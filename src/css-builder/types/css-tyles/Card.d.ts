/**
 * Card コンポーネントの型定義
 * @category container
 */

export interface CardProps {
  /**
   * コンポーネントのバリアント
   * @default "body"
   */
  variant?: 'body' | 'header' | 'footer' | 'title' | 'subtitle' | 'bordered' | 'shadow-sm' | 'shadow' | 'shadow-lg' | 'primary' | 'secondary' | 'accent' | 'hover' | 'body' | 'horizontal' | 'actions';
  
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
  modifiers?: Array<'shadow-sm' | 'shadow' | 'shadow-lg'>;
  
  /**
   * 追加のCSSクラス
   */
  addClass?: string;
  
  /**
   * 子要素
   */
  children?: any;
}
