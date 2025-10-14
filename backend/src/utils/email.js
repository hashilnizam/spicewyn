import nodemailer from 'nodemailer';
import logger from './logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Email send error:', error);
    throw error;
  }
};

export const sendOTPEmail = async (email, otp, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
        .otp { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌶 SpiceWyn</h1>
        </div>
        <div class="content">
          <h2>Hi ${name || 'there'},</h2>
          <p>Your One-Time Password (OTP) for verification is:</p>
          <div class="otp-box">
            <div class="otp">${otp}</div>
          </div>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>SpiceWyn Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} SpiceWyn. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Your OTP for SpiceWyn Verification',
    html,
    text: `Your OTP is: ${otp}. Valid for 10 minutes.`
  });
};

export const sendOrderConfirmation = async (email, order) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .order-box { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .item { padding: 10px 0; border-bottom: 1px solid #ddd; }
        .total { font-size: 18px; font-weight: bold; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed!</h1>
        </div>
        <div class="order-box">
          <h2>Order #${order.orderNumber}</h2>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <h3>Items:</h3>
          ${order.items.map(item => `
            <div class="item">
              <p><strong>${item.name}</strong> x ${item.quantity}</p>
              <p>₹${item.total}</p>
            </div>
          `).join('')}
          <div class="total">
            <p>Total: ₹${order.total}</p>
          </div>
        </div>
        <p>Thank you for shopping with SpiceWyn!</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html,
    text: `Your order ${order.orderNumber} has been confirmed. Total: ₹${order.total}`
  });
};

export const sendTicketUpdate = async (email, ticket) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <body>
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Ticket Update - ${ticket.ticketNumber}</h2>
        <p><strong>Subject:</strong> ${ticket.subject}</p>
        <p><strong>Status:</strong> ${ticket.status}</p>
        <p>Your support ticket has been updated. Please check your account for details.</p>
        <p>Best regards,<br>SpiceWyn Support Team</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Ticket Update - ${ticket.ticketNumber}`,
    html,
    text: `Your ticket ${ticket.ticketNumber} has been updated.`
  });
};
