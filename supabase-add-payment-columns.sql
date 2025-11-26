-- ============================================
-- ALTERNATIVE: ADD MULTIPLE PAYMENT MODE COLUMNS
-- ============================================
-- If you prefer separate columns for different payment modes
-- instead of a single JSONB column, use this script instead.

-- Add payment mode specific columns
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_info JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS transaction_id TEXT,
ADD COLUMN IF NOT EXISTS payment_gateway TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS billing_address TEXT,
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ DEFAULT NOW();

-- Add comments
COMMENT ON COLUMN public.orders.payment_info IS 'Additional payment information as JSON';
COMMENT ON COLUMN public.orders.transaction_id IS 'Unique transaction identifier from payment gateway';
COMMENT ON COLUMN public.orders.payment_gateway IS 'Payment gateway used (e.g., stripe, paypal, mock)';
COMMENT ON COLUMN public.orders.payment_status IS 'Payment status: pending, completed, failed, refunded';
COMMENT ON COLUMN public.orders.billing_address IS 'Billing address for payment';
COMMENT ON COLUMN public.orders.payment_date IS 'Date and time when payment was processed';

-- Create indexes
CREATE INDEX IF NOT EXISTS orders_payment_info_idx ON public.orders USING GIN (payment_info);
CREATE INDEX IF NOT EXISTS orders_transaction_id_idx ON public.orders(transaction_id);
CREATE INDEX IF NOT EXISTS orders_payment_status_idx ON public.orders(payment_status);

-- ============================================
-- VERIFICATION
-- ============================================
-- Verify all columns were added:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'orders' 
-- AND column_name IN ('payment_info', 'transaction_id', 'payment_gateway', 'payment_status', 'billing_address', 'payment_date');
