// templates/componentFactory.jsx
// 互換性のためのラッパー - 新しいインターフェースを呼び出す

import {
  getComponentTemplate,
  getComponentReactTemplate,
  getComponentHtmlTemplate
} from './index'

// 既存の呼び出し元を壊さないようにするための互換レイヤー
export {
  getComponentTemplate,
  getComponentReactTemplate,
  getComponentHtmlTemplate
}

// デフォルトエクスポート
export default {
  getComponentTemplate,
  getComponentReactTemplate,
  getComponentHtmlTemplate
}
