import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import purgecss from 'astro-purgecss'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
	site: 'https://css-summoner.netlify.app',
	build: {
		excludePages: ['**/docs/**/*'],
		inlineStylesheets: 'never',
	},
	experimental: {
		preserveScriptOrder: true,
		headingIdCompat: true,
	},
	integrations: [
		tailwind({
			applyBaseStyles: false,
		}),
		react(),
		purgecss(),
		sitemap(),
	],
	vite: {
		build: {
			cssCodeSplit: false, // CSSのコード分割を無効化
		},
	},
})
