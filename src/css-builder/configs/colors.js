// カラーレジストリ：UIから選択できる色の設定
export const colorRegistry = {
  primary: {
    value: 'color-primary',
    label: 'プライマリ',
    description: '主要なアクションに使用する色',
    cssVar: '--primary'
  },
  secondary: {
    value: 'color-secondary',
    label: 'セカンダリ',
    description: '補助的なアクションに使用する色',
    cssVar: '--secondary'
  },
  accent: {
    value: 'color-accent',
    label: 'アクセント',
    description: '注目を集めるアクションに使用する色',
    cssVar: '--accent'
  },
  neutral: {
    value: 'color-neutral',
    label: 'ニュートラル',
    description: '一般的なアクションに使用する色',
    cssVar: '--neutral'
  },
  dark: {
    value: 'color-dark',
    label: 'ダーク',
    description: '明るい背景上での表示に適した暗い色',
    cssVar: '--neutral-dark'
  },
  light: {
    value: 'color-light',
    label: 'ライト',
    description: '暗い背景上での表示に適した明るい色',
    cssVar: '--neutral-light'
  },
  custom: {
    value: 'color-custom',
    label: 'カスタム',
    description: 'カラーピッカーで選択したカスタム色',
    cssVar: '--custom-color',
    isCustom: true
  }
}

// 他のカラー関連の設定
export const colorOptions = [
  { value: '', label: 'なし', description: '色を指定しない' },
  ...Object.entries(colorRegistry).map(([key, color]) => ({
    value: color.value,
    label: color.label,
    description: color.description,
    cssVar: color.cssVar,
    isCustom: color.isCustom || false
  }))
]

// カスタムカラー設定のデフォルト値
export const defaultCustomColor = {
  mainColor: '#6366f1', // インディゴ
  textColor: '#ffffff',  // 白
  autoTextColor: true,   // テキスト色を自動設定
  autoBorderColor: true  // ボーダー色を自動設定
}

// コントラスト比に基づいてテキスト色を決定（白or黒）
export const getContrastTextColor = (bgColor) => {
  // カラーコードからRGB値を取得
  const r = parseInt(bgColor.slice(1, 3), 16);
  const g = parseInt(bgColor.slice(3, 5), 16);
  const b = parseInt(bgColor.slice(5, 7), 16);
  
  // 明度の計算（W3C方式）
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // 明度が0.5より大きい（明るい色）なら黒、そうでなければ白
  return luminance > 0.5 ? '#000000' : '#ffffff';
}
