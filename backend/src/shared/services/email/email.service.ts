import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { IEmailService } from './interfaces/iemail.service';

@Injectable()
export class EmailService implements IEmailService {
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

    console.log(' OTP email sent successfully to:', email);
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

  async sendBlockNotification(
    email: string,
    name: string,
    reason: string,
  ): Promise<void> {
    await this.sendMail({
      to: email,
      subject: 'Account Status Update – Blocked',
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #d32f2f;">Account Blocked</h2>
            <p>Hi ${name || 'there'},</p>
            <p>We are writing to inform you that your account access has been suspended by your company administrator.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #d32f2f; margin: 20px 0;">
              <strong>Reason:</strong><br/>
              ${reason}
            </div>
            <p>If you believe this is a mistake, please contact your HR department or company administrator.</p>
          </div>
        `,
    });
  }

  async sendUnblockNotification(email: string, name: string): Promise<void> {
    await this.sendMail({
      to: email,
      subject: 'Account Status Update – Restored',
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #388e3c;">Account Restored</h2>
            <p>Hi ${name || 'there'},</p>
            <p>Good news! Your account access has been restored by your company administrator. You can now log in and access your portal.</p>
            <p>If you have any issues logging in, please contact support.</p>
          </div>
        `,
    });
  }

  async sendCompanyStatusNotification(
    email: string,
    adminName: string,
    companyName: string,
    status: 'ACTIVE' | 'SUSPENDED',
    reason: string,
  ): Promise<void> {
    const isSuspended = status === 'SUSPENDED';
    const subject = isSuspended
      ? `Important: ${companyName} has been Suspended`
      : `Important: ${companyName} has been Re-activated`;

    await this.sendMail({
      to: email,
      subject,
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: ${isSuspended ? '#d32f2f' : '#388e3c'};">
              Company ${isSuspended ? 'Suspension' : 'Activation'}
            </h2>
            <p>Hi ${adminName || 'there'},</p>
            <p>This is an official notification regarding the status of your company, <strong>${companyName}</strong>, on our platform.</p>
            <p>Your company has been <strong>${isSuspended ? 'SUSPENDED' : 'ACTIVATED'}</strong> by the platform administrator.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid ${isSuspended ? '#d32f2f' : '#388e3c'}; margin: 20px 0;">
              <strong>Reason:</strong><br/>
              ${reason || (isSuspended ? 'Administrative decision' : 'Review completed')}
            </div>
            <p>${isSuspended ? 'During suspension, all users from your company will lose access to the platform.' : 'All users can now resume their activities on the platform.'}</p>
            <p>If you have any questions, please reply to this email.</p>
          </div>
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
