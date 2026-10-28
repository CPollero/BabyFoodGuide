import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface BottomNavProps {
  activeTab: 'catalog' | 'calculator' | 'safety' | 'chat';
  onTabChange: (tab: 'catalog' | 'calculator' | 'safety' | 'chat') => void;
  plateCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  plateCount,
}) => {
  const { t } = useTheme();

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 ${t.bottomNavBg} backdrop-blur-lg border-t ${t.borderBase} shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden pb-safe transition-colors`}>
      <div className="grid grid-cols-4 h-16 max-w-lg mx-auto px-2">
        {/* Alimentos */}
        <button
          type="button"
          onClick={() => onTabChange('catalog')}
          className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            activeTab === 'catalog'
              ? `${t.accentText} font-extrabold`
              : `${t.textMuted} font-medium`
          }`}
        >
          <span className="text-xl">🥦</span>
          <span className="text-[10px] tracking-tight">Alimentos</span>
        </button>

        {/* Calculadora */}
        <button
          type="button"
          onClick={() => onTabChange('calculator')}
          className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 relative ${
            activeTab === 'calculator'
              ? `${t.accentText} font-extrabold`
              : `${t.textMuted} font-medium`
          }`}
        >
          <div className="relative">
            <span className="text-xl">🍽️</span>
            {plateCount > 0 && (
              <span className={`absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full ${t.accentBg} text-white text-[9px] font-black shadow-xs`}>
                {plateCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Calculadora</span>
        </button>

        {/* Seguridad */}
        <button
          type="button"
          onClick={() => onTabChange('safety')}
          className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            activeTab === 'safety'
              ? `${t.accentText} font-extrabold`
              : `${t.textMuted} font-medium`
          }`}
        >
          <span className="text-xl">🛡️</span>
          <span className="text-[10px] tracking-tight">Seguridad</span>
        </button>

        {/* Asistente IA */}
        <button
          type="button"
          onClick={() => onTabChange('chat')}
          className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            activeTab === 'chat'
              ? `${t.accentText} font-extrabold`
              : `${t.textMuted} font-medium`
          }`}
        >
          <div className="relative">
            <span className="text-xl">👩‍🍳</span>
            <span className={`w-2 h-2 rounded-full ${t.accentBg} absolute -top-0.5 -right-0.5 animate-pulse`} />
          </div>
          <span className="text-[10px] tracking-tight">Chef IA</span>
        </button>
      </div>
    </nav>
  );
};
