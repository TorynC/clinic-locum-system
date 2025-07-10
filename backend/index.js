const express = require("express");
const cors = require("cors");
const pool = require("./db"); 
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {authenticateToken} = require("./utilities");
const multer = require("multer")
const path = require('path');
const cron = require('node-cron');

require('dotenv').config();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

const PORT = 5000;
const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(
    cors({
        origin:allowedOrigins,
        credentials: true,
    })
);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


async function createNotification({ user_id, user_type, type, title, message, job_id }) {
    await pool.query(
        `INSERT INTO notifications (user_id, user_type, type, title, message, job_id) VALUES ($1, $2, $3, $4, $5, $6)`,
        [user_id, user_type, type, title, message, job_id]
    );
}

//test API route to check if the server is running
app.get('/api/test', (req, res) => {
  res.send('Server is working!');
});

// test API route to check if the database connection is working
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ message: "Successfully connected to database", success: true, time: result.rows[0].now });
    } catch (error) {
        return res.json(error);
    }
});

// change the status of a job to completed when the time has past 
cron.schedule('*/10 * * * *', async () => {
    try {
        await pool.query(`UPDATE manual_jobs SET status = 'Completed' WHERE status != 'Completed'
            AND (date + end_time::interval) < NOW()`);
            console.log('Completed jobs updated');
    } catch (error) {
        console.error("Error updating completed jobs:", error);
    }
})

// Delete Job 
app.delete("/api/delete-job/:jobId", authenticateToken, async (req, res) => {
    try {
        const jobId = req.params.jobId;
        if (!jobId) {
            return res.status(400).json({error: true, message: "Job not found"})
        }
        await pool.query("DELETE FROM manual_jobs WHERE id = $1", [jobId])
        return res.status(200).json({error: false, message: "Job successfully deleted"})
    } catch (error) {
        console.error(error)    
        return res.status(500).json({error: true, message: "Internal Server Error"})
    }
})

// Create a new clinic API 
app.post('/api/clinic-register', async (req, res) => {
    const {clinic_name, email, password} = req.body;
    if (!clinic_name || !email || !password) {
        return res.status(400).json({error: true, message: "Please enter all fields"});
    }

    // Check if the clinic already exists
    const existingClinic = await pool.query("SELECT * FROM clinics WHERE email = $1", [email]);
    if (existingClinic.rows.length > 0) {
        return res.status(400).json({ error: true, message: "Clinic already exists" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });

        const result = await pool.query(
            "INSERT INTO clinics (clinic_name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [clinic_name, email, hashedPassword]
        );
        return res.status(201).json({ error: false, message: "Clinic created successfully", clinic: result.rows[0], accessToken });
    } catch (error) {
        console.error("Error creating clinic:", error);
        return res.status(500).json({ error: true, message: "Error creating clinic" });
    }
});

// Add favorite doctor
app.post("/api/favorite-doctor", authenticateToken, async (req, res) => {
    const { clinic_id, doctor_id } = req.body;
    if (!clinic_id || !doctor_id) {
        return res.status(400).json({ error: true, message: "Missing clinic_id or doctor_id" });
    }
    try {
        await pool.query(
            "INSERT INTO favorite_doctors (clinic_id, doctor_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [clinic_id, doctor_id]
        );
        return res.status(200).json({ error: false, message: "Doctor favorited" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

app.get("/api/favorite-doctors/:clinicId", authenticateToken, async (req, res) => {
    const clinicId = req.params.clinicId;
    if (!clinicId) {
        return res.status(400).json({ error: true, message: "Missing clinicId" });
    }
    try {
        const result = await pool.query(
            "SELECT doctor_id FROM favorite_doctors WHERE clinic_id = $1",
            [clinicId]
        );
        // Return as an array of IDs
        const favoriteDoctorIds = result.rows.map(row => row.doctor_id);
        return res.status(200).json({ error: false, favoriteDoctorIds });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});


// Remove favorite doctor
app.delete("/api/favorite-doctor", authenticateToken, async (req, res) => {
    const { clinic_id, doctor_id } = req.query;
    if (!clinic_id || !doctor_id) {
        return res.status(400).json({ error: true, message: "Missing clinic_id or doctor_id" });
    }
    try {
        await pool.query(
            "DELETE FROM favorite_doctors WHERE clinic_id = $1 AND doctor_id = $2",
            [clinic_id, doctor_id]
        );
        return res.status(200).json({ error: false, message: "Doctor unfavorited" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// check if first time clinic login 
app.get("/api/clinic-first-time-login/:clinicId", authenticateToken, async (req, res) => {
    try {
        const clinicId = req.params.clinicId;
        const generalInfoResult = await pool.query("SELECT * FROM clinic_general_info WHERE id = $1", [clinicId]);
        const contactInfoResult = await pool.query("SELECT * FROM clinic_contact_info WHERE id = $1", [clinicId]);
        const preferencesResult = await pool.query("SELECT * FROM clinic_preferences WHERE id = $1", [clinicId]);

        const isFirstTimeLogin = generalInfoResult.rows.length === 0 || contactInfoResult.rows.length === 0 
                                || preferencesResult.rows.length === 0;

        return res.status(200).json({error: false, isFirstTimeLogin});

    } catch (error) {
        return res.status(500).json({error: true, message: "Internal Server Error"});
    }
})

// check if first time doctor login 
app.get("/api/doctor-first-time-login/:doctorId", authenticateToken, async(req, res) => {
    try {
        const doctorId = req.params.doctorId;
        
        // Get doctor info from doctors table
        const doctorResult = await pool.query("SELECT name, email FROM doctors WHERE id = $1", [doctorId]);
        if (doctorResult.rows.length === 0) {
            return res.status(404).json({error: true, message: "Doctor not found"});
        }
        
        const doctor = doctorResult.rows[0];
        
        // Get profile info from doctor_profile table
        const profileInfoResult = await pool.query("SELECT * FROM doctor_profile WHERE id = $1", [doctorId]);
        
        let isFirstTimeLogin = true;
        
        if (profileInfoResult.rows.length > 0) {
            const profile = profileInfoResult.rows[0];
            
            // Check if all required fields are filled (based on frontend validation with *)
            const requiredProfileFields = [
                'ic', 'address', 'city', 'state', 'postal', 'phone', 'gender', 
                'birthday', 'bank_name', 'bank_number', 'mmc_number', 'apc_number', 
                'experience_years', 'mmc_file', 'apc_file'
            ];
            
            const hasAllRequiredFields = requiredProfileFields.every(field => {
                const value = profile[field];
                if (field === 'experience_years') {
                    return value !== null && value !== undefined && value > 0;
                }
                return value !== null && value !== undefined && value !== '';
            });
            
            // Also check required fields from doctors table
            const doctorFieldsComplete = doctor.name && doctor.name.trim() !== '' && 
                                       doctor.email && doctor.email.trim() !== '';
            
            isFirstTimeLogin = !hasAllRequiredFields || !doctorFieldsComplete;
        }
        
        return res.status(200).json({error: false, isFirstTimeLogin});
    } catch (error) {
        console.error("Error checking doctor first time login:", error);
        return res.status(500).json({error: true, message: "Internal Server Error"});
    }
})

// Clinic Login API 
app.post("/api/clinic-login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: true, message: "Please enter all fields" });
    }

    try {
        const clinicResult = await pool.query("SELECT * FROM clinics WHERE email = $1", [email]);
        if (clinicResult.rows.length === 0) {
            return res.status(400).json({ error: true, message: "Clinic does not exist" });
        }

        const clinic = clinicResult.rows[0];

        const passwordMatch = await bcrypt.compare(password, clinic.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: true, message: "Invalid email or password" });
        }

        const generalInfoResult = await pool.query("SELECT * FROM clinic_general_info WHERE id = $1", [clinic.id]);
        const contactInfoResult = await pool.query("SELECT * FROM clinic_contact_info WHERE id = $1", [clinic.id]);
        const preferencesResult = await pool.query("SELECT * FROM clinic_preferences WHERE id = $1", [clinic.id]);

        const isFirstTimeLogin = generalInfoResult.rows.length === 0 || contactInfoResult.rows.length === 0 
                                || preferencesResult.rows.length === 0;

        const accessToken = jwt.sign({ email: clinic.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
        
        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        return res.json({
            error: false,
            message: "Login successful",
            clinic_name: clinic.clinic_name,
            email: clinic.email,
            accessToken,
            id: clinic.id,
            isFirstTimeLogin
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
});

// Doctor register API 
app.post("/api/doctor-register", async (req, res) => {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({error: true, message: "Please enter all fields"});
    } 

    const existingDoctor = await pool.query("SELECT * FROM doctors WHERE email = $1", [email]);
    if (existingDoctor.rows.length > 0) {
        return res.status(400).json({error: true, message: "Doctor already exists"})
    }

    try { 
        const hashedPassword = await bcrypt.hash(password, 10);

        const accessToken = jwt.sign({email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });

        const result = await pool.query("INSERT INTO doctors (name, email, password) VALUES ($1, $2, $3) RETURNING *", [name, email, hashedPassword]);

        return res.status(201).json({error: false, message: "Doctor created successfully", accessToken, doctor: result.rows[0]});
    } catch(error) {
        console.error("signup error:", error);
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
});

// Doctor login API 
app.post("/api/doctor-login", async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({error: true, message:"please enter all fields"});
    } 

    try {
        const result = await pool.query("SELECT * FROM doctors WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({error: true, message: "Account does not exist"});
        }
        
        const doctor = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, doctor.password);
        if (!passwordMatch) {
            return res.status(400).json({error: true, message: "email or password does not match"});
        }

        const profileInfoResult = await pool.query("SELECT * FROM doctor_profile WHERE id = $1", [doctor.id]);
        const isFirstTimeLogin = profileInfoResult.rows.length === 0;

        const accessToken = jwt.sign({email: doctor.email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        return res.status(200).json({
            error: false, 
            message: "Login successful", 
            accessToken, 
            email: doctor.email, 
            id: doctor.id,
            isFirstTimeLogin
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal Server Error"});
    }
})

// Clinic General Information API Route
app.patch("/api/general-info/:id", authenticateToken, async (req, res) => {
    const { type, description} = req.body;

    try {
        const clinicId = req.params.id;
        if (!clinicId) {
            return res.status(400).json({error: true, message: "Clinic not found"});
        }

        await pool.query(`
            INSERT INTO clinic_general_info (id, type, description)
            VALUES ($1, $2, $3)
            ON CONFLICT (id)
            DO UPDATE SET type = $2, description = $3
            `, [clinicId, type, description])
        return res.status(200).json({error: false, message: "General info updated successfully"});
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: true, message: "Internal Server Error" });
    }
})

// get specific job 
app.get("/api/get-job/:jobId", authenticateToken, async(req, res) => {
    try{
        const jobId = req.params.jobId;
        if (!jobId) {
            return res.status(400).json({error: true, message: "Job not found"})
        }
        const result = await pool.query("SELECT * FROM manual_jobs WHERE id = $1", [jobId])
        return res.status(200).json({error: false, message: "Job retrieved successfully", job: result.rows[0]})
    } catch (error) {
        console.error(error);
        return res.status(400).json({error: true, message: "Internal Server Error"});
    }
})

// edit job API 
app.patch("/api/edit-job/:jobId", authenticateToken, async(req, res) => {
    const { date, start_time, end_time, rate, total_pay, duration } = req.body;
    try {
        const jobId = req.params.jobId;
        if (!jobId) {
            return res.status(400).json({error: true, message: "Job not found"})
        }
        await pool.query(
            `UPDATE manual_jobs SET date=$1, start_time=$2, end_time=$3, rate=$4, total_pay=$5, duration=$6 WHERE id=$7`,
            [date, start_time, end_time, rate, total_pay, duration, jobId]
        );
        return res.status(200).json({error: false, message: "Job updated successfully"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal Server Error"})
    }
});

// Clinic Contact Details API Route 
app.patch("/api/contact-details/:id", authenticateToken, async (req, res) => {
    const {address, city, state, postal, phone, doctor} = req.body;

    try {
        const clinicId = req.params.id;

        if (!clinicId) {
            return res.status(400).json({error: true, message: "Clinic not found"});
        } 

        await pool.query(`
            INSERT INTO clinic_contact_info (id, address, city, state, postal, phone, doctor) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id)
            DO UPDATE SET address = $2, city= $3, state = $4, postal = $5, phone = $6, doctor = $7
            `, [clinicId, address, city, state, postal, phone, doctor]);
        return res.status(200).json({ error: false, message: "contact info updated successfully", address, city, state, postal, phone, doctor });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: true, message: "Internal Server Error" });
    } 
});

// update name/email clinic
app.patch("/api/name-email/:id", authenticateToken, async (req, res) => {
    const { clinic_name, email } = req.body;
    const clinicId = req.params.id;

    if (!clinicId) {
        return res.status(400).json({ error: true, message: "Clinic ID is required" });
    }

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (clinic_name) {
        fields.push(`clinic_name = $${paramIndex++}`);
        values.push(clinic_name);
    }

    if (email) {
        fields.push(`email = $${paramIndex++}`);
        values.push(email);
    }

    if (fields.length === 0) {
        return res.status(400).json({ error: true, message: "No fields provided to update" });
    }

    values.push(clinicId); 

    const query = `
        UPDATE clinics
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
    `;

    try {
        result = await pool.query(query, values);
        return res.status(200).json({ error: false, message: "Clinic info updated successfully", clinic_name, email});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Clinic Preferences API Route 
app.patch("/api/preferences/:id", authenticateToken, async (req, res) => {
    const { qualifications, languages, nightRate, nightRateAvailable, rate, gender } = req.body;
    try {
        const clinicId = req.params.id;
        if (!clinicId) {
            return res.status(400).json({ error: true, message: "Clinic not found" });
        } 
        await pool.query(`
            INSERT INTO clinic_preferences (id, qualifications, languages, night_rate, night_rate_available, default_rate, gender)
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            ON CONFLICT (id)
            DO UPDATE SET qualifications = $2, languages = $3, night_rate = $4, night_rate_available = $5, default_rate = $6, gender = $7
            `, [clinicId, qualifications, languages, nightRate, nightRateAvailable, rate, gender]);
        return res.status(200).json({ error: false, message: "preferences successfully updated", qualifications, languages, nightRate, rate, nightRateAvailable, gender });
    } catch(error) {
        console.error(error);
        return res.status(400).json({error: true, message: "Internal Server Error"});
    }
});

// update doctor profile API route 
app.patch("/api/doctor-profile/:doctorId", authenticateToken, upload.fields([
    {name: "profilepic", maxCount: 1},
    {name: "mmcFile", maxCount: 1},
    {name: "apcFile", maxCount: 1}  
]), async (req, res) => {
    const doctorId = req.params.doctorId;
    
    const profilePic = req.files?.profilepic?.[0]?.path || null;
    const mmcFile = req.files?.mmcFile?.[0]?.path || null;
    const apcFile = req.files?.apcFile?.[0]?.path || null;

    const {
        skills, languages, mmcNumber, apcNumber, experienceYears, bio
        , IC, address, city, state, postal, phone, gender, birthday, minimumPay,
        preferredDays, earliestStart, latestEnd, maxDistance, bank, workExperience, bankName
    } = req.body;

    const parsedSkills = typeof skills === "string" ? JSON.parse(skills) : skills;
    const parsedLanguages = typeof languages === "string" ? JSON.parse(languages) : languages;
    const parsedPreferredDays = typeof preferredDays === "string" ? JSON.parse(preferredDays) : preferredDays;

    if (!doctorId) {
        return res.status(400).json({ error: true, message: "No doctor found" });
    }

    try {
        // Get existing profile to preserve file paths if no new files uploaded
        const existingProfile = await pool.query("SELECT profile_pic, mmc_file, apc_file FROM doctor_profile WHERE id = $1", [doctorId]);
        const existing = existingProfile.rows[0] || {};

        // Use new file paths if uploaded, otherwise keep existing ones
        const finalProfilePic = profilePic || existing.profile_pic || null;
        const finalMmcFile = mmcFile || existing.mmc_file || null;
        const finalApcFile = apcFile || existing.apc_file || null;

        console.log('File update info:', {
            doctorId,
            hasNewProfilePic: !!profilePic,
            hasNewMmcFile: !!mmcFile,
            hasNewApcFile: !!apcFile,
            existingProfilePic: existing.profile_pic,
            existingMmcFile: existing.mmc_file,
            existingApcFile: existing.apc_file,
            finalProfilePic,
            finalMmcFile,
            finalApcFile
        });

        const values = [
            parsedSkills, parsedLanguages, mmcNumber, apcNumber, experienceYears,
            bio, IC, address, city, state, postal, phone, gender, birthday,
            minimumPay, parsedPreferredDays, earliestStart, latestEnd, maxDistance,
            finalProfilePic, finalMmcFile, finalApcFile, bank, workExperience, bankName, doctorId
        ];

        const result = await pool.query(`
        INSERT INTO doctor_profile (
            skills, languages, mmc_number, apc_number, experience_years,
            bio, ic, address, city, state, postal, phone, gender, birthday,
            minimum_pay, preferred_days, earliest_start, latest_end, max_distance, 
            profile_pic, mmc_file, apc_file, bank_number, work_experience, bank_name, id
        ) VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
            $18, $19, $20, $21, $22, $23, $24, $25, $26
        )
        ON CONFLICT (id)
        DO UPDATE SET
            skills = $1, 
            languages = $2, 
            mmc_number = $3, 
            apc_number = $4, 
            experience_years = $5,
            bio = $6,  
            ic = $7, 
            address = $8, 
            city = $9, 
            state = $10, 
            postal = $11, 
            phone = $12, 
            gender = $13, 
            birthday = $14, 
            minimum_pay = $15, 
            preferred_days = $16, 
            earliest_start = $17,
            latest_end = $18, 
            max_distance = $19, 
            profile_pic = $20,
            mmc_file = $21,
            apc_file = $22,
            bank_number = $23,
            work_experience = $24,
            bank_name = $25
        RETURNING profile_pic, mmc_file, apc_file
    `, values); 

        return res.status(200).json({ 
            error: false, 
            message: "Doctor profile updated successfully",
            results: {
                profile_pic: result.rows[0]?.profile_pic,
                mmc_file: result.rows[0]?.mmc_file,
                apc_file: result.rows[0]?.apc_file
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// get doctor profile API route 
app.get("/api/get-doctor-profile/:doctorId", authenticateToken, async (req, res) => {
    const doctorId = req.params.doctorId;
    if (!doctorId) {
        return res.status(400).json({ error: true, message: "No doctor found" });
    }
    try {
        const response = await pool.query("SELECT * FROM doctor_profile WHERE id = $1", [doctorId])
        return res.status(200).json({ error: false, message: "Doctor profile received successfully", results: response.rows[0]})
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: true, message: "Internal Server Error"})
    }
})

// get doctor's accepted jobs 
app.get("/api/doctor-accepted-jobs/:doctorId", authenticateToken, async (req, res) => {
    const doctorId = req.params.doctorId;
    if (!doctorId) {
        return res.status(400).json({ error: true, message: "No doctor found" });
    }
    try {
        console.log(`Fetching accepted jobs for doctor: ${doctorId}`);
        const response = await pool.query(
            `SELECT id, date, start_time, end_time, clinic_id, status 
             FROM manual_jobs 
             WHERE doctor_id = $1 AND status = 'Accepted'`, 
            [doctorId]
        );
        console.log(`Found ${response.rows.length} accepted jobs for doctor ${doctorId}`);
        return res.status(200).json({ 
            error: false, 
            message: "Doctor accepted jobs retrieved successfully", 
            jobs: response.rows 
        });
    } catch (error) {
        console.error("Error fetching doctor accepted jobs:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
})

// change job application status 
app.patch("/api/update-job-application/:applicationId", authenticateToken, async (req, res) => {
    const applicationId = req.params.applicationId;
    const { status } = req.body;

    if (!applicationId || !status) {
        return res.status(400).json({ error: true, message: "Application not found" });
    }

    try {
        // Get the application details first
        const applicationResult = await pool.query(
            `SELECT * FROM job_applications WHERE id = $1`,
            [applicationId]
        );
        
        if (applicationResult.rows.length === 0) {
            return res.status(400).json({ error: true, message: "Application not found" });
        }

        const application = applicationResult.rows[0];

        if (status === "Accepted") {
            // Get the job details
            const jobResult = await pool.query(
                `SELECT * FROM manual_jobs WHERE id = $1`,
                [application.job_id]
            );
            const job = jobResult.rows[0];

            // 1. Check if doctor already has a job on the same day with overlapping time
            const conflictingJobs = await pool.query(
                `SELECT id FROM manual_jobs 
                 WHERE doctor_id = $1 
                   AND date = $2 
                   AND status = 'Accepted'
                   AND (
                        (start_time < $4 AND end_time > $3) OR
                        (start_time < $3 AND end_time > $3) OR
                        (start_time < $4 AND end_time > $4) OR
                        (start_time >= $3 AND end_time <= $4)
                   )`,
                [application.doctor_id, job.date, job.start_time, job.end_time]
            );

            if (conflictingJobs.rows.length > 0) {
                return res.status(400).json({ 
                    error: true, 
                    message: "Doctor already has a conflicting job on this date and time" 
                });
            }

            // 2. Accept the application
            await pool.query(
                `UPDATE job_applications SET status = $1 WHERE id = $2`,
                [status, applicationId]
            );

            // 3. Assign doctor to the job
            await pool.query(
                `UPDATE manual_jobs SET doctor_id = $1, status = 'Accepted' WHERE id = $2`,
                [application.doctor_id, application.job_id]
            );

            // 4. Auto-reject ALL OTHER applications for this SAME JOB
            await pool.query(
                `UPDATE job_applications 
                 SET status = 'Rejected' 
                 WHERE job_id = $1 AND id != $2 AND status = 'Pending'`,
                [application.job_id, applicationId]
            );

            // 5. Auto-cancel ALL OTHER applications by this doctor for overlapping jobs on the same day
            console.log(`Checking for overlapping applications for doctor ${application.doctor_id} on date ${job.date} from ${job.start_time} to ${job.end_time}`);
            const overlappingApplications = await pool.query(
                `SELECT ja.id, ja.job_id, mj.date, mj.start_time, mj.end_time, mj.clinic_id
                 FROM job_applications ja
                 JOIN manual_jobs mj ON ja.job_id = mj.id
                 WHERE ja.doctor_id = $1 
                   AND ja.id != $2 
                   AND ja.status = 'Pending'
                   AND mj.date = $3
                   AND (
                        (mj.start_time < $5 AND mj.end_time > $4) OR
                        (mj.start_time < $4 AND mj.end_time > $4) OR
                        (mj.start_time < $5 AND mj.end_time > $5) OR
                        (mj.start_time >= $4 AND mj.end_time <= $5)
                   )`,
                [application.doctor_id, applicationId, job.date, job.start_time, job.end_time]
            );

            console.log(`Found ${overlappingApplications.rows.length} overlapping applications to cancel`);
            // Cancel overlapping applications
            if (overlappingApplications.rows.length > 0) {
                const overlappingAppIds = overlappingApplications.rows.map(app => app.id);
                await pool.query(
                    `UPDATE job_applications 
                     SET status = 'Cancelled' 
                     WHERE id = ANY($1)`,
                    [overlappingAppIds]
                );

                console.log(`Cancelled ${overlappingAppIds.length} overlapping applications:`, overlappingAppIds);

                // Notify doctor about cancelled applications
                for (const overlappingApp of overlappingApplications.rows) {
                    await createNotification({
                        user_id: application.doctor_id,
                        user_type: 'doctor',
                        type: 'job_application',
                        title: 'Application Automatically Cancelled',
                        message: `Your application for a job on ${new Date(overlappingApp.date).toLocaleDateString()} has been automatically cancelled due to a time conflict with your accepted job.`,
                        job_id: overlappingApp.job_id
                    });
                }
            }

            // 6. Notify rejected applicants for the same job
            const rejectedApplicants = await pool.query(
                `SELECT doctor_id FROM job_applications 
                 WHERE job_id = $1 AND id != $2 AND status = 'Rejected'`,
                [application.job_id, applicationId]
            );

            for (const rejected of rejectedApplicants.rows) {
                await createNotification({
                    user_id: rejected.doctor_id,
                    user_type: 'doctor',
                    type: 'job_application',
                    title: 'Application Rejected',
                    message: `Your application for a job on ${new Date(job.date).toLocaleDateString()} has been rejected as another doctor was selected.`,
                    job_id: application.job_id
                });
            }

            // 7. Notify the accepted doctor
            await createNotification({
                user_id: application.doctor_id,
                user_type: 'doctor',
                type: 'job_application',
                title: 'Application Accepted',
                message: `Congratulations! Your application for a job on ${new Date(job.date).toLocaleDateString()} has been accepted.`,
                job_id: application.job_id
            });

        } else {
            // For non-acceptance status changes, just update the application
            await pool.query(
                `UPDATE job_applications SET status = $1 WHERE id = $2`,
                [status, applicationId]
            );
        }

        // Return the updated application
        const updatedApplication = await pool.query(
            `SELECT * FROM job_applications WHERE id = $1`,
            [applicationId]
        );

        return res.status(200).json({ 
            error: false, 
            message: "Application updated successfully", 
            application: updatedApplication.rows[0] 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// post job 
app.post("/api/post-job/:clinicId/jobs", authenticateToken, async (req, res) => {
    const { 
        date,
        chosenLanguages: languages,
        chosenProcedure: procedure,
        address,
        email,
        phone,
        paidBreak: paid_break,
        totalPay: total_pay,
        jobDescription: description,
        jobIncentives: incentives,
        preferredGender: gender,
        contactPerson: contact,
        specialInstructions: special_instructions,
        shiftStart: start_time,
        shiftEnd: end_time,
        status,
        rate, 
        duration,
        shiftType: shift_type,
        breakStart: break_start,
        breakEnd: break_end,
        hasBreak: has_break
    } = req.body;

    try {
        const clinicId = req.params.clinicId;
        if (!clinicId) {
            return res.status(400).json({error: true, message: "Clinic not found"});
        }

        // Proper array formatting for PostgreSQL
        const formattedLanguages = Array.isArray(languages) ? languages : [languages];

        const queryText = `
            INSERT INTO manual_jobs (
                clinic_id, procedure, description,
                incentives, total_pay, date, 
                start_time, end_time, gender, languages, 
                paid_break,  
                contact, special_instructions, email, address, phone, status, rate, duration,
                shift_type, break_start, break_end, has_break
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18,
                $19, $20, $21, $22, $23
            ) RETURNING *
        `;

        const queryValues = [
            clinicId, 
            procedure, 
            description, 
            incentives, 
            total_pay, 
            date, 
            start_time, 
            end_time, 
            gender,  
            formattedLanguages, 
            paid_break, 
            contact, 
            special_instructions,
            email, 
            address, 
            phone,
            status,
            rate,
            duration,
            shift_type,
            break_start,
            break_end,
            has_break
        ];

        console.log('Executing query:', queryText);
        console.log('With values:', queryValues);

        const result = await pool.query(queryText, queryValues);

        return res.status(200).json({
            error: false, 
            message: "Job successfully posted", 
            job: result.rows[0]
        });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({
            error: true, 
            message: "Internal server error",
            details: error.message
        });
    }
});

// post new job application 
app.post("/api/post-job-application", authenticateToken, async (req, res) => {
    const {id: job_id, doctorId: doctor_id, status} = req.body;
    try {
        const existing = await pool.query(
            "SELECT * FROM job_applications WHERE job_id = $1 AND doctor_id = $2", [job_id, doctor_id]
        );
        if (existing.rows.length > 0) {
            return res.status(400).json({error: true, message: "Already applied"});
        }
        const result = await pool.query("INSERT INTO job_applications(job_id, doctor_id, status) VALUES($1, $2, $3) RETURNING *",
            [job_id, doctor_id, status])
      
        // After job application is inserted
       // Get job details for message
        const jobDetails = await pool.query(
            "SELECT date, clinic_id FROM manual_jobs WHERE id = $1",
            [job_id]
        );
        const jobInfo = jobDetails.rows[0];
        const clinicInfo = await pool.query(
            "SELECT clinic_name FROM clinics WHERE id = $1",
            [jobInfo.clinic_id]
        );
        const clinicName = clinicInfo.rows[0]?.clinic_name || "Clinic";
        const jobDateMY = new Date(jobInfo.date).toLocaleDateString("en-MY", { timeZone: "Asia/Kuala_Lumpur" });

        await createNotification({
            user_id: jobInfo.clinic_id,
            user_type: "clinic",
            type: "application",
            title: "New Application",
            message: `Locum Doctor job at ${jobDateMY} at ${clinicName}`,
            job_id: job_id
        });

        return res.status(200).json({error: false,  messsage: "Job application posted successfully", application: result.rows[0]})
        
    } catch(error) {
        console.error(error);
        return res.status(500).json({error: true, messaege: "Internal Server Error"});
    };
});

// get applications that specific doctor applied to 
app.get("/api/get-applications/:doctorId", authenticateToken, async(req, res) => {
    try {
        const doctorId = req.params.doctorId;
        if (!doctorId) {
            return res.status(400).json({error: true, message: "Doctor not found"})
        }
        const result = await pool.query("SELECT * FROM job_applications WHERE doctor_id = $1", [doctorId])
        return res.status(200).json({error: false, message: "Applications retrieved successfully", applications: result.rows})
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal Server Error"});
    }
})

// Get all job applications for a specific clinic (with doctor and job info)
app.get("/api/clinic-applications/:clinicId", authenticateToken, async (req, res) => {
    const clinicId = req.params.clinicId;
    if (!clinicId) {
        return res.status(400).json({ error: true, message: "Clinic ID is required" });
    }
    try {
        const result = await pool.query(`
            SELECT 
                ja.*, 
                d.name AS doctor_name,  
                d.email AS doctor_email,
                mj.description AS job_description, -- use description instead of title
                mj.date AS job_date,
                mj.status AS job_status
            FROM job_applications ja
            JOIN manual_jobs mj ON ja.job_id = mj.id
            JOIN doctors d ON ja.doctor_id = d.id
            WHERE mj.clinic_id = $1
            ORDER BY ja.applied_at DESC
        `, [clinicId]);
        return res.status(200).json({ error: false, applications: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// get all jobs posted by this clinic 
app.get("/api/get-jobs/:clinicId/jobs", authenticateToken, async (req, res) => {
    try {
        const clinicId = req.params.clinicId;
        if (!clinicId) {
            return res.status(400).json({error: true, message: "Clinic not found"});
        }
        const result = await pool.query("SELECT * FROM manual_jobs WHERE clinic_id = $1", [clinicId]);
        if (result.rows.length === 0) {
            return res.status(400).json({error: true, message: "Not found"})
        }
        return res.status(200).json({error: false, message: "Jobs successfully retrieved", jobs: result.rows})
    } catch (error) {
        console.error(error)
        return res.status(400).json({error: true, message: "Internal Server Error"})
    }
})

// get all available jobs 
app.get("/api/get-all-jobs", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM manual_jobs");
        return res.status(200).json({error: false, message: "Available Jobs retrieved", jobs: result.rows});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal Server Error"});
    }
})

// get all doctors 
app.get('/api/get-doctors', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM doctors");
        return res.status(200).json({error: false, message: "Doctors retrieved", doctors: result.rows});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal Server Error"});
    }
})

// get clinic info 
app.get("/api/get-clinic/:id", authenticateToken, async (req, res) => {
    try {
        const clinicId = req.params.id;
        if (!clinicId) {
            return res.status(400).json({ error: true, message: "Clinic not found" });
        } 
        const clinicResult = await pool.query("SELECT * FROM clinics WHERE id = $1", [clinicId]);
         if (clinicResult.rows.length === 0) {
            return res.status(404).json({ error: true, message: "Clinic not found" });
        }
        return res.status(200).json({ error: false, clinic: clinicResult.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal Server Error"})
    }
});

// get clinic general info 
app.get("/api/get-clinic-general/:id", authenticateToken, async(req, res)=> {
    try {
        const clinicId = req.params.id;
        if (!clinicId) {
            return res.status(400).json({ error: true, message: "Clinic not found" });
        } 
        const result = await pool.query("SELECT * FROM clinic_general_info WHERE id = $1", [clinicId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: true, message: "Clinic not found" });
        }
        return res.status(200).json({ error: false, clinic: result.rows[0] });
    } catch(error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal Server Error"});
    }
})

// get clinic contact info 
app.get("/api/get-contact-details/:id", authenticateToken, async(req, res)=> {
    try {
        const clinicId = req.params.id;
        if (!clinicId) {
            return res.status(400).json({ error: true, message: "Clinic not found" });
        } 
        const result = await pool.query("SELECT * FROM clinic_contact_info WHERE id = $1", [clinicId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: true, message: "Clinic not found" });
        }
        return res.status(200).json({ error: false, clinic: result.rows[0] });
    } catch(error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal Server Error"});
    }
})

// get clinic preferences 
app.get("/api/get-preferences/:id", authenticateToken, async(req, res)=> {
    try {
        const clinicId = req.params.id;
        if (!clinicId) {
            return res.status(400).json({ error: true, message: "Clinic not found" });
        } 
        const result = await pool.query("SELECT * FROM clinic_preferences WHERE id = $1", [clinicId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: true, message: "Clinic not found" });
        }
        return res.status(200).json({ error: false, clinic: result.rows[0] });
    } catch(error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal Server Error"});
    }
})

// get doctor info 
app.get("/api/get-doctor/:doctorId", authenticateToken, async(req, res) =>{
    try {
        const doctorId = req.params.doctorId;
        if (!doctorId) {
            return res.status(400).json({error: true, message: "Doctor not found"});
        }
        const result = await pool.query("SELECT * FROM doctors WHERE id = $1", [doctorId]);
        if (result.rows.length === 0) {
            return res.status(404).json({error: true, message: "Doctor not found"});
        } 
        return res.status(200).json({error: false, message: "Doctor retrieved successfully", doctor: result.rows[0]})
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal Server Error"});
    }
})

// get all doctor profiles
app.get("/api/get-all-doctor-profile", authenticateToken, async (req, res) => {
    try {
        const response = await pool.query("SELECT * FROM doctor_profile");
        return res.status(200).json({error: false, message: "doctor profiles received", doctors: response.rows});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal Server Error"});
    }
});

// update doctor name/email
app.patch("/api/doctor-info/:id", authenticateToken, async (req, res) => {
    const { name, email } = req.body;
    const doctorId = req.params.id;

    if (!doctorId) {
        return res.status(400).json({ error: true, message: "Account not found" });
    }

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (name) {
        fields.push(`name = $${paramIndex++}`);
        values.push(name);
    }

    if (email) {
        fields.push(`email = $${paramIndex++}`);
        values.push(email);
    }

    if (fields.length === 0) {
        return res.status(400).json({ error: true, message: "No fields provided to update" });
    }

    values.push(doctorId); 

    const query = `
        UPDATE doctors
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
    `;

    try {
        result = await pool.query(query, values);
        return res.status(200).json({ error: false, message: "Doctor info updated successfully", name, email});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// get all clinics 
app.get("/api/get-all-clinics", authenticateToken, async(req, res) => {
    try { 
        const result = await pool.query("SELECT * FROM clinics");
        return res.status(200).json({error: false, message: "All clinics retrieved", clinics: result.rows})
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal Server Error"})
    }
})

// Doctor cancels a job (urgent re-list)
app.patch("/api/cancel-job/:jobId", authenticateToken, async (req, res) => {
    const { doctorId } = req.body;
    const jobId = req.params.jobId;
    if (!jobId || !doctorId) {
        return res.status(400).json({ error: true, message: "Missing jobId or doctorId" });
    }
    try {
        // Set job to urgent and remove doctor
        await pool.query(
            `UPDATE manual_jobs SET doctor_id = NULL, status = 'Urgent' WHERE id = $1`,
            [jobId]
        );
        // Set the application to Cancelled
        await pool.query(
            `UPDATE job_applications SET status = 'Cancelled' WHERE job_id = $1 AND doctor_id = $2`,
            [jobId, doctorId]
        );
        // Decrease reliability rating in doctor_profile (min 1.0)
        await pool.query(
            `UPDATE doctor_profile SET reliability_rating = GREATEST(COALESCE(reliability_rating, 5) - 0.1, 1.0) WHERE id = $1`,
            [doctorId]
        );
        // After job is set to urgent and doctor removed
        const jobRes = await pool.query("SELECT clinic_id FROM manual_jobs WHERE id = $1", [jobId]);
        if (jobRes.rows.length > 0) {
            const jobCancelDetails = await pool.query(
                "SELECT date, clinic_id FROM manual_jobs WHERE id = $1",
                [jobId]
            );
            const jobCancelInfo = jobCancelDetails.rows[0];
            const clinicCancelInfo = await pool.query(
                "SELECT clinic_name FROM clinics WHERE id = $1",
                [jobCancelInfo.clinic_id]
            );
            const clinicCancelName = clinicCancelInfo.rows[0]?.clinic_name || "Clinic";
            const jobCancelDateMY = new Date(jobCancelInfo.date).toLocaleDateString("en-MY", { timeZone: "Asia/Kuala_Lumpur" });

            await createNotification({
                user_id: jobCancelInfo.clinic_id,
                user_type: "clinic",
                type: "cancellation",
                title: "Doctor Cancelled",
                message: `Locum Doctor job at ${jobCancelDateMY} at ${clinicCancelName}`,
                job_id: jobId
            });
        }
        return res.status(200).json({ error: false, message: "Job cancelled and set to urgent" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// get doctor notifications
app.get("/api/notifications/doctor/:doctorId", authenticateToken, async (req, res) => {
    const doctorId = req.params.doctorId;
    try {
        const result = await pool.query(
            "SELECT * FROM notifications WHERE user_id = $1 AND user_type = 'doctor' ORDER BY created_at DESC",
            [doctorId]
        );
        res.json({ notifications: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

app.get("/api/notifications/clinic/:clinicId", authenticateToken, async (req, res) => {
    const clinicId = req.params.clinicId;
    try {
        const result = await pool.query(
            "SELECT * FROM notifications WHERE user_id = $1 AND user_type = 'clinic' ORDER BY created_at DESC",
            [clinicId]
        );
        res.json({ notifications: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// mark notification as read
app.patch("/api/notifications/:id/read", authenticateToken, async (req, res) => {
    const notificationId = req.params.id;
    try {
        await pool.query(
            "UPDATE notifications SET is_read = TRUE WHERE id = $1",
            [notificationId]
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Logout endpoint to clear authentication cookies
app.post("/api/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    
    return res.status(200).json({
        error: false,
        message: "Logged out successfully"
    });
});

// Start server 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});