<script lang="ts">
    import { onMount } from 'svelte';
    import { Sun, Moon } from 'lucide-svelte';

    let currentTheme = 'maintree';

    onMount(() => {
        const savedTheme = localStorage.getItem('theme') || 'maintree';
        document.documentElement.setAttribute('data-theme', savedTheme);
        currentTheme = savedTheme;
    });

    function toggleTheme() {
        const newTheme = currentTheme === 'maintree' ? 'daisymax' : 'maintree';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        currentTheme = newTheme;
    }
</script>

<label class="swap swap-rotate btn btn-ghost btn-circle">
    <input type="checkbox" on:change={toggleTheme} checked={currentTheme === 'daisymax'} />
    <Sun class="swap-on h-6 w-6" />
    <Moon class="swap-off h-6 w-6" />
</label>