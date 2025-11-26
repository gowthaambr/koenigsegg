# Order Tracking Guide

## 📦 **How Users Can Track Their Orders**

Users who have placed orders can easily track them through the website.

---

## 🔗 **Access Methods:**

### **Method 1: User Menu (Recommended)**
1. **Sign in** to your account
2. Click your **profile icon** in the top-right corner
3. Click **"📦 Track My Orders"**
4. View all your orders and their status

### **Method 2: Direct URL**
- Go to: http://localhost:3000/orders
- Must be signed in to view

### **Method 3: After Placing Order**
- After payment, click **"Track Your Order"** button
- Redirects to orders page

---

## 📊 **What Users Can See:**

### **Order Information:**
- ✅ Order ID
- ✅ Car model and specifications
- ✅ Color and interior
- ✅ Price
- ✅ Delivery address
- ✅ Order date

### **Status Tracking:**
Users can see 5 status stages:

1. **🕐 Order Processing** - Order received and being processed
2. **📦 Manufacturing** - Car is being built
3. **✅ Quality Check** - Final inspection and testing
4. **🚚 Shipping** - On the way to delivery location
5. **📍 Delivered** - Order complete!

### **Visual Timeline:**
- Color-coded status badges
- Progress indicator
- Current stage highlighted
- Completed stages marked

---

## 🔄 **Real-Time Updates:**

### **Automatic Refresh:**
- Page auto-refreshes every **30 seconds**
- Always shows latest status from database
- No manual refresh needed

### **When Admin Updates:**
```
Admin changes status → Saves to database
    ↓
User's page auto-refreshes (within 30 sec)
    ↓
User sees updated status
```

---

## 🎯 **User Flow:**

### **Complete Journey:**

```
1. User places order
   ↓
2. Redirected to success page
   ↓
3. Click "Track Your Order"
   ↓
4. See order with status: "Processing"
   ↓
5. Admin updates to "Manufacturing"
   ↓
6. User's page refreshes automatically
   ↓
7. User sees new status: "Manufacturing"
   ↓
8. Continues until "Delivered"
```

---

## 📱 **Features:**

### **For Users:**
- ✅ View all their orders
- ✅ See current status
- ✅ Track delivery progress
- ✅ View order details
- ✅ Auto-refresh for updates
- ✅ Generate mock orders (testing)

### **Status Colors:**
- 🔵 **Processing** - Blue
- 🟣 **Manufacturing** - Purple
- 🟡 **Quality Check** - Yellow
- 🟠 **Shipping** - Orange
- 🟢 **Delivered** - Green

---

## 🔧 **Technical Details:**

### **Data Source:**
- Fetches from Supabase `orders` table
- Filters by `user_id` (only shows user's orders)
- Falls back to localStorage if database unavailable

### **Refresh Mechanism:**
```javascript
// Auto-refresh every 30 seconds
setInterval(() => {
    fetchOrders()
}, 30000)
```

### **Security:**
- Users can only see their own orders
- Row Level Security (RLS) enforced
- Authentication required

---

## 🚀 **Quick Test:**

### **As a User:**

1. **Sign in:**
   - http://localhost:3000/signin

2. **Place an order:**
   - Go to `/order`
   - Configure a car
   - Complete payment

3. **Track order:**
   - Click profile → "Track My Orders"
   - See your order with status

4. **Wait for updates:**
   - Admin updates status
   - Your page refreshes automatically
   - See new status

---

## 📍 **URLs:**

- **Sign In:** http://localhost:3000/signin
- **Track Orders:** http://localhost:3000/orders
- **Place Order:** http://localhost:3000/order

---

## ✅ **Summary:**

Users can track orders by:
1. Clicking "Track My Orders" in user menu
2. Visiting `/orders` page
3. Seeing real-time status updates
4. Auto-refresh every 30 seconds
5. Visual timeline of order progress

The tracking system is fully functional and syncs with admin updates in real-time!
