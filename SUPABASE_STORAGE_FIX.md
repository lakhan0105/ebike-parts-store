# Fix Supabase Storage Upload Issue

## Problem
You're getting a 403 error when trying to upload product images:
```
"message": "new row violates row-level security policy"
```

This means the storage bucket policies are not set up correctly.

## Solution

Follow these steps in your Supabase dashboard:

### Step 1: Go to Storage Policies

1. Open your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Storage** in the left sidebar
4. Click on the **product-images** bucket
5. Click on the **Policies** tab

### Step 2: Add Storage Policies

You need to add 4 policies. Click **New Policy** for each one:

#### Policy 1: Allow Public Read Access

- **Policy Name**: `Allow public read access`
- **Allowed Operation**: `SELECT`
- **Target Roles**: `public`
- **Policy Definition**:
```sql
bucket_id = 'product-images'
```

Or use the SQL Editor to run:
```sql
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');
```

#### Policy 2: Allow Authenticated Users to Upload (INSERT)

- **Policy Name**: `Allow authenticated users to upload`
- **Allowed Operation**: `INSERT`
- **Target Roles**: `authenticated`
- **Policy Definition**:
```sql
bucket_id = 'product-images'
```

Or use SQL Editor:
```sql
CREATE POLICY "Allow authenticated users to upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');
```

#### Policy 3: Allow Authenticated Users to Update

- **Policy Name**: `Allow authenticated users to update`
- **Allowed Operation**: `UPDATE`
- **Target Roles**: `authenticated`
- **Policy Definition**:
```sql
bucket_id = 'product-images'
```

Or use SQL Editor:
```sql
CREATE POLICY "Allow authenticated users to update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');
```

#### Policy 4: Allow Authenticated Users to Delete

- **Policy Name**: `Allow authenticated users to delete`
- **Allowed Operation**: `DELETE`
- **Target Roles**: `authenticated`
- **Policy Definition**:
```sql
bucket_id = 'product-images'
```

Or use SQL Editor:
```sql
CREATE POLICY "Allow authenticated users to delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
```

### Step 3: Verify Bucket Settings

1. Make sure the `product-images` bucket is set to **Public**
2. Go to Storage → product-images → Configuration
3. Check that "Public bucket" is enabled

### Step 4: Quick SQL Method (Recommended)

Instead of creating policies one by one, you can run all of them at once:

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Paste this SQL:

```sql
-- Delete existing policies if any
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete" ON storage.objects;

-- Create new policies
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Allow authenticated users to upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow authenticated users to update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Allow authenticated users to delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
```

4. Click **Run** or press `Ctrl+Enter`

### Step 5: Test the Upload

1. Go back to your admin panel: http://localhost:5176/admin/dashboard
2. Try to create a new product with an image
3. The upload should now work!

## About Categories

Regarding your first issue: "new categories can be added by the admin, it is not defined to one category"

This is actually the correct behavior! The admin should be able to add as many categories as needed (15-20 or more). This gives you flexibility to organize your products. For example:
- Motors
- Batteries
- Controllers
- Displays
- Chargers
- Cables
- Lights
- Brakes
- Tires
- Seats
- etc.

If you want to limit the number of categories or have a fixed set, please let me know and I can modify the code accordingly.

## Verification

After applying the policies, you should be able to:
- ✅ Upload product images
- ✅ View uploaded images on product pages
- ✅ Update product images
- ✅ Delete products (which also removes their images)
