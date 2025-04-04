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
// findPatternHandler からデバッグログを削除
export const findPatternHandler = (componentType, patternHandlers) => {
	const containsRegexMeta = (pattern) => /[\\^$.*+?()[\]{}|]/.test(pattern)

	const sortedPatterns = Object.entries(patternHandlers || {}).sort(
		([patternA], [patternB]) => {
			const aContainsRegex = containsRegexMeta(patternA)
			const bContainsRegex = containsRegexMeta(patternB)

			if (aContainsRegex === bContainsRegex) {
				return patternB.length - patternA.length
			} else {
				return aContainsRegex ? 1 : -1
			}
		}
	)

	for (const [pattern, handler] of sortedPatterns) {
		const isSimpleString = !containsRegexMeta(pattern)
		const regexPattern = isSimpleString ? `^${pattern}$` : pattern

		if (componentType.match(new RegExp(regexPattern))) {
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
	// console.log(`[generateTemplate] Received componentType: ${componentType}, options:`, JSON.stringify(options)) // デバッグログ削除

	// オプションにコンポーネントタイプを追加
	const mergedOptions = {
		...options,
		componentType, // ここで元の componentType が使われる
	}

	// 結果を格納する変数
	let result

	/**
	 * 適切なハンドラーを検索する関数
	 * 検索順序：
	 * 1. 指定されたバリアントに対応する直接ハンドラー
	 * 2. バリアントの親コンポーネントハンドラー
	 * 3. 指定されたコンポーネントタイプの直接ハンドラー
	 * 4. パターンマッチングで検索するハンドラー
	 *
	 * @returns {{handler: Function, options: Object}|null} ハンドラーとオプション、またはnull
	 */
	const findHandler = () => {
		// console.log(`[findHandler] Searching handler for componentType: ${componentType}, variant: ${options.variant}`) // デバッグログ削除

		// 1. バリアント名に直接対応するハンドラー
		if (options.variant && registry.components[options.variant]) {
			// console.log(`[findHandler] Using direct variant handler: ${options.variant}`) // デバッグログ削除
			return {
				handler: registry.components[options.variant],
				options: mergedOptions,
			}
		}

		// 2. バリアント名でパターンマッチング
		if (options.variant) {
			const patternHandler = findPatternHandler(
				options.variant,
				registry.patterns
			)
			if (patternHandler) {
				// console.log(`[findHandler] Using pattern handler for variant: ${options.variant}`) // デバッグログ削除
				// 注意: パターンハンドラーが見つかった場合、componentTypeではなくvariant名を元に処理が進む
				// 必要であれば、ここで options を調整する (例: mergedOptions.originalComponentType = componentType)
				return { handler: patternHandler, options: mergedOptions }
			}
		}

		// 3. コンポーネントタイプに直接対応するハンドラー
		if (registry.components[componentType]) {
			// console.log(`[findHandler] Using direct component handler: ${componentType}`) // デバッグログ削除
			return {
				handler: registry.components[componentType],
				options: mergedOptions,
			}
		}

		// 4. コンポーネントタイプでパターンマッチング
		// (ステップ2でvariantのマッチングが失敗した場合のフォールバック)
		const patternHandler = findPatternHandler(componentType, registry.patterns)
		if (patternHandler) {
			// console.log(`[findHandler] Using pattern handler for component type: ${componentType}`) // デバッグログ削除
			return { handler: patternHandler, options: mergedOptions }
		}

		// 適切なハンドラーが見つからなかった
		// console.log(`[findHandler] No handler found for: ${componentType} (variant: ${options.variant})`) // デバッグログ削除
		return null
	}

	// ハンドラーを検索して実行
	const handlerInfo = findHandler()

	if (handlerInfo) {
		// 見つかったハンドラーを実行
		result = handlerInfo.handler(handlerInfo.options)
	} else {
		// ハンドラーがない場合はデフォルトテンプレート
		console.log(`[templateEngine] Using default template for: ${componentType}`)
		result = createDefaultTemplate(componentType, options.classString || '')
	}

	// 必要に応じてベースクラスを適用するデコレーター
	return decorateWithBaseClass(result, options.baseClass)
}

export default {
	createDefaultTemplate,
	findPatternHandler,
	generateTemplate,
}
