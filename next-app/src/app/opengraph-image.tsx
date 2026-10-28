import { ImageResponse } from "next/og";
export const alt = "RenderLine Studio - Architecture, made visible.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function ShareImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0b0b0d", color: "#f5f5f7", padding: "66px 76px", borderBottom: "10px solid #d6b883" }}>
      <div style={{ display: "flex", color: "#d6b883", fontSize: 30 }}>RenderLine Studio</div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 83, fontWeight: 700, letterSpacing: -4, lineHeight: 1.08 }}><span>Architecture,</span><span>made visible.</span></div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#acacb3" }}><span>Plans / Drawings / 3D Visualization</span><span>renderline.pk</span></div>
    </div>, size,
  );
}
