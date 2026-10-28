import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FoodCatalog } from './components/FoodCatalog';
import { PortionCalculator, PlateItem } from './components/PortionCalculator';
import { SafetySection } from './components/SafetySection';
import { ChatAssistant } from './components/ChatAssistant';
import { FoodDetailModal } from './components/FoodDetailModal';
import { FoodItem, FOOD_DATABASE } from './data/foodData';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function FoodGuideApp() {
  const { t } = useTheme();
  const [activeTab, setActiveTab] = useState<'catalog' | 'calculator' | 'safety' | 'chat'>('catalog');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [prefilledPrompt, setPrefilledPrompt] = useState<string | undefined>(undefined);

  // Initialize plate with a starter sample (Camote + Pollo) from localStorage or default
  const [plate, setPlate] = useState<PlateItem[]>(() => {
    try {
      const saved = localStorage.getItem('foodguide_plate');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Re-hydrate with current food item definitions to guarantee unified structure
          const hydrated: PlateItem[] = [];
          parsed.forEach((p: any) => {
            const currentItem = FOOD_DATABASE.find(
              (f) => f.id === p.food?.id || (p.food?.id === 'camote_cereal' && f.id === 'camote') || (p.food?.id === 'aguacate_grasa' && f.id === 'aguacate')
            );
            if (currentItem) {
              hydrated.push({ food: currentItem, grams: p.grams || currentItem.defaultServingGrams });
            }
          });
          if (hydrated.length > 0) return hydrated;
        }
      }
    } catch (e) {
      console.warn('Could not read saved plate', e);
    }

    // Default starter example: 35g camote + 25g pollo
    const camote = FOOD_DATABASE.find((f) => f.id === 'camote');
    const pollo = FOOD_DATABASE.find((f) => f.id === 'pollo');
    const items: PlateItem[] = [];
    if (camote) items.push({ food: camote, grams: 35 });
    if (pollo) items.push({ food: pollo, grams: 25 });
    return items;
  });

  // Save plate changes
  useEffect(() => {
    try {
      localStorage.setItem('foodguide_plate', JSON.stringify(plate));
    } catch (e) {
      console.warn('Could not save plate to localStorage', e);
    }
  }, [plate]);

  const plateItemIds = new Set(plate.map((p) => p.food.id));

  // Plate actions
  const handleAddToPlate = (food: FoodItem, grams: number) => {
    setPlate((prev) => {
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id ? { ...item, grams: item.grams + grams } : item
        );
      }
      return [...prev, { food, grams }];
    });
  };

  const handleUpdateGrams = (foodId: string, grams: number) => {
    setPlate((prev) =>
      prev.map((item) => (item.food.id === foodId ? { ...item, grams } : item))
    );
  };

  const handleRemoveFromPlate = (foodId: string) => {
    setPlate((prev) => prev.filter((item) => item.food.id !== foodId));
  };

  const handleClearPlate = () => {
    setPlate([]);
  };

  // Recipe requests from calculator or modal
  const handleRequestAiRecipe = (currentPlateItems: PlateItem[]) => {
    const listSummary = currentPlateItems
      .map((item) => `${item.grams}g de ${item.food.name}`)
      .join(' y ');
    const prompt = `Dame una receta pediátrica detallada paso a paso combinando exactamente ${listSummary} respetando la guía oficial de alimentación complementaria. Incluye versión en puré, versión en BLW (cortes seguros) y consejos de textura.`;
    setPrefilledPrompt(prompt);
    setActiveTab('chat');
  };

  const handleAskRecipeWithFood = (food: FoodItem, grams: number) => {
    const prompt = `¿Cómo preparar y ofrecer de forma segura ${grams}g de ${food.name} a un bebé de ${food.fromAge}? Dame la receta tanto para puré como para corte BLW.`;
    setPrefilledPrompt(prompt);
    setActiveTab('chat');
  };

  return (
    <div className={`min-h-screen flex flex-col ${t.appBg} transition-colors duration-200`}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        plateCount={plate.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 pt-3 sm:pt-6 pb-24 md:pb-10">
        {/* Tab 1: Alimentos & Buscador */}
        {activeTab === 'catalog' && (
          <FoodCatalog
            onSelectFood={(food) => setSelectedFood(food)}
            onQuickAddToPlate={handleAddToPlate}
            plateItemIds={plateItemIds}
          />
        )}

        {/* Tab 2: Calculadora de Porciones */}
        {activeTab === 'calculator' && (
          <PortionCalculator
            plate={plate}
            onUpdateGrams={handleUpdateGrams}
            onRemoveItem={handleRemoveFromPlate}
            onClearPlate={handleClearPlate}
            onAddFood={handleAddToPlate}
            onRequestAiRecipe={handleRequestAiRecipe}
            onOpenFoodDetail={(food) => setSelectedFood(food)}
          />
        )}

        {/* Tab 3: Seguridad y Prohibidos */}
        {activeTab === 'safety' && <SafetySection />}

        {/* Tab 4: Chat Asistente Pediátrico con IA */}
        {activeTab === 'chat' && (
          <ChatAssistant
            currentPlate={plate}
            prefilledPrompt={prefilledPrompt}
            onClearPrefilledPrompt={() => setPrefilledPrompt(undefined)}
          />
        )}
      </main>

      {/* Food Detail Modal */}
      {selectedFood && (
        <FoodDetailModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
          onAddToPlate={handleAddToPlate}
          onAskRecipeWithFood={handleAskRecipeWithFood}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <FoodGuideApp />
    </ThemeProvider>
  );
}
