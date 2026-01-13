const nodemailer = require('nodemailer');

// Email service configuration
// Note: You'll need to configure email settings in .env file
// Required:
// EMAIL_USER=your-email@gmail.com
// EMAIL_PASS=your-app-password
// 
// Optional (for backward compatibility):
// SMTP_HOST=smtp.gmail.com
// SMTP_PORT=587
// SMTP_FROM=noreply@yourdomain.com

let transporter = null;

// Check if email service is configured
function isEmailConfigured() {
  return !!(process.env.EMAIL_USER || process.env.SMTP_USER) && 
         !!(process.env.EMAIL_PASS || process.env.SMTP_PASS);
}

// Initialize email transporter
function initEmailService() {
  // Check if credentials are provided
  if (!isEmailConfigured()) {
    console.warn('⚠️  Email service not configured.');
    console.warn('   Please set EMAIL_USER and EMAIL_PASS in .env file to enable email verification.');
    console.warn('   For Gmail: Use an App Password (not your regular password)');
    console.warn('   Registration will succeed, but verification emails will not be sent.');
    return;
  }

  try {
    const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
    const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

    if (!emailUser || !emailPass) {
      console.warn('⚠️  Email credentials incomplete. Email service disabled.');
      return;
    }

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    // Verify connection (non-blocking)
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email service configuration error:', error.message);
        console.error('   Please check your EMAIL_USER and EMAIL_PASS in .env file');
        console.error('   For Gmail, make sure you\'re using an App Password, not your regular password');
        transporter = null; // Disable transporter on error
      } else {
        console.log('✅ Email service is ready to send messages');
      }
    });
  } catch (error) {
    console.error('❌ Failed to initialize email service:', error.message);
    console.warn('⚠️  Email functionality will be disabled. Please configure SMTP settings in .env file.');
    transporter = null;
  }
}

// Send activation email to user
async function sendActivationEmail(userEmail, userName, userEmailId, userPassword) {
  // Check if email is configured
  if (!isEmailConfigured()) {
    const errorMsg = 'Email service not configured. Please set EMAIL_USER and EMAIL_PASS in .env file.';
    console.warn('⚠️  ' + errorMsg);
    throw new Error(errorMsg);
  }

  // Try to initialize if not already done
  if (!transporter) {
    initEmailService();
  }

  // Double check transporter is ready
  if (!transporter) {
    const errorMsg = 'Email service not initialized. Please check your email configuration in .env file.';
    console.warn('⚠️  ' + errorMsg);
    throw new Error(errorMsg);
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.EMAIL_USER || process.env.SMTP_USER,
    to: userEmail,
    subject: 'Account Activated - Welcome to Mansoor App',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #6B46C1;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 5px 5px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #6B46C1;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Account Activated</h1>
          </div>
          <div class="content">
            <p>Dear ${userName},</p>
            <p>We are pleased to inform you that your account has been successfully activated!</p>
            <p>You can now access all features of the Mansoor App platform.</p>
            <p><strong>Your login credentials are:</strong></p>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; border: 2px solid #6B46C1; margin: 15px 0;">
              <p style="margin: 5px 0;"><strong>Email ID:</strong> ${userEmailId}</p>
              <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${userPassword}</p>
            </div>
            <p><strong>Important:</strong> This is a temporary password. Please change it after your first login for security purposes.</p>
            <p>Please keep these credentials secure and do not share them with anyone.</p>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            <p>Welcome aboard!</p>
            <p>Best regards,<br>The Mansoor App Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Dear ${userName},

      We are pleased to inform you that your account has been successfully activated!

      You can now access all features of the Mansoor App platform.

      Your login credentials are:
      Email ID: ${userEmailId}
      Temporary Password: ${userPassword}
      
      Important: This is a temporary password. Please change it after your first login for security purposes.

      Please keep these credentials secure and do not share them with anyone.

      If you have any questions or need assistance, please don't hesitate to contact our support team.

      Welcome aboard!

      Best regards,
      The Mansoor App Team
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Activation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending activation email:', error);
    throw error;
  }
}

// Initialize on module load
if (process.env.EMAIL_USER || process.env.SMTP_USER) {
  initEmailService();
}

// Send verification email to user after signup
async function sendVerificationEmail(userEmail, userName, verificationToken, baseUrl = 'http://localhost:3000') {
  // Check if email is configured
  if (!isEmailConfigured()) {
    const errorMsg = 'Email service not configured. Please set EMAIL_USER and EMAIL_PASS in .env file.';
    console.warn('⚠️  ' + errorMsg);
    throw new Error(errorMsg);
  }

  // Try to initialize if not already done
  if (!transporter) {
    initEmailService();
  }

  // Double check transporter is ready
  if (!transporter) {
    const errorMsg = 'Email service not initialized. Please check your email configuration in .env file.';
    console.warn('⚠️  ' + errorMsg);
    throw new Error(errorMsg);
  }

  // Create verification URL
  const verificationUrl = `${baseUrl}/api/users/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.EMAIL_USER || process.env.SMTP_USER,
    to: userEmail,
    subject: 'Verify Your Email - Mansoor App',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #6B46C1;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 5px 5px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #6B46C1;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .button:hover {
            background-color: #553C9A;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
          }
          .code {
            background-color: #ffffff;
            padding: 15px;
            border-radius: 5px;
            border: 2px solid #6B46C1;
            margin: 15px 0;
            font-family: monospace;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email Address</h1>
          </div>
          <div class="content">
            <p>Dear ${userName},</p>
            <p>Thank you for signing up for Mansoor App! To complete your registration, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <div class="code">${verificationUrl}</div>
            
            <p><strong>This link will expire in 24 hours.</strong></p>
            
            <p>If you didn't create an account with Mansoor App, please ignore this email.</p>
            
            <p>Best regards,<br>The Mansoor App Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>If the button doesn't work, please copy the link above and paste it into your browser.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Dear ${userName},

      Thank you for signing up for Mansoor App! To complete your registration, please verify your email address by visiting this link:

      ${verificationUrl}

      This link will expire in 24 hours.

      If you didn't create an account with Mansoor App, please ignore this email.

      Best regards,
      The Mansoor App Team
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw error;
  }
}

// Send password reset email
async function sendResetPasswordEmail(userEmail, userName, resetToken, baseUrl = 'http://localhost:3000') {
  // Check if email is configured
  if (!isEmailConfigured()) {
    const errorMsg = 'Email service not configured. Please set EMAIL_USER and EMAIL_PASS in .env file.';
    console.warn('⚠️  ' + errorMsg);
    throw new Error(errorMsg);
  }

  // Try to initialize if not already done
  if (!transporter) {
    initEmailService();
  }

  // Double check transporter is ready
  if (!transporter) {
    const errorMsg = 'Email service not initialized. Please check your email configuration in .env file.';
    console.warn('⚠️  ' + errorMsg);
    throw new Error(errorMsg);
  }

  // Create reset password URL
  const resetUrl = `${baseUrl}/api/users/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.EMAIL_USER || process.env.SMTP_USER,
    to: userEmail,
    subject: 'Reset Your Password - Mansoor App',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #6B46C1;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 5px 5px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #6B46C1;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .button:hover {
            background-color: #553C9A;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
          }
          .code {
            background-color: #ffffff;
            padding: 15px;
            border-radius: 5px;
            border: 2px solid #6B46C1;
            margin: 15px 0;
            font-family: monospace;
            word-break: break-all;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            color: #856404;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <p>Dear ${userName},</p>
            <p>We received a request to reset your password for your Mansoor App account.</p>
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <div class="code">${resetUrl}</div>
            
            <div class="warning">
              <p><strong>⚠️ Important:</strong></p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request a password reset, please ignore this email</li>
                <li>Your password will remain unchanged if you don't click the link</li>
              </ul>
            </div>
            
            <p>For security reasons, if you didn't request this password reset, please contact our support team immediately.</p>
            
            <p>Best regards,<br>The Mansoor App Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>If the button doesn't work, please copy the link above and paste it into your browser.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Dear ${userName},

      We received a request to reset your password for your Mansoor App account.

      Click the link below to reset your password:
      ${resetUrl}

      This link will expire in 1 hour.

      If you didn't request a password reset, please ignore this email. Your password will remain unchanged.

      For security reasons, if you didn't request this password reset, please contact our support team immediately.

      Best regards,
      The Mansoor App Team
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw error;
  }
}

module.exports = {
  sendActivationEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
  initEmailService,
  isEmailConfigured
};


