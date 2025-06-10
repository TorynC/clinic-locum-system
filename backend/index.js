const express = require("express");
const cors = require("cors");
const pool = require("./db"); 
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {authenticateToken} = require("./utilities");

require('dotenv').config();


const PORT = 5000;
const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(
    cors({
        origin:"http://localhost:3001",
        credentials: true,
    })
);

//test API route to check if the server is running
app.get('/test', (req, res) => {
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
            error: false, message: "Login successful", accessToken, email: doctor.email
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

// update name/email
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
    const {rate, qualifications, languages, preferredDoctorsOnly} = req.body;
    try {
        const clinicId = req.params.id;
        if (!clinicId) {
            return res.status(400).json({ error: true, message: "Clinic not found" });
        } 
        await pool.query(`
            INSERT INTO clinic_preferences (id, rate, qualifications, languages, preferred_doctors_only)
            VALUES ($1, $2, $3, $4, $5) 
            ON CONFLICT (id)
            DO UPDATE SET rate = $2, qualifications = $3, languages = $4, preferred_doctors_only = $5
            `, [clinicId, rate, qualifications, languages, preferredDoctorsOnly])
        return res.status(200).json({ error: false, message: "preferences successfully updated", rate, qualifications, languages, preferredDoctorsOnly})
    } catch(error) {
        console.error(error);
        return res.status(400).json({error: true, message: "Internal Server Error"});
    }
});

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
        return res.status(200).json({error: true, message: "Internal Server Error"})
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

// Start server 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});