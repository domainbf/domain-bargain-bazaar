
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Email templates
const templates = {
  registration: (name: string, verificationUrl: string) => ({
    subject: "验证您的账户 - name.cf",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h1 style="color: #4169E1; text-align: center;">账户验证</h1>
        <p>尊敬的 ${name || '用户'},</p>
        <p>感谢您注册 name.cf! 请点击下方按钮验证您的账户:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4169E1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">验证账户</a>
        </div>
        <p>如果您没有注册 name.cf 账户，请忽略此邮件。</p>
        <p>谢谢,<br>name.cf 团队</p>
      </div>
    `,
  }),
  
  passwordReset: (name: string, resetUrl: string) => ({
    subject: "密码重置请求 - name.cf",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h1 style="color: #4169E1; text-align: center;">密码重置</h1>
        <p>尊敬的 ${name || '用户'},</p>
        <p>我们收到了您在 name.cf 的密码重置请求。请点击下方按钮设置新密码:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4169E1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">重置密码</a>
        </div>
        <p>如果您没有请求重置密码，请忽略此邮件，您的账户将保持安全。</p>
        <p>谢谢,<br>name.cf 团队</p>
      </div>
    `,
  }),
  
  offerReceived: (name: string, domainName: string, offerAmount: number, dashboardUrl: string) => ({
    subject: `您收到了对 ${domainName} 的新报价 - name.cf`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h1 style="color: #4169E1; text-align: center;">新报价通知</h1>
        <p>尊敬的 ${name || '用户'},</p>
        <p>您的域名 <strong>${domainName}</strong> 收到了一个新的报价!</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #4169E1;">报价详情:</h3>
          <p><strong>域名:</strong> ${domainName}</p>
          <p><strong>报价金额:</strong> $${offerAmount.toLocaleString()}</p>
        </div>
        <p>请登录您的仪表盘查看和回应此报价:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="background-color: #4169E1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">查看报价</a>
        </div>
        <p>谢谢,<br>name.cf 团队</p>
      </div>
    `,
  }),
  
  transactionConfirmation: (name: string, domainName: string, amount: number, transactionId: string) => ({
    subject: `${domainName} 交易确认 - name.cf`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h1 style="color: #4169E1; text-align: center;">交易确认</h1>
        <p>尊敬的 ${name || '用户'},</p>
        <p>您的域名交易已成功完成!</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #4169E1;">交易详情:</h3>
          <p><strong>域名:</strong> ${domainName}</p>
          <p><strong>金额:</strong> $${amount.toLocaleString()}</p>
          <p><strong>交易ID:</strong> ${transactionId}</p>
          <p><strong>状态:</strong> <span style="color: #2e8b57; font-weight: bold;">已完成</span></p>
        </div>
        <p>感谢您使用我们的服务!</p>
        <p>谢谢,<br>name.cf 团队</p>
      </div>
    `,
  })
};

interface EmailNotificationRequest {
  type: 'registration' | 'passwordReset' | 'offerReceived' | 'transactionConfirmation';
  email: string;
  name?: string;
  data: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, name, data }: EmailNotificationRequest = await req.json();
    let emailContent;
    
    switch (type) {
      case 'registration':
        emailContent = templates.registration(name || '', data.verificationUrl);
        break;
      case 'passwordReset':
        emailContent = templates.passwordReset(name || '', data.resetUrl);
        break;
      case 'offerReceived':
        emailContent = templates.offerReceived(name || '', data.domainName, data.offerAmount, data.dashboardUrl);
        break;
      case 'transactionConfirmation':
        emailContent = templates.transactionConfirmation(name || '', data.domainName, data.amount, data.transactionId);
        break;
      default:
        throw new Error('Invalid email type');
    }

    const emailResponse = await resend.emails.send({
      from: "name.cf <noreply@name.cf>",
      to: [email],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email-notification function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
