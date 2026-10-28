import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Palette, Moon, Sun, Sparkles } from 'lucide-react';
import { ThemeSelectorModal } from './ThemeSelectorModal';

interface HeaderProps {
  activeTab: 'catalog' | 'calculator' | 'safety' | 'chat';
  onTabChange: (tab: 'catalog' | 'calculator' | 'safety' | 'chat') => void;
  plateCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  plateCount,
}) => {
  const { t, mode, toggleMode, palette } = useTheme();
  const [showThemeModal, setShowThemeModal] = useState(false);

  return (
    <>
      <header className={`sticky top-0 z-40 ${t.headerBg} backdrop-blur-md border-b ${t.borderBase} shadow-xs transition-colors`}>
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
          {/* Brand / Title */}
          <div
            onClick={() => onTabChange('catalog')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className={`w-10 h-10 rounded-2xl ${t.accentBg} text-white flex items-center justify-center shadow-xs text-xl`}>
              🥑
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-lg sm:text-xl tracking-tight leading-none">
                  Food<span className={t.accentText}>Guide</span>
                </h1>
                <span className={`px-1.5 py-0.5 rounded-md ${t.accentBadgeBg} ${t.accentBadgeText} font-bold text-[9px] uppercase tracking-wider border ${t.accentBadgeBorder}`}>
                  6-12m
                </span>
              </div>
              <p className={`text-[11px] ${t.textMuted} font-medium`}>
                Alimentación Complementaria · BLW & Purés
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => onTabChange('catalog')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'catalog'
                  ? `${t.accentBg} text-white shadow-xs`
                  : `${t.textSecondary} ${t.cardSubtleBg} hover:opacity-90`
              }`}
            >
              🥦 Alimentos
            </button>

            <button
              onClick={() => onTabChange('calculator')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'calculator'
                  ? `${t.accentBg} text-white shadow-xs`
                  : `${t.textSecondary} ${t.cardSubtleBg} hover:opacity-90`
              }`}
            >
              <span>🍽️ Calculadora</span>
              {plateCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full ${mode === 'oscuro' ? 'bg-white text-stone-900' : 'bg-white text-emerald-700'} text-[10px] font-extrabold`}>
                  {plateCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('safety')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'safety'
                  ? `${t.accentBg} text-white shadow-xs`
                  : `${t.textSecondary} ${t.cardSubtleBg} hover:opacity-90`
              }`}
            >
              🛡️ Seguridad
            </button>

            <button
              onClick={() => onTabChange('chat')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'chat'
                  ? `${t.accentBg} text-white shadow-xs`
                  : `${t.textSecondary} ${t.cardSubtleBg} hover:opacity-90`
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chef IA</span>
            </button>
          </nav>

          {/* Right Action Controls: Dark mode toggle & Palette picker */}
          <div className="flex items-center gap-1.5">
            {/* Quick Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleMode}
              className={`p-2 rounded-xl border ${t.borderBase} ${t.cardSubtleBg} ${t.textSecondary} hover:opacity-80 transition-all active:scale-95`}
              title={mode === 'oscuro' ? 'Activar modo claro' : 'Activar modo oscuro'}
              aria-label="Alternar modo oscuro"
            >
              {mode === 'oscuro' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Pastel Palette Picker Button */}
            <button
              type="button"
              onClick={() => setShowThemeModal(true)}
              className={`p-2 rounded-xl border ${t.borderBase} ${t.cardSubtleBg} ${t.textSecondary} hover:opacity-80 transition-all active:scale-95 flex items-center gap-1.5`}
              title="Personalizar colores pasteles"
              aria-label="Paleta de colores"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold capitalize">{palette}</span>
            </button>

            {/* Mobile quick plate button */}
            <button
              onClick={() => onTabChange('calculator')}
              className={`md:hidden p-2 rounded-xl border ${t.borderBase} ${t.cardSubtleBg} ${t.textSecondary} relative active:scale-95`}
              aria-label="Ver calculadora"
            >
              <span className="text-sm">🍽️</span>
              {plateCount > 0 && (
                <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${t.accentBg} text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs`}>
                  {plateCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />
    </>
  );
};
