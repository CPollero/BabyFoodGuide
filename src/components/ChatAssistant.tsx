import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ChefHat, RotateCcw, AlertCircle, Loader2 } from 'lucide-react';
import { PlateItem } from './PortionCalculator';
import { MarkdownRenderer } from './MarkdownRenderer';
import { useTheme } from '../context/ThemeContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

interface ChatAssistantProps {
  currentPlate: PlateItem[];
  prefilledPrompt?: string;
  onClearPrefilledPrompt?: () => void;
}

const QUICK_PROMPTS = [
  'Dame una receta de puré combinando 35g de camote y 25g de pollo respetando la guía',
  'Idea de almuerzo BLW rico en hierro para un bebé de 6 meses',
  '¿Cómo introducir la crema de cacahuate de forma segura según la regla de los 3 días?',
  'Combinación laxante para aliviar el estreñimiento de mi bebé',
  '¿Cuáles son los cortes seguros para ofrecer uvas y manzana a los 6 meses?',
];

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  currentPlate,
  prefilledPrompt,
  onClearPrefilledPrompt,
}) => {
  const { t } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '¡Hola, mamá/papá! 👋 Soy tu Asistente Pediátrico de **FoodGuide**.\n\nPuedes pedirme recetas personalizadas combinando ingredientes en **gramos específicos** (ej: *"Dame una receta de puré con 35g de camote y 25g de pollo"*), resolver dudas sobre **cortes seguros BLW**, texturas de puré o pautas de alérgenos respetando estrictamente la guía oficial.\n\n¿En qué plato o ingrediente te gustaría que te ayude hoy?',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle prefilled prompt from calculator or food detail
  useEffect(() => {
    if (prefilledPrompt) {
      sendMessage(prefilledPrompt);
      if (onClearPrefilledPrompt) {
        onClearPrefilledPrompt();
      }
    }
  }, [prefilledPrompt]);

  const sendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    setErrorMsg(null);
    setInputText('');

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
          currentPlate: currentPlate.map((p) => ({
            name: p.food.name,
            group: p.food.groups.join(' / '),
            grams: p.grams,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: no se pudo obtener respuesta.`);
      }

      const data = await response.json();
      const modelMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.reply || 'Disculpa, no pude generar una respuesta.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMsg(err?.message || 'Error de conexión con el asistente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        text: 'Conversación reiniciada. ¿Qué receta o duda sobre alimentación complementaria tienes ahora?',
        timestamp: new Date(),
      },
    ]);
    setErrorMsg(null);
  };

  const plateSummary = currentPlate
    .map((item) => `${item.food.name} (${item.grams}g)`)
    .join(' + ');

  return (
    <div className={`flex flex-col h-[calc(100vh-185px)] min-h-[500px] ${t.cardBg} rounded-3xl border ${t.borderBase} shadow-xs overflow-hidden transition-colors`}>
      {/* Chat Top Bar */}
      <div className={`p-3.5 sm:p-4 ${t.cardSubtleBg} border-b ${t.borderBase} flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-2xl ${t.accentBg} text-white flex items-center justify-center shadow-xs`}>
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`font-extrabold ${t.textPrimary} text-sm sm:text-base leading-tight`}>
              Chef Pediátrico & Asistente IA
            </h3>
            <p className={`text-[11px] ${t.textMuted} font-medium flex items-center gap-1`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Basado en la Guía Oficial (BLW y Purés)
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className={`${t.textMuted} hover:${t.textPrimary} p-2 rounded-xl hover:bg-stone-500/10 transition-colors`}
          title="Reiniciar chat"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Active Plate Context Pill if plate is not empty */}
      {currentPlate.length > 0 && (
        <div className={`px-4 py-2 ${t.cardSubtleBg} border-b ${t.borderBase} flex items-center justify-between text-xs ${t.textPrimary}`}>
          <div className="flex items-center gap-2 truncate">
            <span className="text-base">🍽️</span>
            <span className="truncate">
              <strong>Plato activo:</strong> {plateSummary}
            </span>
          </div>
          <button
            onClick={() =>
              sendMessage(
                `Dame una receta paso a paso para puré o BLW utilizando exactamente estos ingredientes de mi plato: ${plateSummary}`
              )
            }
            className={`shrink-0 ml-2 px-2.5 py-1 ${t.accentBg} hover:opacity-90 text-white rounded-lg font-bold text-[11px] transition-colors`}
          >
            Cocinar plato
          </button>
        </div>
      )}

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((message) => {
          const isUser = message.role === 'user';

          return (
            <div
              key={message.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm shadow-xs ${
                  isUser
                    ? `${t.accentBg} text-white`
                    : `${t.accentBadgeBg} ${t.accentBadgeText} border ${t.accentBadgeBorder}`
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? `${t.accentBg} text-white rounded-tr-xs shadow-xs`
                    : `${t.cardSubtleBg} ${t.textPrimary} border ${t.borderBase} rounded-tl-xs shadow-xs`
                }`}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{message.text}</p>
                ) : (
                  <MarkdownRenderer content={message.text} />
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className={`w-8 h-8 rounded-xl ${t.accentBadgeBg} ${t.accentBadgeText} border ${t.accentBadgeBorder} flex items-center justify-center shrink-0`}>
              <Bot className="w-4 h-4" />
            </div>
            <div className={`${t.cardSubtleBg} border ${t.borderBase} rounded-3xl rounded-tl-xs p-4 flex items-center gap-2.5 text-xs ${t.textPrimary} shadow-xs`}>
              <Loader2 className={`w-4 h-4 ${t.accentText} animate-spin`} />
              <span>Preparando receta segura y calculando texturas...</span>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-400/40 rounded-2xl text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className={`p-2 border-t ${t.borderBase} ${t.cardSubtleBg} overflow-x-auto flex items-center gap-1.5 scrollbar-none`}>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => sendMessage(prompt)}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-xl ${t.cardBg} border ${t.borderBase} ${t.textPrimary} text-[11px] font-semibold whitespace-nowrap shrink-0 transition-colors active:scale-95 disabled:opacity-50 hover:opacity-80`}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className={`p-3 sm:p-4 ${t.cardBg} border-t ${t.borderBase}`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputText);
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pide una receta (ej. 35g camote + 25g pollo)..."
            disabled={isLoading}
            className={`flex-1 ${t.inputBg} border ${t.borderBase} ${t.ringFocus} rounded-2xl px-4 py-3 text-xs sm:text-sm ${t.textPrimary} placeholder:text-stone-400 placeholder:opacity-70 outline-hidden transition-all`}
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`w-11 h-11 rounded-2xl ${t.accentBg} ${t.accentHover} active:scale-95 disabled:opacity-40 text-white flex items-center justify-center shadow-xs transition-all shrink-0`}
            aria-label="Enviar pregunta"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
