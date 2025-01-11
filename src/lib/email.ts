import { supabase } from './supabase';

interface EmailParams {
  to: string[];
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailParams) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, html }
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in sendEmail:', error);
    throw error;
  }
};

export const getWelcomeEmailTemplate = (email: string, confirmationUrl: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">欢迎加入 Domain.BF</h2>
      <p>您好！</p>
      <p>感谢您注册 Domain.BF。请点击下面的按钮验证您的邮箱地址：</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${confirmationUrl}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          验证邮箱
        </a>
      </div>
      <p>如果您没有注册 Domain.BF 账号，请忽略此邮件。</p>
      <p>谢谢！<br>Domain.BF 团队</p>
    </div>
  `;
};

export const getPasswordResetTemplate = (resetUrl: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">重置密码</h2>
      <p>您好！</p>
      <p>我们收到了重置您 Domain.BF 账号密码的请求。请点击下面的按钮重置密码：</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          重置密码
        </a>
      </div>
      <p>如果您没有请求重置密码，请忽略此邮件。</p>
      <p>谢谢！<br>Domain.BF 团队</p>
    </div>
  `;
};

export const getEmailChangeConfirmationTemplate = (newEmail: string, confirmationUrl: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">确认更改邮箱地址</h2>
      <p>您好！</p>
      <p>我们收到了将您的 Domain.BF 账号邮箱更改为 ${newEmail} 的请求。请点击下面的按钮确认此更改：</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${confirmationUrl}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          确认更改
        </a>
      </div>
      <p>如果您没有请求更改邮箱地址，请忽略此邮件。</p>
      <p>谢谢！<br>Domain.BF 团队</p>
    </div>
  `;
};