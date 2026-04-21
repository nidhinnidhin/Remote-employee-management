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
    const html = this.getHtmlWrapper(`
      <div style="text-align:center;">
        <h2 style="color:#1e293b;margin-bottom:16px;font-size:24px;">Verify Your Email</h2>
        <p style="color:#64748b;font-size:16px;line-height:24px;margin-bottom:32px;">
          Use the verification code below to complete your sign-in. This code is valid for <strong>10 minutes</strong>.
        </p>
        <div style="background:#f1f5f9;border-radius:12px;padding:24px;display:inline-block;margin-bottom:32px;">
          <span style="font-size:40px;font-weight:bold;letter-spacing:8px;color:#2563eb;font-family:monospace;">${otp}</span>
        </div>
        <p style="color:#94a3b8;font-size:14px;">
          If you didn't request this code, you can safely ignore this email.
        </p>
      </div>
    `);

    await this.sendMail({
      to: email,
      subject: 'Verify your email – OTP',
      html,
    });

    console.log(' OTP email sent successfully to:', email);
  }

  async sendEmployeeInvite(email: string, inviteLink: string): Promise<void> {
    const html = this.getHtmlWrapper(`
      <div style="text-align:center;">
        <h2 style="color:#1e293b;margin-bottom:16px;font-size:24px;">Welcome to the Team! 🎉</h2>
        <p style="color:#64748b;font-size:16px;line-height:24px;margin-bottom:32px;">
          You've been invited to join your organization on our platform. Click the button below to set up your account and get started.
        </p>
        <a href="${inviteLink}" 
           style="display:inline-block;background:#2563eb;color:#ffffff;padding:16px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;margin-bottom:32px;box-shadow:0 4px 6px -1px rgba(37,99,235,0.2);">
          Accept Invitation
        </a>
        <p style="color:#94a3b8;font-size:14px;margin-bottom:0;">
          This link will expire in 15 minutes for security reasons.
        </p>
      </div>
    `);

    await this.sendMail({
      to: email,
      subject: 'Access your employee account',
      html,
    });
  }

  async sendBlockNotification(
    email: string,
    name: string,
    reason: string,
  ): Promise<void> {
    const html = this.getHtmlWrapper(`
      <div>
        <h2 style="color:#dc2626;margin-bottom:16px;font-size:24px;">Account Status Update</h2>
        <p style="color:#1e293b;font-size:16px;line-height:24px;margin-bottom:16px;">
          Hi ${name || 'there'},
        </p>
        <p style="color:#64748b;font-size:16px;line-height:24px;margin-bottom:24px;">
          Your account has been temporarily suspended by your administrator.
        </p>
        <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:20px;margin-bottom:24px;border-radius:4px;">
          <strong style="color:#991b1b;display:block;margin-bottom:4px;">Reason for suspension:</strong>
          <p style="color:#b91c1c;margin:0;">${reason}</p>
        </div>
        <p style="color:#64748b;font-size:16px;line-height:24px;">
          If you believe this is a mistake, please reach out to your organization's IT or HR department.
        </p>
      </div>
    `);

    await this.sendMail({
      to: email,
      subject: 'Account Status Update – Blocked',
      html,
    });
  }

  async sendUnblockNotification(email: string, name: string): Promise<void> {
    const html = this.getHtmlWrapper(`
      <div>
        <h2 style="color:#16a34a;margin-bottom:16px;font-size:24px;">Account Restored</h2>
        <p style="color:#1e293b;font-size:16px;line-height:24px;margin-bottom:16px;">
          Hi ${name || 'there'},
        </p>
        <p style="color:#64748b;font-size:16px;line-height:24px;margin-bottom:24px;">
          Great news! Your account access has been successfully restored by your administrator.
        </p>
        <p style="color:#64748b;font-size:16px;line-height:24px;margin-bottom:32px;">
          You can now log in and resume your activities as normal.
        </p>
        <div style="text-align:center;">
          <a href="${process.env.FRONTEND_URL || '#'}" 
             style="display:inline-block;background:#16a34a;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">
            Go to Dashboard
          </a>
        </div>
      </div>
    `);

    await this.sendMail({
      to: email,
      subject: 'Account Status Update – Restored',
      html,
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
    const html = this.getHtmlWrapper(`
      <div>
        <h2 style="color:${isSuspended ? '#dc2626' : '#16a34a'};margin-bottom:16px;font-size:24px;">
          Company Status: ${isSuspended ? 'Suspended' : 'Activated'}
        </h2>
        <p style="color:#1e293b;font-size:16px;line-height:24px;margin-bottom:16px;">
          Hi ${adminName || 'there'},
        </p>
        <p style="color:#64748b;font-size:16px;line-height:24px;margin-bottom:24px;">
          The status of <strong>${companyName}</strong> has been updated to <strong>${status}</strong>.
        </p>
        <div style="background:${isSuspended ? '#fef2f2' : '#f0fdf4'};border-left:4px solid ${isSuspended ? '#dc2626' : '#16a34a'};padding:20px;margin-bottom:24px;border-radius:4px;">
          <strong style="color:${isSuspended ? '#991b1b' : '#166534'};display:block;margin-bottom:4px;">Notes:</strong>
          <p style="color:${isSuspended ? '#b91c1c' : '#15803d'};margin:0;">
            ${reason || (isSuspended ? 'Administrative decision' : 'Review completed')}
          </p>
        </div>
        <p style="color:#64748b;font-size:16px;line-height:24px;">
          ${
            isSuspended
              ? 'Access for all users within your organization has been disabled until further notice.'
              : 'Your organization is now fully operational. Users can once again access the platform.'
          }
        </p>
      </div>
    `);

    await this.sendMail({
      to: email,
      subject: isSuspended
        ? `Important: ${companyName} has been Suspended`
        : `Important: ${companyName} has been Re-activated`,
      html,
    });
  }

  private getHtmlWrapper(content: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background-color: #f8fafc;
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body style="background-color:#f8fafc;padding:40px 20px;">
          <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);">
            <!-- Header -->
            <div style="background-color:#2563eb;padding:32px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:bold;letter-spacing:-0.5px;">Portal</h1>
            </div>
            
            <!-- Content -->
            <div style="padding:40px;">
              ${content}
            </div>

            <!-- Footer -->
            <div style="background-color:#f8fafc;padding:32px;text-align:center;border-top:1px solid #f1f5f9;">
              <p style="color:#94a3b8;font-size:14px;margin:0 0 8px 0;">&copy; ${new Date().getFullYear()} Portal Inc. All rights reserved.</p>
              <p style="color:#cbd5e1;font-size:12px;margin:0;">This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private async sendMail(options: {
    to: string;
    subject: string;
    html: string;
  }) {
    await this.transporter.sendMail({
      from: `"Portal Support" <${process.env.MAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }
}
