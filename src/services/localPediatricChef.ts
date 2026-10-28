import { FOOD_DATABASE, FoodItem, PROHIBITED_FOODS_UNDER_12_MONTHS } from '../data/foodData';
import { PlateItem } from '../components/PortionCalculator';

/**
 * Intelligent Client-Side Pediatric Chef & Nutrition Engine.
 * Ensures the app works 100% offline and standalone when published to GitHub Pages
 * without requiring an external backend server.
 */
export function generateLocalPediatricResponse(
  userPrompt: string,
  currentPlate: PlateItem[]
): string {
  const query = userPrompt.toLowerCase().trim();

  // 1. Prohibited foods detection
  const prohibitedMatch = PROHIBITED_FOODS_UNDER_12_MONTHS.find(
    (p) => query.includes(p.name.toLowerCase()) || (p.id === 'miel' && query.includes('miel')) || (p.id === 'sal' && (query.includes('sal') || query.includes('sodio'))) || (p.id === 'azucar' && query.includes('azúcar') || query.includes('azucar'))
  );

  if (prohibitedMatch) {
    return `### ❌ Alerta de Seguridad Pediátrica: ${prohibitedMatch.name}

> **Estrictamente Prohibido antes de los 12 meses.**

* **Motivo Médico:** ${prohibitedMatch.reason}
* **Peligro Biológico:** ${prohibitedMatch.danger}

*Recomendación de FoodGuide:* Para sazonar o dar sabor a los purés y guisos de tu bebé, utiliza hierbas naturales seguras a partir de los 6 meses como **cilantro, comino, ajo cocido, cúrcuma, laurel o albahaca (8m)**, ¡siempre sin pizca de sal ni azúcar añadida!`;
  }

  // 2. Choking / Safe cut specific inquiries
  if (query.includes('uva') || query.includes('uvas')) {
    return `### 🍇 Corte Seguro de Uvas (6+ Meses)

> **⚠️ RIESGO ELEVADO DE ATRAGANTAMIENTO**

* **Regla de Oro:** NUNCA ofrecer uvas enteras ni en rodajas circulares (su diámetro coincide exactamente con el de la tráquea infantil).
* **Corte BLW Correcto:**
  1. Lavar muy bien y retirar las semillas interiores.
  2. Cortar longitudinalmente (a lo largo) por la mitad.
  3. Cortar cada mitad nuevamente a lo largo, formando **4 partes alargadas (bastones)**.
* **Textura:** Ofrecer uvas maduras y blandas.`;
  }

  if (query.includes('arandano') || query.includes('arándano') || query.includes('blueberry') || query.includes('blueberries')) {
    return `### 🫐 Corte Seguro de Arándanos / Blueberries (6+ Meses)

> **⚠️ NUNCA OFRECER ENTEROS**

* **Peligro:** Por su forma redonda y piel firme, los arándanos enteros pueden ser aspirados a las vías respiratorias.
* **Forma Segura BLW:** Partir siempre en **4 partes a lo largo**, o aplastarlos entre dos dedos hasta romper la esfera por completo antes de colocarlos frente al bebé.
* **En Puré:** Aplastados con tenedor o triturados con yogur natural sin azúcar.`;
  }

  if (query.includes('manzana') || query.includes('zanahoria')) {
    return `### 🍎🥕 Manzana y Zanahoria: Regla de Cocción

> **⚠️ NUNCA OFRECER CRUDAS ANTES DEL AÑO**

* **Riesgo:** Son alimentos duros y crujientes que no se deshacen con la saliva y encías, siendo una de las causas más frecuentes de asfixia.
* **Preparación Segura:**
  * **Al vapor o hervidas:** Cocinar hasta que al presionar con la yema del pulgar y el índice se aplasten con facilidad ("Test de los dedos").
  * **Corte BLW:** Bastones largos del grosor del dedo meñique de un adulto para que el bebé los sostenga con su puño cerrado.
  * **En Puré:** Compota suave cocida sin azúcar.`;
  }

  if (query.includes('cacahuate') || query.includes('mani') || query.includes('almendra')) {
    return `### 🥜 Protocolo de Seguridad para Frutos Secos

> **⚠️ NUNCA OFRECER ENTEROS NI EN CUCHARADA DENSA**

1. **Frutos secos enteros:** Prohibidos hasta los 4-5 años por riesgo de asfixia mecánica.
2. **Cremas (cacahuate / almendra 100% puras):**
   * **Prohibido dar en cuchara directa:** Su textura pegajosa se adhiere al paladar y puede obstruir la garganta.
   * **Forma correcta:** Disolver completamente una cucharadita (3-5g) dentro de puré tibio, leche materna o papilla suave de avena.
   * **Regla de los 3 días:** Ofrecer en horario diurno (mañana) durante 2 a 3 días consecutivos para vigilar tolerancia.`;
  }

  if (query.includes('estreñimiento') || query.includes('estrenimiento') || query.includes('laxante')) {
    return `### 💩 Alivio Digestivo y Estreñimiento Infantil

Si tu bebé presenta heces duras o dificultad para evacuar, la guía recomienda balancear con ingredientes de **efecto laxante natural**:

* **Frutas Recomendadas:**
  * **Papaya:** En cubos blandos o puré con tenedor (rica en fibra y agua).
  * **Mango:** Tiras maduras suaves o pulpa.
  * **Pera muy madura:** Jugosa y laxante.
* **Verduras:**
  * **Calabaza:** Al vapor en tiras o puré suave.
* **Cereales y Grasas:**
  * **Avena:** Papilla suave hidratada.
  * **Aceite de oliva virgen:** Añadir un chorrito (3-5 ml) en crudo sobre el puré tibio antes de servir.
* **Hidratación:** Asegurar tomas de agua simple en vaso abierto (aprox. 2-4 oz al día). Evitar temporalmente astringentes como arroz, papa y manzana cocida.`;
  }

  // 3. Extract foods mentioned in the prompt or current active plate
  let ingredientsToCook: Array<{ food: FoodItem; grams: number }> = [];

  // Match from active plate if available
  if (currentPlate.length > 0) {
    ingredientsToCook = [...currentPlate];
  } else {
    // Detect foods mentioned in user text
    FOOD_DATABASE.forEach((food) => {
      if (query.includes(food.name.toLowerCase())) {
        // Try to parse grams from text (e.g. "30g camote")
        const regex = new RegExp(`(\\d+)\\s*g(?:ramos)?\\s*(?:de\\s*)?${food.name.toLowerCase()}`, 'i');
        const match = userPrompt.match(regex);
        const grams = match ? parseInt(match[1]) : food.defaultServingGrams;
        ingredientsToCook.push({ food, grams });
      }
    });
  }

  // If no ingredients detected, provide a welcoming guidance recipe (Camote + Pollo)
  if (ingredientsToCook.length === 0) {
    const camote = FOOD_DATABASE.find((f) => f.id === 'camote')!;
    const pollo = FOOD_DATABASE.find((f) => f.id === 'pollo')!;
    ingredientsToCook = [
      { food: camote, grams: 35 },
      { food: pollo, grams: 25 },
    ];
  }

  // Calculate totals and nutritional badges
  const totalGrams = ingredientsToCook.reduce((sum, item) => sum + item.grams, 0);
  const ingredientNames = ingredientsToCook.map((i) => `${i.grams}g de ${i.food.name}`).join(' + ');

  const hasAllergen = ingredientsToCook.some((i) => i.food.isAllergen);
  const allergenList = ingredientsToCook.filter((i) => i.food.isAllergen).map((i) => i.food.name);

  const hasBrainFat = ingredientsToCook.some(
    (i) => i.food.isBrainEssential || i.food.groups.includes('Grasas Saludables')
  );

  const highIron = ingredientsToCook.filter((i) => i.food.ironLevel === 'Alto');
  const mediumIron = ingredientsToCook.filter((i) => i.food.ironLevel === 'Medio');

  return `### 🥣 Receta Pediátrica: Dúo Nutritivo (${totalGrams}g)
**Ingredientes calculados:** ${ingredientNames}

---

#### 🥄 Opción 1: Preparación en Puré Suave (Cuchara / Precuchara)
1. **Cocción al vapor:** Coloca los ingredientes en una vaporera con agua hirviendo. Cocina hasta que estén tiernos (el camote o verdura debe ceder al tacto sin resistencia, aprox. 12-15 min; el pollo o carne debe estar 100% cocido, sin partes rosadas).
2. **Texturizado seguro:** 
${ingredientsToCook.map((i) => `   * **${i.food.name} (${i.grams}g):** ${i.food.pureeForm}`).join('\n')}
3. **Integración:** Mezcla suavemente agregando 1-2 cucharaditas del agua de cocción al vapor o leche materna/fórmula para lograr una consistencia sedosa y homogénea.
4. **Temperatura:** Prueba en el dorso de tu muñeca antes de ofrecer. Debe estar tibio al tacto.

---

#### 🖐️ Opción 2: Presentación BLW (Autorregulación y Agarre)
${ingredientsToCook.map((i) => `* **${i.food.name} (${i.grams}g):** ${i.food.blwCut}`).join('\n')}
* **Postura:** Bebé sentado a 90° en su trona con los pies firmemente apoyados. Nunca dejar al bebé solo comiendo.

---

#### 🔍 Test de Seguridad (Finger Squish Test)
* Presiona cada trozo entre las yemas de tu dedo pulgar e índice. Si se deshace con la misma presión que usarías para aplastar una fruta madura, tiene la consistencia perfecta para ser gestionada con las encías de tu bebé.

---

#### 🌟 Aportes Nutricionales de este Plato:
${hasBrainFat ? '* 🧠 **Desarrollo Cerebral:** Contiene grasas saludables esenciales para la mielinización neuronal.' : ''}
${highIron.length > 0 ? `* 🩸 **Alto en Hierro:** Aporta hierro clave (${highIron.map((i) => i.food.name).join(', ')}) fundamental para prevenir la anemia a partir de los 6 meses.` : mediumIron.length > 0 ? `* 🩸 **Fuente de Hierro:** Aporta hierro biodisponible (${mediumIron.map((i) => i.food.name).join(', ')}).` : ''}
* ⚡ **Energía y Digestión:** Combinación suave, sin sal añadida, sin caldos comerciales y respetuosa con sus riñones inmaduros.

${hasAllergen ? `> ⚠️ **Atención Alérgeno (${allergenList.join(', ')}):** Si es la primera vez que tu bebé prueba este ingrediente, ofrécelo solo durante 2-3 días consecutivos en el desayuno o almuerzo para vigilar cualquier reacción (Regla de los 3 días).` : ''}`;
}
