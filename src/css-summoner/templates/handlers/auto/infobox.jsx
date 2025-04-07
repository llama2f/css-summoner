// templates/handlers/auto/infobox.jsx

import React from 'react'
// combineClasses と sampleIcon を common.jsx からインポート
import { createHandlerResult, combineClasses, sampleIcon } from '../common'

// メタデータ（必須）
export const metadata = {
	type: 'infobox',
	category: 'feedback',
	description: '情報や注意喚起を表示するボックスコンポーネント',
}

// --- 基本レンダラー (必須) ---
export function render(props) {
	const {
		classString = '', // ClassPreview から渡される、baseClass 以外の結合済みクラス
		children = 'インフォメーションメッセージのサンプルです。重要な情報や注意事項を表示するために使用します。',
		baseClass = 'infobox-base', // デフォルトのベースクラス
		title = 'インフォボックスタイトル', // デフォルトタイトル (title クラスがある場合に使用)
		selectedModifiers, // selectedModifiers を明示的に受け取り、rest に含めない
		...rest // DOM要素に渡さない props はここで除外
	} = props

	// --- 最終的なクラス文字列の生成 ---
	const finalClassString = combineClasses({
		baseClass,
		additional: classString, // ClassPreview から渡されたクラスを追加
	})

	// --- アイコンとタイトルの条件付きレンダリング ---
	const hasIcon = classString.includes('infobox-with-icon')
	const hasTitle = classString.includes('infobox-with-title') // CSSクラス名で判断

	const iconReact = hasIcon ? (
		<div
			className='infobox-icon'
			dangerouslySetInnerHTML={{ __html: sampleIcon }}
		/>
	) : null
	const iconHtml = hasIcon
		? `<div class="infobox-icon">${sampleIcon}</div>`
		: ''

	const titleReact = hasTitle ? (
		<div className='infobox-title'>{title}</div>
	) : null
	const titleHtml = hasTitle ? `<div class="infobox-title">${title}</div>` : ''

	// --- React要素の生成 ---
	const reactElement = (
		<div
			className={finalClassString}
			style={{ maxWidth: '400px' }}
			role='alert'
			{...rest}
		>
			{iconReact} {/* アイコンを条件付きで表示 */}
			<div className='infobox-content'>
				{titleReact} {/* タイトルを条件付きで表示 */}
				<p>{children}</p>
			</div>
		</div>
	)

	// --- HTML文字列の生成 ---
	// HTML文字列内でもアイコンとタイトルを条件付きで含める
	const htmlString = `<div class="${finalClassString}" role="alert">
  ${iconHtml}
  <div class="infobox-content">${titleHtml}<p>${children}</p></div>
</div>`

	// --- 結果を返す ---
	return createHandlerResult(reactElement, htmlString)
}

// --- バリアント固有のレンダラー (オプション) ---
// バリアントはCSS側で定義されているもののみ対応するため、削除
// export const variants = { ... }

// --- プレビュー用サンプルデータ (オプション) ---
// バリアントに基づかないため削除
// export const samples = { ... }

// --- デフォルトエクスポート (必須) ---
export default {
	metadata,
	render,
	// variants と samples を削除
}
