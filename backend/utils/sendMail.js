const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (email, subject, text) => {
  try {
    // Setup transporter
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,          // SMTP Host
      service: process.env.SERVICE,    // Gmail หรือผู้ให้บริการอื่น
      port: Number(process.env.EMAIL_PORT), // พอร์ต (587 หรือ 465)
      secure: Boolean(process.env.SECURE),  // ใช้ TLS/SSL
      auth: {
        user: process.env.USER, // อีเมลผู้ส่ง
        pass: process.env.PASS, // App Password (ไม่ใช่รหัสผ่านหลัก)
      },
    });

    // Mail options
    const mailOptions = {
      from: `"OrangeGive Support" <${process.env.USER}>`,
      to: email, // ผู้รับ
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h3>${subject}</h3>
          <p>${text}</p>
          <p style="font-weight: bold;">This OTP will expire in 10 minutes.</p>
        </div>
      `,
    };

    // ส่งอีเมล
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
    console.error("Stack trace:", error.stack);
    throw new Error("Failed to send email");
  }
};
