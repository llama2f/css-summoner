// 新しいコンポーネントハンドラーのテンプレートファイルです。
// このファイルをコピーして、'component-name.jsx' のようにリネームして使用してください。
// 設計原則:
// 1. DRY原則: バリアント間で共通のHTML構造を持つ場合は必ず関数を再利用すること
// 2. パラメータのみが異なる場合は、追加パラメータを渡して共通関数を呼び出す形で実装
// 3. サンプルテキストはsamplesオブジェクトを参照し、ハードコードしないこと
//
// 実装パターン例:
// - 基本バリアント: 共通処理を含む関数を実装
// - 派生バリアント: { ...props, variant: 'special' } のようにパラメータを追加して基本関数を呼び出す
// --- 仕様 ---
// - プレビュー、HTMLコード表示を行います。
// - クラス名は基本的に classMappings.js の baseClasses からベースクラスが自動的に適用されます。
// - ベースクラスの自動付与が不要な場合は、以下のいずれかの方法を使用します：
//   1. ハンドラー内で: `return { ...createHandlerResult(reactElement), skipDecoration: true }`
//   2. CSSでベースクラスを定義せず、classMappings.js の baseClasses にも登録しない

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

	// ClassBuilderから渡されたクラス文字列をそのまま使用
	// ※注意: combineClasses関数はClassBuilderで既に使用されているため、
	// ハンドラー側で再度クラスを結合すると重複の問題が発生します
	const finalClassString = classString

	const reactElement = (
		<div className={finalClassString} id={id} role={role} {...commonProps}>
			{/* ★ 適切なHTML要素に変更 */}
			{children}
		</div>
	)

	return createHandlerResult(reactElement)
	// 注: ベースクラス付与をスキップする方法は2つあります:
	// 1. ハンドラー内でフラグを指定: return { ...createHandlerResult(reactElement), skipDecoration: true }
	// 2. コンポーネントに対応するCSSでbaseクラスを定義せず、classMappings.jsのbaseClassesにも登録しない
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
