/**
 * 直接ハンドラーとパターンハンドラーを生成するファクトリー
 * @param {Object} handlersMap - コンポーネントタイプとハンドラーのマッピング
 * @param {Object} [options] - オプション
 * @param {Object} [options.customPatterns] - カスタムパターン
 * @returns {Object} {components, patterns} オブジェクト
 */
export const createComponentHandlers = (handlersMap, options = {}) => {
	const { customPatterns = {} } = options

	// 直接的な名前に対応するハンドラー
	const components = { ...handlersMap }

	// パターンマッチング用ハンドラー
	const patterns = { ...customPatterns }

	// 各コンポーネントタイプをパターンとしても登録
	Object.entries(handlersMap).forEach(([type, handler]) => {
		const exactPattern = `^${type}`
		// カスタムパターンに存在しない場合のみ登録
		if (!patterns[exactPattern]) {
			patterns[exactPattern] = handler
		}

		// プレフィックスパターンも登録（例: 'form-'で始まるもの全て）
		const prefix = type.split('-')[0]
		const prefixPattern = `^${prefix}-`
		if (prefix && prefix !== type && !patterns[prefixPattern]) {
			patterns[prefixPattern] = components[prefix] || handler
		}
	})

	return { components, patterns }
}
/**
 * ハンドラーオプションを標準化するユーティリティ
 * @param {Object} options - 元のオプション
 * @returns {Object} 標準化されたオプション
 */
export const normalizeOptions = (options = {}) => {
	const {
		componentType = '',
		classString = '',
		variant = '',
		isVariant = false,
		variantType = '',
		baseClass = '',
		forPreview = false,
		selectedModifiers = [],
		...rest
	} = options

	// 実際に使用するコンポーネントタイプを決定
	// バリアントとして呼び出された場合はvariantTypeを優先
	const actualType = isVariant && variantType ? variantType : componentType

	return {
		componentType, // 元のコンポーネントタイプ
		actualType, // 実際に使用するタイプ
		classString, // クラス文字列
		variant, // バリアント名
		isVariant, // バリアントとして呼び出されたか
		variantType, // バリアントタイプ
		baseClass, // ベースクラス
		forPreview, // プレビュー用か
		selectedModifiers, // 選択されたモディファイア
		...rest, // その他の全てのオプション
	}
}

/**
 * ハンドラー関数を作成するユーティリティ
 * @param {Function} renderFn - レンダリング関数
 * @returns {Function} 標準化されたハンドラー関数
 */
export const createHandler = (renderFn) => {
	return (options) => {
		const normalizedOptions = normalizeOptions(options)
		return renderFn(normalizedOptions)
	}
}
// handlers/common.jsx
// 共通ユーティリティと定数

import React from 'react'
import ReactDOMServer from 'react-dom/server'

/**
 * Reactコンポーネントのプロパティを、React特有のプロパティとDOM要素プロパティに分離する
 * @param {Object} props - 元のプロパティオブジェクト
 * @param {Array<string>} reactProps - Reactとして扱うプロパティ名の配列（標準React propsに追加）
 * @param {Array<string>} domProps - DOM要素として扱うプロパティ名の配列（標準DOM propsに追加）
 * @returns {Object} { reactProps, domProps, commonProps } - 分離されたプロパティオブジェクト
 */
export const separateProps = (props, reactProps = [], domProps = []) => {
	// Reactコンポーネント特有のプロパティ
	const standardReactProps = [
		'className',
		'style',
		'onClick',
		'onChange',
		'onFocus',
		'onBlur',
		'onMouseOver',
		'onMouseOut',
		'onKeyDown',
		'onKeyUp',
		'onKeyPress',
		'children',
		'dangerouslySetInnerHTML',
		'key',
		'ref',
		// CSS Builder特有のプロパティ
		'classString',
		'variant',
		'componentType',
		'baseClass',
		'selectedModifiers',
		'forPreview',
		'isVariant',
		'variantType',
		'color',
	]

	// DOM要素特有のプロパティ
	const standardDomProps = [
		'id',
		'name',
		'type',
		'value',
		'disabled',
		'placeholder',
		'aria-label',
		'aria-describedby',
		'aria-hidden',
		'role',
		'title',
		'tabIndex',
		'autoFocus',
		'autoComplete',
		'href',
		'target',
		'rel',
		'alt',
		'src',
		'width',
		'height',
	]

	// 全てのカスタムReactプロパティとDOM要素プロパティを合わせる
	const allReactProps = [...standardReactProps, ...reactProps]
	const allDomProps = [...standardDomProps, ...domProps]

	// オブジェクトの初期化
	const reactPropsObj = {}
	const domPropsObj = {}
	const commonProps = {} // 両方に適用したいプロパティ

	// プロパティを分類
	Object.entries(props).forEach(([key, value]) => {
		// React特有のプロパティ
		if (allReactProps.includes(key)) {
			reactPropsObj[key] = value
		}
		// DOM要素特有のプロパティ
		else if (allDomProps.includes(key)) {
			domPropsObj[key] = value
		}
		// 両方に当てはまらないプロパティはcommonPropsに
		else {
			commonProps[key] = value
		}
	})

	return { reactProps: reactPropsObj, domProps: domPropsObj, commonProps }
}

// サンプルアイコンSVG - 各種ハンドラーで共通利用
export const sampleIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="12" y1="8" x2="12" y2="16"></line>
  <line x1="8" y1="12" x2="16" y2="12"></line>
</svg>`

// 共通ハンドラーユーティリティ関数

/**
 * JSX要素からHTML文字列を生成し、Reactの内部属性を削除
 * @param {React.ReactElement} element - JSX要素
 * @returns {string} クリーンなHTML文字列
 */
export const cleanupReactAttributes = (html) => {
	// React属性の削除
	const cleaned = html
		.replace(/\s+data-reactroot=""/g, '')
		.replace(/<!-- -->/g, '')
		.replace(/\s+data-reactid="[^"]*"/g, '')
		.replace(/\s+data-react-checksum="[^"]*"/g, '')
		.replace(/className=/g, 'class=')

	// 基本的な整形 (オプション)
	return cleaned
		.replace(/></g, '>\n  <')
		.replace(/<\/div>/g, '\n</div>')
		.replace(/<\/button>/g, '\n</button>')
}

/**
 * JSX要素からHTMLを生成するハンドラー結果を作成
 * @param {React.ReactElement} reactElement - React要素
 * @param {string} [htmlString] - オプションの手動HTML文字列（指定がなければJSXから自動生成）
 * @returns {Object} ハンドラー結果
 */
export const createHandlerResult = (reactElement, htmlString = null) => {
	// htmlStringが指定されていない場合は、JSXから自動生成
	if (htmlString === null) {
		try {
			htmlString = cleanupReactAttributes(
				ReactDOMServer.renderToString(reactElement)
			)
		} catch (error) {
			console.error('JSXからHTMLの生成に失敗しました:', error)
			// フォールバックとして簡易的なHTML生成（完全な変換は難しい）
			htmlString = `<div>JSXからHTMLへの変換エラー</div>`
		}
	}

	return { reactElement, htmlString }
}

/**
 * 各種クラスを優先順位を保ちながら結合する
 * @param {Object} options - 結合するクラスのオプション
 * @param {string} options.baseClass - ベースクラス
 * @param {string} options.variant - バリアントクラス
 * @param {string} options.size - サイズクラス
 * @param {string} options.radius - 角丸クラス
 * @param {Array} options.modifiers - モディファイア配列
 * @param {Array} options.specialClasses - 特殊クラス配列
 * @param {string} options.additional - 追加クラス
 * @param {string} options.color - 色クラス（新規追加）
 * @returns {string} 結合されたクラス文字列
 */
export const combineClasses = ({
	baseClass = '',
	variant = '',
	size = '',
	radius = '',
	modifiers = [],
	specialClasses = [],
	color = '',
	additional = '',
}) => {
	return [
		baseClass,
		variant,
		size,
		radius,
		...(modifiers || []),
		...(specialClasses || []),
		color, // 色クラスを追加
		additional,
	]
		.filter(Boolean)
		.join(' ')
}

/**
 * ベースクラスが指定されているがクラス文字列に含まれていない場合に追加する
 * @param {string} classString - 元のクラス文字列
 * @param {string} baseClass - ベースクラス
 * @returns {string} ベースクラスを確実に含むクラス文字列
 */
export const ensureBaseClass = (classString, baseClass) => {
	if (!baseClass) return classString // ベースクラスがない場合は何もしない

	// より厳密なチェック - 単語として完全一致するかを確認
	const classNames = classString.split(/\s+/)
	if (!classNames.includes(baseClass)) {
		return `${baseClass} ${classString}`.trim()
	}
	return classString
}

/**
 * 要素をrecursiveに検索して、data-skip-decoration属性を持つ要素があるか確認
 * @param {React.ReactElement} element - 検索対象のReact要素
 * @returns {boolean} data-skip-decoration属性を持つ要素があればtrue
 */
const hasSkipDecorationAttribute = (element) => {
	if (!element || !element.props) return false

	// data-skip-decoration属性を持っているか確認
	if (element.props['data-skip-decoration'] === 'true') {
		return true
	}

	// 子要素を検索
	const { children } = element.props
	if (children) {
		// 単一の子要素の場合
		if (React.isValidElement(children)) {
			return hasSkipDecorationAttribute(children)
		}

		// 複数の子要素の場合
		if (Array.isArray(children)) {
			return children.some(
				(child) =>
					React.isValidElement(child) && hasSkipDecorationAttribute(child)
			)
		}
	}

	return false
}

/**
 * ハンドラーの結果にベースクラスを適用するデコレーター
 * @param {Object} result - ハンドラーからの結果
 * @param {React.ReactElement} result.reactElement - Reactエレメント
 * @param {string} result.htmlString - HTML文字列
 * @param {string} baseClass - ベースクラス
 * @returns {Object} 装飾された結果
 */
export const decorateWithBaseClass = (result, baseClass) => {
	if (!baseClass) return result
	if (!result) return result

	const { reactElement, htmlString, skipDecoration } = result

	// skipDecorationフラグがある場合は装飾を行わない
	if (skipDecoration === true) {
		return result
	}

	// 要素がdata-skip-decoration属性を持つか確認
	if (reactElement && hasSkipDecorationAttribute(reactElement)) {
		return result
	}

	// React要素のclassNameを修正
	let decoratedReactElement = reactElement
	if (reactElement && reactElement.props) {
		decoratedReactElement = React.cloneElement(reactElement, {
			className: ensureBaseClass(reactElement.props.className || '', baseClass),
		})
	}

	// HTML文字列も修正（正規表現で置換）
	const decoratedHtmlString = htmlString
		? htmlString.replace(
				/class="([^"]*)"/,
				(match, classStr) => `class="${ensureBaseClass(classStr, baseClass)}"`
			)
		: htmlString

	return {
		reactElement: decoratedReactElement,
		htmlString: decoratedHtmlString,
		skipDecoration,
	}
}
