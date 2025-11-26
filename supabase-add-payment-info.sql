-- ============================================
-- ADD PAYMENT INFO COLUMN TO ORDERS TABLE
-- ============================================
-- This migration adds a payment_info JSONB column to store
-- additional payment-related information in a flexible format.
-- Run this in your Supabase SQL Editor.

-- Add payment_info column to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_info JSONB DEFAULT '{}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.orders.payment_info IS 'Additional payment information stored as JSON (e.g., transaction ID, payment gateway response, billing address)';

-- Create index for better query performance on payment_info
CREATE INDEX IF NOT EXISTS orders_payment_info_idx ON public.orders USING GIN (payment_info);

-- Example of what can be stored in payment_info:
-- {
--   "transaction_id": "txn_1234567890",
--   "payment_gateway": "stripe",
--   "billing_address": {
--     "street": "123 Main St",
--     "city": "New York",
--     "state": "NY",
--     "zip": "10001",
--     "country": "USA"
--   },
--   "payment_status": "completed",
--   "payment_date": "2025-01-27T00:00:00Z",
--   "currency": "USD",
--   "amount": 3000000,
--   "fees": 0,
--   "net_amount": 3000000
-- }

-- ============================================
-- VERIFICATION
-- ============================================
-- After running this script, verify the column was added:
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'orders' AND column_name = 'payment_info';
