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
  if (typeof value !== "string") return false;
  try {
    const u = new URL(value);
    return (
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
    value.every(
      (s) =>
        s &&
        typeof s.id === "string" &&
        typeof s.title === "string" &&
        s.title.length <= 200 &&
        ["working", "structure", "submission"].includes(s.discipline) &&
        typeof s.marla === "number" &&
        s.marla > 0 &&
        s.marla <= 1000 &&
        typeof s.level === "string" &&
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
