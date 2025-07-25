const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

app.post("/send-email", async (req, res) => {
    const { email, name } = req.body;

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: `Hi ${name}`,
        html: `
           <h2>Hello ${name},</h2>
           <p>Congratulations! 🎉</p>
           <p>Welcome to <strong>Darshita's EmailBot </strong>.</p>
        `,
        attachments: [
          
            {
                filename: "trophy.png",
                path: path.join(__dirname, "trophy.png"),
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to send email" });
    }
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
