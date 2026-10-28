import React, { useState, useMemo } from 'react';
import {
  FOOD_DATABASE,
  FoodGroup,
  AgeFrom,
  IronLevel,
  DigestiveType,
  FoodItem,
} from '../data/foodData';
import { useTheme } from '../context/ThemeContext';
import { Search, X, Filter, Sparkles, Check, Plus } from 'lucide-react';

interface FoodCatalogProps {
  onSelectFood: (food: FoodItem) => void;
  onQuickAddToPlate: (food: FoodItem, grams: number) => void;
  plateItemIds: Set<string>;
}

const GROUPS: Array<FoodGroup | 'Todos'> = [
  'Todos',
  'Verduras',
  'Frutas',
  'Proteínas',
  'Cereales',
  'Grasas Saludables',
  'Hierbas y Especias',
];

const AGES: Array<AgeFrom | 'Todas'> = ['Todas', '6 meses', '8 meses', '12 meses'];
const IRON_LEVELS: Array<IronLevel | 'Todos'> = ['Todos', 'Alto', 'Medio', 'Bajo'];

const DIGESTIVE_OPTIONS: Array<{ value: DigestiveType | 'Todos'; label: string; emoji: string }> = [
  { value: 'Todos', label: 'Todos', emoji: '🌱' },
  { value: 'laxante', label: 'Laxante (Estreñimiento)', emoji: '💩' },
  { value: 'estriñe', label: 'Astringente (Estriñe)', emoji: '🥔' },
  { value: 'digestivo', label: 'Digestivo / Gases', emoji: '🌿' },
  { value: 'neutro', label: 'Neutro / Liviano', emoji: '✨' },
];

export const FoodCatalog: React.FC<FoodCatalogProps> = ({
  onSelectFood,
  onQuickAddToPlate,
  plateItemIds,
}) => {
  const { t } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<FoodGroup | 'Todos'>('Todos');
  const [selectedAge, setSelectedAge] = useState<AgeFrom | 'Todas'>('Todas');
  const [selectedIron, setSelectedIron] = useState<IronLevel | 'Todos'>('Todos');
  const [selectedDigestive, setSelectedDigestive] = useState<DigestiveType | 'Todos'>('Todos');
  const [onlyAllergens, setOnlyAllergens] = useState(false);
  const [onlyBrain, setOnlyBrain] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter foods (using unified multi-group and digestiveType match)
  const filteredFoods = useMemo(() => {
    return FOOD_DATABASE.filter((food) => {
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = food.name.toLowerCase().includes(query);
        const matchesGroups = food.groups.some((g) => g.toLowerCase().includes(query));
        const matchesCut = food.blwCut.toLowerCase().includes(query);
        const matchesNotes = food.notes.toLowerCase().includes(query);
        if (!matchesName && !matchesGroups && !matchesCut && !matchesNotes) {
          return false;
        }
      }

      // Group
      if (selectedGroup !== 'Todos' && !food.groups.includes(selectedGroup)) {
        return false;
      }

      // Age
      if (selectedAge !== 'Todas' && food.fromAge !== selectedAge) {
        return false;
      }

      // Iron
      if (selectedIron !== 'Todos' && food.ironLevel !== selectedIron) {
        return false;
      }

      // Digestive Type Filter
      if (selectedDigestive !== 'Todos') {
        const foodDigestive = food.digestiveEffect || 'neutro';
        if (foodDigestive !== selectedDigestive) {
          return false;
        }
      }

      // Allergens
      if (onlyAllergens && !food.isAllergen) {
        return false;
      }

      // Brain essential
      if (onlyBrain && !food.isBrainEssential) {
        return false;
      }

      return true;
    });
  }, [
    searchTerm,
    selectedGroup,
    selectedAge,
    selectedIron,
    selectedDigestive,
    onlyAllergens,
    onlyBrain,
  ]);

  const activeFiltersCount =
    (selectedGroup !== 'Todos' ? 1 : 0) +
    (selectedAge !== 'Todas' ? 1 : 0) +
    (selectedIron !== 'Todos' ? 1 : 0) +
    (selectedDigestive !== 'Todos' ? 1 : 0) +
    (onlyAllergens ? 1 : 0) +
    (onlyBrain ? 1 : 0);

  const resetFilters = () => {
    setSelectedGroup('Todos');
    setSelectedAge('Todas');
    setSelectedIron('Todos');
    setSelectedDigestive('Todos');
    setOnlyAllergens(false);
    setOnlyBrain(false);
    setSearchTerm('');
  };

  return (
    <div className="space-y-4">
      {/* Search Header Banner */}
      <div className={`${t.cardBg} rounded-3xl p-4 sm:p-5 shadow-xs border ${t.borderBase} transition-colors`}>
        {/* Search Input */}
        <div className="relative">
          <Search className={`w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} pointer-events-none`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por alimento (ej. camote, aguacate, avena, lentejas)..."
            className={`w-full ${t.inputBg} border ${t.borderBase} ${t.ringFocus} rounded-2xl pl-11 pr-10 py-3 text-sm ${t.textPrimary} placeholder:text-stone-400 outline-hidden transition-all shadow-inner`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${t.textMuted} hover:${t.textPrimary} rounded-full`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Group Selector - Horizontal scroll chips */}
        <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1">
          {GROUPS.map((grp) => {
            const isSelected = selectedGroup === grp;
            return (
              <button
                key={grp}
                onClick={() => setSelectedGroup(grp)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shrink-0 active:scale-95 ${
                  isSelected
                    ? `${t.accentBg} text-white shadow-xs`
                    : `${t.cardSubtleBg} ${t.textSecondary} border ${t.borderSubtle} hover:opacity-85`
                }`}
              >
                {grp}
              </button>
            );
          })}
        </div>

        {/* Digestive Filter Quick Chips Bar */}
        <div className="mt-3 pt-3 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className={`text-[11px] font-bold uppercase tracking-wider ${t.textMuted} shrink-0 mr-1`}>
            Digestión:
          </span>
          {DIGESTIVE_OPTIONS.map((opt) => {
            const isSelected = selectedDigestive === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSelectedDigestive(opt.value)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all active:scale-95 border flex items-center gap-1 ${
                  isSelected
                    ? `${t.accentBadgeBg} ${t.accentBadgeText} ${t.accentBadgeBorder} ring-1 ring-emerald-500/30 font-bold`
                    : `${t.cardSubtleBg} ${t.textSecondary} ${t.borderBase} hover:opacity-90`
                }`}
              >
                <span>{opt.emoji}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Toggle Row */}
        <div className={`mt-3 pt-3 border-t ${t.borderBase} flex items-center justify-between text-xs`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                showAdvancedFilters || activeFiltersCount > 0
                  ? `${t.accentBadgeBg} ${t.accentBadgeText} ${t.accentBadgeBorder}`
                  : `${t.cardSubtleBg} ${t.textSecondary} ${t.borderBase}`
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {/* Quick Chips */}
            <button
              onClick={() => setOnlyBrain(!onlyBrain)}
              className={`px-3 py-1.5 rounded-xl font-semibold border transition-colors flex items-center gap-1 ${
                onlyBrain
                  ? `${t.accentBg} text-white border-transparent`
                  : `${t.cardSubtleBg} ${t.textSecondary} ${t.borderBase} hover:opacity-90`
              }`}
            >
              <span>🧠 Cerebro</span>
            </button>

            <button
              onClick={() => setOnlyAllergens(!onlyAllergens)}
              className={`px-3 py-1.5 rounded-xl font-semibold border transition-colors flex items-center gap-1 ${
                onlyAllergens
                  ? 'bg-amber-600 text-white border-transparent'
                  : `${t.cardSubtleBg} ${t.textSecondary} ${t.borderBase} hover:opacity-90`
              }`}
            >
              <span>⚠️ Alérgenos</span>
            </button>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className={`${t.textMuted} hover:${t.textPrimary} font-medium underline`}
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {showAdvancedFilters && (
          <div className={`mt-3.5 p-3.5 ${t.cardSubtleBg} rounded-2xl border ${t.borderBase} space-y-3 animate-fade-in text-xs`}>
            {/* Age Filter */}
            <div>
              <p className={`font-bold ${t.textPrimary} mb-1.5`}>Edad de inicio:</p>
              <div className="flex flex-wrap gap-1.5">
                {AGES.map((age) => (
                  <button
                    key={age}
                    onClick={() => setSelectedAge(age)}
                    className={`px-2.5 py-1.5 rounded-xl font-semibold border ${
                      selectedAge === age
                        ? `${t.accentBg} text-white border-transparent`
                        : `${t.cardBg} ${t.textPrimary} ${t.borderBase}`
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            {/* Iron Filter */}
            <div>
              <p className={`font-bold ${t.textPrimary} mb-1.5`}>Nivel de Hierro:</p>
              <div className="flex flex-wrap gap-1.5">
                {IRON_LEVELS.map((iron) => (
                  <button
                    key={iron}
                    onClick={() => setSelectedIron(iron)}
                    className={`px-2.5 py-1.5 rounded-xl font-semibold border ${
                      selectedIron === iron
                        ? 'bg-rose-600 text-white border-transparent'
                        : `${t.cardBg} ${t.textPrimary} ${t.borderBase}`
                    }`}
                  >
                    {iron}
                  </button>
                ))}
              </div>
            </div>

            {/* Digestive Type Details in drawer */}
            <div>
              <p className={`font-bold ${t.textPrimary} mb-1.5`}>Efecto Digestivo:</p>
              <div className="flex flex-wrap gap-1.5">
                {DIGESTIVE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedDigestive(opt.value)}
                    className={`px-2.5 py-1.5 rounded-xl font-semibold border flex items-center gap-1 ${
                      selectedDigestive === opt.value
                        ? `${t.accentBg} text-white border-transparent`
                        : `${t.cardBg} ${t.textPrimary} ${t.borderBase}`
                    }`}
                  >
                    <span>{opt.emoji}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Catalog Results Header */}
      <div className="flex items-center justify-between px-1">
        <p className={`text-xs font-bold ${t.textMuted} uppercase tracking-wider`}>
          {filteredFoods.length} {filteredFoods.length === 1 ? 'alimento único' : 'alimentos únicos'}
        </p>
        <span className={`text-[11px] ${t.textMuted}`}>Toca una tarjeta para detalles y porciones</span>
      </div>

      {/* Foods Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredFoods.map((food) => {
          const isAdded = plateItemIds.has(food.id);

          return (
            <div
              key={food.id}
              onClick={() => onSelectFood(food)}
              className={`${t.cardBg} rounded-3xl p-4 border ${t.borderBase} shadow-xs hover:shadow-md hover:${t.borderBase} transition-all cursor-pointer relative flex flex-col justify-between group`}
            >
              <div>
                {/* Top Row: Emoji, Name, Age Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${t.cardSubtleBg} border ${t.borderBase} flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform`}>
                      {food.emoji}
                    </div>
                    <div>
                      <h4 className={`font-bold ${t.textPrimary} text-base leading-tight group-hover:${t.accentText} transition-colors`}>
                        {food.name}
                      </h4>
                      {/* Display all assigned groups for unified foods */}
                      <p className={`text-xs ${t.textMuted} font-medium`}>
                        {food.groups.join(' · ')}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.accentBadgeBg} ${t.accentBadgeText} border ${t.accentBadgeBorder} shrink-0`}>
                    {food.fromAge}
                  </span>
                </div>

                {/* Tags Row */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  {food.ironLevel !== 'N/A' && (
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
                        food.ironLevel === 'Alto'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                          : food.ironLevel === 'Medio'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
                          : `${t.cardSubtleBg} ${t.textMuted}`
                      }`}
                    >
                      🩸 Hierro {food.ironLevel}
                    </span>
                  )}

                  {food.digestiveEffect && food.digestiveEffect !== 'neutro' && (
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
                        food.digestiveEffect === 'laxante'
                          ? 'bg-teal-100 text-teal-900 dark:bg-teal-950/90 dark:text-teal-200 border border-teal-300 dark:border-teal-800'
                          : food.digestiveEffect === 'estriñe'
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/90 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                          : `${t.accentBadgeBg} ${t.accentBadgeText} border ${t.accentBadgeBorder}`
                      }`}
                    >
                      {food.digestiveEffect === 'laxante'
                        ? '💩 Laxante'
                        : food.digestiveEffect === 'estriñe'
                        ? '🥔 Estriñe'
                        : '🌿 Digestivo'}
                    </span>
                  )}

                  {food.isBrainEssential && (
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${t.accentBadgeBg} ${t.accentBadgeText} border ${t.accentBadgeBorder} flex items-center gap-1`}>
                      🧠 Cerebro
                    </span>
                  )}

                  {food.isAllergen && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/90 dark:text-amber-200 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                      ⚠️ Alérgeno
                    </span>
                  )}

                  {food.chokingHazardWarning && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-800 dark:bg-rose-950/70 dark:text-rose-200 border border-rose-200 dark:border-rose-900 flex items-center gap-1">
                      ✂️ Corte crítico
                    </span>
                  )}
                </div>

                {/* BLW / Puree Preview */}
                <div className={`mt-3 p-2.5 ${t.cardSubtleBg} rounded-2xl border ${t.borderSubtle} space-y-1 text-xs`}>
                  <p className={`${t.textPrimary} line-clamp-1`}>
                    <strong className="font-semibold text-orange-600 dark:text-orange-400">BLW:</strong> {food.blwCut}
                  </p>
                  <p className={`${t.textMuted} line-clamp-1`}>
                    <strong className="font-semibold text-emerald-600 dark:text-emerald-400">Puré:</strong> {food.pureeForm}
                  </p>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className={`mt-3 pt-2.5 border-t ${t.borderBase} flex items-center justify-between`}>
                <span className={`text-[11px] font-medium ${t.textMuted}`}>
                  Sugerido: <strong className={t.textPrimary}>{food.defaultServingGrams}g</strong>
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAddToPlate(food, food.defaultServingGrams);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                    isAdded
                      ? `${t.accentBadgeBg} ${t.accentBadgeText} border ${t.accentBadgeBorder}`
                      : `${t.cardSubtleBg} ${t.accentText} border ${t.borderBase} hover:${t.accentBg} hover:text-white`
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>En Plato</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFoods.length === 0 && (
        <div className={`text-center py-12 ${t.cardBg} rounded-3xl p-6 border ${t.borderBase}`}>
          <p className="text-3xl mb-2">🔍</p>
          <h4 className={`font-bold ${t.textPrimary} text-base`}>No encontramos alimentos con estos filtros</h4>
          <p className={`text-xs ${t.textMuted} mt-1 max-w-xs mx-auto`}>
            Prueba ajustando la búsqueda o quitando filtros de digestión para ver más opciones de la guía.
          </p>
          <button
            onClick={resetFilters}
            className={`mt-4 px-4 py-2 ${t.accentBg} ${t.accentHover} text-white rounded-2xl text-xs font-bold transition-colors`}
          >
            Ver todos los alimentos
          </button>
        </div>
      )}
    </div>
  );
};
