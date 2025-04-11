/**
 * Heading コンポーネントのプロパティ型定義
 * 
 * カテゴリ: typography
 * 自動生成されたインターフェース定義 - 2025-04-11T01:16:08.274Z
 */
export interface HeadingProps {
  /**
   * コンポーネントの視覚的なスタイルバリアント
   * @default "heading-accent-border"
   * * - `heading-accent-border`: heading-accent-border variant
   * - `heading-accent-gradient`: heading-accent-gradient variant
   * - `heading-accent-stripe`: heading-accent-stripe variant
   * - `heading-casual-badge`: heading-casual-badge variant
   * - `heading-casual-dotted`: heading-casual-dotted variant
   * - `heading-casual-handwritten`: heading-casual-handwritten variant
   * - `heading-casual-highlight`: heading-casual-highlight variant
   * - `heading-casual-wavy`: heading-casual-wavy variant
   * - `heading-formal-boxed`: heading-formal-boxed variant
   * - `heading-formal-double`: heading-formal-double variant
   * - `heading-formal-full`: heading-formal-full variant
   * - `heading-formal-primary`: heading-formal-primary variant
   * - `heading-formal-underline`: heading-formal-underline variant
   * - `heading-japanesque-brush`: heading-japanesque-brush variant
   * - `heading-japanesque-vertical`: heading-japanesque-vertical variant
   * - `heading-modern-minimal`: heading-modern-minimal variant
   * - `heading-modern-oversized`: heading-modern-oversized variant
   * - `heading-modern-split`: heading-modern-split variant
   * - `heading-technical-bracket`: heading-technical-bracket variant
   * - `heading-technical-code`: heading-technical-code variant
   * - `heading-technical-comment`: heading-technical-comment variant
   * - `heading-technical-tag`: heading-technical-tag variant
   */
  variant?: "border" | "gradient" | "stripe" | "badge" | "dotted" | "handwritten" | "highlight" | "wavy" | "boxed" | "double" | "full" | "primary" | "underline" | "brush" | "vertical" | "minimal" | "oversized" | "split" | "bracket" | "code" | "comment" | "tag";

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
