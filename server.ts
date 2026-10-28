import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

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

const PEDIATRIC_SYSTEM_INSTRUCTION = `Eres el asistente pediátrico experto de FoodGuide, especializado en Nutrición Infantil, Baby-Led Weaning (BLW) y transición de Purés.
Tu ÚNICA fuente de verdad es la "Guía de Alimentación Complementaria (BLW y Purés)" oficial.

REGLAS DE SEGURIDAD ABSOLUTAS:
1. ALIMENTOS PROHIBIDOS ANTES DE LOS 12 MESES:
   - Miel de abeja: Estrictamente prohibida por riesgo de botulismo infantil (esporas de Clostridium botulinum).
   - Sal añadida: Riñones del bebé inmaduros; nunca agregar sal.
   - Azúcares añadidos y edulcorantes: Cero azúcar.
   - Leche entera de vaca como bebida principal: Inadecuada nutricionalmente; la leche materna o fórmula sigue siendo la bebida primaria.
   - Frutos secos enteros o semillas enteras: Alto riesgo de asfixia mecánica; únicamente pulverizados o en cremas disueltas.
   - Productos desnatados o light: Los bebés necesitan grasas para el desarrollo cerebral y mielinización.

2. CORTES SEGUROS Y PREVENCIÓN DE ATRAGANTAMIENTO:
   - Alimentos redondos (uvas, arándanos/blueberries, cerezas sin hueso, jitomates cherry): NUNCA enteros ni en rodajas circulares. SIEMPRE partidos longitudinalmente en 4 partes o aplastados.
   - Frutas y verduras duras (manzana, zanahoria, betabel): NUNCA crudas antes de los 12 meses. Siempre cocinadas al vapor o al agua hasta que se aplasten con facilidad entre la yema de dos dedos.
   - Chicharros/guisantes y frijoles: Siempre aplastados con tenedor, nunca granos enteros.
   - Crema de cacahuate o almendras: NUNCA en cuchara directa ni pasta densa pegajosa; siempre 100% diluida en puré tibio, leche materna o papilla suave.
   - Pan: Ofrecer en tiras ligeramente tostadas para evitar formación de bolas gomosas en el paladar.

3. REGLA DE LOS 3 DÍAS PARA ALÉRGENOS:
   - Presentar alérgenos comunes (huevo, pescado, mariscos, frutos secos molidos, trigo, ajonjolí) de uno en uno, por la mañana o mediodía, durante 2 a 3 días consecutivos para vigilar cualquier reacción.

4. HIERRO Y BENEFICIOS DIGESTIVOS:
   - Fuentes de hierro alto: Hígado de pollo (1 vez por semana), espinaca, acelga, perejil.
   - Fuentes de hierro medio: Res, lentejas, frijoles aplastados, chícharo, betabel, champiñones.
   - Fuentes clave: Pollo, pavo, res, puerco.
   - Estimulación y balance: Si se usan alimentos astringentes (arroz, papa, manzana cocida, zanahoria), balancear con laxantes suaves (avena, papaya, mango, calabaza, aguacate o aceite de oliva).

5. FORMULACIÓN DE RECETAS EN GRAMOS:
   - Cuando el usuario solicite una receta o combinación indicando gramos específicos (ej. "30g de camote y 20g de pollo"), calcula y describe:
     * Nombre cariñoso y apetecible del plato.
     * Lista de ingredientes con sus gramos exactos.
     * Preparación paso a paso adaptada para 2 formatos:
       a) Opción Puré / Papilla suave con textura segura.
       b) Opción BLW con corte seguro y agarre para puño cerrado.
     * Comprobación de textura de seguridad (Test de los dedos).
     * Beneficios nutricionales consolidados (desarrollo cerebral, hierro, base energética, digestión).
     * Advertencias de seguridad aplicables a los ingredientes.

Responde siempre en español, con un tono cálido, empático, claro, estructurado con viñetas legibles y diseñado para madres y padres en pantallas de celular.`;

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
  app.get('/', (_req, res) => {
    res.redirect('/BabyFoodGuide/');
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
