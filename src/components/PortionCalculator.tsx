import React, { useState } from 'react';
import { FoodItem, FOOD_DATABASE } from '../data/foodData';
import { useTheme } from '../context/ThemeContext';
import {
  Trash2,
  Plus,
  AlertTriangle,
  HeartPulse,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ChefHat,
  Search,
  CheckCircle2,
} from 'lucide-react';

export interface PlateItem {
  food: FoodItem;
  grams: number;
}

interface PortionCalculatorProps {
  plate: PlateItem[];
  onUpdateGrams: (foodId: string, grams: number) => void;
  onRemoveItem: (foodId: string) => void;
  onClearPlate: () => void;
  onAddFood: (food: FoodItem, grams: number) => void;
  onRequestAiRecipe: (plate: PlateItem[]) => void;
  onOpenFoodDetail: (food: FoodItem) => void;
}

export const PortionCalculator: React.FC<PortionCalculatorProps> = ({
  plate,
  onUpdateGrams,
  onRemoveItem,
  onClearPlate,
  onAddFood,
  onRequestAiRecipe,
  onOpenFoodDetail,
}) => {
  const { t } = useTheme();
  const [showAddPicker, setShowAddPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  // Total weight
  const totalGrams = plate.reduce((sum, item) => sum + item.grams, 0);

  // Consolidated nutritional analysis using unified groups
  const hasBrainFat = plate.some(
    (item) => item.food.isBrainEssential || item.food.groups.includes('Grasas Saludables')
  );
  const brainItems = plate.filter(
    (item) => item.food.isBrainEssential || item.food.groups.includes('Grasas Saludables')
  );

  // Iron items
  const highIronItems = plate.filter((item) => item.food.ironLevel === 'Alto');
  const mediumIronItems = plate.filter((item) => item.food.ironLevel === 'Medio');
  const lowIronItems = plate.filter((item) => item.food.ironLevel === 'Bajo');
  const hasIron = highIronItems.length > 0 || mediumIronItems.length > 0 || lowIronItems.length > 0;

  // Vitamin C booster check
  const hasVitC = plate.some((item) =>
    ['pimiento', 'jitomate', 'mandarina', 'naranja', 'kiwi', 'fresas', 'brocoli'].includes(item.food.id)
  );

  // Digestive balance
  const astringentItems = plate.filter((item) => item.food.digestiveEffect === 'estriñe');
  const laxativeItems = plate.filter((item) => item.food.digestiveEffect === 'laxante');

  // Allergens & critical precautions in current plate
  const allergenItems = plate.filter((item) => item.food.isAllergen);
  const chokingHazardItems = plate.filter((item) => Boolean(item.food.chokingHazardWarning));

  // Available foods to add from picker
  const availableFoodsToAdd = FOOD_DATABASE.filter((f) => {
    const query = pickerSearch.toLowerCase().trim();
    if (!query) return true;
    return (
      f.name.toLowerCase().includes(query) ||
      f.groups.some((g) => g.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-4">
      {/* Plate Header Banner */}
      <div className={`${t.cardBg} rounded-3xl p-5 shadow-xs border ${t.borderBase} transition-colors`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${t.cardSubtleBg} ${t.accentText} border ${t.borderBase} flex items-center justify-center text-2xl shadow-xs`}>
              🍽️
            </div>
            <div>
              <h3 className={`font-extrabold ${t.textPrimary} text-lg sm:text-xl`}>
                Plato del Bebé
              </h3>
              <p className={`text-xs ${t.textMuted}`}>
                Calcula los gramos exactos y verifica aportes nutricionales
              </p>
            </div>
          </div>

          {plate.length > 0 && (
            <button
              onClick={onClearPlate}
              className={`${t.textMuted} hover:text-rose-500 p-2 rounded-xl ${t.cardSubtleBg} transition-colors flex items-center gap-1 text-xs font-semibold`}
              title="Vaciar plato"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Vaciar</span>
            </button>
          )}
        </div>

        {/* Total Grams Display */}
        <div className={`mt-4 p-4 rounded-2xl ${t.cardSubtleBg} border ${t.borderBase} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${t.textMuted}`}>
              Peso total de la porción
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className={`text-3xl font-black ${t.textPrimary}`}>{totalGrams}</span>
              <span className={`text-sm font-bold ${t.textMuted}`}>gramos (g)</span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${t.accentBadgeBg} ${t.accentBadgeText} border ${t.accentBadgeBorder}`}>
              {plate.length === 0
                ? 'Plato vacío'
                : totalGrams <= 50
                ? 'Porción inicial exploratoria (~30-50g)'
                : totalGrams <= 100
                ? 'Porción estándar bebé (~60-100g)'
                : 'Porción completa (~100-150g)'}
            </span>
            <p className={`text-[11px] ${t.textMuted} mt-1`}>
              Guíate por las señales de saciedad de tu bebé
            </p>
          </div>
        </div>
      </div>

      {/* Plate Items List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h4 className={`text-xs font-bold ${t.textMuted} uppercase tracking-wider`}>
            Ingredientes en el plato ({plate.length})
          </h4>
          <button
            onClick={() => setShowAddPicker(true)}
            className={`text-xs font-bold ${t.accentText} flex items-center gap-1 hover:underline`}
          >
            <Plus className="w-4 h-4" />
            <span>Agregar ingrediente</span>
          </button>
        </div>

        {plate.length === 0 ? (
          <div className={`${t.cardBg} rounded-3xl p-8 text-center border border-dashed ${t.borderBase}`}>
            <span className="text-4xl block mb-2">🥣</span>
            <h4 className={`font-bold ${t.textPrimary} text-base`}>Tu plato está vacío</h4>
            <p className={`text-xs ${t.textMuted} mt-1 max-w-sm mx-auto`}>
              Selecciona ingredientes de la guía (ej. 35g camote + 25g pollo) para calcular aportes nutricionales y alertas de corte.
            </p>
            <button
              onClick={() => setShowAddPicker(true)}
              className={`mt-4 px-5 py-2.5 ${t.accentBg} ${t.accentHover} active:scale-95 text-white rounded-2xl text-xs font-bold shadow-xs transition-all inline-flex items-center gap-2`}
            >
              <Plus className="w-4 h-4" />
              <span>Seleccionar alimentos</span>
            </button>
          </div>
        ) : (
          plate.map((item) => (
            <div
              key={item.food.id}
              className={`${t.cardBg} rounded-2xl p-3.5 border ${t.borderBase} shadow-xs flex items-center justify-between gap-3 transition-colors`}
            >
              <div
                className="flex items-center gap-3 cursor-pointer shrink-0"
                onClick={() => onOpenFoodDetail(item.food)}
              >
                <div className={`w-11 h-11 rounded-xl ${t.cardSubtleBg} border ${t.borderBase} flex items-center justify-center text-xl shrink-0`}>
                  {item.food.emoji}
                </div>
                <div>
                  <h4 className={`font-bold ${t.textPrimary} text-sm leading-tight hover:${t.accentText} transition-colors`}>
                    {item.food.name}
                  </h4>
                  <div className={`flex items-center gap-1.5 text-[11px] ${t.textMuted} mt-0.5`}>
                    <span>{item.food.groups.join(' · ')}</span>
                    {item.food.isAllergen && (
                      <span className="text-amber-700 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-950/80 px-1.5 rounded-md">⚠️ Alérgeno</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Gram Modifier Controls */}
              <div className="flex items-center gap-2">
                <div className={`flex items-center ${t.cardSubtleBg} rounded-xl p-0.5 border ${t.borderBase}`}>
                  <button
                    type="button"
                    onClick={() => onUpdateGrams(item.food.id, Math.max(1, item.grams - 5))}
                    className={`w-8 h-8 rounded-lg ${t.cardBg} shadow-xs font-bold ${t.textPrimary} hover:opacity-80 flex items-center justify-center active:scale-90 text-sm`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={item.grams}
                    onChange={(e) => onUpdateGrams(item.food.id, Math.max(1, parseInt(e.target.value) || 0))}
                    className={`w-12 text-center font-bold ${t.textPrimary} text-sm bg-transparent outline-hidden`}
                  />
                  <span className={`text-[10px] font-semibold ${t.textMuted} pr-1`}>g</span>
                  <button
                    type="button"
                    onClick={() => onUpdateGrams(item.food.id, item.grams + 5)}
                    className={`w-8 h-8 rounded-lg ${t.cardBg} shadow-xs font-bold ${t.textPrimary} hover:opacity-80 flex items-center justify-center active:scale-90 text-sm`}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveItem(item.food.id)}
                  className={`w-8 h-8 rounded-xl ${t.textMuted} hover:text-rose-500 hover:bg-rose-500/10 flex items-center justify-center transition-colors`}
                  title="Eliminar alimento"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Consolidated Nutritional Analysis Section */}
      {plate.length > 0 && (
        <div className={`${t.cardBg} rounded-3xl p-5 shadow-xs border ${t.borderBase} space-y-4 transition-colors`}>
          <div className={`flex items-center gap-2 border-b ${t.borderBase} pb-3`}>
            <Sparkles className={`w-5 h-5 ${t.accentText}`} />
            <h4 className={`font-extrabold ${t.textPrimary} text-base`}>
              Aportes Nutricionales Consolidados
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Brain Development */}
            <div
              className={`p-3.5 rounded-2xl border ${
                hasBrainFat
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : `${t.cardSubtleBg} ${t.borderBase} ${t.textMuted}`
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1">
                <span>🧠</span>
                <span className={hasBrainFat ? 'text-emerald-800' : t.textPrimary}>
                  Grasas para el Cerebro
                </span>
              </div>
              {hasBrainFat ? (
                <p className="leading-relaxed">
                  <strong>Excelente:</strong> Incluye {brainItems.map((i) => i.food.name).join(', ')}. Aporta lípidos esenciales para el desarrollo neuronal y mielinización.
                </p>
              ) : (
                <p className={`leading-relaxed ${t.textMuted}`}>
                  Tip: Añade aguacate o un chorrito de aceite de oliva en crudo para aportar ácidos grasos indispensables.
                </p>
              )}
            </div>

            {/* Iron Level */}
            <div
              className={`p-3.5 rounded-2xl border ${
                hasIron
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100'
                  : `${t.cardSubtleBg} ${t.borderBase} ${t.textMuted}`
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <span className={hasIron ? 'text-rose-700 dark:text-rose-300' : t.textPrimary}>
                  Aporte de Hierro
                </span>
              </div>
              {hasIron ? (
                <div className="space-y-1 leading-relaxed">
                  <p>
                    {highIronItems.length > 0 && (
                      <span className="font-bold text-rose-800 dark:text-rose-300">Alto ({highIronItems.map((i) => i.food.name).join(', ')}) </span>
                    )}
                    {mediumIronItems.length > 0 && (
                      <span className="font-semibold text-rose-700 dark:text-rose-400">Medio ({mediumIronItems.map((i) => i.food.name).join(', ')}) </span>
                    )}
                    {lowIronItems.length > 0 && (
                      <span className="text-rose-600 dark:text-rose-300">Bajo ({lowIronItems.map((i) => i.food.name).join(', ')})</span>
                    )}
                  </p>
                  {hasVitC && (
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                      ✨ Contiene vitamina C en el plato, facilitando la absorción del hierro vegetal.
                    </p>
                  )}
                </div>
              ) : (
                <p className={`leading-relaxed ${t.textMuted}`}>
                  Tip: A partir de los 6 meses las reservas de hierro se agotan. Añade res, pollo, lentejas o espinaca.
                </p>
              )}
            </div>

            {/* Digestive Balance */}
            <div className={`p-3.5 rounded-2xl ${t.cardSubtleBg} border ${t.borderBase} col-span-1 sm:col-span-2`}>
              <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${t.accentText} mb-1`}>
                <span>🌱</span>
                <span>Balance Digestivo</span>
              </div>
              <p className={`leading-relaxed text-xs ${t.textPrimary}`}>
                {astringentItems.length > 0 && laxativeItems.length > 0 ? (
                  <>
                    <strong className="text-emerald-700 dark:text-emerald-300">Plato balanceado:</strong> Combina alimentos con efecto astringente ({astringentItems.map((i) => i.food.name).join(', ')}) con fuentes laxantes suaves ({laxativeItems.map((i) => i.food.name).join(', ')}).
                  </>
                ) : astringentItems.length > 0 ? (
                  <>
                    <strong className="text-amber-700 dark:text-amber-300">Nota digestiva:</strong> Contiene {astringentItems.map((i) => i.food.name).join(', ')} que pueden estriñir. Si el bebé tiene heces duras, acompáñalo con papaya, avena o calabaza.
                  </>
                ) : laxativeItems.length > 0 ? (
                  <>
                    <strong className="text-emerald-700 dark:text-emerald-300">Favorece el tránsito:</strong> Contiene {laxativeItems.map((i) => i.food.name).join(', ')} que aportan fibra soluble y agua.
                  </>
                ) : (
                  'Ingredientes neutros y de fácil asimilación gástrica.'
                )}
              </p>
            </div>
          </div>

          {/* Highlighted Safety & Allergen Warnings */}
          {(allergenItems.length > 0 || chokingHazardItems.length > 0) && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-400/40 text-rose-950 dark:text-rose-100 space-y-2.5">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-black text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Advertencias de Seguridad y Alérgenos en este Plato</span>
              </div>

              {allergenItems.length > 0 && (
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-rose-800 dark:text-rose-300">
                    ⚠️ Alérgenos presentes: {allergenItems.map((i) => i.food.name).join(', ')}
                  </p>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    Si tu bebé no los ha probado antes por separado, recuerda la <strong>Regla de los 3 días</strong>: ofrecer de uno en uno en horario diurno (mañana o almuerzo) durante 2 a 3 días consecutivos para observar tolerancia.
                  </p>
                </div>
              )}

              {chokingHazardItems.length > 0 && (
                <div className="space-y-1 text-xs border-t border-rose-400/20 pt-2">
                  <p className="font-bold text-rose-800 dark:text-rose-300">✂️ Precauciones de corte y preparación segura:</p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] opacity-90">
                    {chokingHazardItems.map((item) => (
                      <li key={item.food.id}>
                        <strong>{item.food.name}:</strong> {item.food.chokingHazardWarning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Call to Action: Send Plate to Gemini Pediatric Chef */}
          <button
            type="button"
            onClick={() => onRequestAiRecipe(plate)}
            className={`w-full py-3.5 px-4 rounded-2xl ${t.accentBg} ${t.accentHover} active:scale-[0.99] text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all`}
          >
            <ChefHat className="w-5 h-5" />
            <span>Pedir al Asistente IA la Receta con estos {totalGrams}g</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}

      {/* Add Food Picker Modal */}
      {showAddPicker && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={() => setShowAddPicker(false)} />
          <div className={`relative w-full sm:max-w-md ${t.cardBg} ${t.textPrimary} rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl z-10 overflow-hidden border ${t.borderBase}`}>
            {/* Grab bar */}
            <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-600 rounded-full mx-auto mt-3 sm:hidden" />

            <div className={`p-4 border-b ${t.borderBase} flex items-center justify-between`}>
              <h3 className="font-bold text-base">Añadir al Plato</h3>
              <button
                onClick={() => setShowAddPicker(false)}
                className={`text-xs font-semibold px-2 py-1 ${t.textMuted} hover:${t.textPrimary}`}
              >
                Cerrar
              </button>
            </div>

            <div className={`p-3 border-b ${t.borderBase} ${t.cardSubtleBg}`}>
              <div className="relative">
                <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${t.textMuted}`} />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Buscar ingrediente (ej. camote, pollo)..."
                  className={`w-full ${t.cardBg} border ${t.borderBase} rounded-xl pl-9 pr-3 py-2 text-xs ${t.textPrimary} outline-hidden ${t.ringFocus}`}
                />
              </div>
            </div>

            <div className="p-3 overflow-y-auto max-h-[55vh] space-y-1.5">
              {availableFoodsToAdd.map((food) => {
                const inPlate = plate.some((p) => p.food.id === food.id);
                return (
                  <div
                    key={food.id}
                    onClick={() => {
                      if (!inPlate) {
                        onAddFood(food, food.defaultServingGrams);
                      }
                    }}
                    className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                      inPlate
                        ? `${t.accentBadgeBg} ${t.accentBadgeText} border ${t.accentBadgeBorder}`
                        : `${t.cardSubtleBg} border ${t.borderBase} hover:opacity-90`
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{food.emoji}</span>
                      <div>
                        <p className="font-bold text-xs">{food.name}</p>
                        <p className={`text-[10px] ${t.textMuted}`}>
                          {food.groups.join(' · ')} · {food.fromAge}
                        </p>
                      </div>
                    </div>

                    {inPlate ? (
                      <span className={`text-xs font-bold flex items-center gap-1 ${t.accentText}`}>
                        <CheckCircle2 className="w-4 h-4" /> En plato
                      </span>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${t.accentBg} text-white shadow-xs`}>
                        +{food.defaultServingGrams}g
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
