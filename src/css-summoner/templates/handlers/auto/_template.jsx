// templates/handlers/auto/_template.jsx
// 新しいコンポーネントハンドラーのテンプレートファイルです。
// このファイルをコピーして、'component-name.jsx' のようにリネームして使用してください。

// --- 仕様 ---
// - プレビュー、HTMLコード表示を行います。
// - baseクラスの自動付与をスキップしたい場合は、render関数またはvariant関数内で
//   `return { ...createHandlerResult(reactElement, htmlString), skipDecoration: true }`
//   のように `skipDecoration: true` を含めてください。

import React from 'react'
import { createHandlerResult, sampleIcon } from '../common' // 必要に応じてインポート

// --- メタデータ (必須) ---
// ハンドラー自動登録システムが使用します。
export const metadata = {
	type: 'component-name', // ★ 必ずコンポーネントタイプ名に変更してください (例: 'alert')
	category: 'category-name', // ★ カテゴリ名に変更してください (例: 'feedback', 'layout', 'form' など)
	description: 'ここにコンポーネントの説明を記述します', // ★ 説明を記述してください
}

// --- 基本レンダラー (必須) ---
// コンポーネントの基本的な表示を定義します。
// props: { classString, selectedModifiers, children, color, variant, baseClass, ...rest } などを受け取ります。
export function render(props) {
	const {
		classString = '',
		children = `${metadata.type} Preview`, // デフォルトのプレビューテキスト
		// 他に必要な props を分割代入で受け取る
		baseClass, // baseClass を受け取り、rest から除外 (DOM警告防止)
		...rest // DOM要素に渡さない props はここで除外する
	} = props

	// --- React要素の生成 ---
	const reactElement = (
		<div className={classString} {...rest}>
			{' '}
			{/* ★ 適切なHTML要素に変更 */}
			{children}
			{/* 必要に応じてアイコンなどを追加: {sampleIcon} */}
		</div>
	)

	// --- HTML文字列の生成 ---
	// dangerouslySetInnerHTML を使う場合はサニタイズに注意してください。
	const htmlString = `<div class="${classString}"> {/* ★ 適切なHTML要素に変更 */}
    ${children}
  </div>`

	// --- 結果を返す ---
	// skipDecoration が不要な場合はシンプルに: return createHandlerResult(reactElement, htmlString);
	return createHandlerResult(reactElement, htmlString)
	// ベースクラス付与をスキップする場合:
	// return { ...createHandlerResult(reactElement, htmlString), skipDecoration: true };
}

// --- バリアント固有のレンダラー (オプション) ---
// コンポーネントに特定のバリアントがある場合に定義します。
export const variants = {
	// variantName: (props) => {
	//   const { classString, baseClass, ... } = props; // baseClass を受け取り rest から除外
	//   const reactElement = ...;
	//   const htmlString = ...;
	//   // 必要なら skipDecoration: true を含める
	//   return createHandlerResult(reactElement, htmlString);
	// },
}

// --- プレビュー用サンプルデータ (オプション) ---
// ClassBuilder UI のプレビュー表示で使用されるサンプルテキストなど。
export const samples = {
	// default: 'デフォルトテキスト',
	// variantName: 'バリアント用テキスト',
}

// --- デフォルトエクスポート (必須) ---
// ハンドラー自動登録システムが使用します。
export default {
	metadata,
	render,
	variants, // 不要な場合は削除可
	samples, // 不要な場合は削除可
}
