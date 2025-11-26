-- ============================================
-- EXPORT ORDERS FROM DATABASE
-- ============================================
-- Run this query in Supabase SQL Editor to see all orders

-- View all orders with user information
SELECT 
    o.id as order_id,
    o.user_id,
    o.model,
    o.color,
    o.interior,
    o.customizations,
    o.price,
    o.payment_method,
    o.card_type,
    o.card_last_four,
    o.card_holder_name,
    o.delivery_address,
    o.status,
    o.created_at,
    p.full_name as customer_name,
    u.email as customer_email
FROM public.orders o
LEFT JOIN public.profiles p ON o.user_id = p.id
LEFT JOIN auth.users u ON o.user_id = u.id
ORDER BY o.created_at DESC;

-- ============================================
-- COUNT ORDERS BY STATUS
-- ============================================
SELECT 
    status,
    COUNT(*) as count
FROM public.orders
GROUP BY status
ORDER BY count DESC;

-- ============================================
-- TOTAL REVENUE
-- ============================================
SELECT 
    COUNT(*) as total_orders,
    SUM(CAST(REPLACE(REPLACE(price, '$', ''), ',', '') AS NUMERIC)) as total_revenue
FROM public.orders;

-- ============================================
-- RECENT ORDERS (Last 10)
-- ============================================
SELECT 
    o.id,
    o.model,
    o.price,
    o.status,
    o.created_at,
    u.email as customer_email
FROM public.orders o
LEFT JOIN auth.users u ON o.user_id = u.id
ORDER BY o.created_at DESC
LIMIT 10;
