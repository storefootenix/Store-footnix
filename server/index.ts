import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import aiRoutes from './routes/ai.js';
import { supabase } from './db.js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);
app.use('/api/ai', aiRoutes);

// Serve Vite frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // --- SUPABASE WAKEUP SCRIPT ---
  // Sends a tiny request to Supabase every 5 minutes to prevent the free tier from pausing
  setInterval(async () => {
    try {
      await supabase.from('store_config').select('storeName').limit(1);
      console.log(`[Supabase Keep-Alive] Ping sent at ${new Date().toISOString()}`);
    } catch (err) {
      console.error('[Supabase Keep-Alive] Ping failed:', err);
    }
  }, 5 * 60 * 1000); // 5 minutes
});
