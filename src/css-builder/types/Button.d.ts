/**
 * Button コンポーネントの型定義
 * @category interactive
 */

export interface ButtonProps {
  /**
   * コンポーネントのバリアント
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'light' | 'dark' | 'outline-primary' | 'outline-secondary' | 'outline-accent' | 'outline-neutral' | 'ghost-primary' | 'ghost-secondary' | 'ghost-accent' | 'ghost-neutral' | 'gradient-primary' | 'gradient-secondary' | 'gradient-accent' | 'link-primary' | 'link-secondary' | 'link-accent';
  
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
