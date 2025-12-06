import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendMail({ to, subject, text, html }) {
    return transporter.sendMail({
        from: `"AI RFP System" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
    });
}
