// =============================================
// SUPABASE CONFIGURATION
// RenderLine Architecture Visualization
// =============================================

// Supabase credentials
const SUPABASE_URL = 'https://ywqtjgtqwbylkgofogxe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3cXRqZ3Rxd2J5bGtnb2ZvZ3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0OTg5NzksImV4cCI6MjA4MTA3NDk3OX0.H3UvyEVXcLIaqWFPRfsVlFYvJvaA2VeD44aVcDJdDjM';

// Initialize Supabase Client
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Check if Supabase is configured
function isSupabaseConfigured() {
    return SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL' &&
        SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY' &&
        supabase !== null;
}

// =============================================
// AUTHENTICATION FUNCTIONS
// =============================================

// Admin Login
async function adminLogin(email, password) {
    if (!isSupabaseConfigured()) {
        console.error('Supabase not configured');
        return { error: { message: 'Supabase not configured. Please add your credentials.' } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    return { data, error };
}

// Admin Logout
async function adminLogout() {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase.auth.signOut();
    return { error };
}

// Get Current User
async function getCurrentUser() {
    if (!isSupabaseConfigured()) return null;

    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Check if logged in
async function isLoggedIn() {
    const user = await getCurrentUser();
    return user !== null;
}

// =============================================
// PORTFOLIO FUNCTIONS
// =============================================

// Get all portfolio items
async function getPortfolioItems(category = 'all') {
    if (!isSupabaseConfigured()) {
        console.log('Using static portfolio data');
        return { data: null, error: null };
    }

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

// Add portfolio item
async function addPortfolioItem(item) {
    if (!isSupabaseConfigured()) return { error: { message: 'Supabase not configured' } };

    const { data, error } = await supabase
        .from('portfolio_items')
        .insert([item])
        .select();

    return { data, error };
}

// Update portfolio item
async function updatePortfolioItem(id, updates) {
    if (!isSupabaseConfigured()) return { error: { message: 'Supabase not configured' } };

    const { data, error } = await supabase
        .from('portfolio_items')
        .update(updates)
        .eq('id', id)
        .select();

    return { data, error };
}

// Delete portfolio item
async function deletePortfolioItem(id) {
    if (!isSupabaseConfigured()) return { error: { message: 'Supabase not configured' } };

    const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

    return { error };
}

// =============================================
// IMAGE UPLOAD FUNCTIONS
// =============================================

// Upload image to Supabase Storage
async function uploadImage(file, bucket = 'portfolio-images') {
    if (!isSupabaseConfigured()) return { error: { message: 'Supabase not configured' } };

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

    if (error) return { error };

    // Get public URL
    const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return { data: { path: filePath, url: urlData.publicUrl }, error: null };
}

// Delete image from Supabase Storage
async function deleteImage(filePath, bucket = 'portfolio-images') {
    if (!isSupabaseConfigured()) return { error: { message: 'Supabase not configured' } };

    const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

    return { error };
}

// =============================================
// CONTACT FORM FUNCTIONS
// =============================================

// Submit contact form
async function submitContactForm(formData) {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, using fallback');
        return { error: null, fallback: true };
    }

    const { data, error } = await supabase
        .from('contacts')
        .insert([{
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            project_type: formData.project_type || null,
            message: formData.message,
            status: 'new',
            created_at: new Date().toISOString()
        }])
        .select();

    return { data, error };
}

// Get all contact messages (admin)
async function getContactMessages(status = 'all') {
    if (!isSupabaseConfigured()) return { data: [], error: null };

    let query = supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

    if (status !== 'all') {
        query = query.eq('status', status);
    }

    const { data, error } = await query;
    return { data, error };
}

// Update contact status
async function updateContactStatus(id, status) {
    if (!isSupabaseConfigured()) return { error: { message: 'Supabase not configured' } };

    const { data, error } = await supabase
        .from('contacts')
        .update({ status, replied_at: status === 'replied' ? new Date().toISOString() : null })
        .eq('id', id)
        .select();

    return { data, error };
}

// =============================================
// SITE CONTENT FUNCTIONS
// =============================================

// Get site content
async function getSiteContent() {
    if (!isSupabaseConfigured()) return { data: null, error: null };

    const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .single();

    return { data, error };
}

// Update site content
async function updateSiteContent(updates) {
    if (!isSupabaseConfigured()) return { error: { message: 'Supabase not configured' } };

    const { data, error } = await supabase
        .from('site_content')
        .update(updates)
        .eq('id', 1)
        .select();

    return { data, error };
}

// =============================================
// SERVICES FUNCTIONS
// =============================================

// Get all services
async function getServices() {
    if (!isSupabaseConfigured()) return { data: null, error: null };

    const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order', { ascending: true });

    return { data, error };
}

// Update service
async function updateService(id, updates) {
    if (!isSupabaseConfigured()) return { error: { message: 'Supabase not configured' } };

    const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select();

    return { data, error };
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#25d366' : '#ff4757'};
        color: white;
        border-radius: 4px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

console.log('Supabase Config Loaded. Configured:', isSupabaseConfigured());
