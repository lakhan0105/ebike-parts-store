-- Add stock column to products table
ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0;

-- Update existing products to have a default stock value
UPDATE products SET stock = 0 WHERE stock IS NULL;
