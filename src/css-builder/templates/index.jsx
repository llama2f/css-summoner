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
 
  const { reactElement } = generateTemplate(componentType, options, registry)
 
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
  
  
  // HTML生成は通常のgenerateTemplateを使用する
  // バリアント情報は、templateEngineが適切に処理する
  const { htmlString } = generateTemplate(componentType, options, registry);
  return htmlString;
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
