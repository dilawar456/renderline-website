import { createClient } from "@supabase/supabase-js";
import { revalidatePath, revalidateTag } from "next/cache";
import { studioSession, apiError } from "@/lib/studio-server";
import { getPricing } from "@/lib/pricing-server";
import { validatePricing } from "@/lib/pricing";
import { validSamples } from "@/lib/drawing-samples";
import { supabase } from "@/lib/supabase";
export async function GET(request: Request) {
  try {
    await studioSession(request, true);
    const [pricing, { data }] = await Promise.all([
      getPricing(),
      supabase
        .from("site_content")
        .select("drawing_samples")
        .limit(1)
        .maybeSingle(),
    ]);
    return Response.json(
      {
        pricing,
        samples: validSamples(data?.drawing_samples)
          ? data.drawing_samples
          : [],
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function PATCH(request: Request) {
  try {
    await studioSession(request, true);
    if (Number(request.headers.get("content-length")) > 200000)
      return Response.json(
        { error: "Configuration is too large." },
        { status: 400 },
      );
    const body = await request.json();
    if (!validatePricing(body.pricing) || !validSamples(body.samples))
      return Response.json(
        {
          error:
            "Check all positive numeric rates and valid HTTPS sample PDF/preview links.",
        },
        { status: 400 },
      );
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key) throw new Error("503:Website settings are unavailable.");
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: row, error: readError } = await db
      .from("site_content")
      .select("id")
      .limit(1)
      .single();
    if (readError || !row)
      throw new Error("503:Website content record is unavailable.");
    const { data: savedRow, error } = await db
      .from("site_content")
      .update({ pricing_config: body.pricing, drawing_samples: body.samples })
      .eq("id", row.id)
      .select("id")
      .single();
    if (error || !savedRow)
      throw new Error(
        "503:Website settings could not be saved. Please retry; your changes have not been confirmed.",
      );
    revalidateTag("public-website", { expire: 0 });
    revalidatePath("/", "layout");
    return Response.json({ saved: true });
  } catch (e) {
    return apiError(e);
  }
}
