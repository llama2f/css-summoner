/**
 * @file src/css-summoner/configs/borderRadius.mjs
 * @summary CSS Summonerで使用される角丸 (border-radius) のオプションを定義します。
 *
 * @description
 * このファイルは、CSS Summonerアプリケーション全体で利用可能な角丸のスタイルオプションを提供します。
 * 共通のオプションと、将来的にはコンポーネント固有のオプションを定義できます。
 *
 * @typedef {object} BorderRadiusOption
 * @property {string} value - Tailwind CSSのクラス名。
 * @property {string} label - UIに表示されるラベル。
 */

/**
 * @typedef {object} BorderRadiusOptions
 * @property {Array<BorderRadiusOption>} common - 共通で使用される角丸オプションの配列。
 * @property {Array<never>} text - テキスト専用の角丸オプションの配列 (現在は空)。
 */

/**
 * 角丸オプションを含むオブジェクト。
 * @type {BorderRadiusOptions}
 * @exports borderRadiusOptions
 * @default
 *
 * @example
 * // 他のファイルからインポートして使用
 * import borderRadiusOptions from './borderRadius.mjs';
 * console.log(borderRadiusOptions.common);
 *
 * @see
 * - `@fortawesome/fontawesome-svg-core` の `text` がインポートされていますが、
 *   このファイル内では現在使用されていません。
 *
 * @note
 * コメントアウトされている `componentBorderRadius` は現在使用されていません。
 */
// configs/borderRadius.cjs
// 角丸設定の管理

import { text } from '@fortawesome/fontawesome-svg-core' // 依存関係: 使用されていないインポート

export const borderRadiusOptions = {
	common: [
		{ value: 'rounded-none', label: 'なし' },
		{ value: 'rounded-sm', label: 'Small' },
		{ value: 'rounded', label: 'Medium' },
		{ value: 'rounded-lg', label: 'Large' },
		{ value: 'rounded-full', label: 'Full' },
	],
	text: [], // テキスト専用オプション (現在未使用)
}
// コンポーネントごとの角丸設定 (現在未使用)
/* export const componentBorderRadius = {
	button: [
		{ value: 'btn-rounded-sm', label: 'Small' },
		{ value: 'btn-rounded-lg', label: 'Large' },
		{ value: 'btn-rounded-full', label: 'Full' },
		{ value: 'btn-square', label: 'Square (角なし)' },
	],
}
 */
export default borderRadiusOptions
