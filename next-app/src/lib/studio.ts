export type Role = 'owner' | 'team' | 'client';
export type Profile = { id: string; name: string; email: string; role: Role };
export type Project = { id: string; title: string; brief: string; client_id: string | null; status: string; due_date: string | null };
export type Task = { id: string; project_id: string; title: string; instructions: string; assignee_id: string | null; due_date: string | null; status: string; priority: string };
export type Update = { id: string; project_id: string; body: string; link: string; visibility: string; created_at: string };
export type Intake = { id: string; project_id: string; raw_text: string; created_at: string };
export type LineItem = { description: string; quantity: number; rate: number };
export type Invoice = { id: string; project_id: string; number: string; bill_to: string; currency: string; items: LineItem[]; subtotal: number; discount: number; total: number; paid: number; status: string; due_date: string | null; notes: string; created_at: string };
export type Tracking = { id: number; enabled: boolean; meta_pixel: string; google_tag: string; google_ads: string; google_conversion: string };
export type Brief = { summary: string; requirements: string[]; references: string[]; changes: string[]; questions: string[]; private_notes: string[]; tasks: { title: string; instructions: string; priority: string }[] };
export const emptyTracking: Tracking = {id:1,enabled:false,meta_pixel:'',google_tag:'',google_ads:'',google_conversion:''};
export function invoiceSubtotal(items: LineItem[]) {
 if (!Array.isArray(items) || items.length < 1 || items.length > 30) throw new Error('Add 1–30 invoice items.');
 const cents = items.reduce((sum,item) => {
  if (typeof item.description !== 'string' || !item.description.trim() || !Number.isFinite(item.quantity) || !Number.isFinite(item.rate) || item.quantity <= 0 || item.rate < 0 || item.quantity > 100000 || item.rate > 100000000) throw new Error('Each item needs a description, positive quantity and valid rate.');
  return sum + Math.round(item.quantity * item.rate * 100);
 }, 0);
 if (!Number.isSafeInteger(cents) || cents > 99999999999999) throw new Error('Invoice total is too large.');
 return cents / 100;
}
export function validTracking(t: Tracking) {
 return (t.meta_pixel === '' || /^\d{5,25}$/.test(t.meta_pixel)) && (t.google_tag === '' || /^(G-[A-Z0-9]{4,20}|AW-\d{4,20})$/.test(t.google_tag)) && (t.google_ads === '' || /^AW-\d{4,20}$/.test(t.google_ads)) && (t.google_conversion === '' || /^AW-\d{4,20}\/[A-Za-z0-9_-]{1,100}$/.test(t.google_conversion));
}
export function safeLink(value: string) {
 try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : ''; } catch { return ''; }
}
