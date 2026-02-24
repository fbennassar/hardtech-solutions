---
trigger: always_on
---

Usa unicamente PNPM para los comandos e instalaciones
Usa exclusivamente Svelte 5 Runes ($state, $derived, $effect, $props). Prohibido usar la sintaxis de Svelte 4 (export let, $:, onMount).
Usa siempre los tipos de database.types.ts. Evita el uso de any. Si una función devuelve datos de Supabase, debe estar tipada con Tables<'nombre_tabla'>
Toda fecha y hora mostrada al usuario debe estar convertida a la zona horaria America/Caracas. En la base de datos, almacena siempre en UTC.
Al realizar select en Supabase, especifica solo las columnas necesarias. Nunca uses select('\*') en tablas de gran volumen para minimizar el consumo de datos móviles.
Cada acción de botón debe tener un estado de loading o disabled claro para evitar múltiples clics en redes lentas.
Usa componentes de DaisyUI.
