module.exports = {
	plugins: {
		'postcss-import': {},
		'tailwindcss/nesting': {},
		tailwindcss: {},
		autoprefixer: {},
		// 'postcss-nested': {}, // tailwindcss/nesting と競合する可能性があるためコメントアウト
	},
}
