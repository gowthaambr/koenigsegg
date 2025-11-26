-- ============================================
-- KOENIGSEGG WEBSITE - COMPLETE DATABASE SETUP
-- ============================================
-- This script creates all necessary tables for the Koenigsegg website
-- including authentication, orders, and user profiles.
-- Run this in your Supabase SQL Editor.

-- ============================================
-- 1. ORDERS TABLE
-- ============================================
-- Stores all customer orders for Koenigsegg vehicles

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    model TEXT NOT NULL,
    color TEXT NOT NULL,
    interior TEXT NOT NULL,
    customizations TEXT,
    price TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    delivery_address TEXT,
    status TEXT NOT NULL DEFAULT 'processing',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Payment details (mock)
    card_last_four TEXT,
    card_holder_name TEXT,
    card_type TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);

-- Add comments for documentation
COMMENT ON TABLE public.orders IS 'Stores customer orders for Koenigsegg vehicles';
COMMENT ON COLUMN public.orders.user_id IS 'Reference to the user who placed the order';
COMMENT ON COLUMN public.orders.model IS 'Car model name (e.g., Jesko Absolut, Gemera)';
COMMENT ON COLUMN public.orders.color IS 'Exterior color';
COMMENT ON COLUMN public.orders.interior IS 'Interior specification';
COMMENT ON COLUMN public.orders.customizations IS 'Additional customizations requested';
COMMENT ON COLUMN public.orders.price IS 'Order price';
COMMENT ON COLUMN public.orders.payment_method IS 'Payment method used (credit, debit, mock)';
COMMENT ON COLUMN public.orders.delivery_address IS 'Full delivery address for the order';
COMMENT ON COLUMN public.orders.status IS 'Order status: processing, manufacturing, quality_check, shipping, delivered';

-- ============================================
-- 2. USER PROFILES TABLE
-- ============================================
-- Extended user information beyond Supabase auth

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    country TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    is_ghost_squadron BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS profiles_id_idx ON public.profiles(id);

-- Add comments
COMMENT ON TABLE public.profiles IS 'Extended user profile information';
COMMENT ON COLUMN public.profiles.full_name IS 'User full name';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL to user avatar image';
COMMENT ON COLUMN public.profiles.phone IS 'User phone number';
COMMENT ON COLUMN public.profiles.country IS 'User country';
COMMENT ON COLUMN public.profiles.preferences IS 'User preferences stored as JSON';
COMMENT ON COLUMN public.profiles.is_ghost_squadron IS 'Whether user is a Ghost Squadron member';

-- ============================================
-- 3. CART ITEMS TABLE (Optional - for persistent cart)
-- ============================================
-- Stores shopping cart items for logged-in users

CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    model TEXT NOT NULL,
    price TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS cart_items_user_id_idx ON public.cart_items(user_id);

-- Add comments
COMMENT ON TABLE public.cart_items IS 'Shopping cart items for users';
COMMENT ON COLUMN public.cart_items.user_id IS 'Reference to the user';
COMMENT ON COLUMN public.cart_items.model IS 'Car model name';
COMMENT ON COLUMN public.cart_items.price IS 'Price of the item';
COMMENT ON COLUMN public.cart_items.quantity IS 'Quantity in cart';

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;

-- ORDERS POLICIES
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
ON public.orders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
ON public.orders
FOR UPDATE
USING (auth.uid() = user_id);

-- PROFILES POLICIES
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- CART ITEMS POLICIES
CREATE POLICY "Users can view their own cart items"
ON public.cart_items
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
ON public.cart_items
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
ON public.cart_items
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
ON public.cart_items
FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- 5. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, created_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at on all tables
DROP TRIGGER IF EXISTS set_updated_at ON public.orders;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.cart_items;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.cart_items
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 6. SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment the following to insert sample data for testing

/*
-- Note: Replace 'YOUR_USER_ID' with an actual user ID from auth.users
INSERT INTO public.orders (user_id, model, color, interior, price, payment_method, delivery_address, status)
VALUES 
    ('YOUR_USER_ID', 'Jesko Absolut', 'Crystal White', 'Desiato Black', '$3,000,000', 'credit', '123 Test St, Mock City, MC 12345, Testland', 'processing'),
    ('YOUR_USER_ID', 'Gemera', 'Launch Grey', 'Alcantara Tan', '$1,700,000', 'debit', '456 Demo Ave, Sample Town, ST 67890, Testland', 'manufacturing');
*/

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your database is now ready for the Koenigsegg website.
-- 
-- IMPORTANT NOTES:
-- 1. Authentication (Sign Up/Sign In) is handled by Supabase Auth automatically
--    - No need to create a separate users table
--    - Supabase manages auth.users table
-- 
-- 2. The profiles table extends user information
--    - Automatically created when a user signs up (via trigger)
-- 
-- 3. All tables have RLS enabled for security
--    - Users can only access their own data
-- 
-- 4. To test, you can:
--    - Sign up via your website
--    - Place an order
--    - Check the orders table in Supabase Table Editor
