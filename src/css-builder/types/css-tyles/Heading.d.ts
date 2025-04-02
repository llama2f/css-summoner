/**
 * Heading コンポーネントの型定義
 * @category typography
 */

export interface HeadingProps {
  /**
   * コンポーネントのバリアント
   * @default "formal-primary"
   */
  variant?: 'formal-primary' | 'formal-underline' | 'formal-full' | 'casual-dotted' | 'casual-badge' | 'casual-wavy' | 'technical-code' | 'technical-tag' | 'technical-bracket' | 'accent-gradient' | 'accent-border' | 'accent-stripe';
  
  /**
   * コンポーネントのサイズ
   * @default "sm"
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * 角丸の設定
   */
  radius?: string;
  
  /**
   * 追加のモディファイア
   * @example ["shadow", "animate-up"]
   */
  modifiers?: Array<'with-icon' | 'animated'>;
  
  /**
   * 追加のCSSクラス
   */
  addClass?: string;
  
  /**
   * 子要素
   */
  children?: any;
}
