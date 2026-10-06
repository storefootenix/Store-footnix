<div align="center">
  <img src="https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=2000&auto=format&fit=crop" alt="Footenix Store Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px; object-fit: cover; height: 300px;" />
  
  <h1 align="center">🏆 Footenix Store</h1>
  
  <p align="center">
    <strong>The Ultimate Premium E-Commerce Platform for Football Card Collectors</strong>
  </p>
  
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#deployment">Deploy on Vercel</a> •
    <a href="#local-development">Local Development</a>
  </p>
</div>

---

## 🌟 About Footenix Store

Footenix Store is a high-performance, full-stack e-commerce application built specifically for trading card collectors. Featuring a sleek, modern UI, lightning-fast product filtering, and a fully integrated headless backend, Footenix provides a premium shopping experience for buying Match Attax, Panini stickers, and exclusive A5 posters.

---

## 🚀 Key Features

<table>
  <tr>
    <td>🛍️ <strong>Dynamic Catalog</strong><br/>Blazing fast filtering for Booster Boxes, Single Cards, and Stickers.</td>
    <td>💳 <strong>Razorpay Integration</strong><br/>Secure, embedded payment flows for prepaid orders.</td>
  </tr>
  <tr>
    <td>🔐 <strong>Collector Portal</strong><br/>Google OAuth authentication for users to track order history.</td>
    <td>🎛️ <strong>Admin Dashboard</strong><br/>Real-time inventory management, order tracking, and banner configuration.</td>
  </tr>
  <tr>
    <td>📧 <strong>Automated Emails</strong><br/>Nodemailer integration for instant HTML order receipts.</td>
    <td>📱 <strong>Mobile First</strong><br/>Beautifully responsive design with a native app-like bottom navigation.</td>
  </tr>
</table>

---

## 💻 Tech Stack

<div align="center">
  <code><img height="30" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png" alt="React"></code>
  <code><img height="30" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png" alt="TypeScript"></code>
  <code><img height="30" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/tailwind/tailwind.png" alt="Tailwind CSS"></code>
  <code><img height="30" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png" alt="Node.js"></code>
  <code><img height="30" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/express/express.png" alt="Express"></code>
  <br/><br/>
  <strong>Frontend:</strong> React 19, Vite, Tailwind CSS 4, Lucide Icons<br/>
  <strong>Backend:</strong> Node.js, Express, Nodemailer, Razorpay<br/>
  <strong>Database & Auth:</strong> Supabase (PostgreSQL, Google OAuth)<br/>
  <strong>Deployment:</strong> Vercel (Serverless Functions)
</div>

---

## ⚡ Deployment (Vercel)

This project is configured out-of-the-box for **Vercel Serverless Functions**. 
The React frontend and the Express backend both deploy seamlessly on a single Vercel instance.

1. Create a new project on [Vercel](https://vercel.com).
2. Import this GitHub repository.
3. Add the required environment variables from `.env.local`:
   - `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_ANON_KEY`
   - `GMAIL_USER` & `GMAIL_APP_PASSWORD`
   - *(Optional)* `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`
4. Click **Deploy**.

*Note: A native Vercel Cron Job is included (`vercel.json`) to automatically ping the database daily, preventing free-tier Supabase projects from pausing.*

---

## 🛠️ Local Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/storefootenix/Store-footnix.git
cd Store-footnix
npm install
```

Start both the frontend and backend servers simultaneously:
```bash
# Terminal 1: Starts Vite Frontend on localhost:3000
npm run dev

# Terminal 2: Starts Express Backend on localhost:3001
npm run dev:server
```

<div align="center">
  <br/>
  <p>Built with ❤️ for Football Collectors</p>
</div>
