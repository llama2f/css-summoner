/**
 * TextQuote コンポーネントの型定義
 * @category typography
 */

export interface TextQuoteProps {
  /**
   * コンポーネントのバリアント
   * @default "quote-primary"
   */
  variant?: 'quote-primary' | 'quote-secondary' | 'quote-accent';
  
  /**
   * コンポーネントのサイズ
   * @default ""
   */
  size?: string;
  
  /**
   * 角丸の設定
   */
  radius?: string;
  
  /**
   * 追加のモディファイア
   * @example ["shadow", "animate-up"]
   */
  modifiers?: Array<string>;
  
  /**
   * 追加のCSSクラス
   */
  addClass?: string;
  
  /**
   * 子要素
   */
  children?: any;
}
