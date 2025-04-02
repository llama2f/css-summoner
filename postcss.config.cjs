module.exports = {
	plugins: [
		require('postcss-import'), // 最初にインポートを処理
		require('tailwindcss/nesting'), // ネスト構文のサポート（必要な場合）
		require('tailwindcss'), // Tailwindの処理
		require('autoprefixer'), // プレフィックスの追加
	],
}
