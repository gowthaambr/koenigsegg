# 🔑 ADMIN CREDENTIALS

## Default Admin Login Details

**Email:** `admin@koenigsegg.com`  
**Password:** `Admin@123`

---

## How to Login

1. **Click "Admin" button** in the top-right corner of the navbar
2. **Enter credentials:**
   - Email: `admin@koenigsegg.com`
   - Password: `Admin@123`
3. **Click "Access Dashboard"**
4. You're in! 🎉

---

## URLs

- **Admin Login:** http://localhost:3000/admin/login
- **Admin Dashboard:** http://localhost:3000/admin

---

## Features Available

Once logged in, you can:
- ✅ View all customer orders
- ✅ See user details (email, user ID)
- ✅ View car specifications (model, color, interior, customizations)
- ✅ Check payment information (card type, last 4 digits)
- ✅ See delivery addresses
- ✅ Filter orders by status
- ✅ Search orders by ID, email, or model
- ✅ Export orders to CSV
- ✅ View detailed order information

---

## Security Notes

- These are **hardcoded credentials** for demo purposes
- Works without Supabase authentication
- Session is stored in localStorage
- For production, change these credentials!

---

## Changing Admin Credentials

To change the admin email and password:

1. Open `/app/admin/login/page.tsx`
2. Update lines 17-18:
   ```typescript
   const ADMIN_EMAIL = "your-email@example.com"
   const ADMIN_PASSWORD = "YourSecurePassword123"
   ```

3. Open `/app/admin/page.tsx`
4. Update line 46:
   ```typescript
   const ADMIN_EMAIL = "your-email@example.com"
   ```

---

## Logout

Click the **"Exit Admin"** button in the top-right corner of the dashboard to logout.
