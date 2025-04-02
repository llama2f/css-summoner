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
   * @default "xs"
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * 角丸の設定
   */
  radius?: string;
  
  /**
   * 追加のモディファイア
   * @example ["shadow", "animate-up"]
   */
  modifiers?: Array<'sm' | '' | 'lg' | ''>;
  
  /**
   * 追加のCSSクラス
   */
  addClass?: string;
  
  /**
   * 子要素
   */
  children?: any;
}
