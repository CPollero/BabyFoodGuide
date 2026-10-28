import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Palette, Moon, Sun, Sparkles, Menu, X, ShieldCheck } from 'lucide-react';
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close the mobile menu when tapping outside of it
  useEffect(() => {
    if (!showMobileMenu) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showMobileMenu]);

  const mobileTabClass = (tab: HeaderProps['activeTab']) =>
    `flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 relative ${
      activeTab === tab
        ? `${t.accentBg} text-white shadow-xs`
        : `${t.textSecondary} ${t.cardSubtleBg}`
    }`;

  const mobileMenuItemClass = `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${t.textSecondary} hover:opacity-80 active:scale-[0.98] transition-all text-left`;

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

          {/* Right Action Controls (desktop): Dark mode toggle & Palette picker */}
          <div className="hidden md:flex items-center gap-1.5">
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
              <span className="text-xs font-semibold capitalize">{palette}</span>
            </button>
          </div>

          {/* Mobile expandable menu: Dark mode, Colors & Safety */}
          <div ref={mobileMenuRef} className="md:hidden relative">
            <button
              type="button"
              onClick={() => setShowMobileMenu((v) => !v)}
              className={`p-2 rounded-xl border ${t.borderBase} ${showMobileMenu || activeTab === 'safety' ? `${t.accentBg} text-white` : `${t.cardSubtleBg} ${t.textSecondary}`} transition-all active:scale-95`}
              aria-label={showMobileMenu ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={showMobileMenu}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {showMobileMenu && (
              <div className={`absolute right-0 top-full mt-2 w-56 p-1.5 rounded-2xl border ${t.borderBase} ${t.cardBg} shadow-lg z-50 animate-fade-in`}>
                <button
                  type="button"
                  onClick={toggleMode}
                  className={mobileMenuItemClass}
                >
                  {mode === 'oscuro' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
                  <span>{mode === 'oscuro' ? 'Modo claro' : 'Modo oscuro'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowThemeModal(true);
                  }}
                  className={mobileMenuItemClass}
                >
                  <Palette className="w-4 h-4" />
                  <span className="flex-1">Colores</span>
                  <span className={`text-[11px] ${t.textMuted} capitalize`}>{palette}</span>
                </button>

                <div className={`my-1 border-t ${t.borderBase}`} />

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenu(false);
                    onTabChange('safety');
                  }}
                  className={`${mobileMenuItemClass} ${activeTab === 'safety' ? `${t.accentText} font-extrabold` : ''}`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Seguridad</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <nav className="md:hidden max-w-5xl mx-auto px-3 pb-2.5 flex items-center gap-1.5">
          <button type="button" onClick={() => onTabChange('catalog')} className={mobileTabClass('catalog')}>
            <span>🥦</span>
            <span>Alimentos</span>
          </button>

          <button type="button" onClick={() => onTabChange('calculator')} className={mobileTabClass('calculator')}>
            <span>🍽️</span>
            <span>Calculadora</span>
            {plateCount > 0 && (
              <span className={`px-1.5 rounded-full ${activeTab === 'calculator' ? `bg-white ${mode === 'oscuro' ? 'text-stone-900' : 'text-emerald-700'}` : `${t.accentBg} text-white`} text-[10px] font-extrabold`}>
                {plateCount}
              </span>
            )}
          </button>

          <button type="button" onClick={() => onTabChange('chat')} className={mobileTabClass('chat')}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chef IA</span>
          </button>
        </nav>
      </header>

      {/* Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />
    </>
  );
};
