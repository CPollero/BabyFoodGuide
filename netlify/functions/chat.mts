import { GoogleGenAI } from '@google/genai';
import { PEDIATRIC_SYSTEM_INSTRUCTION } from '../../shared/pediatricPrompt';

// Credentials and base URL are provided automatically by Netlify AI Gateway.
const ai = new GoogleGenAI({});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405);
  }

  try {
    const { messages, currentPlate } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: 'Messages array is required.' }, 400);
    }

    const conversationHistory = messages.slice(0, -1).map((msg: { role: string; text: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    let userPrompt = messages[messages.length - 1].text;
    if (Array.isArray(currentPlate) && currentPlate.length > 0) {
      const plateSummary = currentPlate
        .map((item: { name: string; grams: number; group: string }) => `- ${item.name} (${item.group}): ${item.grams}g`)
        .join('\n');
      userPrompt = `[Contexto actual del plato seleccionado en la calculadora]:\n${plateSummary}\n\nPregunta del padre/madre: ${userPrompt}`;
    }

    let replyText = '';
    let lastError: any = null;

    for (const model of ['gemini-3.8-flash', 'gemini-3.1-flash-lite']) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [...conversationHistory, { role: 'user', parts: [{ text: userPrompt }] }],
          config: {
            systemInstruction: PEDIATRIC_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });
        replyText = response.text || '';
        if (replyText) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} call failed, trying next option...`, err?.message);
      }
    }

    if (!replyText && lastError) {
      throw lastError;
    }

    return json({ reply: replyText });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return json(
      {
        error: 'Error al contactar con el asistente pediátrico. Verifica tu conexión.',
        details: error?.message || 'Unknown error',
      },
      500
    );
  }
};

export const config = {
  path: '/api/chat',
};
