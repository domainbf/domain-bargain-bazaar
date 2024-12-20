import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: 'woshi@wubaohu.com',
    pass: 'lijiawei123AINI@'
  }
});

export const sendOfferEmail = async (
  buyerEmail: string,
  domainName: string,
  offerAmount: number,
  buyerName: string,
  message?: string
) => {
  try {
    // Send email to buyer
    await transporter.sendMail({
      from: 'woshi@wubaohu.com',
      to: buyerEmail,
      subject: `Your offer for ${domainName} has been received`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Thank you for your offer!</h1>
          <p>Dear ${buyerName},</p>
          <p>We have received your offer of $${offerAmount.toLocaleString()} for ${domainName}.</p>
          <p>We will review your offer and get back to you soon.</p>
          ${message ? `<p>Your message: ${message}</p>` : ''}
          <p>Best regards,<br>Domain Bazaar Team</p>
        </div>
      `
    });

    // Send email to admin
    await transporter.sendMail({
      from: 'woshi@wubaohu.com',
      to: 'domain@nic.bn',
      subject: `New offer received for ${domainName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">New Domain Offer</h1>
          <p><strong>Domain:</strong> ${domainName}</p>
          <p><strong>Offer Amount:</strong> $${offerAmount.toLocaleString()}</p>
          <p><strong>Buyer Name:</strong> ${buyerName}</p>
          <p><strong>Buyer Email:</strong> ${buyerEmail}</p>
          ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
        </div>
      `
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};