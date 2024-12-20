import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: 'woshi@wubaohu.com',
    pass: 'lijiawei123AINI@'
  },
  tls: {
    rejectUnauthorized: false
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <h1 style="color: #1a1a1a; margin-bottom: 20px;">Thank you for your offer!</h1>
          <p style="color: #4a4a4a; font-size: 16px;">Dear ${buyerName},</p>
          <p style="color: #4a4a4a; font-size: 16px;">We have received your offer of $${offerAmount.toLocaleString()} for ${domainName}.</p>
          <p style="color: #4a4a4a; font-size: 16px;">We will review your offer and get back to you soon.</p>
          ${message ? `<p style="color: #4a4a4a; font-size: 16px;">Your message: ${message}</p>` : ''}
          <p style="color: #4a4a4a; font-size: 16px; margin-top: 20px;">Best regards,<br>Domain Bazaar Team</p>
        </div>
      `
    });

    // Send email to admin
    await transporter.sendMail({
      from: 'woshi@wubaohu.com',
      to: 'domain@nic.bn',
      subject: `New offer received for ${domainName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <h1 style="color: #1a1a1a; margin-bottom: 20px;">New Domain Offer</h1>
          <div style="background-color: white; padding: 20px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="color: #4a4a4a; font-size: 16px;"><strong>Domain:</strong> ${domainName}</p>
            <p style="color: #4a4a4a; font-size: 16px;"><strong>Offer Amount:</strong> $${offerAmount.toLocaleString()}</p>
            <p style="color: #4a4a4a; font-size: 16px;"><strong>Buyer Name:</strong> ${buyerName}</p>
            <p style="color: #4a4a4a; font-size: 16px;"><strong>Buyer Email:</strong> ${buyerEmail}</p>
            ${message ? `<p style="color: #4a4a4a; font-size: 16px;"><strong>Message:</strong> ${message}</p>` : ''}
          </div>
        </div>
      `
    });

    console.log('Emails sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};