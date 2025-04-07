/**
 * Img コンポーネントのプロパティ型定義
 * カテゴリ: media
 */
export interface ImgProps {
  /**
   * コンポーネントの視覚的なスタイルバリアント。
   * @default "aspect-portrait"
   */
  variant?: 'aspect-portrait' | 'aspect-square' | 'aspect-video' | 'border' | 'border-accent' | 'border-double' | 'border-primary' | 'border-secondary' | 'brightness-high' | 'brightness-low' | 'caption-hover' | 'caption-overlay' | 'circle' | 'container' | 'contrast-high' | 'float-left' | 'float-right' | 'grayscale' | 'grayscale-hover' | 'grid' | 'rounded' | 'rounded-lg' | 'rounded-sm' | 'sepia' | 'shadow' | 'shadow-lg' | 'shadow-sm' | 'w-1' | 'w-3' | 'w-full' | 'zoom-hover';

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
