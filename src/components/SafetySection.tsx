import React, { useState } from 'react';
import {
  PROHIBITED_FOODS_UNDER_12_MONTHS,
  SAFETY_PRACTICAL_GUIDELINES,
} from '../data/foodData';
import { useTheme } from '../context/ThemeContext';
import {
  AlertOctagon,
  CheckCircle,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

export const SafetySection: React.FC = () => {
  const { t } = useTheme();
  const [activeTab, setActiveTab] = useState<'prohibidos' | 'reglas'>('prohibidos');
  const [openGuideId, setOpenGuideId] = useState<string>('regla_3_dias');

  return (
    <div className="space-y-4">
      {/* Safety Header Banner */}
      <div className={`${t.cardBg} rounded-3xl p-5 shadow-xs border ${t.borderBase} transition-colors`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-2xl shadow-xs">
            🛡️
          </div>
          <div>
            <h3 className={`font-extrabold ${t.textPrimary} text-lg sm:text-xl`}>
              Seguridad y Alimentos Prohibidos
            </h3>
            <p className={`text-xs ${t.textMuted}`}>
              Pautas oficiales para proteger la salud digestiva y evitar riesgos de asfixia
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className={`grid grid-cols-2 gap-2 mt-4 p-1 ${t.cardSubtleBg} rounded-2xl`}>
          <button
            onClick={() => setActiveTab('prohibidos')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'prohibidos'
                ? 'bg-rose-600 text-white shadow-xs'
                : `${t.textMuted} hover:${t.textPrimary}`
            }`}
          >
            ❌ Prohibidos (&lt; 12 meses)
          </button>
          <button
            onClick={() => setActiveTab('reglas')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reglas'
                ? `${t.accentBg} text-white shadow-xs`
                : `${t.textMuted} hover:${t.textPrimary}`
            }`}
          >
            💡 Consejos Prácticos
          </button>
        </div>
      </div>

      {/* Tab: Alimentos Prohibidos */}
      {activeTab === 'prohibidos' && (
        <div className="space-y-3">
          <div className="p-3.5 bg-rose-500/10 border border-rose-400/40 rounded-2xl text-rose-950 dark:text-rose-100 text-xs flex items-center gap-2.5">
            <AlertOctagon className="w-5 h-5 text-rose-500 shrink-0" />
            <p>
              <strong>Cero excepciones antes del primer año:</strong> Estos alimentos representan riesgos biológicos (bacterias como botulismo), sobrecarga renal o asfixia mecánica.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROHIBITED_FOODS_UNDER_12_MONTHS.map((item) => (
              <div
                key={item.id}
                className={`${t.cardBg} rounded-3xl p-4 sm:p-5 border ${t.borderBase} shadow-xs space-y-2 hover:border-rose-400 transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h4 className={`font-extrabold ${t.textPrimary} text-sm sm:text-base leading-tight`}>
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      Estrictamente Prohibido
                    </span>
                  </div>
                </div>

                <div className={`pt-2 border-t ${t.borderBase} space-y-1 text-xs`}>
                  <p className={`${t.textPrimary} font-medium`}>
                    <strong>Motivo:</strong> {item.reason}
                  </p>
                  <p className="text-rose-900 dark:text-rose-200 bg-rose-500/10 p-2 rounded-xl text-[11px] leading-relaxed">
                    <strong>Peligro:</strong> {item.danger}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Consejos Prácticos y Reglas */}
      {activeTab === 'reglas' && (
        <div className="space-y-3">
          {SAFETY_PRACTICAL_GUIDELINES.map((guide) => {
            const isOpen = openGuideId === guide.id;

            return (
              <div
                key={guide.id}
                className={`${t.cardBg} rounded-3xl border ${t.borderBase} shadow-xs overflow-hidden transition-all`}
              >
                <button
                  type="button"
                  onClick={() => setOpenGuideId(isOpen ? '' : guide.id)}
                  className={`w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 hover:${t.cardSubtleBg} transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{guide.icon}</span>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${t.accentBadgeBg} ${t.accentBadgeText} px-2 py-0.5 rounded-full border ${t.accentBadgeBorder}`}>
                        {guide.badge}
                      </span>
                      <h4 className={`font-bold ${t.textPrimary} text-sm sm:text-base mt-0.5`}>
                        {guide.title}
                      </h4>
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 ${t.textMuted} shrink-0 transition-transform ${
                      isOpen ? `rotate-180 ${t.textPrimary}` : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className={`p-4 sm:p-5 pt-0 border-t ${t.borderBase} ${t.cardSubtleBg} text-xs sm:text-sm space-y-3`}>
                    <p className={`${t.textPrimary} leading-relaxed font-medium`}>
                      {guide.description}
                    </p>

                    <div className={`space-y-2 ${t.cardBg} p-3.5 rounded-2xl border ${t.borderBase}`}>
                      {guide.bulletPoints.map((point, idx) => (
                        <div key={idx} className={`flex items-start gap-2.5 ${t.textPrimary} text-xs leading-relaxed`}>
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Gagging vs Choking */}
          <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/10 border border-amber-400/40 text-amber-950 dark:text-amber-100 space-y-2 text-xs">
            <h4 className="font-bold text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              ¿Arcada (Gagging) o Atragantamiento?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <div className={`p-3 ${t.cardBg} rounded-2xl border border-amber-300/40`}>
                <p className="font-bold text-emerald-700 dark:text-emerald-300">✅ Arcada (Reflejo normal):</p>
                <p className={`text-[11px] ${t.textMuted} mt-1`}>
                  Hace ruidos, tose, cara enrojecida, saca la lengua. El bebé está resolviendo por sí mismo empujando la comida. No intervengas abruptamente; mantén la calma y observa.
                </p>
              </div>

              <div className={`p-3 ${t.cardBg} rounded-2xl border border-rose-300/40`}>
                <p className="font-bold text-rose-700 dark:text-rose-300">🚨 Atragantamiento (Urgencia):</p>
                <p className={`text-[11px] ${t.textMuted} mt-1`}>
                  Silencio absoluto, no puede toser ni respirar, labios azulados. Vía aérea bloqueada: actuar de inmediato con la maniobra de desobstrucción pediátrica (5 golpes en la espalda / 5 compresiones).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
