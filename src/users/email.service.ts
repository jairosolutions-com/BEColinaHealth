// import { Injectable } from '@nestjs/common';
// import { MailerService } from '@nestjs-modules/mailer';

// @Injectable()
// export class EmailService {
//   constructor(private readonly mailerService: MailerService) {}

//   async sendResetToken(email: string, resetToken: string): Promise<void> {
//     await this.mailerService.sendMail({
//       to: email,
//       subject: 'Password Reset Token',
//       text: `Your password reset token is: ${resetToken}`,
//     });
//   }
// }
