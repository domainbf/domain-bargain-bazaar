import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const PAYPAL_API_URL = Deno.env.get('PAYPAL_API_URL') || 'https://api-m.sandbox.paypal.com';
const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
const PAYPAL_SECRET_KEY = Deno.env.get('PAYPAL_SECRET_KEY');

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

async function getAccessToken() {
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`);
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await response.json();
  return data.access_token;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    const { amount } = await req.json();
    const accessToken = await getAccessToken();

    console.log('Creating PayPal order for amount:', amount);

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: amount.toString(),
          },
        }],
      }),
    });

    const data = await response.json();
    console.log('PayPal order created:', data);

    return new Response(JSON.stringify(data), {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
    });
  }
})