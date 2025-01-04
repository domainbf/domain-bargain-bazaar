const baseEmailStyle = `
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333333;
  background-color: #f8f9fa;
`;

const buttonStyle = `
  display: inline-block;
  padding: 12px 24px;
  background-color: #4F46E5;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  margin: 16px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const getWelcomeEmailTemplate = (email: string, confirmationUrl: string) => `
  <div style="${baseEmailStyle} max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 24px; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <img src="https://domain.bf/logo.png" alt="Domain.BF Logo" style="height: 40px;" />
    </div>
    
    <div style="background-color: #ffffff; padding: 32px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <h1 style="color: #1F2937; margin-bottom: 16px; text-align: center;">欢迎加入 Domain.BF</h1>
      
      <p style="color: #4B5563;">您好！</p>
      
      <p style="color: #4B5563;">感谢您注册 Domain.BF 账户。为了确保您的账户安全，请点击下方按钮验证您的邮箱地址：</p>
      
      <div style="text-align: center;">
        <a href="${confirmationUrl}" style="${buttonStyle}">
          验证邮箱地址
        </a>
      </div>
      
      <p style="color: #4B5563; margin-top: 24px;">
        如果您没有注册 Domain.BF 账户，请忽略此邮件。
      </p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
        <p style="color: #6B7280; font-size: 14px; text-align: center;">
          需要帮助？请联系我们的支持团队：
          <a href="mailto:support@domain.bf" style="color: #4F46E5;">support@domain.bf</a>
        </p>
      </div>
    </div>
  </div>
`;

export const getPasswordResetTemplate = (resetUrl: string) => `
  <div style="${baseEmailStyle} max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <img src="https://domain.bf/logo.png" alt="Domain.BF Logo" style="height: 40px;" />
    </div>
    
    <h1 style="color: #1F2937; margin-bottom: 16px;">重置密码</h1>
    
    <p>您好！</p>
    
    <p>我们收到了重置您 Domain.BF 账户密码的请求。如果这是您本人的操作，请点击下方按钮重置密码：</p>
    
    <div style="text-align: center;">
      <a href="${resetUrl}" style="${buttonStyle}">
        重置密码
      </a>
    </div>
    
    <p style="margin-top: 24px; color: #EF4444;">
      ⚠️ 此链接将在 24 小时后失效。如果您没有请求重置密码，请立即联系我们的支持团队。
    </p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
      <p style="color: #6B7280; font-size: 14px;">
        需要帮助？请联系我们的支持团队：
        <a href="mailto:support@domain.bf" style="color: #4F46E5;">support@domain.bf</a>
      </p>
    </div>
  </div>
`;

export const getEmailChangeConfirmationTemplate = (newEmail: string, confirmationUrl: string) => `
  <div style="${baseEmailStyle} max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <img src="https://domain.bf/logo.png" alt="Domain.BF Logo" style="height: 40px;" />
    </div>
    
    <h1 style="color: #1F2937; margin-bottom: 16px;">确认更改邮箱地址</h1>
    
    <p>您好！</p>
    
    <p>您正在将邮箱地址更改为：${newEmail}</p>
    
    <p>为了确保账户安全，请点击下方按钮确认此更改：</p>
    
    <div style="text-align: center;">
      <a href="${confirmationUrl}" style="${buttonStyle}">
        确认更改
      </a>
    </div>
    
    <p style="margin-top: 24px; color: #EF4444;">
      ⚠️ 如果这不是您本人的操作，请立即联系我们的支持团队并更改您的密码。
    </p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
      <p style="color: #6B7280; font-size: 14px;">
        需要帮助？请联系我们的支持团队：
        <a href="mailto:support@domain.bf" style="color: #4F46E5;">support@domain.bf</a>
      </p>
    </div>
  </div>
`;
