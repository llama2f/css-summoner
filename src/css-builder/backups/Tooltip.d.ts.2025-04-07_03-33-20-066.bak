/**
 * Tooltip コンポーネントのプロパティ型定義
 * カテゴリ: display
 */
export interface TooltipProps {
  /**
   * コンポーネントの視覚的なスタイルバリアント。
   * @default "default"
   */
  variant?: 'default' | 'error' | 'info' | 'outline-default' | 'outline-error' | 'outline-info' | 'outline-success' | 'outline-warning' | 'success' | 'warning';

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
  modifiers?: Array<'sm' | '' | 'lg' | ''>;

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
