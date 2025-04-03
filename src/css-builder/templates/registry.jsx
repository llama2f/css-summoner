// registry.jsx
// コンポーネントハンドラーのレジストリ

// 各種ハンドラーをインポート
import { buttonHandlers } from './handlers/buttonHandlers'
import { cardHandlers } from './handlers/cardHandlers'
import { infoboxHandlers } from './handlers/infoboxHandlers'
import { headingPatternHandler } from './handlers/headingHandlers'
import {  formHandlers } from './handlers/formHandlers'
import { imagePatternHandler } from './handlers/imageHandlers'
import { textPatternHandler } from './handlers/textHandlers'

/**
 * コンポーネントレジストリ
 * すべてのコンポーネントハンドラーとパターンハンドラーを管理
 */ 
const componentRegistry = {
  // 登録済みコンポーネント（directルックアップ用）
  // 特定の名前と完全に一致するコンポーネントタイプのハンドラー
  // O(1)の時間複雑度で高速に検索できる
  components: {
    ...buttonHandlers,
    ...cardHandlers,
    ...infoboxHandlers,
    ...formHandlers,
  },

  // パターンハンドラー
  // 正規表現を使用した部分一致のコンポーネントタイプのハンドラー
  // 直接登録されていないコンポーネントタイプのフォールバックとして機能する
  patterns: {
    ...headingPatternHandler,
    ...imagePatternHandler,
    ...textPatternHandler
  },
  
  // 登録後のチェック
  checkComponents: function() { 
    return this;
  },

  /**
   * コンポーネントハンドラーを登録
   * @param {string} type - コンポーネントタイプ 
   * @param {Function} handler - ハンドラー関数
   */
  registerComponent: function(type, handler) {
    this.components[type] = handler
    console.log(`コンポーネント "${type}" を登録しました`)
    return this
  },

  /**
   * パターンハンドラーを登録
   * @param {string} pattern - 正規表現パターン
   * @param {Function} handler - ハンドラー関数
   */
  registerPattern: function(pattern, handler) {
    this.patterns[pattern] = handler
    console.log(`パターン "${pattern}" を登録しました`)
    return this
  },

  /**
   * コンポーネントハンドラーの登録を解除
   * @param {string} type - コンポーネントタイプ
   */
  unregisterComponent: function(type) {
    if (this.components[type]) {
      delete this.components[type]
      console.log(`コンポーネント "${type}" の登録を解除しました`)
    }
    return this
  },

  /**
   * パターンハンドラーの登録を解除
   * @param {string} pattern - 正規表現パターン
   */
  unregisterPattern: function(pattern) {
    if (this.patterns[pattern]) {
      delete this.patterns[pattern]
      console.log(`パターン "${pattern}" の登録を解除しました`)
    }
    return this
  }
}

// 登録確認後にエクスポート
componentRegistry.checkComponents();

export default componentRegistry
