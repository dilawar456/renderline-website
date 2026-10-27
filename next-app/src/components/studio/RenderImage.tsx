"use client";
import Image, { type ImageProps } from "next/image";
import { cloudinaryLoader } from "@/lib/cloudinary-loader";
export default function RenderImage(props:ImageProps) {
  const cloudinary=typeof props.src==='string' && props.src.startsWith('https://res.cloudinary.com/');
  return <Image {...props} alt={props.alt} loader={cloudinary ? cloudinaryLoader : props.loader} />;
}
