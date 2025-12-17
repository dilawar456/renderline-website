# 🔧 Cloudinary Upload Preset Setup Guide

## ⚠️ CRITICAL: Why images are NOT uploading to cloud?

Your website is using **"Unsigned" upload presets** to upload images directly from the browser to Cloudinary. 
This is a security feature - Cloudinary requires you to **manually create** an upload preset first.

---

## 📋 Step-by-Step: Create Upload Preset

### Step 1: Login to Cloudinary
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Login with your account

### Step 2: Navigate to Upload Settings
1. Click on **Settings** (gear icon in left sidebar)
2. Click on **Upload** tab
3. Scroll down to **"Upload presets"** section

### Step 3: Create New Preset
1. Click **"Add upload preset"** button
2. Fill in:
   - **Preset name**: `renderline_unsigned` (EXACT name - case sensitive!)
   - **Signing Mode**: Select **"Unsigned"** ⚠️ THIS IS REQUIRED!
   - **Folder**: Leave blank or set to `portfolio`

### Step 4: Save Preset
1. Click **"Save"** button
2. Your preset is now ready!

---

## ✅ Verification

After creating the preset:
1. Go to your Admin Panel (`/admin.html`)
2. Try uploading an image to Portfolio
3. Check browser console (F12) for any errors

---

## 🔑 Your Cloudinary Credentials

These are already configured in your website:

| Setting | Value |
|---------|-------|
| **Cloud Name** | `dzp70azv3` |
| **API Key** | `124754412421972` |
| **Upload Preset** | `renderline_unsigned` |

> ⚠️ **Note**: API Secret is NOT needed for frontend uploads. It's only for server-side operations.

---

## 📚 How It Works

1. **Admin uploads image** → Image goes to Cloudinary cloud
2. **Cloudinary returns URL** → Example: `https://res.cloudinary.com/dzp70azv3/image/upload/v123/portfolio/image.jpg`
3. **URL saved to Supabase** → Database stores the Cloudinary URL
4. **Website displays image** → Using the Cloudinary URL

---

## 🐛 Troubleshooting

### Error: "Upload preset not found"
- Make sure preset name is **exactly** `renderline_unsigned`
- Make sure signing mode is **Unsigned**

### Error: "Invalid API key"
- API key should be `124754412421972`
- Check Cloud Name is `dzp70azv3`

### Images upload but don't show on website
- Check browser console for errors
- Make sure Supabase is connected
- Check if `portfolio_items` table exists in Supabase

---

## 📞 Need Help?

Contact support or check Cloudinary documentation:
- [Cloudinary Upload Presets](https://cloudinary.com/documentation/upload_presets)
- [Unsigned Uploads](https://cloudinary.com/documentation/upload_images#unsigned_upload)
