/**
 * @fileoverview CSS Summonerで使用されるカラーパレット、オプション、関連ユーティリティ関数を定義します。
 *
 * @description
 * このファイルは、CSS Summoner アプリケーション全体で利用される色の設定を一元管理します。
 * UIコンポーネントでの色の選択肢、カスタムカラーのデフォルト値、
 * および色のコントラストに基づいたテキスト色の自動計算機能を提供します。
 *
 * @exports colorRegistry - UIで選択可能な色定義オブジェクト。
 *   各色オブジェクトは以下のプロパティを持ちます:
 *   - `value` {string}: CSSクラス名や内部的な識別子として使用される値。
 *   - `label` {string}: UI上で表示される色の名前。
 *   - `description` {string}: 色の用途や意味合いを示す説明文。
 *   - `cssVar` {string}: 対応するCSSカスタムプロパティ名。
 *   - `isCustom` {boolean} (optional): カスタムカラーであるかを示すフラグ (`custom` のみ true)。
 *
 * @exports colorOptions - UIのドロップダウンなどで使用される色の選択肢配列。
 *   「None」オプションと `colorRegistry` の各色が含まれます。
 *   各オプションオブジェクトは `colorRegistry` の各色オブジェクトと同様のプロパティを持ちます。
 *
 * @exports defaultCustomColor - カスタムカラー設定の初期値オブジェクト。
 *   - `mainColor` {string}: カスタムカラーピッカーの初期色 (16進数カラーコード)。
 *   - `textColor` {string}: カスタムカラーに対する初期テキスト色 (16進数カラーコード)。
 *   - `autoTextColor` {boolean}: `mainColor` に基づいてテキスト色を自動計算するかどうか。
 *   - `autoBorderColor` {boolean}: `mainColor` に基づいてボーダー色を自動計算するかどうか。
 *
 * @exports getContrastTextColor - 背景色に基づいて適切なテキスト色を返す関数。
 *   @param {string} bgColor - 背景色の16進数カラーコード文字列 (例: '#ffffff')。
 *   @returns {string} コントラスト比に基づいて決定されたテキスト色 ('#000000' または '#ffffff')。
 *
 * @example
 * // 他のファイルからインポートして使用する例
 * import { colorRegistry, colorOptions, defaultCustomColor, getContrastTextColor } from './colors.js';
 *
 * const primaryColorValue = colorRegistry.primary.value;
 * console.log('Primary color value:', primaryColorValue);
 *
 * const textColorForBlue = getContrastTextColor('#0000ff');
 * console.log('Text color for blue:', textColorForBlue); // '#ffffff'
 *
 * @see /src/css-summoner/docs/stylingGuide.md - スタイルガイド
 *
 * @dependecies なし
 */

// カラーレジストリ：UIから選択できる色の設定
export const colorRegistry = {
	primary: {
		value: 'color-primary',
		label: 'Primary',
		description: '主要なアクションに使用する色',
		cssVar: '--primary',
	},
	secondary: {
		value: 'color-secondary',
		label: 'Secondary',
		description: '補助的なアクションに使用する色',
		cssVar: '--secondary',
	},
	accent: {
		value: 'color-accent',
		label: 'Accent',
		description: '注目を集めるアクションに使用する色',
		cssVar: '--accent',
	},
	neutral: {
		value: 'color-neutral',
		label: 'Neutral',
		description: '一般的なアクションに使用する色',
		cssVar: '--neutral',
	},
	dark: {
		value: 'color-dark',
		label: 'Dark',
		description: '明るい背景上での表示に適した暗い色',
		cssVar: '--neutral-dark',
	},
	light: {
		value: 'color-light',
		label: 'Light',
		description: '暗い背景上での表示に適した明るい色',
		cssVar: '--neutral-light',
	},
	custom: {
		value: 'color-custom',
		label: 'Custom',
		description: 'カラーピッカーで選択したカスタム色',
		cssVar: '--custom-color',
		isCustom: true,
	},
}

// 他のカラー関連の設定
export const colorOptions = [
	{ value: '', label: 'None', description: '色を指定しない' },
	...Object.entries(colorRegistry).map(([key, color]) => ({
		value: color.value,
		label: color.label,
		description: color.description,
		cssVar: color.cssVar,
		isCustom: color.isCustom || false,
	})),
]

// カスタムカラー設定のデフォルト値
export const defaultCustomColor = {
	mainColor: '#6366f1', // インディゴ
	textColor: '#ffffff', // 白
	autoTextColor: true, // テキスト色を自動設定
	autoBorderColor: true, // ボーダー色を自動設定
}

// コントラスト比に基づいてテキスト色を決定（白or黒）
export const getContrastTextColor = (bgColor) => {
	// カラーコードからRGB値を取得
	const r = parseInt(bgColor.slice(1, 3), 16)
	const g = parseInt(bgColor.slice(3, 5), 16)
	const b = parseInt(bgColor.slice(5, 7), 16)

	// 明度の計算（W3C方式）
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

	// 明度が0.5より大きい（明るい色）なら黒、そうでなければ白
	return luminance > 0.5 ? '#000000' : '#ffffff'
}
