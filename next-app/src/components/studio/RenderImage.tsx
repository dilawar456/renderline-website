"use client";
import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { cloudinaryLoader } from "@/lib/cloudinary-loader";

export default function RenderImage(props: ImageProps) {
  const source = typeof props.src === "string"
    ? props.src
    : "src" in props.src ? props.src.src : props.src.default.src;
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const failed = failedSource === source;
  const cloudinary = source.startsWith("https://res.cloudinary.com/");

  return (
    <>
      <Image
        {...props}
        alt={props.alt}
        loader={cloudinary ? cloudinaryLoader : props.loader}
        style={{
          ...props.style,
          ...(failed ? { visibility: "hidden", ...(props.fill ? {} : { display: "none" }) } : {}),
        }}
        onError={event => {
          setFailedSource(source);
          props.onError?.(event);
        }}
        onLoad={event => {
          setFailedSource(null);
          props.onLoad?.(event);
        }}
      />
      {failed && (
        <span
          className={"rl-image-unavailable" + (props.fill ? "" : " rl-image-unavailable-block")}
          role="img"
          aria-label={`${props.alt || "Image"}: preview unavailable`}
        >
          <ImageOff size={28} strokeWidth={1.4} aria-hidden="true" />
          <span>Preview unavailable</span>
        </span>
      )}
    </>
  );
}
