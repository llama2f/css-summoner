/**
 * Infobox コンポーネントの型定義
 * @category notification
 */

export interface InfoboxProps {
  /**
   * コンポーネントのバリアント
   * @default "with-icon"
   */
  variant?: 'with-icon' | 'info' | 'success' | 'warning' | 'error' | 'note' | 'outline' | 'bordered' | 'shadow' | 'square' | 'icon' | 'title' | 'compact';
  
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
  modifiers?: Array<'outline' | 'bordered' | 'shadow' | 'square' | 'with-icon' | 'compact'>;
  
  /**
   * 追加のCSSクラス
   */
  addClass?: string;
  
  /**
   * 子要素
   */
  children?: any;
}
