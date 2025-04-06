/**
 * Text コンポーネントのプロパティ型定義
 * カテゴリ: typography
 */
export interface TextProps {
  /**
   * コンポーネントの視覚的なスタイルバリアント。
   * @default "highlight"
   */
  variant?: 'highlight' | 'marker' | 'marker-double' | 'marker-full' | 'marker-stripe' | 'quote' | 'underline' | 'underline-dashed' | 'underline-dotted' | 'underline-thick' | 'underline-wavy';

  /**
   * コンポーネントのサイズ。
   * @default "xs"
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * コンポーネントの角丸の程度。
   */
  radius?: string;

  /**
   * 追加のスタイル修飾子 (例: 影、アニメーション)。
   * @example ["shadow", "animate-up"]
   */
  modifiers?: Array<'center' | 'right' | 'justify' | 'nowrap' | 'shadow' | 'shadow-sm' | 'blur' | 'outlined' | 'serif' | 'sans' | 'mono' | 'vertical'>;

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
