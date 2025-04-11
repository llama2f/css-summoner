// 新しいコンポーネントハンドラーのテンプレートファイルです。
// このファイルをコピーして、'component-name.jsx' のようにリネームして使用してください。

// --- 仕様 ---
// - プレビュー、HTMLコード表示を行います。
// - baseクラスの自動付与をスキップしたい場合は、render関数またはvariant関数内で
//   `return { ...createHandlerResult(reactElement), skipDecoration: true }`
//   のように `skipDecoration: true` を含めてください。

import React from 'react'
import {
	createHandlerResult,
	combineClasses,
	sampleIcon,
	separateProps,
} from '../common'

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
	const { reactProps, domProps, commonProps } = separateProps(
		props,
		['classString', 'children', 'selectedModifiers', 'baseClass'],
		['id', 'role']
	)

	const classString = reactProps.classString || ''
	const children =
		samples.default || reactProps.children || `${metadata.type} Preview`
	const baseClass = reactProps.baseClass || `${metadata.type}-base`

	const { id, role } = domProps

	const finalClassString = combineClasses({
		baseClass,
		additional: classString,
	})

	const reactElement = (
		<div className={finalClassString} id={id} role={role} {...commonProps}>
			{/* ★ 適切なHTML要素に変更 */}
			{children}
		</div>
	)

	return createHandlerResult(reactElement)
	// return { ...createHandlerResult(reactElement), skipDecoration: true }; // ベースクラス付与をスキップする場合
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
	//   // サンプルから値を取得するか、デフォルト値を使用
	//   const classString = reactProps.classString || '';
	//   const children = samples.special || reactProps.children || '特別な表示';
	//   const baseClass = reactProps.baseClass || `${metadata.type}-base`;
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
// サンプルデータを提供することで、プレビュー時に常に特定のテキストや値を表示できます。
export const samples = {
	default: 'デフォルトのサンプルテキスト', // コンポーネントのデフォルト表示テキスト
	title: 'サンプルタイトル', // タイトルが必要なコンポーネント用
	// variantName: 'バリアント用テキスト', // 特定のバリアント用
}

// --- Astroコンポーネント カスタム生成関数 (オプション) ---
// この関数をエクスポートすると、generate-astro.js はデフォルトの生成ロジックをスキップし、
// この関数が返す文字列をそのまま .astro ファイルとして書き出します。
// componentData には、componentInterface.js で定義された Props 情報などが含まれます。
/*
export async function generateAstroTemplate(componentData, options = {}) {
	const { componentName, propsInterface, defaultProps, description, variants } = componentData;

	// propsInterface を元に Astro の Props 定義を生成
	const propsDefinition = Object.entries(propsInterface)
		.map(([name, prop]) => {
			// デフォルト値の処理を追加
			const defaultValue = defaultProps[name] ? ` = ${JSON.stringify(defaultProps[name])}` : '';
			// コメントを追加
			const comment = prop.description ? ` // ${prop.description}` : '';
			return `  ${name}${prop.required ? '' : '?'}: ${prop.type}${defaultValue};${comment}`;
		})
		.join('\\n'); // 改行をエスケープ

	// バリアントが存在する場合、variant プロパティの型を生成
	const variantType = variants && variants.length > 0
		? `\\n  variant?: ${variants.map(v => `'${v.value}'`).join(' | ')}; // Component Variants` // 改行をエスケープ
		: '';

	// Astro コンポーネントのテンプレート文字列
	// テンプレートリテラル内の特殊文字をエスケープ
	const template = \`---
// \${componentName}.astro - Generated Astro Component
// \${description || ''}

interface Props \${'{'}
\${propsDefinition}\${variantType}
  // 必要に応じて他の Props を追加
  [key: string]: any; // スロットなどのための追加プロパティを許可
}

const \${'{'}
  class: className, // 'class' は予約語なので 'className' にリネーム
  \${Object.keys(propsInterface).join(',\\n  ')}\${variants && variants.length > 0 ? ',\\n  variant' : ''} // 改行をエスケープ
  ...rest // スロットやその他の属性用
} = Astro.props;

// ここでクラスの結合ロジックなどを実装
// 例: const combinedClasses = [baseClass, variantClass, sizeClass, className].filter(Boolean).join(' ');
const combinedClasses = \`\\\${className || ''}\`; // ★ 実際のクラス結合ロジックに置き換える (バッククォートをエスケープ)

---
// Astro マークアップをここに記述
<div class={combinedClasses} {...rest}>
  <slot /> // デフォルトスロット
</div>

<style>
// 必要に応じてコンポーネント固有のスタイルを記述
</style>
\`; // テンプレートリテラルを閉じる
	return template;
}
*/

// --- デフォルトエクスポート (必須) ---
// ハンドラー自動登録システムが使用します。
export default {
	metadata,
	render,
	variants, // 不要な場合は削除可
	samples,
	// generateAstroTemplate, // カスタム生成を使用する場合はコメント解除
}
