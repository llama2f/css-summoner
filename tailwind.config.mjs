/** @type {import('tailwindcss').Config} */

const colors = ['primary', 'secondary', 'neutral', 'accent']
const shades = ['', '-dark', '-light'] // 色のバリエーション

const modifiers = {
	base: ['text', 'bg'],
	hover: ['hover:text', 'hover:bg'],
	groupHover: ['group-hover:text', 'group-hover:bg'],
	visited: ['visited:text', 'md:visited:text', 'lg:visited:text'],
	md: ['md:text', 'md:bg'],
	mdHover: ['md:hover:text', 'md:hover:bg'],
	mdGroupHover: ['md:group-hover:text', 'md:group-hover:bg'],
	lg: ['lg:text', 'lg:bg'],
	lgHover: ['lg:hover:text', 'lg:hover:bg'],
	lgGroupHover: ['lg:group-hover:text', 'lg:group-hover:bg'],
}

function generateSafeList() {
	const safelist = ['visited:text-white', 'md:hover:text-neutral-light']

	colors.forEach((color) => {
		shades.forEach((shade) => {
			const classSuffix = shade ? `${color}${shade}` : color

			Object.values(modifiers).forEach((modifierList) => {
				modifierList.forEach((modifier) => {
					safelist.push(`${modifier}-${classSuffix}`)
				})
			})
		})
	})

	return safelist
}

export default {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./public/**/*.html',
		'./src/css-builder/styles/**/*.css',
		'./src/styles/global.css',
		'./src/styles/**/*.scss',
	],
	safelist: [...generateSafeList(), 'font-serif', 'font-sans', 'font-mono'],
	data: {
		checked: 'open~="true"',
		open: 'ui~="checked"',
	},
	darkMode: 'selector',
	theme: {
		extend: {
			colors: {
				primary: {
					light: 'var(--primary-light)',
					DEFAULT: 'var(--primary)',
					dark: 'var(--primary-dark)',
					darker: 'var(--primary-darker)',
				},
				secondary: {
					light: 'var(--secondary-light)',
					DEFAULT: 'var(--secondary)',
					dark: 'var(--secondary-dark)',
				},
				neutral: {
					light: 'var(--neutral-light)',
					DEFAULT: 'var(--neutral)',
					dark: 'var(--neutral-dark)',
				},
				accent: {
					DEFAULT: 'var(--accent)',
					dark: 'var(--accent-dark)',
				},
				success: 'var(--success)',
				warning: 'var(--warning)',
				error: 'var(--error)',
			},
			spacing: {
				global: 'clamp(1.25rem,1rem + 2vw,2.5rem )',
				globalX2: 'clamp(40px,2rem + 2vw, 60px)',
				globalRem: '2rem',
			},
			backgroundImage: {
				// hero フォルダ内のパターン
				'hero-bank-note': 'var(--bg-hero-bank-note)',
				'hero-stripes': 'var(--bg-hero-stripes)',
				'hero-brick-wall': 'var(--bg-hero-brick-wall)',
				'hero-bubbles': 'var(--bg-hero-bubbles)',
				'hero-leaf': 'var(--bg-hero-leaf)',
				'hero-polka-dots': 'var(--bg-hero-polka-dots)',
				'hero-diagonal-lines': 'var(--bg-hero-diagonal-lines)',
				'hero-texture': 'var(--bg-hero-texture)',
				'hero-endless-clouds': 'var(--bg-hero-endless-clouds)',
				'hero-graph-paper': 'var(--bg-hero-graph-paper)',
				'hero-diagonal-stripes': 'var(--bg-hero-diagonal-stripes)',
				'hero-plus': 'var(--bg-hero-plus)',

				// subtle フォルダ内のパターン
				'subtle-gravel': 'var(--bg-subtle-gravel)',
				'subtle-worn-dots': 'var(--bg-subtle-worn-dots)',
				'subtle-naturalwhite': 'var(--bg-subtle-naturalwhite)',
				'subtle-45degree-fabric': 'var(--bg-subtle-45degree-fabric)',
				'subtle-tree-bark': 'var(--bg-subtle-tree-bark)',
				'subtle-geometric-leaves': 'var(--bg-subtle-geometric-leaves)',
			},
			fontSize: {
				base: '1rem', // 16px
				sm: '0.875rem', // 14px
				md: '1rem', // 16px
				lg: '1.125rem', // 18px
				xl: '1.25rem', // 20px
				'2xl': '1.5rem', // 24px
				'3xl': '1.75rem', // 28px
				'4xl': '2rem', // 32px
				'5xl': '2.25rem', // 36px
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
		fontFamily: {
			body: [
				'Hiragino Sans',
				'ヒラギノ角ゴシック',
				'メイリオ',
				'Meiryo',
				'MS Ｐゴシック',
				'MS PGothic',
				'sans-serif',
				'YuGothic',
				'Yu Gothic',
			],
			fontawesome: ['"Font Awesome 6 Free"', 'sans'],
			sans: [
				'Hiragino Sans',
				'ヒラギノ角ゴシック',
				'BIZ UDPゴシック',
				'メイリオ',
				'"Apple Color Emoji"',
				'"Segoe UI Emoji"',
				'"Segoe UI Symbol"',
				'"Noto Color Emoji"',
				'ui-sans-serif',
				'system-ui',
				'sans-serif',
			],
			serif: [
				'ui-serif',
				'Georgia',
				'Cambria',
				'"Times New Roman"',
				'Times',
				'serif',
			],
			mono: [
				'ui-monospace',
				'SFMono-Regular',
				'Menlo',
				'Monaco',
				'Consolas',
				'"Liberation Mono"',
				'"Courier New"',
				'monospace',
			],
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('tailwindcss-animate'),
	],
}
