"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Keep the floating shortcut away from the footer's own contact action. */
export default function FloatingContactVisibility() {
  const pathname = usePathname();
  useEffect(() => {
    const footer = document.querySelector(".studio-footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => {
      document.documentElement.dataset.footerVisible = String(entry.isIntersecting);
    });
    observer.observe(footer);
    return () => {
      observer.disconnect();
      delete document.documentElement.dataset.footerVisible;
    };
  }, [pathname]);
  return null;
}
