# Gmail SMTP Setup Guide

To send automated order confirmation emails from your own Gmail address (e.g., `footenix@gmail.com`) for free, we use **Nodemailer**.

However, Google does not allow apps to log in using your normal password. Instead, you must generate a secure **App Password**.

## Step 1: Enable 2-Step Verification
You cannot create an App Password unless 2-Step Verification is turned on for your Google Account.
1. Go to your [Google Account Security settings](https://myaccount.google.com/security).
2. Scroll down to the **"How you sign in to Google"** section.
3. Click on **2-Step Verification** and turn it on (if it isn't already).

## Step 2: Create an App Password
1. Once 2-Step Verification is on, use the search bar at the top of your Google Account and search for **"App passwords"**.
2. Alternatively, go to [this direct link](https://myaccount.google.com/apppasswords).
3. In the "App name" field, type something like `Footenix Store Website` and click **Create**.
4. A popup will appear with a **16-character password** (usually highlighted in yellow). 
5. **Copy this 16-character password**.

## Step 3: Add to Environment Variables
1. Open your `.env.local` file in your code editor.
2. At the bottom, you will see two variables:
   ```env
   GMAIL_USER=your_email@gmail.com
   GMAIL_APP_PASSWORD=abcdefghijklmnop
   ```
3. Paste your Gmail address into `GMAIL_USER`.
4. Paste the 16-character App Password (without any spaces) into `GMAIL_APP_PASSWORD`.
5. Save the file!

The moment a customer successfully places an order, the backend will automatically log in and send them a beautiful order confirmation receipt directly from your email address.
