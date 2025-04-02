import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import react from '@astrojs/react'
import purgecss from 'astro-purgecss'

export default defineConfig({
	site: 'https://your-domain.com',
	build: {
		excludePages: ['**/docs/**/*'],
		inlineStylesheets: 'never',
	},
	experimental: {
		svg: true,
		preserveScriptOrder: true,
		headingIdCompat: true,
	},
	vite: {
        plugins: [
            tailwindcss()
        ]
    },
	integrations: [
		react(),
		purgecss(),
	],
})
