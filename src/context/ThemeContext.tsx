import React, { createContext, useContext, useState, useEffect } from 'react';

export type PastelPalette = 'verde' | 'durazno' | 'azul' | 'lavanda';
export type ColorMode = 'claro' | 'oscuro';

export interface ThemeClasses {
  appBg: string;
  cardBg: string;
  cardSubtleBg: string;
  inputBg: string;
  headerBg: string;
  bottomNavBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderBase: string;
  borderSubtle: string;
  accentBg: string;
  accentHover: string;
  accentText: string;
  accentBadgeBg: string;
  accentBadgeText: string;
  accentBadgeBorder: string;
  ringFocus: string;
  highlightCard: string;
}

interface ThemeContextType {
  palette: PastelPalette;
  mode: ColorMode;
  setPalette: (p: PastelPalette) => void;
  setMode: (m: ColorMode) => void;
  toggleMode: () => void;
  t: ThemeClasses;
}

const PALETTES_CONFIG: Record<
  PastelPalette,
  {
    name: string;
    emoji: string;
    colorHex: string;
    claro: ThemeClasses;
    oscuro: ThemeClasses;
  }
> = {
  verde: {
    name: 'Verde Pastel (Menta)',
    emoji: '🌱',
    colorHex: '#10B981',
    claro: {
      appBg: 'bg-[#F3FAF5]',
      cardBg: 'bg-white',
      cardSubtleBg: 'bg-[#EBF7EF]/70',
      inputBg: 'bg-[#F2F9F4]',
      headerBg: 'bg-white/90',
      bottomNavBg: 'bg-white/95',
      textPrimary: 'text-stone-900',
      textSecondary: 'text-emerald-950',
      textMuted: 'text-stone-500',
      borderBase: 'border-emerald-100',
      borderSubtle: 'border-emerald-50',
      accentBg: 'bg-emerald-600',
      accentHover: 'hover:bg-emerald-700',
      accentText: 'text-emerald-700',
      accentBadgeBg: 'bg-emerald-100',
      accentBadgeText: 'text-emerald-900',
      accentBadgeBorder: 'border-emerald-200',
      ringFocus: 'focus:border-emerald-500',
      highlightCard: 'bg-emerald-50/70 border-emerald-200',
    },
    oscuro: {
      appBg: 'bg-[#062419]',
      cardBg: 'bg-[#0d3527]',
      cardSubtleBg: 'bg-[#134232]/80',
      inputBg: 'bg-[#0a2c20]',
      headerBg: 'bg-[#062419]/95',
      bottomNavBg: 'bg-[#062419]/95',
      textPrimary: 'text-emerald-50',
      textSecondary: 'text-emerald-200',
      textMuted: 'text-emerald-300/60',
      borderBase: 'border-emerald-800/60',
      borderSubtle: 'border-emerald-900/60',
      accentBg: 'bg-emerald-500',
      accentHover: 'hover:bg-emerald-400',
      accentText: 'text-emerald-300',
      accentBadgeBg: 'bg-emerald-900/80',
      accentBadgeText: 'text-emerald-200',
      accentBadgeBorder: 'border-emerald-700/80',
      ringFocus: 'focus:border-emerald-400',
      highlightCard: 'bg-emerald-950/80 border-emerald-800/80',
    },
  },
  durazno: {
    name: 'Durazno Pastel (Melocotón)',
    emoji: '🍑',
    colorHex: '#F97316',
    claro: {
      appBg: 'bg-[#FDF8F4]',
      cardBg: 'bg-white',
      cardSubtleBg: 'bg-[#FFF3EB]/80',
      inputBg: 'bg-[#FAF2EB]',
      headerBg: 'bg-white/90',
      bottomNavBg: 'bg-white/95',
      textPrimary: 'text-stone-900',
      textSecondary: 'text-amber-950',
      textMuted: 'text-stone-500',
      borderBase: 'border-orange-100',
      borderSubtle: 'border-orange-50',
      accentBg: 'bg-orange-500',
      accentHover: 'hover:bg-orange-600',
      accentText: 'text-orange-700',
      accentBadgeBg: 'bg-orange-100',
      accentBadgeText: 'text-orange-950',
      accentBadgeBorder: 'border-orange-200',
      ringFocus: 'focus:border-orange-400',
      highlightCard: 'bg-orange-50/70 border-orange-200',
    },
    oscuro: {
      appBg: 'bg-[#1c120c]',
      cardBg: 'bg-[#291b13]',
      cardSubtleBg: 'bg-[#38261c]/80',
      inputBg: 'bg-[#231710]',
      headerBg: 'bg-[#1c120c]/95',
      bottomNavBg: 'bg-[#1c120c]/95',
      textPrimary: 'text-amber-50',
      textSecondary: 'text-amber-200',
      textMuted: 'text-amber-300/60',
      borderBase: 'border-orange-900/50',
      borderSubtle: 'border-orange-950',
      accentBg: 'bg-orange-500',
      accentHover: 'hover:bg-orange-400',
      accentText: 'text-orange-300',
      accentBadgeBg: 'bg-orange-950/80',
      accentBadgeText: 'text-orange-200',
      accentBadgeBorder: 'border-orange-800/70',
      ringFocus: 'focus:border-orange-400',
      highlightCard: 'bg-amber-950/80 border-orange-900/60',
    },
  },
  azul: {
    name: 'Azul Pastel (Cielo)',
    emoji: '🌊',
    colorHex: '#0284C7',
    claro: {
      appBg: 'bg-[#F2F7FC]',
      cardBg: 'bg-white',
      cardSubtleBg: 'bg-[#E7F1FB]/70',
      inputBg: 'bg-[#ECF4FB]',
      headerBg: 'bg-white/90',
      bottomNavBg: 'bg-white/95',
      textPrimary: 'text-stone-900',
      textSecondary: 'text-sky-950',
      textMuted: 'text-stone-500',
      borderBase: 'border-sky-100',
      borderSubtle: 'border-sky-50',
      accentBg: 'bg-sky-600',
      accentHover: 'hover:bg-sky-700',
      accentText: 'text-sky-700',
      accentBadgeBg: 'bg-sky-100',
      accentBadgeText: 'text-sky-950',
      accentBadgeBorder: 'border-sky-200',
      ringFocus: 'focus:border-sky-500',
      highlightCard: 'bg-sky-50/70 border-sky-200',
    },
    oscuro: {
      appBg: 'bg-[#0a1829]',
      cardBg: 'bg-[#11253e]',
      cardSubtleBg: 'bg-[#193353]/80',
      inputBg: 'bg-[#0d1e33]',
      headerBg: 'bg-[#0a1829]/95',
      bottomNavBg: 'bg-[#0a1829]/95',
      textPrimary: 'text-sky-50',
      textSecondary: 'text-sky-200',
      textMuted: 'text-sky-300/60',
      borderBase: 'border-sky-900/50',
      borderSubtle: 'border-sky-950',
      accentBg: 'bg-sky-500',
      accentHover: 'hover:bg-sky-400',
      accentText: 'text-sky-300',
      accentBadgeBg: 'bg-sky-950/80',
      accentBadgeText: 'text-sky-200',
      accentBadgeBorder: 'border-sky-800/70',
      ringFocus: 'focus:border-sky-400',
      highlightCard: 'bg-sky-950/80 border-sky-900/60',
    },
  },
  lavanda: {
    name: 'Lavanda Pastel',
    emoji: '🌸',
    colorHex: '#9333EA',
    claro: {
      appBg: 'bg-[#F8F5FC]',
      cardBg: 'bg-white',
      cardSubtleBg: 'bg-[#F2ECF9]/70',
      inputBg: 'bg-[#F4EFFB]',
      headerBg: 'bg-white/90',
      bottomNavBg: 'bg-white/95',
      textPrimary: 'text-stone-900',
      textSecondary: 'text-purple-950',
      textMuted: 'text-stone-500',
      borderBase: 'border-purple-100',
      borderSubtle: 'border-purple-50',
      accentBg: 'bg-purple-600',
      accentHover: 'hover:bg-purple-700',
      accentText: 'text-purple-700',
      accentBadgeBg: 'bg-purple-100',
      accentBadgeText: 'text-purple-950',
      accentBadgeBorder: 'border-purple-200',
      ringFocus: 'focus:border-purple-500',
      highlightCard: 'bg-purple-50/70 border-purple-200',
    },
    oscuro: {
      appBg: 'bg-[#150f24]',
      cardBg: 'bg-[#221838]',
      cardSubtleBg: 'bg-[#31234f]/80',
      inputBg: 'bg-[#1c1430]',
      headerBg: 'bg-[#150f24]/95',
      bottomNavBg: 'bg-[#150f24]/95',
      textPrimary: 'text-purple-50',
      textSecondary: 'text-purple-200',
      textMuted: 'text-purple-300/60',
      borderBase: 'border-purple-900/50',
      borderSubtle: 'border-purple-950',
      accentBg: 'bg-purple-500',
      accentHover: 'hover:bg-purple-400',
      accentText: 'text-purple-300',
      accentBadgeBg: 'bg-purple-950/80',
      accentBadgeText: 'text-purple-200',
      accentBadgeBorder: 'border-purple-800/70',
      ringFocus: 'focus:border-purple-400',
      highlightCard: 'bg-purple-950/80 border-purple-900/60',
    },
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default palette: Verde Pastel (as requested)
  const [palette, setPaletteState] = useState<PastelPalette>(() => {
    try {
      const saved = localStorage.getItem('foodguide_palette');
      if (saved && ['verde', 'durazno', 'azul', 'lavanda'].includes(saved)) {
        return saved as PastelPalette;
      }
    } catch (e) {
      console.warn(e);
    }
    return 'verde';
  });

  // Default mode: claro
  const [mode, setModeState] = useState<ColorMode>(() => {
    try {
      const saved = localStorage.getItem('foodguide_mode');
      if (saved === 'oscuro' || saved === 'claro') {
        return saved;
      }
    } catch (e) {
      console.warn(e);
    }
    return 'claro';
  });

  const setPalette = (p: PastelPalette) => {
    setPaletteState(p);
    try {
      localStorage.setItem('foodguide_palette', p);
    } catch (e) {
      console.warn(e);
    }
  };

  const setMode = (m: ColorMode) => {
    setModeState(m);
    try {
      localStorage.setItem('foodguide_mode', m);
    } catch (e) {
      console.warn(e);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'claro' ? 'oscuro' : 'claro');
  };

  const currentTheme = PALETTES_CONFIG[palette][mode];

  // Sync theme-color meta tag for mobile browsers and body class
  useEffect(() => {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      if (mode === 'oscuro') {
        metaTheme.setAttribute('content', palette === 'verde' ? '#062419' : palette === 'durazno' ? '#1c120c' : palette === 'azul' ? '#0a1829' : '#150f24');
      } else {
        metaTheme.setAttribute('content', PALETTES_CONFIG[palette].colorHex);
      }
    }
  }, [palette, mode]);

  return (
    <ThemeContext.Provider
      value={{
        palette,
        mode,
        setPalette,
        setMode,
        toggleMode,
        t: currentTheme,
      }}
    >
      <div className={`${currentTheme.appBg} ${currentTheme.textPrimary} min-h-screen transition-colors duration-200`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const AVAILABLE_PALETTES: Array<{
  id: PastelPalette;
  name: string;
  emoji: string;
  colorHex: string;
  previewBg: string;
}> = [
  { id: 'verde', name: 'Verde Pastel', emoji: '🌱', colorHex: '#10B981', previewBg: 'bg-emerald-400' },
  { id: 'durazno', name: 'Durazno Pastel', emoji: '🍑', colorHex: '#F97316', previewBg: 'bg-orange-400' },
  { id: 'azul', name: 'Azul Pastel', emoji: '🌊', colorHex: '#0284C7', previewBg: 'bg-sky-400' },
  { id: 'lavanda', name: 'Lavanda Pastel', emoji: '🌸', colorHex: '#9333EA', previewBg: 'bg-purple-400' },
];
