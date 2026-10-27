import "server-only";
import { unstable_cache } from "next/cache";
import { getPortfolioItems as readPortfolio, getSiteContent as readContent, getVideos as readVideos } from "./supabase";
import { getPricing as readPricing } from "./pricing-server";
// Only anonymous, public website reads enter this cache. Portal queries never do.
const options = { revalidate: 60, tags: ["public-website"] };
export const getPortfolioItems = unstable_cache(async (category = "all") => {
  const result = await readPortfolio(category);
  if (result.error) throw new Error("Portfolio could not be loaded");
  return result;
}, ["public-portfolio-v1"], options);
export const getSiteContent = unstable_cache(async () => {
  const result = await readContent();
  if (result.error) throw new Error("Website content could not be loaded");
  return result;
}, ["public-content-v1"], options);
export const getVideos = unstable_cache(async () => {
  const result = await readVideos();
  if (result.error) throw new Error("Website videos could not be loaded");
  return result;
}, ["public-videos-v1"], options);
export const getPricing = unstable_cache(readPricing, ["public-pricing-v1"], options);
export { getPortfolioOrder, getPinnedItems, optimizeCloudinaryUrl } from "./supabase";
