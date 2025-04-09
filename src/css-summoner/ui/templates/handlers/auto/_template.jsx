// templates/handlers/auto/_template.jsx
// 新しいコンポーネントハンドラーのテンプレートファイルです。
// このファイルをコピーして、'component-name.jsx' のようにリネームして使用してください。

// --- 仕様 ---
// - プレビュー、HTMLコード表示を行います。
// - baseクラスの自動付与をスキップしたい場合は、render関数またはvariant関数内で
//   `return { ...createHandlerResult(reactElement), skipDecoration: true }`
//   のように `skipDecoration: true` を含めてください。

import React from 'react'
// combineClasses: baseClass と他のクラス文字列を結合するヘルパー関数
// sampleIcon: プレビュー用のサンプルSVGアイコン
// separateProps: プロパティを分離するユーティリティ
import {
	createHandlerResult,
	combineClasses,
	sampleIcon,
	separateProps,
} from '../common' // 必要に応じてインポート

// --- メタデータ (必須) ---
// ハンドラー自動登録システムが使用します。
export const metadata = {
	type: 'component-name', // ★ 必ずコンポーネントタイプ名に変更してください (例: 'alert')
	category: 'category-name', // ★ カテゴリ名に変更してください (例: 'feedback', 'layout', 'form' など)
	description: 'ここにコンポーネントの説明を記述します', // ★ 説明を記述してください
}

// --- 基本レンダラー (必須) ---
// コンポーネントの基本的な表示を定義します。
export function render(props) {
	// プロパティを分離
	const { reactProps, domProps, commonProps } = separateProps(
		props,
		['classString', 'children', 'selectedModifiers', 'baseClass'], // React特有のプロパティ
		['id', 'role'] // DOM要素に直接渡すプロパティ
	)

	// Reactプロパティを取得
	const {
		classString = '', // ClassPreview から渡される、baseClass 以外の結合済みクラス
		children = `${metadata.type} Preview`, // デフォルトのプレビューテキスト
		baseClass = `${metadata.type}-base`, // デフォルトのベースクラス (必要に応じて調整)
	} = reactProps

	// DOM要素プロパティを取得
	const { id, role } = domProps

	// --- 最終的なクラス文字列の生成 ---
	// baseClass と ClassPreview から渡された classString を結合
	const finalClassString = combineClasses({
		baseClass,
		additional: classString,
	})

	// --- React要素の生成 ---
	const reactElement = (
		// finalClassString を className に適用
		<div
			className={finalClassString}
			id={id}
			role={role}
			{...commonProps} // その他のプロパティを展開
		>
			{/* ★ 適切なHTML要素に変更 */}
			{children}
			{/* 必要に応じてアイコンなどを追加: <span dangerouslySetInnerHTML={{ __html: sampleIcon }} /> */}
		</div>
	)

	// --- 結果を返す ---
	// HTML文字列はJSXから自動生成されるので、第2引数を省略します
	return createHandlerResult(reactElement)
	// ベースクラス付与をスキップする場合:
	// return { ...createHandlerResult(reactElement), skipDecoration: true };
}

// --- バリアント固有のレンダラー (オプション) ---
// コンポーネントに特定のバリアントがある場合に定義します。
export const variants = {
	// 例: specialというバリアントの場合
	// special: (props) => {
	//   // プロパティを分離
	//   const { reactProps, domProps, commonProps } = separateProps(
	//     props,
	//     ['classString', 'children', 'baseClass'], // React特有のプロパティ
	//     ['id', 'role'] // DOM要素プロパティ
	//   );
	//
	//   // 必要なプロパティを取得
	//   const { classString = '', baseClass = `${metadata.type}-base` } = reactProps;
	//   const { id, role } = domProps;
	//
	//   // クラス文字列を結合
	//   const finalClassString = combineClasses({ baseClass, additional: classString });
	//
	//   // React要素を生成
	//   const reactElement = (
	//     <div className={finalClassString} id={id} role={role} {...commonProps}>
	//       特別な表示
	//     </div>
	//   );
	//
	//   // HTML文字列は自動生成される
	//   return createHandlerResult(reactElement);
	// }
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
