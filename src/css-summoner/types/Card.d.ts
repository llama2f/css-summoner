/**
 * Card コンポーネントのプロパティ型定義
 * 
 * カテゴリ: container
 * 自動生成されたインターフェース定義 - 2025-04-11T01:16:08.275Z
 */
export interface CardProps {
  /**
   * コンポーネントの視覚的なスタイルバリアント
   * @default "card-actions"
   * * - `card-actions`: card-actions variant
   * - `card-bordered`: card-bordered variant
   * - `card-compact`: card-compact variant
   * - `card-ghost`: card-ghost variant
   * - `card-horizontal`: card-horizontal variant
   * - `card-outline`: card-outline variant
   * - `card-solid`: card-solid variant
   * - `card-subtle`: card-subtle variant
   */
  variant?: "actions" | "bordered" | "compact" | "ghost" | "horizontal" | "outline" | "solid" | "subtle";

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
