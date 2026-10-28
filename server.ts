import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { PEDIATRIC_SYSTEM_INSTRUCTION } from './shared/pediatricPrompt';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API endpoint for multi-turn chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, currentPlate } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Construct history for Gemini
    let conversationHistory = messages.slice(0, -1).map((msg: { role: string; text: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const lastMessage = messages[messages.length - 1];

    let userPrompt = lastMessage.text;
    if (currentPlate && Array.isArray(currentPlate) && currentPlate.length > 0) {
      const plateSummary = currentPlate
        .map((item: { name: string; grams: number; group: string }) => `- ${item.name} (${item.group}): ${item.grams}g`)
        .join('\n');
      userPrompt = `[Contexto actual del plato seleccionado en la calculadora]:\n${plateSummary}\n\nPregunta del padre/madre: ${userPrompt}`;
    }

    let replyText = '';
    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            ...conversationHistory,
            {
              role: 'user',
              parts: [{ text: userPrompt }],
            },
          ],
          config: {
            systemInstruction: PEDIATRIC_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });
        replyText = response.text || '';
        if (replyText) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} call failed, trying next option...`, err?.message);
        // Short delay before retry
        await new Promise((r) => setTimeout(r, 600));
      }
    }

    if (!replyText && lastError) {
      throw lastError;
    }

    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: 'Error al contactar con el asistente pediátrico. Verifica tu conexión.',
      details: error?.message || 'Unknown error',
    });
  }
});

// Production vs Development middleware
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`FoodGuide server running on http://0.0.0.0:${PORT}`);
});
