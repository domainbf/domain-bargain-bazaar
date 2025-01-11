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
    console.log('Attempting to send email to:', to);
    console.log('Email subject:', subject);
    
    const { data: resendApiKey } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'RESEND_API_KEY')
      .single();

    if (!resendApiKey?.value) {
      throw new Error('Resend API key not found');
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey.value}`,
      },
      body: JSON.stringify({
        from: 'Domain.BF <noreply@domain.bf>',
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send email');
    }

    const data = await response.json();
    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendDomainNotification = async (
  to: string,
  type: 'offer' | 'purchase' | 'transfer',
  data: {
    domainName: string;
    amount?: number;
    message?: string;
    buyerEmail?: string;
    buyerPhone?: string;
  }
) => {
  let subject = '';
  let html = '';

  switch (type) {
    case 'offer':
      subject = `新的域名报价 - ${data.domainName}`;
      html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2>新的域名报价</h2>
          <p>您收到了一个新的域名报价：</p>
          <p><strong>域名:</strong> ${data.domainName}</p>
          <p><strong>报价金额:</strong> $${data.amount?.toLocaleString()}</p>
          <p><strong>买家邮箱:</strong> ${data.buyerEmail}</p>
          <p><strong>买家电话:</strong> ${data.buyerPhone}</p>
          ${data.message ? `<p><strong>留言:</strong> ${data.message}</p>` : ''}
          <p>请登录您的账户查看详细信息并回复此报价。</p>
        </div>
      `;
      break;
    case 'purchase':
      subject = `域名购买确认 - ${data.domainName}`;
      html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2>域名购买确认</h2>
          <p>您已成功购买域名 ${data.domainName}</p>
          <p>购买金额: $${data.amount?.toLocaleString()}</p>
          <p>我们的团队将尽快处理您的订单。</p>
        </div>
      `;
      break;
    case 'transfer':
      subject = `域名转移通知 - ${data.domainName}`;
      html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2>域名转移通知</h2>
          <p>您的域名 ${data.domainName} 正在进行转移。</p>
          <p>请注意查收相关邮件并按照指引完成转移流程。</p>
        </div>
      `;
      break;
  }

  await sendEmail({
    to: [to],
    subject,
    html,
  });
};

export const sendWelcomeEmail = async (email: string, confirmationUrl: string) => {
  console.log('Sending welcome email to:', email);
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
