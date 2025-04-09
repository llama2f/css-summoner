/**
 * @fileoverview CSS Summonerで使用される特殊なユーティリティクラス（遷移効果、絶対中央配置など）のオプションを定義します。
 *
 * @typedef {object} SpecialClassOption
 * @property {string} value - CSSクラス名。
 * @property {string} label - UI表示用のラベル。
 * @property {string} description - クラスの説明。
 */

/**
 * 特殊クラスオプションの配列。
 * 各オプションは `{ value: string, label: string, description: string }` の形式です。
 * @type {SpecialClassOption[]}
 */
export const specialClasses = [
	{
		value: 'animate-down',
		label: 'ダウンアニメーション',
		description: 'マウスオーバー時に下に移動するアニメーション',
	},
	{
		value: 'tran-200',
		label: '遷移効果 200ms',
		description: '200msのトランジション効果',
	},
	{
		value: 'tran-300',
		label: '遷移効果 300ms',
		description: '300msのトランジション効果',
	},
	{
		value: 'tran-500',
		label: '遷移効果 500ms',
		description: '500msのトランジション効果',
	},
	{
		value: 'abs-center',
		label: '絶対中央',
		description: '絶対配置で中央に配置',
	},
]

/**
 * デフォルトエクスポートされる特殊クラスオプションの配列。
 * 他のファイルからデフォルトインポートして使用します。
 * 例: `import specialClasses from './specialClasses.mjs';`
 * @exports specialClasses
 * @default
 */
export default specialClasses
