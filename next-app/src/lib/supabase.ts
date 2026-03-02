import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============ PORTFOLIO ============
export async function getPortfolioItems(category = 'all') {
    let query = supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });

    if (category !== 'all') {
        query = query.eq('category', category);
    }

    const { data, error } = await query;
    return { data, error };
}

// ============ SITE CONTENT ============
export async function getSiteContent() {
    const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .single();
    return { data, error };
}

// ============ PORTFOLIO ORDER ============
export async function getPortfolioOrder(content: Record<string, string> | null): Promise<Record<string, string[]>> {
    const rawOrder = content?.portfolio_order || content?.contact_phone_display;
    if (!rawOrder) return { all: [] };
    try {
        const parsed = JSON.parse(rawOrder);
        if (Array.isArray(parsed)) return { all: parsed.map(String) };
        return parsed;
    } catch {
        return { all: [] };
    }
}

// ============ PORTFOLIO PINNED ============
export async function getPinnedItems(content: Record<string, string> | null): Promise<Record<string, string[]>> {
    if (!content?.portfolio_pinned) return { all: [] };
    try {
        const parsed = JSON.parse(content.portfolio_pinned);
        if (Array.isArray(parsed)) return { all: parsed.map(String) };
        return parsed;
    } catch {
        return { all: [] };
    }
}

// ============ VIDEOS ============
export async function getVideos() {
    const { data, error } = await supabase
        .from('site_videos')
        .select('*')
        .order('created_at', { ascending: false });
    return { data, error };
}

// ============ CONTACT FORM ============
export async function submitContactForm(formData: {
    name: string;
    email: string;
    phone?: string;
    project_type?: string;
    message: string;
}) {
    const { data, error } = await supabase
        .from('messages')
        .insert([{
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            project_type: formData.project_type || null,
            message: formData.message,
            status: 'new',
            created_at: new Date().toISOString(),
        }])
        .select();
    return { data, error };
}

// ============ CLOUDINARY HELPER ============
export function optimizeCloudinaryUrl(url: string, width = 800): string {
    if (!url || !url.includes('res.cloudinary.com')) return url;
    // Only add transforms if not already present
    if (url.includes('/upload/q_')) return url;
    return url.replace('/upload/', `/upload/q_auto,f_auto,w_${width},c_limit/`);
}
