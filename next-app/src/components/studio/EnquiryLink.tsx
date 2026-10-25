"use client";
import type { ComponentPropsWithoutRef } from "react";
import { publicWhatsAppNumber } from "@/lib/public-contact";
import { recordWhatsAppContact } from "@/lib/contact-tracking";
export default function EnquiryLink({
  number,
  message,
  children,
  ...props
}: Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  number: string;
  message: string;
}) {
  return (
    <a
      {...props}
      href={`https://wa.me/${publicWhatsAppNumber(number)}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => recordWhatsAppContact("home_cta")}
    >
      {children}
    </a>
  );
}
