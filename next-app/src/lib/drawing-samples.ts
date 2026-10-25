export type DrawingSample = {
  id: string;
  title: string;
  discipline: "working" | "structure" | "submission";
  marla: number;
  level: string;
  description: string;
  pdf: string;
  previews: string[];
};
export function safeSampleUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const u = new URL(value);
    const publicStudioAsset =
      u.hostname === "renderline.pk" ||
      (u.hostname === "res.cloudinary.com" &&
        u.pathname.startsWith("/dzp70azv3/")) ||
      (u.hostname === "ywqtjgtqwbylkgofogxe.supabase.co" &&
        /^\/storage\/v1\/(?:object|render\/image)\/public\//.test(u.pathname));
    return (
      publicStudioAsset &&
      u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      [
        "res.cloudinary.com",
        "ywqtjgtqwbylkgofogxe.supabase.co",
        "renderline.pk",
      ].includes(u.hostname)
    );
  } catch {
    return false;
  }
}
export function validSamples(value: unknown): value is DrawingSample[] {
  return (
    Array.isArray(value) &&
    value.length <= 100 &&
    new Set(value.map((s) => s?.id)).size === value.length &&
    value.every(
      (s) =>
        s &&
        typeof s.id === "string" &&
        s.id.trim().length > 0 &&
        s.id.length <= 100 &&
        typeof s.title === "string" &&
        s.title.trim().length > 0 &&
        s.title.length <= 200 &&
        ["working", "structure", "submission"].includes(s.discipline) &&
        typeof s.marla === "number" &&
        s.marla > 0 &&
        s.marla <= 1000 &&
        typeof s.level === "string" &&
        s.level.trim().length > 0 &&
        s.level.length <= 150 &&
        typeof s.description === "string" &&
        s.description.length <= 3000 &&
        safeSampleUrl(s.pdf) &&
        Array.isArray(s.previews) &&
        s.previews.length >= 1 &&
        s.previews.length <= 40 &&
        s.previews.every(safeSampleUrl),
    )
  );
}
