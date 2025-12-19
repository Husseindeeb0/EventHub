require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

(async function () {
    console.log("Testing Gmail SMTP...");
    console.log("User:", process.env.GMAIL_USER);
    // Mask password for log safety
    console.log("Pass:", process.env.GMAIL_APP_PASSWORD ? '******' : 'MISSING');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER, // Send to self
            subject: "EventHub SMTP Test",
            text: "If you see this, SMTP is working!",
        });
        console.log("✅ Email sent successfully:", info.messageId);
    } catch (err) {
        console.error("❌ SMTP Error:", err);
    }
})();
