process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
const currentDate = new Date(); // Get the current date
    const formattedDate = currentDate.toDateString(); // Format the date as a string
@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NEXT_USER,
        pass: process.env.NEXT_PASS,
      },
    });
  }
  
  async sendEmail(
    emailAddress: string,
    subject: string,
    name: string,
    message: string,
    variant: string
  ) {
    const mailOptions = {
      from: process.env.NEXT_USER,
      to: emailAddress,
      replyTo: emailAddress,
      subject: subject,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Email</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
      </head>
      <body style="margin: 0; font-family: 'Poppins', sans-serif; background: #ffffff; font-size: 14px;">
      
      <div style="max-width: 680px; margin: 0 auto; padding: 45px 30px 60px; background: #f4f7ff; background-image: linear-gradient(90deg, #007C85 0%, #007C85 100%); background-repeat: no-repeat; background-size: 800px 452px; background-position: top center; font-size: 14px; color: #434343;">
        <header>
          <table style="width: 100%;">
            <tbody>
              <tr style="height: 0;">
                <td>
                  <img alt="" src="https://i.imgur.com/nFcGQ1T.png" height="30px">
                </td>
                <td style="text-align: right;">
                  <span style="font-size: 16px; line-height: 30px; color: #ffffff;">${formattedDate}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </header>
  
        <main>
          <div style="margin: 0; margin-top: 70px; padding: 92px 30px 115px; background: #ffffff; border-radius: 30px; text-align: center;">
            <div style="width: 100%; max-width: 489px; margin: 0 auto;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 500; color: #1f1f1f;">Your OTP</h1>
              <p style="margin: 0; margin-top: 17px; font-size: 16px; font-weight: 500;">Hey ${name},</p>
              <p style="margin: 0; margin-top: 17px; font-weight: 500; letter-spacing: 0.56px;">Use the following OTP to complete the procedure to ${variant==="signIn"?"login your account":"reset your account"}. OTP is valid for <span style="font-weight: 600; color: #1f1f1f;">5 minutes</span> and one time use only. Do not share this code with others, including other employees.</p>
              <p style="margin: 0; margin-top: 60px; font-size: 40px; font-weight: 600; letter-spacing: 25px; color: #007C85;">${message}</p>
            </div>
          </div>
  
          <p style="max-width: 400px; margin: 0 auto; margin-top: 90px; text-align: center; font-weight: 500; color: #8c8c8c;">Need help? Ask at <a href="mailto:kentjohnliloc@gmail.com" style="color: #499fb6; text-decoration: none;">kentjohnliloc@gmail.com</a> or visit our <a href="" target="_blank" style="color: #499fb6; text-decoration: none;">Help Center</a></p>
        </main>
  
        <footer style="width: 100%; max-width: 490px; margin: 20px auto 0; text-align: center; border-top: 1px solid #e6ebf1;">
          <p style="margin: 0; margin-top: 40px; font-size: 16px; font-weight: 600; color: #434343;">Colina Health</p>
          <p style="margin: 0; margin-top: 8px; color: #434343;">Address 540, City, State.</p>
          <div style="margin: 0; margin-top: 16px;">
            <a href="" target="_blank" style="display: inline-block;"><img width="36px" alt="Facebook" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"></a>
            <a href="" target="_blank" style="display: inline-block; margin-left: 8px;"><img width="36px" alt="Instagram" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"></a>
            <a href="" target="_blank" style="display: inline-block; margin-left: 8px;"><img width="36px" alt="Twitter" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"></a>
            <a href="" target="_blank" style="display: inline-block; margin-left: 8px;"><img width="36px" alt="Youtube" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"></a>
          </div>
          <p style="margin: 0; margin-top: 16px; color: #434343;">Copyright © 2024 Jairosoft. All rights reserved.</p>
        </footer>
      </div>
      
      </body>
      </html>
    `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
