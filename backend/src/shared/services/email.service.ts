import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendOtp(email: string, otp: string): Promise<void> {
    await this.sendMail({
      to: email,
      subject: 'Verify your email – OTP',
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP code is:</p>
        <h1>${otp}</h1>
        <p>This code is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore.</p>
      `,
    });
  }

  async sendEmployeeInvite(email: string, inviteLink: string): Promise<void> {
    await this.sendMail({
      to: email,
      subject: 'Access your employee account',
      html: `
        <p>Hi,</p>
        <p>You’ve been invited to join the organization.</p>
        <p>
          <a href="${inviteLink}" target="_blank">
            Access my account
          </a>
        </p>
        <p>This link expires in 15 minutes.</p>
        <p>If you didn’t request this, ignore the email.</p>
      `,
    });
  }

  private async sendMail(options: {
    to: string;
    subject: string;
    html: string;
  }) {
    await this.transporter.sendMail({
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }
}
