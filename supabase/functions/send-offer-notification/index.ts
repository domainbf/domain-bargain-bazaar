import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OfferNotification {
  domainName: string;
  amount: number;
  buyerEmail: string;
  buyerPhone: string;
  message: string;
  ownerEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      domainName, 
      amount, 
      buyerEmail, 
      buyerPhone, 
      message,
      ownerEmail 
    }: OfferNotification = await req.json();

    // Get the owner's email from their profile
    const { data: ownerProfile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', ownerEmail)
      .single();

    if (profileError) {
      throw new Error('Could not find domain owner profile');
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2>您的域名收到了新的报价！</h2>
        <p>您好！您的域名 ${domainName} 收到了一个新的报价。</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>报价金额:</strong> $${amount.toLocaleString()}</p>
          <p><strong>买家邮箱:</strong> ${buyerEmail}</p>
          <p><strong>买家电话:</strong> ${buyerPhone}</p>
          <p><strong>买家留言:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        
        <p>请登录您的账户查看详细信息并回复此报价。</p>
        <p>如有任何问题，请联系我们的支持团队。</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Domain.BF <noreply@domain.bf>",
        to: [ownerProfile.email],
        subject: `新的域名报价 - ${domainName}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending offer notification:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send offer notification" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);