/**
 * Form コンポーネントのプロパティ型定義
 * 
 * カテゴリ: form-controls
 * 自動生成されたインターフェース定義 - 2025-04-11T01:16:08.275Z
 */
export interface FormProps {
  /**
   * コンポーネントの視覚的なスタイルバリアント
   * @default "form-checkbox"
   * * - `form-checkbox`: form-checkbox variant
   * - `form-feedback`: form-feedback variant
   * - `form-input`: form-input variant
   * - `form-radio`: form-radio variant
   * - `form-search`: form-search variant
   * - `form-select`: form-select variant
   * - `form-switch`: form-switch variant
   * - `form-textarea`: form-textarea variant
   */
  variant?: "checkbox" | "feedback" | "input" | "radio" | "search" | "select" | "switch" | "textarea";

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
