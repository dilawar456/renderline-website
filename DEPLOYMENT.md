# Deployment Guide for RenderLine Website

## 1. Finalize Database Setup (Supabase)
Ensure your Supabase database has the necessary columns for YouTube videos and Cloudinary images.
Run the following SQL in your Supabase SQL Editor if you haven't already:

```sql
-- Add YouTube video URL columns
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS youtube_video1 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS youtube_video2 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS youtube_video3 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS youtube_video4 TEXT;

-- Add Cloudinary image URL columns
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_hero1 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_hero2 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_hero3 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_hero4 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_hero5 TEXT;

-- Verify columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'site_content' 
AND (column_name LIKE '%youtube%' OR column_name LIKE '%cloudinary%');
```

## 2. Push Code to GitHub
Open your terminal and run the following commands to save all your recent changes:

```bash
git add .
git commit -m "Finalize media features: YouTube persistence, Cloudinary upload, Contact form fixes"
git push origin main
```

## 3. Deploy to Vercel
1.  Go to [Vercel](https://vercel.com) and log in.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `renderline-website` repository.
4.  (Optional) If you used environment variables for Supabase in a specific way that requires them on Vercel (though currently they are in `supabase-config.js`), add them in the "Environment Variables" section. *Note: Since your credentials are hardcoded in `supabase-config.js` for this phase, you can skip this step, but for production security, moving them to env vars is recommended later.*
5.  Click **"Deploy"**.

## 4. Verification Check
After deployment, visit your live site URL:
1.  **Admin Panel**: Go to `/admin.html`. Log in.
2.  **YouTube**: Paste a YouTube link in the "YouTube Videos" section and click "Save". Refresh the page to confirm it stays.
3.  **Portfolio**: Go to `/portfolio.html` to see if the video appears.
4.  **Cloudinary**: In Admin, click a "Hero Image" slot to upload an image. Confirm it uploads and saves. Check `/index.html` to see the new hero image.
5.  **Contact Form**: Go to `/contact.html`, fill out the form, and send. Check your Supabase `contacts` table to see the new entry.

## 5. Troubleshooting
*   **Images not saving?** Check the Browser Console (F12) for errors in `admin.html`. Ensure your Cloudinary Upload Preset is set to "Unsigned" in your Cloudinary Dashboard.
*   **Form not sending?** Ensure the `contacts` table exists in Supabase.
