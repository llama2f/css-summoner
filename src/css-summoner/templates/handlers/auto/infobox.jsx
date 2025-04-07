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
		...rest // DOM要素に渡さない props はここで除外
	} = props

	// --- 最終的なクラス文字列の生成 ---
	const finalClassString = combineClasses({
		baseClass,
		additional: classString, // ClassPreview から渡されたクラスを追加
	})

	// --- React要素の生成 ---
	const reactElement = (
		<div
			className={finalClassString}
			style={{ maxWidth: '400px' }}
			role='alert'
			{...rest}
		>
			<div className='infobox-content'>
				<p>{children}</p>
			</div>
		</div>
	)

	// --- HTML文字列の生成 ---
	const htmlString = `<div class="${finalClassString}" role="alert">
  <div class="infobox-content"><p>${children}</p></div>
</div>`

	// --- 結果を返す ---
	return createHandlerResult(reactElement, htmlString)
}

// --- バリアント固有のレンダラー (オプション) ---
export const variants = {
	// アイコン付き
	'with-icon': (props) => {
		const {
			classString = '', // ClassPreview から渡されるクラス (例: 'infobox-with-icon color-primary size-sm')
			children = 'アイコン付きメッセージのサンプルです。',
			baseClass = 'infobox-base',
			...rest
		} = props

		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const iconReact = (
			<div
				className='infobox-icon'
				dangerouslySetInnerHTML={{ __html: sampleIcon }}
			/>
		)
		const iconHtml = `<div class="infobox-icon">${sampleIcon}</div>`

		const reactElement = (
			<div
				className={finalClassString}
				style={{ maxWidth: '400px' }}
				role='alert'
				{...rest}
			>
				{iconReact}
				<div className='infobox-content'>
					<p>{children}</p>
				</div>
			</div>
		)

		const htmlString = `<div class="${finalClassString}" role="alert">
  ${iconHtml}
  <div class="infobox-content"><p>${children}</p></div>
</div>`
		return createHandlerResult(reactElement, htmlString)
	},

	// タイトル付き
	'with-title': (props) => {
		const {
			classString = '', // ClassPreview から渡されるクラス (例: 'infobox-with-title color-secondary')
			title = 'インフォボックスタイトル',
			children = 'タイトル付きメッセージのサンプルです。',
			baseClass = 'infobox-base',
			...rest
		} = props

		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const titleReact = <div className='infobox-title'>{title}</div>
		const titleHtml = `<div class="infobox-title">${title}</div>`

		const reactElement = (
			<div
				className={finalClassString}
				style={{ maxWidth: '400px' }}
				role='alert'
				{...rest}
			>
				<div className='infobox-content'>
					{titleReact}
					<p>{children}</p>
				</div>
			</div>
		)

		const htmlString = `<div class="${finalClassString}" role="alert">
  <div class="infobox-content">${titleHtml}<p>${children}</p></div>
</div>`
		return createHandlerResult(reactElement, htmlString)
	},

	// アイコンとタイトル付き
	'with-icon-title': (props) => {
		const {
			classString = '', // ClassPreview から渡されるクラス (例: 'infobox-with-icon infobox-with-title color-accent')
			title = 'アイコン＆タイトル付き',
			children = 'アイコンとタイトルが付いたメッセージのサンプルです。',
			baseClass = 'infobox-base',
			...rest
		} = props

		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const iconReact = (
			<div
				className='infobox-icon'
				dangerouslySetInnerHTML={{ __html: sampleIcon }}
			/>
		)
		const iconHtml = `<div class="infobox-icon">${sampleIcon}</div>`
		const titleReact = <div className='infobox-title'>{title}</div>
		const titleHtml = `<div class="infobox-title">${title}</div>`

		const reactElement = (
			<div
				className={finalClassString}
				style={{ maxWidth: '400px' }}
				role='alert'
				{...rest}
			>
				{iconReact}
				<div className='infobox-content'>
					{titleReact}
					<p>{children}</p>
				</div>
			</div>
		)

		const htmlString = `<div class="${finalClassString}" role="alert">
  ${iconHtml}
  <div class="infobox-content">${titleHtml}<p>${children}</p></div>
</div>`
		return createHandlerResult(reactElement, htmlString)
	},
}

// --- プレビュー用サンプルデータ (オプション) ---
export const samples = {
	default: '基本インフォボックス',
	'with-icon': 'アイコン付き',
	'with-title': 'タイトル付き',
	'with-icon-title': 'アイコン＆タイトル付き',
}

// --- デフォルトエクスポート (必須) ---
export default {
	metadata,
	render,
	variants,
	samples,
}
