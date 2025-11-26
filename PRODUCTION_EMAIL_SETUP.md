# Configuring Email Confirmation for Production

## Step 1: Update Supabase Authentication Settings

1. **Go to Supabase Dashboard:**
   - Visit https://supabase.com/dashboard
   - Select your project

2. **Navigate to Authentication Settings:**
   - Click **"Authentication"** in the left sidebar
   - Click **"URL Configuration"**

3. **Set Site URL:**
   - **Site URL:** `https://koenigsegg-five.vercel.app`
   - This is the main URL of your application

4. **Add Redirect URLs:**
   - **Redirect URLs:** Add the following URLs (one per line):
     ```
     https://koenigsegg-five.vercel.app/auth/callback
     http://localhost:3000/auth/callback
     http://localhost:3001/auth/callback
     http://localhost:3002/auth/callback
     ```
   - The localhost URLs are for development
   - The production URL is for your live site

5. **Save Changes:**
   - Click **"Save"** at the bottom

## Step 2: Update Email Templates (Optional)

If you want to customize the email confirmation link:

1. Go to **Authentication** → **Email Templates**
2. Select **"Confirm signup"**
3. The confirmation link will automatically use your Site URL
4. Default template uses: `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup`

## Step 3: Test Email Confirmation Flow

### On Production (https://koenigsegg-five.vercel.app):

1. **Sign Up:**
   - Go to https://koenigsegg-five.vercel.app/signup
   - Enter email and password
   - Click "Sign Up"

2. **Check Email:**
   - You'll receive a confirmation email
   - Click the confirmation link

3. **Redirect:**
   - You'll be redirected to: `https://koenigsegg-five.vercel.app/auth/callback`
   - Then automatically to the exclusive page

### On Development (localhost):

1. Same process, but uses `http://localhost:3000/auth/callback`

## Step 4: Verify Environment Variables in Vercel

Make sure these are set in Vercel:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Add/Verify:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key

3. **Redeploy** if you added new variables:
   - Go to **Deployments** tab
   - Click **"..."** on the latest deployment
   - Click **"Redeploy"**

## Current Setup

Your authentication callback route is already configured at:
- **File:** `/app/auth/callback/route.ts`
- **URL:** `/auth/callback`

This route handles:
- Email confirmation
- Password reset
- OAuth callbacks

## Troubleshooting

### If email confirmation doesn't work:

1. **Check Redirect URLs:**
   - Make sure `https://koenigsegg-five.vercel.app/auth/callback` is in the list

2. **Check Site URL:**
   - Should be `https://koenigsegg-five.vercel.app` (no trailing slash)

3. **Check Email:**
   - Look for the confirmation link
   - Make sure it points to your production domain

4. **Check Console:**
   - Open browser DevTools
   - Look for any errors in the Console tab

### Common Issues:

- **"Invalid redirect URL"** → Add the URL to Supabase redirect URLs list
- **"Email not confirmed"** → User needs to click the link in their email
- **Redirects to localhost** → Update Site URL in Supabase to production URL

## Summary

✅ **Site URL:** `https://koenigsegg-five.vercel.app`
✅ **Callback URL:** `https://koenigsegg-five.vercel.app/auth/callback`
✅ **Email Flow:** Sign up → Receive email → Click link → Confirm → Redirect to app

Your users will now receive confirmation emails that redirect to your production website!
