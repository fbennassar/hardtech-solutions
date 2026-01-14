# Contexto del Proyecto: E-commerce de Hardware y Taller de Reparación

## Tech Stack
- **Framework:** SvelteKit (Node.js adapter).
- **Lenguaje:** TypeScript.
- **UI Framework:** Tailwind CSS.
- **Component Library:** DaisyUI.
- **Iconos:** Lucide-svelte o Heroicons.

## Reglas de Diseño (DaisyUI)
- Utiliza componentes semánticos de DaisyUI (`btn`, `card`, `hero`, `input`, `steps`).
- **Tema:** Soporte para light/dark mode (usando clases de Tailwind standard).
- **Estilo:** Limpio, moderno, enfocado en "Gaming" y "Tecnología".
- No uses CSS personalizado si Tailwind puede resolverlo.

## Estructura del Negocio
1. **Tienda (Ecommerce):** Venta de componentes de PC (GPU, CPU, RAM).
2. **Taller (Servicio):** El punto diferenciador. Los usuarios pueden rastrear el estado de su reparación.

## Reglas de Código Svelte
- Usa la sintaxis estándar de Svelte.
- Usa `<script>` para lógica y `<style>` solo si es estrictamente necesario.
- Evita jQuery o manipulación directa del DOM; usa el estado reactivo de Svelte.
- Las imágenes deben ser placeholders de `https://placehold.co/` por ahora.

## Ubicación del Archivo Objetivo
Estamos trabajando en `src/routes/(public)/+page.svelte` (La Landing Page Pública).