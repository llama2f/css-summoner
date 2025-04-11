/**
 * Badge コンポーネントのプロパティ型定義
 * 
 * カテゴリ: display
 * 自動生成されたインターフェース定義 - 2025-04-11T01:16:08.276Z
 */
export interface BadgeProps {
  /**
   * コンポーネントの視覚的なスタイルバリアント
   * @default "badge-outline"
   * * - `badge-outline`: badge-outline variant
   * - `badge-solid`: badge-solid variant
   * - `badge-subtle`: badge-subtle variant
   */
  variant?: "outline" | "solid" | "subtle";

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
