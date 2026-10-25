import "server-only";
import { supabase } from "./supabase";
import { DEFAULT_PRICING, validatePricing, type Pricing } from "./pricing";
export async function getPricing(): Promise<Pricing> {
  const { data } = await supabase
    .from("site_content")
    .select("pricing_config")
    .limit(1)
    .maybeSingle();
  return validatePricing(data?.pricing_config)
    ? data.pricing_config
    : DEFAULT_PRICING;
}
