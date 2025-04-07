/**
 * Form コンポーネントのプロパティ型定義
 * カテゴリ: form-controls
 */
export interface FormProps {
  /**
   * コンポーネントの視覚的なスタイルバリアント。
   * @default "checkbox"
   */
  variant?: 'checkbox' | 'feedback' | 'input' | 'radio' | 'search' | 'select' | 'switch' | 'textarea';

  /**
   * コンポーネントのサイズ。
   * @default ""
   */
  size?: string;

  /**
   * コンポーネントの角丸の程度。
   */
  radius?: string;

  /**
   * 追加のスタイル修飾子 (例: 影、アニメーション)。
   * @example ["shadow", "animate-up"]
   */
  modifiers?: Array<string>;

  /**
   * Tailwindクラスなど、追加で適用するCSSクラス文字列。
   */
  addClass?: string;

  /**
   * コンポーネント内に表示される子要素 (Reactノード)。
   */
  children?: React.ReactNode; // any より React.ReactNode が望ましい

  // 必要に応じて他の共通プロパティを追加 (例: id, aria-label など)
  // id?: string;
  // 'aria-label'?: string;
}
