import { supabase } from './supabase';

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
    
    const response = await fetch(
      'https://trqxaizkwuizuhlfmdup.supabase.co/functions/v1/send-email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          to,
          subject,
          html,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
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
    to: ['9208522@qq.com'],
    subject: `新的反馈信息 - 来自 ${feedback.name}`,
    html,
  });

  // Store feedback in database
  await supabase.from('feedback').insert([feedback]);
};