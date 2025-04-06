/**
 * Infobox コンポーネントのプロパティ型定義
 * カテゴリ: notification
 */
export interface InfoboxProps {
  /**
   * コンポーネントの視覚的なスタイルバリアント。
   * @default "ghost"
   */
  variant?: 'ghost' | 'outline' | 'solid' | 'title';

  /**
   * コンポーネントのサイズ。
   * @default "xs"
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * コンポーネントの角丸の程度。
   */
  radius?: 'rounded-none' | 'rounded-sm' | 'rounded' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl' | 'rounded-full';

  /**
   * 追加のスタイル修飾子 (例: 影、アニメーション)。
   * @example ["shadow", "animate-up"]
   */
  modifiers?: Array<'with-icon' | 'compact' | 'hover' | 'hover-down' | 'hover-scale' | 'hover-overlay' | 'hover-border' | 'hover-ghost'>;

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
