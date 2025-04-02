/**
 * ButtonGroup コンポーネントの型定義
 * @category interactive
 */

export interface ButtonGroupProps {
  /**
   * コンポーネントのバリアント
   * @default "group-vertical"
   */
  variant?: 'group-vertical';
  
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
