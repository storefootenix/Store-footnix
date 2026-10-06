# Setting Up Supabase Storage for Product Images

I have upgraded the Admin Panel's "Add Product" form so you can now upload real image files directly from your computer instead of pasting URLs! 

For this to work, you need to create a **Storage Bucket** in your Supabase database to hold the image files. It takes 30 seconds.

### Step 1: Create the Bucket
1. Open your **Supabase Dashboard**.
2. Click on **Storage** in the left-hand menu.
3. Click the **New Bucket** button.
4. Name the bucket exactly: `products` (all lowercase).
5. **CRITICAL:** Check the box that says **"Public bucket"** (This allows your customers to see the images on the website!).
6. Click **Save**.

### Step 2: Test it out!
1. Go back to your Admin Panel and click **Add New Product**.
2. You will see a file upload button. Choose an image from your computer.
3. The image will upload directly to your new Supabase Storage bucket and the URL will automatically paste itself into the box!

*(Note: If you get an error when uploading, double-check that the bucket is named `products` and is set to Public).*
