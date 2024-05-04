import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NEXT_USER  ,
        pass: process.env.NEXT_PASS 
      },
    });
  }

  async sendEmail(emailAddress: string, subject: string, name: string, message: string) {
    const mailOptions = {
      from: process.env.NEXT_USER,
      to: emailAddress,
      replyTo: emailAddress,
      subject: subject,
      html: `
        <div>
          <p>Hi ${name},</p>
          <p>${message}</p>
        </div>
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
