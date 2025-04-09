/**
 * @fileoverview CSS Summonerで使用されるサイズ関連のオプション（テキストサイズ、ボタンサイズなど）を定義します。
 *
 * @module configs/sizes
 *
 * @property {object} sizes - サイズオプションを含むオブジェクト。
 * @property {Array<{value: string, label: string}>} sizes.common - 全般的なサイズオプション。
 * @property {Array<{value: string, label: string}>} sizes.button - ボタン専用のサイズオプション。
 * @property {Array<{value: string, label: string}>} sizes.badge - バッジ専用のサイズオプション。
 * @property {Array<{value: string, label: string}>} sizes.text - テキスト専用のサイズオプション。
 * @property {Array<{value: string, label: string}>} sizes.heading - 見出し専用のサイズオプション。
 * @property {Array<{value: string, label: string}>} sizes.form - フォーム専用のサイズオプション。
 * @property {Array<{value: string, label: string}>} sizes.infobox - インフォボックス専用のサイズオプション。
 * @property {Array<{value: string, label: string}>} sizes.card - カード専用のサイズオプション。
 * @property {Array<{value: string, label: string}>} sizes.tooltip - ツールチップ専用のサイズオプション。
 *
 * @example
 * // 他のファイルからデフォルトインポートして使用
 * import sizes from './sizes.mjs';
 * const buttonSizes = sizes.button;
 * console.log(buttonSizes); // [{ value: 'btn-xs', label: 'XS' }, ...]
 *
 * @default sizes
 * @exports sizes
 *
 * @description
 * このファイルは、CSS Summoner UIで利用可能なサイズ関連のクラスとその表示名を定義します。
 * 各キー（例: `button`, `badge`）は特定のコンポーネントタイプに対応し、
 * その値は `{ value: string, label: string }` 形式のオブジェクトの配列です。
 * `value` は適用されるCSSクラス名、`label` はUIに表示される名前です。
 *
 * @see configs/colors.js - 色設定ファイル
 * @see configs/modifiers.mjs - 修飾子設定ファイル
 * @see configs/borderRadius.mjs - 角丸設定ファイル
 *
 * @requires - なし (依存関係なし)
 */

// configs/sizes.js
// サイズ設定の管理

export const sizes = {
	// 全般的なサイズ
	common: [
		{ value: 'text-xs', label: 'XS' },
		{ value: 'text-sm', label: 'Small' },
		{ value: 'text-md', label: 'Medium' },
		{ value: 'text-lg', label: 'Large' },
		{ value: 'text-xl', label: 'XL' },
	],
	// ボタン専用のサイズクラス
	button: [
		{ value: 'btn-xs', label: 'XS' },
		{ value: 'btn-sm', label: 'Small' },
		{ value: 'btn-md', label: 'Medium' },
		{ value: 'btn-lg', label: 'Large' },
		{ value: 'btn-xl', label: 'XL' },
	],

	// バッジ専用のサイズクラス
	badge: [
		{ value: 'badge-xs', label: 'XS' },
		{ value: 'badge-sm', label: 'Small' },
		{ value: 'badge-md', label: 'Medium' },
		{ value: 'badge-lg', label: 'Large' },
	],

	// テキスト専用のサイズクラス
	text: [
		{ value: 'text-xs', label: 'XS' },
		{ value: 'text-sm', label: 'Small' },
		{ value: 'text-md', label: 'Medium' },
		{ value: 'text-lg', label: 'Large' },
		{ value: 'text-xl', label: 'XL' },
	],

	// 見出し専用のサイズクラス
	heading: [
		{ value: 'heading-sm', label: 'Small' },
		{ value: 'heading-md', label: 'Medium' },
		{ value: 'heading-lg', label: 'Large' },
		{ value: 'heading-xl', label: 'XL' },
	],

	// フォーム専用のサイズクラス
	form: [
		{ value: 'form-xs', label: 'XS' },
		{ value: 'form-sm', label: 'Small' },
		{ value: 'form-md', label: 'Medium' },
		{ value: 'form-lg', label: 'Large' },
		{ value: 'form-xl', label: 'XL' },
	],

	// インフォボックス専用のサイズクラス
	infobox: [
		{ value: 'infobox-sm', label: 'Small' },
		{ value: 'infobox-md', label: 'Medium' }, // デフォルト (クラスなし)
		{ value: 'infobox-lg', label: 'Large' },
	],

	// カード専用のサイズクラス
	card: [
		{ value: 'text-xs', label: 'XS' },
		{ value: 'text-sm', label: 'Small' },
		{ value: 'text-md', label: 'Medium' },
		{ value: 'text-lg', label: 'Large' },
		{ value: 'text-xl', label: 'XL' },
	],

	// ツールチップ専用のサイズクラス
	tooltip: [
		{ value: 'tooltip-sm', label: 'Small' },
		{ value: 'tooltip-md', label: 'Medium' }, // Default size, might not need a class if base styles handle it
		{ value: 'tooltip-lg', label: 'Large' },
	],
}

export default sizes
