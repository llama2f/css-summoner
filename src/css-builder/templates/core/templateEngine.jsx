// core/templateEngine.jsx
// テンプレートエンジンのコア機能

import React from 'react'
import { decorateWithBaseClass } from '@/css-builder/templates/handlers/common'

/**
 * デフォルトテンプレート - 未登録コンポーネント用のフォールバック
 *
 * @param {string} componentType - コンポーネントタイプ
 * @param {string} classString - 適用するクラス文字列
 * @returns {Object} - {reactElement, htmlString}
 */
export const createDefaultTemplate = (componentType, classString) => {
	// Reactコンポーネント
	const reactElement = (
		<div className={classString}>
			<div className='p-4 border border-dashed border-neutral-400 rounded'>
				<div className='text-sm text-neutral-500 mb-2'>
					コンポーネント: {componentType}
				</div>
				<div className='font-medium'>デフォルトテンプレート</div>
			</div>
		</div>
	)

	// HTML文字列
	const htmlString = `<div class="${classString}">
  <div class="p-4 border border-dashed border-neutral-400 rounded">
    <div class="text-sm text-neutral-500 mb-2">コンポーネント: ${componentType}</div>
    <div class="font-medium">デフォルトテンプレート</div>
  </div>
</div>`

	return { reactElement, htmlString }
}

/**
 * パターンマッチングを使用してハンドラーを検索
 *
 * @param {string} componentType - コンポーネントタイプ
 * @param {Object} patternHandlers - パターンハンドラーのマップ
 * @returns {Function|null} - 一致するハンドラー関数またはnull
 */
export const findPatternHandler = (componentType, patternHandlers) => {
	for (const [pattern, handler] of Object.entries(patternHandlers || {})) {
		if (componentType.match(new RegExp(pattern))) {
			/* console.log(
				`コンポーネント "${componentType}" をパターン "${pattern}" で処理しました`
			) */
			return handler
		}
	}
	return null
}

/**
 * コンポーネントテンプレートを生成
 *
 * @param {string} componentType - コンポーネントタイプ
 * @param {Object} options - オプション
 * @param {Object} registry - コンポーネントレジストリ
 * @returns {Object} - {reactElement, htmlString}
 */
export const generateTemplate = (componentType, options = {}, registry) => {
	// オプションにコンポーネントタイプを追加
	const mergedOptions = {
		...options,
		componentType,
	}

	// 結果を所得
	let result

	// 1. 直接登録されたハンドラーがあればそれを使用
	if (registry.components[componentType]) {
		result = registry.components[componentType](mergedOptions)
	} else {
		// 2. パターンハンドラーを検索
		const patternHandler = findPatternHandler(componentType, registry.patterns)
		if (patternHandler) {
			result = patternHandler(mergedOptions)
		} else {
			// 3. 未登録ならデフォルトテンプレートを返す
			console.log(
				`未登録コンポーネント "${componentType}" にデフォルトテンプレートを適用しました`
			)
			result = createDefaultTemplate(componentType, options.classString || '')
		}
	}

	// 必要に応じてベースクラスを適用するデコレーター
	return decorateWithBaseClass(result, options.baseClass)
}

export default {
	createDefaultTemplate,
	findPatternHandler,
	generateTemplate,
}
