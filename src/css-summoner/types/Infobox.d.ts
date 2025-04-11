/**
 * Infobox コンポーネントのプロパティ型定義
 * 
 * カテゴリ: notification
 * 自動生成されたインターフェース定義 - 2025-04-11T01:16:08.273Z
 */
export interface InfoboxProps {
  /**
   * コンポーネントの視覚的なスタイルバリアント
   * @default "infobox-ghost"
   * * - `infobox-ghost`: infobox-ghost variant
   * - `infobox-outline`: infobox-outline variant
   * - `infobox-solid`: infobox-solid variant
   * - `infobox-title`: infobox-title variant
   */
  variant?: "ghost" | "outline" | "solid" | "title";

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
