
const express = require("express");
const cors = require("cors");
const pool = require("./db"); 
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {authenticateToken} = require("./utilities");
const multer = require("multer")
const path = require('path');


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

        const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

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

        const accessToken = jwt.sign({ email: clinic.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        
        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        return res.json({
            error: false,
            message: "Login successful",
            clinic_name: clinic.clinic_name,
            email: clinic.email,
            accessToken,
            id: clinic.id
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

        const accessToken = jwt.sign({email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

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

        const accessToken = jwt.sign({email: doctor.email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            error: false, message: "Login successful", accessToken, email: doctor.email, id: doctor.id
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal Server Error"});
    }
})

// Clinic General Information API Route
app.patch("/api/general-info/:id", authenticateToken, async (req, res) => {
    const { type, description, year} = req.body;

    try {
        const clinicId = req.params.id;
        if (!clinicId) {
            return res.status(400).json({error: true, message: "Clinic not found"});
        }

        await pool.query(`
            INSERT INTO clinic_general_info (id, type, description, year)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (id)
            DO UPDATE SET type = $2, description = $3, year = $4
            `, [clinicId, type, description, year])
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
    const { 
        jobTitle: title,
        date,
        chosenLanguages: languages,
        chosenProcedure: procedure,
        preferredDoctors: preferred_doctors,
        address,
        email,
        phone,
        paidBreak: paid_break,
        totalPay: total_pay,
        dayRate: day_rate,
        nightRate: night_rate,
        dayStart: start_day_time,
        dayEnd: end_day_time,
        nightStart: start_night_time,
        nightEnd: end_night_time,
        jobDescription: description,
        jobIncentives: incentives,
        preferredGender: gender,
        contactPerson: contact,
        specialInstructions: special_instructions,
        shiftStart: start_time,
        shiftEnd: end_time,
        status,
        rate,
        twoRates: two_rates,
        duration
    } = req.body;

    try {
        const jobId = req.params.jobId;
        if (!jobId) {
            return res.status(400).json({error: true, message: "Job not found"})
        }
        await pool.query(
            `UPDATE manual_jobs SET
                title = $1,
                procedure = $2,
                description = $3,
                incentives = $4,
                day_rate = $5,
                night_rate = $6,
                total_pay = $7,
                date = $8,
                start_time = $9,
                end_time = $10,
                gender = $11,
                languages = $12,
                preferred_doctors = $13,
                paid_break = $14,
                start_day_time = $15,
                end_day_time = $16,
                start_night_time = $17,
                end_night_time = $18,
                contact = $19,
                special_instructions = $20,
                email = $21,
                address = $22,
                phone = $23,
                status = $24,
                rate = $25,
                two_rates = $26,
                duration = $27
            WHERE id = $28`, [title, procedure, description, incentives, day_rate, 
                night_rate, total_pay, date, start_time, end_time, gender, languages, 
                preferred_doctors, paid_break, start_day_time, end_day_time, start_night_time, 
                end_night_time, contact, special_instructions, email, address,
                phone, status, rate, two_rates, duration, jobId
            ]
        )
        return res.status(200).json({error: false, message: "Job updated successfully"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal Server Error"})
    }
})

// Clinic Contact Details API Route 
app.patch("/api/contact-details/:id", authenticateToken, async (req, res) => {
    const {address, city, postal, phone, website} = req.body;

    try {
        const clinicId = req.params.id;

        if (!clinicId) {
            return res.status(400).json({error: true, message: "Clinic not found"});
        } 

        await pool.query(`
            INSERT INTO clinic_contact_info (id, address, city, postal, phone, website) 
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id)
            DO UPDATE SET address = $2, city= $3 ,postal = $4 ,phone = $5,  website = $6
            `, [clinicId, address, city, postal, phone, website])
        return res.status(200).json({ error: false, message: "contact info updated successfully", address, city, postal, phone, website })
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: true, message: "Internal Server Error" })
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
    const {dayRate, nightRate, dayStart, dayEnd, nightStart, nightEnd, qualifications, languages, preferredDoctors, twoRates, rate, start, end} = req.body;
    try {
        const clinicId = req.params.id;
        if (!clinicId) {
            return res.status(400).json({ error: true, message: "Clinic not found" });
        } 
        await pool.query(`
            INSERT INTO clinic_preferences (id, day_rate, night_rate, day_start_time, day_end_time, night_start_time, night_end_time, qualifications, languages, preferred_doctors_only, two_rates, default_rate, start_time, end_time)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
            ON CONFLICT (id)
            DO UPDATE SET day_rate = $2, night_rate = $3, day_start_time = $4, day_end_time = $5, night_start_time = $6, night_end_time = $7, qualifications = $8, languages = $9, preferred_doctors_only = $10, two_rates = $11, default_rate = $12, start_time = $13, end_time = $14
            `, [clinicId, dayRate, nightRate, dayStart, dayEnd, nightStart, nightEnd, qualifications, languages, preferredDoctors, twoRates, rate, start, end])
        return res.status(200).json({ error: false, message: "preferences successfully updated", dayRate, nightRate, dayStart, dayEnd, nightStart, nightEnd, qualifications, languages, preferredDoctors, twoRates, rate, start, end})
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
        skills, languages, mmcNumber, apcNumber, specialization, experienceYears, bio
        , IC, address, city, state, postal, phone, gender, birthday, minimumPay,
        preferredDays, earliestStart, latestEnd, maxDistance, emailNotif, SMSNotif, verified, bank, workExperience
    } = req.body;

    const parsedSkills = typeof skills === "string" ? JSON.parse(skills) : skills;
    const parsedLanguages = typeof languages === "string" ? JSON.parse(languages) : languages;
    const parsedPreferredDays = typeof preferredDays === "string" ? JSON.parse(preferredDays) : preferredDays;


    if (!doctorId) {
        return res.status(400).json({ error: true, message: "No doctor found" });
    }

    try {
        const values = [
            parsedSkills, parsedLanguages, mmcNumber, apcNumber, specialization, experienceYears,
            bio, IC, address, city, state, postal, phone, gender, birthday,
            minimumPay, parsedPreferredDays, earliestStart, latestEnd, maxDistance, emailNotif, SMSNotif, verified,
            profilePic, mmcFile, apcFile, bank, workExperience, doctorId
        ];

        await pool.query(`
        INSERT INTO doctor_profile (
            skills, languages, mmc_number, apc_number, specialization, experience_years,
            bio, ic, address, city, state, postal, phone, gender, birthday,
            minimum_pay, preferred_days, earliest_start, latest_end, max_distance, email_notif, 
            sms_notif, verified, profile_pic, mmc_file, apc_file, bank_number, work_experience, id
        ) VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
            $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29
        )
        ON CONFLICT (id)
        DO UPDATE SET
            skills = $1, 
            languages = $2, 
            mmc_number = $3, 
            apc_number = $4, 
            specialization = $5, 
            experience_years = $6,
            bio = $7,  
            ic = $8, 
            address = $9, 
            city = $10, 
            state = $11, 
            postal = $12, 
            phone = $13, 
            gender = $14, 
            birthday = $15, 
            minimum_pay = $16, 
            preferred_days = $17, 
            earliest_start = $18,
            latest_end = $19, 
            max_distance = $20, 
            email_notif = $21, 
            sms_notif = $22,
            verified = $23,
            profile_pic = $24,
            mmc_file = $25,
            apc_file = $26,
            bank_number = $27,
            work_experience = $28
    `, values); 


        return res.status(200).json({ error: false, message: "Doctor profile updated successfully" });
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

// change job application status 
app.patch("/api/update-job-application/:applicationId", authenticateToken, async (req, res) => {
    const applicationId = req.params.applicationId;
    const {status} = req.body;

    if (!applicationId || !status) {
        return res.status(400).json({error: true, message: "Application not found"})
    }

    try {
        const result = await pool.query(`UPDATE job_applications SET status = $1 WHERE id = $2 RETURNING *`, 
            [status, applicationId]
        );
        if (result.rows.length === 0) {
            return res.status(400).json({error: true, message: "Application not found"});
        }

        if (status === "Accepted") {
            const application = result.rows[0];
            await pool.query(`UPDATE manual_jobs SET doctor_id = $1, status = 'Accepted' WHERE id = $2`, [application.doctor_id, application.job_id])
        }
        return res.status(200).json({error: false, message: "Application updated successfully", application: result.rows[0]})
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal Server Error"});
    }
});

// post job 
app.post("/api/post-job/:clinicId/jobs", authenticateToken, async (req, res) => {
    const { 
        jobTitle: title,
        date,
        chosenLanguages: languages,
        chosenProcedure: procedure,
        preferredDoctors: preferred_doctors,
        address,
        email,
        phone,
        paidBreak: paid_break,
        totalPay: total_pay,
        dayRate: day_rate,
        nightRate: night_rate,
        dayStart: start_day_time,
        dayEnd: end_day_time,
        nightStart: start_night_time,
        nightEnd: end_night_time,
        jobDescription: description,
        jobIncentives: incentives,
        preferredGender: gender,
        contactPerson: contact,
        specialInstructions: special_instructions,
        shiftStart: start_time,
        shiftEnd: end_time,
        status,
        rate, 
        twoRates: two_rates,
        duration
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
                clinic_id, title, procedure, description,
                incentives, day_rate, night_rate, total_pay, date, 
                start_time, end_time, gender, languages, 
                preferred_doctors, paid_break, start_day_time, 
                end_day_time, start_night_time, end_night_time, 
                contact, special_instructions, email, address, phone, status, rate, two_rates, duration
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18,
                $19, $20, $21, $22, $23, $24, $25, $26, $27, $28
            ) RETURNING *
        `;

        const queryValues = [
            clinicId, 
            title, 
            procedure, 
            description, 
            incentives, 
            day_rate, 
            night_rate,
            total_pay, 
            date, 
            start_time, 
            end_time, 
            gender,  
            formattedLanguages, 
            preferred_doctors,
            paid_break, 
            start_day_time, 
            end_day_time, 
            start_night_time, 
            end_night_time, 
            contact, 
            special_instructions,
            email, 
            address, 
            phone,
            status,
            rate,
            two_rates,
            duration
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
                mj.title AS job_title, 
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

// Start server 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});