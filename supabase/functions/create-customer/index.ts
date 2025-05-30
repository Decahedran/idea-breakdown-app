// supabase/functions/create-customer/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.1.0";

// Load Stripe with secret key
const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2022-11-15",
});

serve(async (req: Request): Promise<Response> => {
  // Enable CORS
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "https://idea-breakdown-app.vercel.app", // Adjust this in production
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  }

  try {
    const body = await req.json();
    const { email } = body;

    // Basic input validation
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers,
      });
    }

    // Create the Stripe customer
    const customer = await stripe.customers.create({ email });

    return new Response(JSON.stringify({ id: customer.id }), {
      status: 200,
      headers,
    });
  } catch (err: any) {
    console.error("Stripe Error:", err.message);

    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers,
    });
  }
});
