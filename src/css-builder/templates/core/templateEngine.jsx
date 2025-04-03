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
		// 1. バリアントに直接対応するハンドラーを探す
		if (options.variant && registry.components[options.variant]) {
			console.log(`[templateEngine] Using variant handler for: ${options.variant}`)
			return {
				handler: registry.components[options.variant],
				options: mergedOptions
			}
		}
		
		// 2. 親コンポーネントハンドラーでバリアントを処理
		if (options.variant) {
			const parentType = options.variant.split('-')[0]
			if (parentType && registry.components[parentType]) {
				console.log(`[templateEngine] Using parent component handler for variant: ${parentType}/${options.variant}`)
				return {
					handler: registry.components[parentType],
					options: { ...mergedOptions, isVariant: true, variantType: options.variant }
				}
			}
		}
		
		// 3. 直接登録されたハンドラーがあればそれを使用
		if (registry.components[componentType]) {
			// console.log(`[templateEngine] Using direct handler for: ${componentType}`)
			return {
				handler: registry.components[componentType],
				options: mergedOptions
			}
		}
		
		// 4. パターンマッチングで検索
		const patternHandler = findPatternHandler(componentType, registry.patterns)
		if (patternHandler) {
			console.log(`[templateEngine] Using pattern handler for: ${componentType}`)
			return {
				handler: patternHandler,
				options: mergedOptions
			}
		}
		
		// 適切なハンドラーが見つからなかった
		console.log(`[templateEngine] No handler found for: ${componentType}`)
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
