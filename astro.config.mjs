import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
import alpinejs from '@astrojs/alpinejs'

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
	integrations: [
		tailwind({
			applyBaseStyles: false,
		}),
		react(),
		sitemap(),
		mdx(),
		alpinejs(),
		purgecss(),
	],
})
