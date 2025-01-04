import { supabase } from './supabase';
import {
  getWelcomeEmailTemplate,
  getPasswordResetTemplate,
  getEmailChangeConfirmationTemplate
} from './emailTemplates';

export const sendEmail = async ({
  to,
  subject,
  html
}: {
  to: string[];
  subject: string;
  html: string;
}) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await supabase.functions.invoke('send-email', {
      body: {
        to,
        subject,
        html,
      },
    });

    if (response.error) {
      console.error('Error response from send-email function:', response.error);
      throw new Error(response.error.message || 'Failed to send email');
    }

    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email: string, confirmationUrl: string) => {
  await sendEmail({
    to: [email],
    subject: '欢迎加入 Domain.BF - 请验证您的邮箱',
    html: getWelcomeEmailTemplate(email, confirmationUrl),
  });
};

export const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
  await sendEmail({
    to: [email],
    subject: 'Domain.BF - 重置密码请求',
    html: getPasswordResetTemplate(resetUrl),
  });
};

export const sendEmailChangeConfirmation = async (newEmail: string, confirmationUrl: string) => {
  await sendEmail({
    to: [newEmail],
    subject: 'Domain.BF - 确认更改邮箱地址',
    html: getEmailChangeConfirmationTemplate(newEmail, confirmationUrl),
  });
};

export const sendFeedbackEmail = async (feedback: {
  name: string;
  email: string;
  message: string;
}) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2>新的反馈信息</h2>
      <p><strong>姓名:</strong> ${feedback.name}</p>
      <p><strong>邮箱:</strong> ${feedback.email}</p>
      <p><strong>消息:</strong></p>
      <p style="white-space: pre-wrap;">${feedback.message}</p>
    </div>
  `;

  await sendEmail({
    to: ['admin@domain.bf'],
    subject: `新的反馈信息 - 来自 ${feedback.name}`,
    html,
  });
};

export const sendPurchaseConfirmation = async (to: string, domainName: string, amount: number) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2>域名购买确认</h2>
      <p>您已成功购买域名 ${domainName}</p>
      <p>购买金额: $${amount}</p>
      <p>我们的团队将尽快处理您的订单。</p>
      <p>如有任何问题，请联系 support@domain.bf</p>
    </div>
  `;

  await sendEmail({
    to: [to],
    subject: `域名购买确认 - ${domainName}`,
    html,
  });
};

export const sendOfferNotification = async (to: string, domainName: string, amount: number) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2>新的域名报价</h2>
      <p>您收到了一个新的域名报价：</p>
      <p><strong>域名:</strong> ${domainName}</p>
      <p><strong>报价金额:</strong> $${amount}</p>
      <p>请登录您的账户查看详细信息并回复此报价。</p>
      <p>如有任何问题，请联系 support@domain.bf</p>
    </div>
  `;

  await sendEmail({
    to: [to],
    subject: `新的域名报价 - ${domainName}`,
    html,
  });
};
