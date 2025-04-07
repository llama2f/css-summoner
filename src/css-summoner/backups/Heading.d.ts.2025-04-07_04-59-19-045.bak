/**
 * Heading コンポーネントのプロパティ型定義
 * カテゴリ: typography
 */
export interface HeadingProps {
  /**
   * コンポーネントの視覚的なスタイルバリアント。
   * @default "accent-border"
   */
  variant?: 'accent-border' | 'accent-gradient' | 'accent-stripe' | 'casual-badge' | 'casual-dotted' | 'casual-handwritten' | 'casual-highlight' | 'casual-wavy' | 'formal-boxed' | 'formal-double' | 'formal-full' | 'formal-primary' | 'formal-underline' | 'japanesque-brush' | 'japanesque-vertical' | 'modern-minimal' | 'modern-oversized' | 'modern-split' | 'technical-bracket' | 'technical-code' | 'technical-comment' | 'technical-tag';

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
