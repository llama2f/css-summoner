// index.jsx
// コンポーネントテンプレートシステムのメインエントリーポイント

import { generateTemplate } from './core/templateEngine'
import registry from './registry'
import { sampleIcon } from './handlers/common'

/**
 * コンポーネントタイプに基づいてテンプレートを生成
 * React要素とHTML文字列の両方を返す
 * 
 * @param {string} componentType - コンポーネントタイプ
 * @param {Object} options - オプション
 * @returns {Object} - {reactElement, htmlString}
 */
export const getComponentTemplate = (componentType, options = {}) => {
  return generateTemplate(componentType, options, registry)
}

/**
 * Reactコンポーネントのみを取得
 * 
 * @param {string} componentType - コンポーネントタイプ
 * @param {Object} options - オプション
 * @returns {React.ReactElement} - Reactエレメント
 */
export const getComponentReactTemplate = (componentType, options = {}) => {
  console.log('[index.jsx] getComponentReactTemplate called with:', componentType, options); // デバッグログ追加
  console.log('[index.jsx] Registry object:', registry); // デバッグログ追加
  const { reactElement } = generateTemplate(componentType, options, registry)
  console.log('[index.jsx] generateTemplate returned:', reactElement); // デバッグログ追加
  return reactElement
}

/**
 * HTML文字列のみを取得
 * 
 * @param {string} componentType - コンポーネントタイプ
 * @param {Object} options - オプション
 * @returns {string} - HTML文字列
 */
export const getComponentHtmlTemplate = (componentType, options = {}) => {
  const { htmlString } = generateTemplate(componentType, options, registry)
  return htmlString
}

/**
 * カスタムハンドラーを登録
 * 
 * @param {string} type - コンポーネントタイプ
 * @param {Function} handler - ハンドラー関数
 */
export const registerHandler = (type, handler) => {
  registry.registerComponent(type, handler)
}

/**
 * カスタムパターンハンドラーを登録
 * 
 * @param {string} pattern - 正規表現パターン
 * @param {Function} handler - ハンドラー関数
 */
export const registerPatternHandler = (pattern, handler) => {
  registry.registerPattern(pattern, handler)
}

// サンプルアイコンも再エクスポート
export { sampleIcon }

// デフォルトエクスポート
export default {
  getComponentTemplate,
  getComponentReactTemplate,
  getComponentHtmlTemplate,
  registerHandler,
  registerPatternHandler,
  sampleIcon
}
