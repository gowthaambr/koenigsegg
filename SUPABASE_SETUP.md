# Supabase Authentication Setup Guide

## Prerequisites
1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project

## Step 1: Get Your Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **API**
3. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 2: Configure Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values with your actual credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Set Up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `supabase-setup.sql`
4. Click **Run** to execute the script

This will create:
- `profiles` table for user data
- Row Level Security (RLS) policies
- Automatic triggers for new user creation

## Step 4: Configure Email Templates (Optional but Recommended)

1. Go to **Authentication** > **Email Templates**
2. Customize the following templates:
   - **Confirm signup**: Email sent when users sign up
   - **Reset password**: Email sent for password reset

### Recommended Settings:
- **Confirm signup redirect**: `{{ .SiteURL }}/auth/callback`
- **Reset password redirect**: `{{ .SiteURL }}/reset-password`

## Step 5: Enable Email Authentication

1. Go to **Authentication** > **Providers**
2. Ensure **Email** is enabled
3. Configure email settings:
   - **Enable email confirmations**: ON (recommended)
   - **Secure email change**: ON (recommended)

## Step 6: Test Your Setup

1. Start your development server: `npm run dev`
2. Navigate to `/signup`
3. Create a test account
4. Check your email for verification
5. Complete the onboarding flow
6. Access the exclusive page

## Troubleshooting

### Email not sending?
- Check your Supabase project's email rate limits
- Verify email templates are configured
- Check spam folder

### Authentication not working?
- Verify environment variables are set correctly
- Restart your development server after changing `.env.local`
- Check browser console for errors

### Database errors?
- Ensure `supabase-setup.sql` ran successfully
- Check RLS policies are enabled
- Verify triggers were created

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add environment variables to your hosting platform
2. Update email template URLs to use your production domain
3. Configure custom SMTP (optional) in Supabase settings
4. Test all authentication flows in production

## Security Notes

- Never commit `.env.local` to version control (it's in `.gitignore`)
- The anon key is safe to expose in client-side code
- RLS policies protect user data at the database level
- Always use HTTPS in production
