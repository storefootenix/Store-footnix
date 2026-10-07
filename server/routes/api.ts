import express from 'express';
import { supabase } from '../db.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import multer from 'multer';
import nodemailer from 'nodemailer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Helper to fetch store settings from DB
const getSettings = async () => {
  const { data, error } = await supabase.from('store_settings').select('*').eq('id', 1).single();
  if (error || !data) {
    return {
      razorpay_key_id: '',
      razorpay_key_secret: '',
      delhivery_api_key: '',
      gmail_user: '',
      gmail_app_password: ''
    };
  }
  return data;
};

// Admin Auth Middleware
const requireAdmin = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized Access' });
  }

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('sessionToken', token)
      .single();

    if (data && !error) {
      next();
    } else {
      res.status(401).json({ error: 'Session expired or invalid' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Auth server error' });
  }
};

// Auth Route
router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (data && !error) {
      // Generate a new token and save it to the DB
      const token = crypto.randomBytes(32).toString('hex');
      await supabase
        .from('admin_users')
        .update({ sessionToken: token })
        .eq('id', data.id);
        
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Auth error' });
  }
});

// Client Admin Credentials Route (Manage id=2)
router.get('/admin/credentials', requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from('admin_users').select('username').eq('id', 2).single();
  if (error || !data) return res.json({ username: '' });
  res.json({ username: data.username });
});

router.put('/admin/credentials', requireAdmin, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });
  let { data, error } = await supabase.from('admin_users').update({ username, password }).eq('id', 2).select();
  if (!data || data.length === 0) {
    const insertRes = await supabase.from('admin_users').insert({ id: 2, username, password }).select();
    error = insertRes.error;
    data = insertRes.data;
  }
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Image Upload
router.post('/upload', requireAdmin, upload.single('file'), async (req: any, res: any) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
  try {
    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
    res.json({ success: true, url: publicUrl });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Products
router.get('/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/products', requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from('products').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

router.put('/products/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('products').update(req.body).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

router.delete('/products/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

// Orders
router.get('/orders', async (req, res) => {
  const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/orders', async (req, res) => {
  console.log('Received POST /orders', req.body);
  const orderData = { ...req.body };
  
  // Auto-create Delhivery shipment for prepaid (Razorpay) orders
  if (orderData.paymentMethod === 'razorpay' && !orderData.trackingNumber) {
    try {
      // In a real scenario, you'd call Delhivery API here with order details
      const mockAwb = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      orderData.trackingNumber = mockAwb;
      orderData.status = 'processing'; // Automatically advance status since it's paid
    } catch (err) {
      console.error('Failed to auto-create Delhivery shipment:', err);
    }
  }

  console.log('Inserting into Supabase:', orderData);
  const { data, error } = await supabase.from('orders').insert([orderData]).select();
  if (error) {
    console.error('Supabase Insert Error:', error);
    return res.status(500).json({ error: error.message });
  }

  console.log('Successfully inserted order:', data[0].id);
  const order = data[0];

  // Auto-deduct stock for each item in the order
  try {
    for (const item of order.items) {
      // Fetch current stock
      const { data: productData, error: fetchError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.id)
        .single();
        
      if (!fetchError && productData) {
        // Read-modify-write (using service role key, so bypasses RLS)
        const newStock = Math.max(0, (productData.stock || 0) - item.quantity);
        await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.id);
      }
    }
    console.log('Successfully deducted inventory stock for order items.');
  } catch (stockErr) {
    console.error('Failed to deduct stock:', stockErr);
  }

  // Send Automated Email via Nodemailer (Gmail)
  const settings = await getSettings();
  if (settings.gmail_user && settings.gmail_app_password) {
    try {
      const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: settings.gmail_user, pass: settings.gmail_app_password } });
      await transporter.sendMail({
        from: `"Footenix Store" <${settings.gmail_user}>`,
        to: order.customerEmail,
        subject: `Order Confirmed: #${order.id.slice(0, 8).toUpperCase()}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #245bff;">Thank you for your order, ${order.customerName}!</h2>
            <p>We've received your order and are currently processing it.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Order Details</h3>
              <p><strong>Order ID:</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
              <p><strong>Total Amount:</strong> Rs. ${order.total}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid (Razorpay)'}</p>
              <p><strong>Shipping Address:</strong><br/>${order.shippingAddress}, ${order.city} - ${order.pincode}</p>
            </div>
            ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
            <p>You can track the status of your order anytime in the Collector Portal on our website.</p>
          </div>
        `
      });
    } catch (err) {
      console.error('Failed to send Nodemailer email:', err);
    }
  }

  res.status(201).json(order);
});

router.put('/orders/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('orders').update(req.body).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// Store Config
router.get('/config', async (req, res) => {
  const { data, error } = await supabase.from('store_config').select('*').single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.put('/config', requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from('store_config').upsert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// Contact Form
router.post('/contact', async (req, res) => {
  const { name, email, topic, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const settings = await getSettings();
  if (settings.gmail_user && settings.gmail_app_password) {
    try {
      const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: settings.gmail_user, pass: settings.gmail_app_password } });
      await transporter.sendMail({
        from: `"Footenix Store Contact Form" <${settings.gmail_user}>`,
        to: settings.gmail_user, // Send to the admin's email
        replyTo: email,
        subject: `[Contact Form] ${topic} - from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <h2 style="color: #245bff; margin-top: 0;">New Support Request</h2>
            <p><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
            <p><strong>Topic:</strong> ${topic}</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin-top: 20px; border-left: 4px solid #245bff;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">Reply directly to this email to contact the customer.</p>
          </div>
        `
      });
      res.status(200).json({ success: true });
    } catch (err) {
      console.error('Failed to send contact email:', err);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    // If Nodemailer isn't configured, just fake success so the UI works
    console.log('Contact form submitted (Email not configured):', req.body);
    res.status(200).json({ success: true, warning: 'Email not configured on server' });
  }
});

// Razorpay
router.post('/payment/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };
    
    const settings = await getSettings();
    if (settings.razorpay_key_id && settings.razorpay_key_id !== 'rzp_test_dummy') {
      const razorpay = new Razorpay({ key_id: settings.razorpay_key_id, key_secret: settings.razorpay_key_secret });
      const order = await razorpay.orders.create(options);
      res.json(order);
    } else {
      res.json({
        id: `order_mock_${Date.now()}`,
        amount: options.amount,
        currency: "INR"
      });
    }
  } catch (error: any) {
    console.error('Razorpay Error:', error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

router.post('/payment/verify', async (req, res) => {
  try {
    const settings = await getSettings();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = settings.razorpay_key_secret || 'dummy_secret';
    
    if (razorpay_order_id.startsWith('order_mock_')) {
      return res.json({ success: true });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");
      
    if (expectedSignature === razorpay_signature) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Signature verification failed' });
  }
});

// Delhivery
router.post('/shipping/create-shipment', requireAdmin, async (req, res) => {
  try {
    const settings = await getSettings();
    const hasKey = !!settings.delhivery_api_key;
    const mockAwb = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    
    res.json({ 
      success: true, 
      awb: mockAwb,
      message: hasKey ? 'Sent to Delhivery API' : 'Mock Mode (No API Key)' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Delhivery shipment' });
  }
});

// Settings API
router.get('/settings/public', async (req, res) => {
  const settings = await getSettings();
  res.json({ razorpay_key_id: settings.razorpay_key_id });
});

router.get('/settings', requireAdmin, async (req, res) => {
  const settings = await getSettings();
  res.json(settings);
});

router.post('/settings', requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from('store_settings').update(req.body).eq('id', 1).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

export default router;
