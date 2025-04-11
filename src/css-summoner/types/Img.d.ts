/**
 * Img コンポーネントのプロパティ型定義
 * 
 * カテゴリ: media
 * 自動生成されたインターフェース定義 - 2025-04-11T01:16:08.274Z
 */
export interface ImgProps {
  /**
   * コンポーネントの視覚的なスタイルバリアント
   * @default "img-aspect-portrait"
   * * - `img-aspect-portrait`: img-aspect-portrait variant
   * - `img-aspect-square`: img-aspect-square variant
   * - `img-aspect-video`: img-aspect-video variant
   * - `img-border`: img-border variant
   * - `img-border-accent`: img-border-accent variant
   * - `img-border-double`: img-border-double variant
   * - `img-border-primary`: img-border-primary variant
   * - `img-border-secondary`: img-border-secondary variant
   * - `img-brightness-high`: img-brightness-high variant
   * - `img-brightness-low`: img-brightness-low variant
   * - `img-container`: img-container variant
   * - `img-caption-hover`: img-caption-hover variant
   * - `img-caption-overlay`: img-caption-overlay variant
   * - `img-circle`: img-circle variant
   * - `img-container`: img-container variant
   * - `img-contrast-high`: img-contrast-high variant
   * - `img-float-left`: img-float-left variant
   * - `img-float-right`: img-float-right variant
   * - `img-grayscale`: img-grayscale variant
   * - `img-grayscale-hover`: img-grayscale-hover variant
   * - `img-grid`: img-grid variant
   * - `img-rounded`: img-rounded variant
   * - `img-rounded-lg`: img-rounded-lg variant
   * - `img-rounded-sm`: img-rounded-sm variant
   * - `img-sepia`: img-sepia variant
   * - `img-shadow`: img-shadow variant
   * - `img-shadow-lg`: img-shadow-lg variant
   * - `img-shadow-sm`: img-shadow-sm variant
   * - `img-w-1`: img-w-1 variant
   * - `img-w-1`: img-w-1 variant
   * - `img-w-1`: img-w-1 variant
   * - `img-w-3`: img-w-3 variant
   * - `img-w-full`: img-w-full variant
   * - `img-zoom-hover`: img-zoom-hover variant
   */
  variant?: "portrait" | "square" | "video" | "border" | "accent" | "double" | "primary" | "secondary" | "high" | "low" | "container" | "hover" | "overlay" | "circle" | "container" | "high" | "left" | "right" | "grayscale" | "hover" | "grid" | "rounded" | "lg" | "sm" | "sepia" | "shadow" | "lg" | "sm" | "1" | "1" | "1" | "3" | "full" | "hover";

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
