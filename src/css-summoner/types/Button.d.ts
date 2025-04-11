/**
 * Button コンポーネントのプロパティ型定義
 * 
 * カテゴリ: interactive
 * 自動生成されたインターフェース定義 - 2025-04-11T01:16:08.275Z
 */
export interface ButtonProps {
  /**
   * コンポーネントの視覚的なスタイルバリアント
   * @default "btn-group"
   * * - `btn-group`: btn-group variant
   * - `btn-ghost`: btn-ghost variant
   * - `btn-gradient`: btn-gradient variant
   * - `btn-icon`: btn-icon variant
   * - `btn-icon-ghost`: btn-icon-ghost variant
   * - `btn-icon-outline`: btn-icon-outline variant
   * - `btn-link`: btn-link variant
   * - `btn-outline`: btn-outline variant
   * - `btn-solid`: btn-solid variant
   * - `btn-subtle`: btn-subtle variant
   */
  variant?: "group" | "ghost" | "gradient" | "icon" | "ghost" | "outline" | "link" | "outline" | "solid" | "subtle";

  /**
   * カラースキーム (例: color-primary, color-secondary)
   * @default "color-neutral"
   */
  color?: string;

  /**
   * コンポーネントのサイズ
   */
  size?: string;

  /**
   * 角丸の設定
   */
  radius?: string;

  /**
   * 追加のスタイル修飾子 (例: shadow, animate-up)
   * @default "[]"
   */
  modifiers?: Array<string>;

  /**
   * 追加のCSSクラス名
   * @default """"
   */
  class?: string;

  /**
   * その他のHTML属性
   */
  [key: string]: any;
}
