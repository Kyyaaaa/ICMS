import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function test() {
  try {
    console.log('USER:', process.env.EMAIL_USER);
    console.log('PASS:', process.env.EMAIL_APP_PASSWORD ? '***' : 'MISSING');
    
    const mailOptions = {
      from: `"Test User" <${process.env.EMAIL_USER}>`,
      to: 'hoanglbp3300@gmail.com',
      subject: 'Test Email',
      text: 'This is a test'
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Success:', info.messageId);
  } catch (err) {
    console.error('Failed:', err);
  }
}
test();
