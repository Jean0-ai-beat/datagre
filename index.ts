import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OS_APP_ID  = "a9f70648-314c-4c8e-9e39-7ac36505ce51";
const OS_API_KEY = "os_v2_org_tl2hjf2qdffsfbnaiyiburvn4r7rn7ok24neax5gfmybadjfjkmwaznoddna5b3wpryzpchenqpfh736vjrilzq2d6moyuvn2jvp4ui";

const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  /* CORS preflight */
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { title, message } = await req.json();

    const payload = {
      app_id:            OS_APP_ID,
      included_segments: ["All"],
      headings:  { en: title, fr: title, ht: title },
      contents:  { en: message, fr: message, ht: message },
      url:       "https://grenadyehub.com/#actualites",
    };

    const osRes = await fetch("https://onesignal.com/api/v1/notifications", {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": "Basic " + OS_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await osRes.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status:  osRes.status,
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status:  500,
    });
  }
});
