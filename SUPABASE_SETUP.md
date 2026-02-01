# Supabase Setup Guide

This guide will help you set up your Supabase project for the E-Bike Parts Store application.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon/public API key

## 2. Create Database Tables

Go to the SQL Editor in your Supabase dashboard and run the following SQL:

```sql
-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on products"
  ON products FOR SELECT
  USING (true);

-- Create policies for authenticated users (admin) to manage data
CREATE POLICY "Allow authenticated users to insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);
```

## 3. Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name it `product-images`
4. Make it **Public**
5. Click **Create bucket**

## 4. Set Storage Policies

Go to the **Policies** tab for the `product-images` bucket and add these policies:

### Allow Public Read Access

```sql
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');
```

### Allow Authenticated Users to Upload

```sql
CREATE POLICY "Allow authenticated users to upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');
```

### Allow Authenticated Users to Update

```sql
CREATE POLICY "Allow authenticated users to update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');
```

### Allow Authenticated Users to Delete

```sql
CREATE POLICY "Allow authenticated users to delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
```

## 5. Create Admin User

1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Click **Add user** → **Create new user**
3. Enter email and password for your admin account
4. Click **Create user**
5. Use these credentials to log into the admin panel

## 6. Update Environment Variables

Update your `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_WHATSAPP_NUMBER=919019506002
```

## 7. Test the Setup

1. Start your development server: `npm run dev`
2. Log into the admin panel at `/admin`
3. Create a few categories
4. Add some products with images
5. Test the user-facing pages

## Troubleshooting

### Images not uploading
- Verify the storage bucket is named exactly `product-images`
- Check that storage policies are correctly set
- Ensure the bucket is set to **Public**

### Authentication errors
- Verify your Supabase URL and anon key are correct
- Check that you created an admin user in the Authentication section

### Database errors
- Ensure all SQL scripts ran successfully
- Check that RLS policies are enabled and configured correctly

## Sample Data (Optional)

You can add sample categories to get started:

```sql
INSERT INTO categories (name) VALUES
  ('Motors'),
  ('Batteries'),
  ('Controllers'),
  ('Displays'),
  ('Accessories');
```
