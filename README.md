# 🥑 FoodGuide - Nutrición Infantil (BLW y Purés)

Aplicación web interactiva optimizada para teléfonos móviles (Mobile-First) y compatible con **GitHub Pages** y **Google Sites**, basada en la Guía Oficial de Alimentación Complementaria.

---

## 🚀 Publicación en GitHub Pages

La aplicación está 100% lista para publicarse en **GitHub Pages** gracias a la configuración de rutas relativas (`base: './'`) en Vite y al motor de recetas pediátrico autónomo que no depende de servidores externos.

### Opción 1: Despliegue Automático con GitHub Actions (Recomendado)

1. Sube tu código a un repositorio en GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial FoodGuide release"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
   git push -u origin main
   ```
2. En GitHub, ve a **Settings** > **Pages**.
3. En la sección **Build and deployment** > **Source**, selecciona **GitHub Actions**.
4. ¡Listo! El flujo de trabajo `.github/workflows/deploy.yml` compilará la app con Vite y publicará tu sitio automáticamente en `https://TU-USUARIO.github.io/TU-REPOSITORIO/`.

---

### Opción 2: Despliegue Manual con rama `gh-pages`

1. Compila el proyecto en tu computadora:
   ```bash
   npm run build
   ```
2. Sube el contenido de la carpeta `dist/` a la rama `gh-pages` de tu repositorio de GitHub.

---

## 🌟 Características de FoodGuide

- 📱 **Mobile-First & Touch-Friendly**: Diseñado ergonómicamente para usarse con una sola mano y el pulgar.
- 🎨 **Paletas Pasteles y Modo Oscuro**: Alterna entre Verde Menta (por defecto), Durazno Cálido, Azul Cielo y Lavanda, con modo nocturno para cuidar la vista en tomas nocturnas.
- 🥦 **Buscador y Filtros**: Por grupo, edad (6m, 8m, 12m), nivel de hierro, alérgenos y tipo digestivo (laxante, astringente, digestivo).
- 🍽️ **Calculadora de Gramos**: Ajusta porciones en gramos exactos y obtén aportes nutricionales y alertas de corte en tiempo real.
- 🛡️ **Reglas de Seguridad y Alimentos Prohibidos**: Miel (botulismo), sal, azúcar, uvas en 4, etc.
- 👩‍🍳 **Chef Pediátrico Integrado**: Generador de recetas seguras en gramos tanto para puré como para BLW.
