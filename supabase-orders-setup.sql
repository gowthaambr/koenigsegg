-- Create orders table if it doesn't exist
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
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

-- Create RLS policies
-- Allow users to view their own orders
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own orders
CREATE POLICY "Users can insert their own orders"
ON public.orders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own orders
CREATE POLICY "Users can update their own orders"
ON public.orders
FOR UPDATE
USING (auth.uid() = user_id);

-- Add comments
COMMENT ON TABLE public.orders IS 'Stores customer orders for Koenigsegg vehicles';
COMMENT ON COLUMN public.orders.user_id IS 'Reference to the user who placed the order';
COMMENT ON COLUMN public.orders.model IS 'Car model name';
COMMENT ON COLUMN public.orders.color IS 'Exterior color';
COMMENT ON COLUMN public.orders.interior IS 'Interior specification';
COMMENT ON COLUMN public.orders.customizations IS 'Additional customizations';
COMMENT ON COLUMN public.orders.price IS 'Order price';
COMMENT ON COLUMN public.orders.payment_method IS 'Payment method used';
COMMENT ON COLUMN public.orders.delivery_address IS 'Delivery address for the order';
COMMENT ON COLUMN public.orders.status IS 'Order status: processing, manufacturing, quality_check, shipping, delivered';
