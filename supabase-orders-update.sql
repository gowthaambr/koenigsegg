-- Add delivery_address column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address TEXT;

-- Update the orders table comment
COMMENT ON COLUMN orders.delivery_address IS 'Full delivery address for the order';
