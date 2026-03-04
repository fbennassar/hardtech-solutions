<script lang="ts">
  import { Sun, Moon } from "lucide-svelte";
  import { themeState, toggleTheme, initTheme } from "$lib/theme.svelte";

  $effect(() => {
    initTheme();
  });
</script>

<label class="swap swap-rotate btn btn-ghost btn-circle">
  <input
    type="checkbox"
    onchange={toggleTheme}
    checked={themeState.current === "daisymax"}
  />
  <Sun class="swap-on h-6 w-6" />
  <Moon class="swap-off h-6 w-6" />
</label>
