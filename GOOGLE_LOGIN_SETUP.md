# Google Login Setup Guide

To enable "Sign in with Google" for your customers, you need to connect your Supabase project to Google's authentication system. Follow these steps carefully in order.

---

## Step 1: Get your Supabase Callback URL
Before heading to Google, you need to know exactly where Google should send the user back to after they log in.
1. Open your **Supabase Dashboard**.
2. Go to **Authentication** (the lock icon on the left menu).
3. Click on **URL Configuration** under the Configuration section.
4. Look for your **Site URL** (e.g., `http://localhost:3000` for testing, or your live domain).
5. Copy the **Callback URI**. It will look something like this:
   `https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback`
   *(Keep this copied or pasted in a notepad, you will need it in Step 2!)*

---

## Step 2: Configure Google Cloud Console
This step generates the secure keys allowing your website to ask Google to authenticate a user.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. In the top left, click the project dropdown and click **New Project**. Name it "Footenix Store" and click Create. (Make sure this new project is selected at the top).
3. In the search bar at the top, search for **"OAuth consent screen"** and click on it.
4. Select **External** and click **Create**.
5. Fill out the required fields:
   - **App name**: Footenix Store
   - **User support email**: (Select your email)
   - **Developer contact information**: (Enter your email)
   - Click **Save and Continue** at the bottom of all the screens until you get back to the Dashboard.
6. Now, on the left sidebar, click **Credentials**.
7. Click the **+ CREATE CREDENTIALS** button at the top and select **OAuth client ID**.
8. Under **Application type**, select **Web application**.
9. Name it "Footenix Web Login".
10. Under **Authorized JavaScript origins**, click **ADD URI** and enter:
    - `http://localhost:3000` (for testing locally)
    - *(When you go live, you will add your `https://yourdomain.com` here too)*
11. Under **Authorized redirect URIs**, click **ADD URI** and paste the **Callback URI** you copied from Supabase in Step 1.
12. Click **Create**.
13. A popup will appear with your **Client ID** and **Client Secret**. Keep this window open or copy both values somewhere safe!

---

## Step 3: Enable Google in Supabase
Now we tell Supabase to use those Google keys.

1. Go back to your **Supabase Dashboard**.
2. Go to **Authentication** -> **Providers**.
3. Find **Google** in the list and click it.
4. Toggle the switch to **Enable Sign in with Google**.
5. Paste in the **Client ID** and **Client Secret** you got from Google in Step 2.
6. Click **Save**.

---

## Step 4: Update Your Database
We need to update your database so that when a user places an order, we can link it to their Google Account.

1. Go to the **SQL Editor** in your Supabase Dashboard.
2. Paste and run the following command:

```sql
-- Add a column to link orders to a specific user account
ALTER TABLE orders ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Optional: If you want customers to be able to see their own orders securely:
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
```

---

## Step 5: Update your Local Environment Variables
To make the login button work on the website, Vite (our frontend builder) needs access to your public Supabase keys.

Open the `.env.local` file in your code editor and add the following two lines (replace with your actual Supabase URL and Publishable Key from your Supabase Project Settings > API):

```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-publishable-key"
```

*(Note: These are safe to be public. It is only the `SUPABASE_SECRET_KEY` and `ADMIN_PASSWORD` that must remain completely secret!).*

---

### You're Done! 🎉
Once you have completed these steps, tell me to **"Go ahead and build the frontend"** and I will write all the React code to add the Account drawer and the Google Login button to the storefront!
