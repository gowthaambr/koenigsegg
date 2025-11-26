# Database Connection Guide

## ✅ Admin Page is Already Connected!

The admin dashboard at `/admin` is already configured to fetch orders directly from your Supabase database. Here's how it works:

### Current Setup

1. **Admin page fetches from:**
   - `public.orders` table - All order data
   - `public.profiles` table - User names
   - `auth.users` - User emails

2. **Data displayed:**
   - Order ID, model, color, interior
   - Customer email and name
   - Payment details (card type, last 4 digits)
   - Delivery address
   - Order status and date

### How to Verify Connection

#### Option 1: Test Page
Visit: `http://localhost:3000/test-db`

This page will:
- ✅ Test Supabase connection
- ✅ Show all orders in database
- ✅ Display connection status

#### Option 2: Admin Dashboard
1. Login to admin: `http://localhost:3000/admin/login`
2. Credentials: `admin@koenigsegg.com` / `Admin@123`
3. View all orders from database

#### Option 3: Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "Table Editor"
4. Select "orders" table
5. See all orders

### Export Orders from Database

#### Method 1: Supabase Dashboard
1. Go to Table Editor → orders
2. Click "..." menu → "Download as CSV"

#### Method 2: SQL Query
Run `export-orders-query.sql` in Supabase SQL Editor:
```sql
SELECT 
    o.*,
    p.full_name,
    u.email
FROM public.orders o
LEFT JOIN public.profiles p ON o.user_id = p.id
LEFT JOIN auth.users u ON o.user_id = u.id
ORDER BY o.created_at DESC;
```

#### Method 3: Admin Dashboard
1. Login to admin
2. Click "Export CSV" button
3. Downloads all orders

### Troubleshooting

#### If admin page shows "No orders found":

**Check 1: Database Setup**
```sql
-- Run in Supabase SQL Editor
SELECT COUNT(*) FROM public.orders;
```

**Check 2: Environment Variables**
Make sure `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Check 3: RLS Policies**
Make sure Row Level Security allows admin to read:
```sql
-- Check if policies exist
SELECT * FROM pg_policies WHERE tablename = 'orders';
```

**Check 4: Console Logs**
Open browser DevTools → Console tab
Look for:
- `🔄 Fetching orders from Supabase...`
- `✅ Fetched X orders from Supabase`

### Data Sync

The admin page automatically syncs with the database:
- ✅ **Real-time**: Refresh page to see latest orders
- ✅ **No caching**: Always fetches fresh data
- ✅ **Fallback**: Uses localStorage if database unavailable

### Verification Steps

1. **Place a test order:**
   - Go to `/order`
   - Configure a car
   - Complete payment
   - Order saved to database

2. **Check in Supabase:**
   - Open Supabase Dashboard
   - Table Editor → orders
   - See the new order

3. **Check in Admin:**
   - Login to `/admin`
   - See the same order
   - All details match database

### Files Involved

- **Admin Page**: `/app/admin/page.tsx` - Fetches from database
- **Payment Page**: `/app/payment/page.tsx` - Saves to database
- **Database Schema**: `supabase-complete-setup.sql` - Table structure
- **Export Query**: `export-orders-query.sql` - View all orders

### Summary

✅ **Admin page IS connected to database**
✅ **Orders table IS linked**
✅ **Data reflects in real-time**
✅ **Export functionality works**

The connection is already set up and working! Just make sure:
1. Supabase tables are created (run `supabase-complete-setup.sql`)
2. Environment variables are set
3. Orders exist in the database

Visit `/test-db` to verify the connection is working!
