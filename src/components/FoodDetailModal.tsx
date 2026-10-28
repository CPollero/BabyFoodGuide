import React, { useState } from 'react';
import { FoodItem } from '../data/foodData';
import { useTheme } from '../context/ThemeContext';
import { X, Plus, AlertTriangle, ShieldCheck, HeartPulse, Sparkles, ChefHat } from 'lucide-react';

interface FoodDetailModalProps {
  food: FoodItem | null;
  onClose: () => void;
  onAddToPlate: (food: FoodItem, grams: number) => void;
  onAskRecipeWithFood: (food: FoodItem, grams: number) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  food,
  onClose,
  onAddToPlate,
  onAskRecipeWithFood,
}) => {
  const { t } = useTheme();
  const [selectedGrams, setSelectedGrams] = useState<number>(
    food ? food.defaultServingGrams : 25
  );

  if (!food) return null;

  const handleAdd = () => {
    onAddToPlate(food, selectedGrams);
    onClose();
  };

  const handleAsk = () => {
    onAskRecipeWithFood(food, selectedGrams);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className={`relative w-full sm:max-w-lg ${t.cardBg} ${t.textPrimary} rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden z-10 border ${t.borderBase} transition-colors`}>
        {/* Grab bar */}
        <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-600 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Header */}
        <div className={`flex items-center justify-between p-5 pb-3 border-b ${t.borderBase}`}>
          <div className="flex items-center gap-3">
            <span className="text-4xl filter drop-shadow-sm">{food.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{food.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${t.accentBadgeBg} ${t.accentBadgeText} border ${t.accentBadgeBorder}`}>
                  {food.fromAge}
                </span>
              </div>
              <p className={`text-xs ${t.textMuted} font-medium`}>
                {food.groups.join(' · ')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-9 h-9 rounded-full ${t.cardSubtleBg} flex items-center justify-center ${t.textMuted} hover:${t.textPrimary} transition-colors`}
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm leading-relaxed">
          {/* Iron & Brain Badges */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className={`p-3 rounded-2xl ${t.cardSubtleBg} border ${t.borderBase} flex items-center gap-2.5`}>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider opacity-75">Nivel de Hierro</p>
                <p className="font-bold text-sm">{food.ironLevel}</p>
              </div>
            </div>

            <div className={`p-3 rounded-2xl ${t.cardSubtleBg} border ${t.borderBase} flex items-center gap-2.5`}>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider opacity-75">Aporte Clave</p>
                <p className="font-bold text-xs truncate">
                  {food.isBrainEssential ? '🧠 Desarrollo Cerebral' : food.digestiveEffect === 'laxante' ? 'Laxante natural' : food.digestiveEffect === 'estriñe' ? 'Astringente' : 'Nutricional base'}
                </p>
              </div>
            </div>
          </div>

          {/* Allergen Warning */}
          {food.isAllergen && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex items-start gap-3 text-amber-950 dark:text-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300">Alerta de Alérgeno</h4>
                <p className="text-xs mt-0.5 opacity-90">
                  Este ingrediente es un alérgeno común. Introduce de uno en uno, durante la mañana o mediodía, y repite 2 a 3 días consecutivos (Regla de los 3 días).
                </p>
              </div>
            </div>
          )}

          {/* Choking Hazard */}
          {food.chokingHazardWarning && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900 flex items-start gap-3 text-rose-950 dark:text-rose-200">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-rose-800 dark:text-rose-300">Precaución Crítica de Corte / Asfixia</h4>
                <p className="text-xs mt-0.5 font-medium">{food.chokingHazardWarning}</p>
              </div>
            </div>
          )}

          {/* BLW Presentation */}
          <div className={`p-4 rounded-2xl ${t.cardSubtleBg} border ${t.borderBase} space-y-1.5`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              <span className={`w-6 h-6 rounded-lg ${t.accentBg} text-white flex items-center justify-center text-xs`}>BLW</span>
              <h4>Forma y Corte para Baby-Led Weaning</h4>
            </div>
            <p className={`text-xs sm:text-sm pl-8 font-medium ${t.textSecondary}`}>
              {food.blwCut}
            </p>
          </div>

          {/* Purée Presentation */}
          <div className={`p-4 rounded-2xl ${t.cardSubtleBg} border ${t.borderBase} space-y-1.5`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs">Puré</span>
              <h4>Presentación en Papilla / Puré</h4>
            </div>
            <p className={`text-xs sm:text-sm pl-8 font-medium ${t.textSecondary}`}>
              {food.pureeForm}
            </p>
          </div>

          {/* Notes */}
          <div className={`p-4 rounded-2xl ${t.cardSubtleBg} border ${t.borderBase} space-y-1`}>
            <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${t.accentText}`}>
              <ShieldCheck className="w-4 h-4" />
              <span>Notas de la Guía Oficial</span>
            </div>
            <p className={`text-xs pl-6 ${t.textSecondary}`}>{food.notes}</p>
          </div>

          {/* Grams Selector for Calculator */}
          <div className={`pt-2 border-t ${t.borderBase}`}>
            <label className={`block text-xs font-bold uppercase tracking-wider ${t.textMuted} mb-2`}>
              Cantidad para la Porción (Gramos):
            </label>
            <div className="flex items-center gap-2">
              <div className={`flex-1 flex items-center ${t.cardSubtleBg} rounded-2xl p-1 border ${t.borderBase}`}>
                <button
                  type="button"
                  onClick={() => setSelectedGrams(Math.max(1, selectedGrams - 5))}
                  className={`w-10 h-10 rounded-xl ${t.cardBg} shadow-xs font-bold ${t.textPrimary} hover:opacity-80 flex items-center justify-center active:scale-95 text-lg`}
                >
                  -
                </button>
                <div className={`flex-1 text-center font-extrabold ${t.textPrimary} text-base`}>
                  {selectedGrams} <span className={`text-xs font-semibold ${t.textMuted}`}>g</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedGrams(selectedGrams + 5)}
                  className={`w-10 h-10 rounded-xl ${t.cardBg} shadow-xs font-bold ${t.textPrimary} hover:opacity-80 flex items-center justify-center active:scale-95 text-lg`}
                >
                  +
                </button>
              </div>

              {/* Preset Pills */}
              <div className="flex gap-1.5">
                {[15, 25, 40].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSelectedGrams(preset)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                      selectedGrams === preset
                        ? `${t.accentBg} text-white border-transparent shadow-xs`
                        : `${t.cardSubtleBg} ${t.textSecondary} ${t.borderBase} hover:opacity-90`
                    }`}
                  >
                    {preset}g
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className={`p-4 ${t.cardSubtleBg} border-t ${t.borderBase} grid grid-cols-2 gap-2.5`}>
          <button
            onClick={handleAdd}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl ${t.accentBg} ${t.accentHover} active:scale-[0.98] text-white font-bold text-sm shadow-sm transition-all`}
          >
            <Plus className="w-4 h-4" />
            <span>Añadir al Plato</span>
          </button>

          <button
            onClick={handleAsk}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold text-sm shadow-sm transition-all"
          >
            <ChefHat className="w-4 h-4" />
            <span>Pedir Receta IA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
