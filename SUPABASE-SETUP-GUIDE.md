# 🚀 Supabase Setup Guide for VOG WAVE

Welcome! This guide will help you connect your website to Supabase for dynamic content management.

## 📋 What You'll Get

After setup, you'll be able to:
- ✅ Login to a secure admin panel
- ✅ Upload images directly from browser
- ✅ Manage portfolio items (add/edit/delete)
- ✅ View all contact form submissions
- ✅ Edit website text without touching code
- ✅ All data backed up in the cloud

---

## Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub or Email
4. Verify your email if needed

---

## Step 2: Create a New Project

1. Click **"New Project"**
2. Fill in details:
   - **Name**: `vogwave-studio`
   - **Database Password**: Create a strong password (SAVE IT!)
   - **Region**: Choose closest to you (e.g., `Frankfurt` for Europe/Middle East)
3. Click **"Create new project"**
4. Wait 2-3 minutes for setup

---

## Step 3: Run Database Setup

1. In your Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. Open `database-setup.sql` from your website folder
4. Copy ALL the SQL code
5. Paste it into the SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. You should see "Success" messages

---

## Step 4: Get Your API Credentials

1. Go to **Settings** → **API** (in left sidebar)
2. Copy these two values:
   - **Project URL**: `https://xxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1Ni...` (long string)

---

## Step 5: Update Configuration

1. Open `supabase-config.js` in your website folder
2. Replace the placeholder values:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

3. Save the file

---

## Step 6: Create Admin User

1. Go to **Authentication** → **Users** (in Supabase dashboard)
2. Click **"Add User"** → **"Create new user"**
3. Enter:
   - **Email**: `designstudio813@gmail.com` (or your email)
   - **Password**: Create a strong password
4. Check **"Auto Confirm User"**
5. Click **"Create User"**

---

## Step 7: Create Storage Buckets

1. Go to **Storage** (in left sidebar)
2. Click **"New Bucket"**
3. Create these buckets (one by one):

| Bucket Name | Public |
|-------------|--------|
| `portfolio-images` | ✅ Yes |
| `service-images` | ✅ Yes |
| `videos` | ✅ Yes |
| `profile` | ✅ Yes |

4. For each bucket, go to **Policies** and add:
   - **SELECT**: Allow all (for public viewing)
   - **INSERT/UPDATE/DELETE**: Allow authenticated users only

---

## Step 8: Test Your Setup

1. Open `admin.html` in your browser
2. Login with the admin email and password you created
3. You should see the admin dashboard!

---

## 🎉 Done!

Your website is now connected to Supabase. You can:

- **Upload images**: Go to Portfolio → Upload Zone
- **View messages**: All contact form submissions appear in Messages
- **Edit content**: Change homepage text from Site Content section

---

## ❓ Troubleshooting

### Login not working?
- Check if you created the user correctly in Supabase
- Make sure email is verified (or Auto Confirm was checked)
- Check browser console (F12) for errors

### Images not uploading?
- Make sure storage buckets are created
- Check bucket policies allow authenticated uploads

### Database errors?
- Go to SQL Editor and check for any failed queries
- Make sure all tables were created successfully

---

## 📞 Need Help?

- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **WhatsApp**: 0311-4544040

---

## 🔐 Security Tips

1. **Never share your service_role key** - Only use anon key in frontend
2. **Use strong passwords** for admin accounts
3. **Enable RLS policies** (already done in database-setup.sql)
4. **Keep supabase-config.js secure** - Don't commit to public repos

---

Made with ❤️ for VOG WAVE Design Studio
