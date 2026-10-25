import type { Metadata } from "next";
import WebsiteEditor from "./WebsiteEditor";
export const metadata: Metadata = {
  title: "Website Rates & Samples",
  robots: "noindex, nofollow",
};
export default function WebsiteSettings() {
  return <WebsiteEditor />;
}
