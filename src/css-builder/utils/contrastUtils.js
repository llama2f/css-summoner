/**
 * コントラストと色の変換に関するユーティリティ関数
 */

/**
 * 16進数カラーコードをRGB値に変換
 * @param {string} hex - 16進数カラーコード (#fff または #ffffff 形式)
 * @returns {Object|null} RGB値のオブジェクト {r, g, b} または無効な値の場合はnull
 */
export const hexToRgb = (hex) => {
  if (!hex || typeof hex !== 'string') return null;

  // #を削除
  hex = hex.replace(/^#/, '');

  // 短い形式（#rgb）を通常の形式（#rrggbb）に変換
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * RGB値を16進数カラーコードに変換
 * @param {Object} rgb - RGB値のオブジェクト {r, g, b}
 * @returns {string} 16進数カラーコード (#ffffff 形式)
 */
export const rgbToHex = (rgb) => {
  // RGB文字列の場合（"rgb(123, 123, 123)"形式）を解析
  if (typeof rgb === 'string') {
    const matches = rgb.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (matches) {
      return `#${
        Number(matches[1]).toString(16).padStart(2, '0') +
        Number(matches[2]).toString(16).padStart(2, '0') +
        Number(matches[3]).toString(16).padStart(2, '0')
      }`;
    }
    return rgb; // 変換できない場合は元の値を返す
  }

  // オブジェクトの場合
  if (rgb && typeof rgb === 'object') {
    return `#${
      (rgb.r || 0).toString(16).padStart(2, '0') +
      (rgb.g || 0).toString(16).padStart(2, '0') +
      (rgb.b || 0).toString(16).padStart(2, '0')
    }`;
  }

  return '#000000'; // デフォルト値
};

/**
 * 相対輝度の計算 (WCAG 2.0に基づく)
 * @param {Object} rgb - RGB値のオブジェクト {r, g, b}
 * @returns {number} 相対輝度（0～1の範囲）
 */
export const calculateLuminance = ({ r, g, b }) => {
  // sRGB色空間からリニア色空間への変換
  const rgb = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  // 相対輝度の計算（WCAG 2.0の定義に基づく）
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
};

/**
 * コントラスト比の計算 (WCAG 2.0に基づく)
 * @param {string} color1 - 16進数カラーコード
 * @param {string} color2 - 16進数カラーコード
 * @returns {number|null} コントラスト比または計算不能な場合はnull
 */
export const calculateContrast = (color1, color2) => {
  if (!color1 || !color2) return null;

  // 16進数カラーコードをRGB値に変換
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return null;

  // 相対輝度を計算
  const luminance1 = calculateLuminance(rgb1);
  const luminance2 = calculateLuminance(rgb2);

  // 明るい色を分子に、暗い色を分母に配置する
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  // コントラスト比を計算
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * コントラスト比の評価（WCAG基準）
 * @param {number} ratio - コントラスト比
 * @returns {Object} 評価結果 {level: 'AAA'|'AA'|'AA Large'|'Fail', color: 'text-color-class'}
 */
export const getContrastRating = (ratio) => {
  if (ratio >= 7) return { level: 'AAA', color: 'text-green-600' };
  if (ratio >= 4.5) return { level: 'AA', color: 'text-blue-600' };
  if (ratio >= 3) return { level: 'AA Large', color: 'text-yellow-600' }; // 大きなテキスト用のAA基準
  return { level: 'Fail', color: 'text-red-600' };
};

/**
 * 背景色に基づいて最適なテキスト色（黒または白）を計算
 * @param {string} bgColor - 16進数カラーコード
 * @returns {string} 最適なテキスト色の16進数コード（黒または白）
 */
export const getContrastTextColor = (bgColor) => {
  const rgb = hexToRgb(bgColor);
  if (!rgb) return '#000000';

  // 相対輝度の計算
  const luminance = calculateLuminance(rgb);

  // 明るい背景には暗いテキスト、暗い背景には明るいテキスト
  return luminance > 0.5 ? '#000000' : '#ffffff';
};
