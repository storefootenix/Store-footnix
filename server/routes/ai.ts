import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ''
});

router.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('AI Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate response' });
  }
});

export default router;
