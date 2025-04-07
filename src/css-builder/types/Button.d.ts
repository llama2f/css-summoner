/**
 * Button コンポーネントのプロパティ型定義
 * カテゴリ: interactive
 */
export interface ButtonProps {
  /**
   * コンポーネントの視覚的なスタイルバリアント。
   * @default "group"
   */
  variant?: 'group' | 'ghost' | 'gradient' | 'icon' | 'icon-ghost' | 'icon-outline' | 'link' | 'outline' | 'solid' | 'subtle';

  /**
   * コンポーネントのサイズ。
   * @default "xs"
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * コンポーネントの角丸の程度。
   */
  radius?: 'btn-rounded-sm' | 'btn-rounded-lg' | 'btn-rounded-full' | 'btn-square';

  /**
   * 追加のスタイル修飾子 (例: 影、アニメーション)。
   * @example ["shadow", "animate-up"]
   */
  modifiers?: Array<'full' | 'animate-up' | 'animate-down' | 'animate-pulse' | 'icon-left' | 'icon-right' | 'icon-only'>;

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
