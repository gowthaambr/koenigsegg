# Admin Dashboard Setup Guide

## Overview
The admin dashboard allows administrators to view and manage all customer orders, including payment details, delivery information, and order status.

## Features

### 📊 Dashboard Statistics
- Total number of orders
- Total revenue
- Unique customers count
- Pending orders count

### 🔍 Order Management
- View all orders in a table format
- Search orders by ID, model, or customer email
- Filter orders by status (Processing, Manufacturing, Quality Check, Shipping, Delivered)
- View detailed order information in a modal
- Export orders to CSV file

### 💳 Payment Information
- Payment method used
- Card type (Visa, Mastercard, American Express)
- Last 4 digits of card number
- Cardholder name

### 📦 Order Details
- Customer email
- Model and customizations
- Exterior color and interior
- Delivery address
- Order status and date
- Price

## Setup Instructions

### Step 1: Configure Admin Email

1. Open `/app/admin/page.tsx`
2. Find line 46:
   ```typescript
   const ADMIN_EMAIL = "admin@koenigsegg.com" // TODO: Change to your admin email
   ```
3. Replace `"admin@koenigsegg.com"` with your actual admin email address

### Step 2: Create Admin Account

1. Go to your website: `http://localhost:3000/signup`
2. Sign up with the email you set as `ADMIN_EMAIL`
3. Verify your email (if email verification is enabled)

### Step 3: Access Admin Dashboard

1. Sign in with your admin account
2. Navigate to: `http://localhost:3000/admin`
3. You should see the admin dashboard

## Security Features

### ✅ Authentication Required
- Users must be signed in to access the admin page
- Non-admin users are redirected with an "Access Denied" message

### ✅ Email-Based Authorization
- Only the email specified in `ADMIN_EMAIL` can access the dashboard
- All other users see an access denied screen

### ✅ Data Protection
- Sensitive card information is masked (only last 4 digits shown)
- CVV is never stored
- Full card numbers are never displayed

## Usage

### Viewing Orders
- All orders are displayed in a table
- Click the eye icon (👁️) to view full order details

### Searching Orders
- Use the search bar to find orders by:
  - Order ID
  - Customer email
  - Model name

### Filtering Orders
- Use the status dropdown to filter by order status:
  - All Status
  - Processing
  - Manufacturing
  - Quality Check
  - Shipping
  - Delivered

### Exporting Data
- Click "Export CSV" to download all filtered orders
- File includes: Order ID, Customer Email, Model, Color, Interior, Price, Payment Method, Card Type, Status, Date
- Filename format: `koenigsegg-orders-YYYY-MM-DD.csv`

## Advanced Configuration

### Multiple Admins
To allow multiple admin users, modify the authentication check:

```typescript
// In /app/admin/page.tsx, replace line 46-47:
const ADMIN_EMAILS = [
    "admin@koenigsegg.com",
    "manager@koenigsegg.com",
    "supervisor@koenigsegg.com"
]

// Then update the check on line 58:
if (ADMIN_EMAILS.includes(user.email)) {
    setIsAdmin(true)
    fetchAllOrders()
}
```

### Role-Based Access Control (Advanced)
For more sophisticated access control, you can add a `role` column to the `profiles` table:

1. Add column to Supabase:
   ```sql
   ALTER TABLE public.profiles 
   ADD COLUMN role TEXT DEFAULT 'user';
   
   -- Set admin role
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE id = 'USER_ID_HERE';
   ```

2. Update the admin check:
   ```typescript
   const { data: profile } = await supabase
       .from('profiles')
       .select('role')
       .eq('id', user.id)
       .single()
   
   if (profile?.role === 'admin') {
       setIsAdmin(true)
       fetchAllOrders()
   }
   ```

## Troubleshooting

### "Access Denied" Error
- **Cause:** Your email doesn't match the `ADMIN_EMAIL`
- **Solution:** Update `ADMIN_EMAIL` in `/app/admin/page.tsx` to match your account email

### No Orders Showing
- **Cause:** Database not configured or no orders placed yet
- **Solution:** 
  - Check Supabase connection
  - Place a test order
  - Orders will fallback to localStorage if Supabase is unavailable

### Can't Fetch User Emails
- **Cause:** Missing Supabase admin permissions
- **Solution:** User emails will show as "N/A" - this is normal for localStorage fallback

## Production Deployment

### Environment Variables
Make sure these are set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Admin Email
Update the `ADMIN_EMAIL` constant before deploying to production

### Security Recommendations
1. Use environment variables for admin emails:
   ```typescript
   const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@koenigsegg.com"
   ```

2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_ADMIN_EMAIL=your-admin@email.com
   ```

3. Add to Vercel environment variables

## URL
- **Local:** http://localhost:3000/admin
- **Production:** https://koenigsegg-five.vercel.app/admin

## Support
For issues or questions, check the console logs for detailed error messages.
