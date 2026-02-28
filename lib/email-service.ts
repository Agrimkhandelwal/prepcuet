import nodemailer from 'nodemailer';

// Email configuration - add these to .env.local
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
const FROM_NAME = 'PrepCUET';

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport(SMTP_CONFIG);
  }
  return transporter;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using SMTP
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const { to, subject, html, text } = options;

    const mailOptions = {
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text: text || stripHtml(html),
    };

    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(userName: string, userEmail: string): Promise<boolean> {
  const subject = 'Welcome to PrepCUET - Your CUET Preparation Journey Starts Here! 🎓';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to PrepCUET!</h1>
          <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px;">Your Gateway to CUET Success</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #1e293b; font-size: 24px; margin: 0 0 20px 0;">Hello ${userName}! 👋</h2>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Congratulations on taking the first step towards CUET success! We're thrilled to have you join thousands of students preparing with PrepCUET.
          </p>

          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            Here's what you can do to get started:
          </p>

          <!-- Features -->
          <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
            <div style="margin-bottom: 20px;">
              <div style="display: inline-block; width: 40px; height: 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 8px; text-align: center; line-height: 40px; font-size: 20px; margin-right: 15px; vertical-align: middle;">📚</div>
              <div style="display: inline-block; vertical-align: middle; max-width: calc(100% - 60px);">
                <h3 style="color: #1e293b; font-size: 18px; margin: 0 0 5px 0;">Access Free Resources</h3>
                <p style="color: #64748b; font-size: 14px; margin: 0;">Browse our comprehensive study materials and notes</p>
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <div style="display: inline-block; width: 40px; height: 40px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 8px; text-align: center; line-height: 40px; font-size: 20px; margin-right: 15px; vertical-align: middle;">📝</div>
              <div style="display: inline-block; vertical-align: middle; max-width: calc(100% - 60px);">
                <h3 style="color: #1e293b; font-size: 18px; margin: 0 0 5px 0;">Take Free Tests</h3>
                <p style="color: #64748b; font-size: 14px; margin: 0;">One free test for each subject to get you started</p>
              </div>
            </div>

            <div>
              <div style="display: inline-block; width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 8px; text-align: center; line-height: 40px; font-size: 20px; margin-right: 15px; vertical-align: middle;">📊</div>
              <div style="display: inline-block; vertical-align: middle; max-width: calc(100% - 60px);">
                <h3 style="color: #1e293b; font-size: 18px; margin: 0 0 5px 0;">Track Your Progress</h3>
                <p style="color: #64748b; font-size: 14px; margin: 0;">View detailed analytics and improve your performance</p>
              </div>
            </div>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.preepcuet.in'}/test-series" 
               style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Start Practicing Now
            </a>
          </div>

          <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
            Need help? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.preepcuet.in'}/support" style="color: #3b82f6; text-decoration: none;">Support Center</a>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0 0 10px 0;">
            You're receiving this email because you created an account on PrepCUET
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            © 2026 PrepCUET. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: userEmail, subject, html });
}

/**
 * Send confirmation email when a test is submitted
 */
export async function sendSubmissionConfirmationEmail(
  userName: string,
  userEmail: string,
  testTitle: string,
  testId: string
): Promise<boolean> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.preepcuet.in';
  const subject = `✅ Test Submitted: ${testTitle} — Results in 10 minutes!`;
  const html = `
    <!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',sans-serif;background:#f8fafc;">
    <div style="max-width:600px;margin:0 auto;background:#fff;">
      <div style="background:linear-gradient(135deg,#1a237e,#1565c0);padding:40px 20px;text-align:center;">
        <div style="font-size:48px;margin-bottom:12px;">🎉</div>
        <h1 style="color:#fff;margin:0;font-size:26px;font-weight:700;">Test Submitted!</h1>
        <p style="color:#90caf9;margin:10px 0 0;font-size:15px;">${testTitle}</p>
      </div>
      <div style="padding:40px 30px;">
        <h2 style="color:#1e293b;font-size:22px;margin:0 0 16px;">Hi ${userName || 'Student'}! 👋</h2>
        <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;">Your test is being evaluated. Results will be <strong>ready in 10 minutes</strong> and we'll email you when they're available.</p>
        <div style="background:#f0f4ff;border-left:4px solid #1a237e;padding:18px 20px;border-radius:8px;margin-bottom:28px;">
          <p style="color:#1a237e;font-size:14px;margin:0;line-height:1.8;">
            ⏱️ <strong>Ready in:</strong> ~10 minutes<br/>
            📧 <strong>Email sent:</strong> Automatically when ready<br/>
            📊 <strong>Includes:</strong> Score, rank, question breakdown
          </p>
        </div>
        <div style="text-align:center;margin:32px 0;">
          <a href="${siteUrl}/test-series/${testId}/pending" style="display:inline-block;background:linear-gradient(135deg,#1a237e,#1565c0);color:#fff;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:600;font-size:15px;">Check Result Status</a>
        </div>
      </div>
      <div style="background:#f8fafc;padding:24px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="color:#94a3b8;font-size:12px;margin:0;">© 2026 PrepCUET. All rights reserved.</p>
      </div>
    </div></body></html>
  `;
  return sendEmail({ to: userEmail, subject, html });
}

/**
 * Send result notification email
 */
export async function sendResultNotificationEmail(
  userName: string,
  userEmail: string,
  testTitle: string,
  testId: string,
  resultId: string
): Promise<boolean> {
  const resultUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.preepcuet.in'}/test-series/${testId}/result?ref=email`;

  const subject = `Your ${testTitle} Results Are Ready! 🎯`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
          <div style="width: 80px; height: 80px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px;">
            🎯
          </div>
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Results Are Ready!</h1>
          <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Your test has been evaluated</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #1e293b; font-size: 24px; margin: 0 0 20px 0;">Hello ${userName}! 👋</h2>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Great news! Your results for <strong>${testTitle}</strong> are now available.
          </p>

          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="color: #065f46; font-size: 16px; margin: 0; line-height: 1.6;">
              <strong>📊 View your detailed performance analysis including:</strong><br/>
              ✓ Score and rank<br/>
              ✓ Question-wise breakdown<br/>
              ✓ Time analysis<br/>
              ✓ Improvement suggestions
            </p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resultUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
              View My Results
            </a>
          </div>

          <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
            Or copy and paste this link in your browser:<br/>
            <a href="${resultUrl}" style="color: #3b82f6; word-break: break-all;">${resultUrl}</a>
          </p>

          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 30px 0;">
            <p style="color: #92400e; font-size: 14px; margin: 0;">
              💡 <strong>Tip:</strong> Review the solutions carefully to understand your mistakes and improve in your next attempt!
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0 0 10px 0;">
            Keep practicing to ace your CUET exam!
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            © 2026 PrepCUET. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: userEmail, subject, html });
}

/**
 * Send notification about a new or updated test series
 */
export async function sendTestNotificationEmail(
  userName: string,
  userEmail: string,
  testTitle: string,
  testId: string,
  testDescription: string
): Promise<boolean> {
  const testUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.preepcuet.in'}/test-series/${testId}`;
  const subject = `New Test Available: ${testTitle} 📚`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">New Test Available!</h1>
          <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px;">Sharpen your skills with our latest test.</p>
        </div>

        <div style="padding: 40px 30px;">
          <h2 style="color: #1e293b; font-size: 24px; margin: 0 0 20px 0;">Hello ${userName || 'Student'}! 👋</h2>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            We have just published a new test that you might be interested in: <strong>${testTitle}</strong>
          </p>

          <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
            <p style="color: #475569; font-size: 15px; line-height: 1.5; margin: 0;">
              ${testDescription || 'Check out this new test and practice your concepts to ace your exams.'}
            </p>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${testUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
              View Test Details
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
            Or copy and paste this link in your browser:<br/>
            <a href="${testUrl}" style="color: #3b82f6; word-break: break-all;">${testUrl}</a>
          </p>
        </div>

        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0 0 10px 0;">
            You're receiving this email because you created an account on PrepCUET
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            © 2026 PrepCUET. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: userEmail, subject, html });
}

/**
 * Helper function to strip HTML tags for plain text version
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
