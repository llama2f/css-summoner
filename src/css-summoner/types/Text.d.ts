/**
 * Text コンポーネントのプロパティ型定義
 * 
 * カテゴリ: typography
 * 自動生成されたインターフェース定義 - 2025-04-11T01:16:08.273Z
 */
export interface TextProps {
  /**
   * コンポーネントの視覚的なスタイルバリアント
   * @default "text-highlight"
   * * - `text-highlight`: text-highlight variant
   * - `text-marker`: text-marker variant
   * - `text-marker-double`: text-marker-double variant
   * - `text-marker-full`: text-marker-full variant
   * - `text-marker-stripe`: text-marker-stripe variant
   * - `text-quote`: text-quote variant
   * - `text-underline`: text-underline variant
   * - `text-underline-dashed`: text-underline-dashed variant
   * - `text-underline-dotted`: text-underline-dotted variant
   * - `text-underline-thick`: text-underline-thick variant
   * - `text-underline-wavy`: text-underline-wavy variant
   */
  variant?: "highlight" | "marker" | "double" | "full" | "stripe" | "quote" | "underline" | "dashed" | "dotted" | "thick" | "wavy";

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
