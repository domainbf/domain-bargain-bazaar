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
  offerAmount: number
) => {
  // Send email to buyer
  await transporter.sendMail({
    from: 'woshi@wubaohu.com',
    to: buyerEmail,
    subject: `Your offer for ${domainName} has been received`,
    html: `
      <h1>Thank you for your offer!</h1>
      <p>We have received your offer of $${offerAmount} for ${domainName}.</p>
      <p>We will review your offer and get back to you soon.</p>
    `
  });

  // Send email to admin
  await transporter.sendMail({
    from: 'woshi@wubaohu.com',
    to: 'domain@nic.bn',
    subject: `New offer received for ${domainName}`,
    html: `
      <h1>New Domain Offer</h1>
      <p>Domain: ${domainName}</p>
      <p>Offer Amount: $${offerAmount}</p>
      <p>Buyer Email: ${buyerEmail}</p>
    `
  });
};