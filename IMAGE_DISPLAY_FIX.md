# Fix Image Display Issue (400 Bad Request)

## Problem
Images are being saved to the database, but when trying to display them, you get:
```
Status Code: 400 Bad Request
URL: https://leznodychbflqybrfsrq.supabase.co/storage/v1/object/public/product-images/...
```

## Root Cause
The `product-images` bucket is not properly configured as **public**, or the bucket settings are incorrect.

## Solution

### Step 1: Make the Bucket Public

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to **Storage** in the left sidebar
3. Click on the **product-images** bucket
4. Click on **Configuration** (gear icon or settings)
5. **IMPORTANT**: Toggle **"Public bucket"** to **ON** (enabled)
6. Click **Save**

### Step 2: Verify Storage Policies Are Applied

Go to **SQL Editor** and run this to check existing policies:

```sql
-- Check existing storage policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
```

If you don't see the 4 policies for `product-images`, run this SQL to create them:

```sql
-- Delete any existing policies to avoid conflicts
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

### Step 3: Test with an Existing Image

1. Go to **Storage** → **product-images** bucket
2. You should see your uploaded images listed
3. Click on one of the images
4. Click **Get URL** or **Copy URL**
5. The URL should look like:
   ```
   https://leznodychbflqybrfsrq.supabase.co/storage/v1/object/public/product-images/filename.png
   ```
6. Open this URL in a new browser tab
7. If the bucket is public, the image should display
8. If you still get 400, the bucket is not public

### Step 4: Alternative - Recreate the Bucket

If the above doesn't work, you may need to recreate the bucket:

1. **Backup your images first** (download them from the bucket)
2. Delete the `product-images` bucket
3. Create a new bucket:
   - Name: `product-images`
   - **Public bucket**: ✅ **ENABLED** (this is critical!)
   - Click **Create bucket**
4. Apply the storage policies from Step 2
5. Re-upload your images

### Step 5: Verify in Your App

After making the bucket public:

1. Go to your admin panel: http://localhost:5176/admin/dashboard
2. Try uploading a new product with an image
3. The image should now display correctly in:
   - Admin product table
   - Product detail page
   - Category page

## Quick Checklist

- [ ] Bucket `product-images` exists
- [ ] Bucket is set to **Public** (most important!)
- [ ] 4 storage policies are created (SELECT, INSERT, UPDATE, DELETE)
- [ ] Images are uploading successfully (no 403 error)
- [ ] Images are displaying (no 400 error)

## Testing

Test the public URL directly in your browser:
```
https://leznodychbflqybrfsrq.supabase.co/storage/v1/object/public/product-images/YOUR_IMAGE_NAME.png
```

Replace `YOUR_IMAGE_NAME.png` with an actual filename from your bucket.

- ✅ If it shows the image → Bucket is public, everything is working
- ❌ If you get 400 error → Bucket is NOT public, go back to Step 1

## Common Mistakes

1. **Bucket not set to public** - This is the #1 cause of 400 errors
2. **Policies not applied** - Storage policies must be created
3. **Wrong bucket name** - Must be exactly `product-images`
4. **File path issues** - The code has been updated to use correct paths

## After Fixing

Once the bucket is public and policies are applied:
- New uploads will work immediately
- Existing images will also start displaying
- No code changes needed (already updated)
