import React from 'react';
import { useTheme, AVAILABLE_PALETTES, PastelPalette } from '../context/ThemeContext';
import { X, Moon, Sun, Palette, Check } from 'lucide-react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({ isOpen, onClose }) => {
  const { palette, mode, setPalette, setMode, toggleMode, t } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className={`relative w-full sm:max-w-md ${t.cardBg} ${t.textPrimary} rounded-t-3xl sm:rounded-3xl shadow-2xl border ${t.borderBase} overflow-hidden z-10 transition-colors`}>
        {/* Grab bar */}
        <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-600 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Modal Header */}
        <div className={`p-4 border-b ${t.borderBase} flex items-center justify-between`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl ${t.accentBadgeBg} ${t.accentBadgeText} flex items-center justify-center`}>
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Personalizar Apariencia</h3>
              <p className={`text-xs ${t.textMuted}`}>Elige tu paleta pastel y modo de lectura</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full ${t.cardSubtleBg} flex items-center justify-center ${t.textMuted} hover:${t.textPrimary}`}
            aria-label="Cerrar selector de temas"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-5 text-sm">
          {/* Day / Night Mode Toggle */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider ${t.textMuted} mb-2.5`}>
              Modo de Visualización:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setMode('claro')}
                className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition-all active:scale-95 ${
                  mode === 'claro'
                    ? `${t.accentBg} text-white shadow-xs border-transparent`
                    : `${t.cardSubtleBg} ${t.textSecondary} ${t.borderBase} hover:border-stone-400`
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Modo Claro</span>
                {mode === 'claro' && <Check className="w-3.5 h-3.5 ml-1" />}
              </button>

              <button
                type="button"
                onClick={() => setMode('oscuro')}
                className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition-all active:scale-95 ${
                  mode === 'oscuro'
                    ? `${t.accentBg} text-white shadow-xs border-transparent`
                    : `${t.cardSubtleBg} ${t.textSecondary} ${t.borderBase} hover:border-stone-400`
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Modo Oscuro</span>
                {mode === 'oscuro' && <Check className="w-3.5 h-3.5 ml-1" />}
              </button>
            </div>
            {mode === 'oscuro' && (
              <p className="text-[11px] text-emerald-300/80 mt-2">
                🌙 Fondos profundos que descansan la vista durante tomas o consultas nocturnas.
              </p>
            )}
          </div>

          {/* Pastel Palette Selector */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider ${t.textMuted} mb-2.5`}>
              Paleta de Tonos Pasteles:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {AVAILABLE_PALETTES.map((p) => {
                const isSelected = palette === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPalette(p.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-95 ${
                      isSelected
                        ? `${t.accentBadgeBg} ${t.accentBadgeText} ${t.accentBadgeBorder} ring-2 ring-emerald-500/30`
                        : `${t.cardSubtleBg} ${t.textPrimary} ${t.borderBase} hover:border-stone-400`
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full ${p.previewBg} shadow-xs shrink-0`} />
                      <div>
                        <span className="font-bold text-xs block leading-tight">{p.name}</span>
                        <span className="text-[10px] opacity-75">{p.emoji}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-300" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-3.5 ${t.cardSubtleBg} border-t ${t.borderBase} flex justify-end`}>
          <button
            onClick={onClose}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl ${t.accentBg} ${t.accentHover} text-white font-bold text-xs shadow-xs transition-all active:scale-95`}
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
