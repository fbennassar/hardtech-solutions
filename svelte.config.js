import adapter from '@sveltejs/adapter-netlify'; // <--- Cambia esto (antes decía adapter-auto)
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto intenta adivinar, adapter-netlify sabe exactamente qué hacer
		adapter: adapter() 
	},
    preprocess: vitePreprocess()
};

export default config;