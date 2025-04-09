// src/components/utils/theme.ts
/**
 * テーマ管理ユーティリティ
 *
 * 【基本原則】
 * - Keep It Simple, Stupid (KISS): まずは単純な解決策を試すこと
 * - 実用性優先: ユースケースに合わせた適切な方法を選択
 * - 一貫性: コンポーネント間で視覚的な一貫性を維持
 *
 * 【使用方法】
 * 1. 基本: テーマのみ適用
 *    const classes = getThemeClasses('primary', 'button');
 *
 * 2. カスタムクラスとの併用:
 *    const baseClasses = 'py-2 px-4 rounded';
 *    const classes = `${baseClasses} ${getThemeClasses('primary', 'button')}`;
 *    // Tailwindの後勝ちルールにより、baseClassesとテーマを両立
 *
 * 3. テーマの上書き:
 *    const classes = getThemeClasses('primary', 'button', customClasses);
 *    // customClassesがテーマの同種プロパティを上書きします
 *    // 例：customClassesに'text-red-500'があると、テーマの'text-*'を上書き
 *
 * 【選択のガイドライン】
 * - テーマをベースにしつつ特定のスタイルを調整したい → 方法2
 * - テーマの一部要素を完全に置き換えたい → 方法3
 * - テーマスタイルを最大限に活かしたい → 方法1
 */
export type Theme =
  | "default"
  | "light"
  | "dark"
  | "primary"
  | "secondary"
  | "accent"
  | "transparent";
export type GlobalTheme = "light" | "dark" | "corporate" | "casual";

// ベースとなる共通テーマクラス
export const baseThemeClasses: Record<Theme, string> = {
  default: "text-neutral-dark border-neutral-600/60 transition-colors",
  light:
    "bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 border-neutral-dark/50 transition-colors",
  dark: "bg-neutral-800 text-neutral-100 border-neutral-200 transition-colors",
  primary:
    "bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-primary-light border-primary transition-colors",
  secondary:
    "bg-secondary-light dark:bg-secondary-dark text-secondary-dark dark:text-secondary-light border-secondary transition-colors",
  accent: "bg-accent-light text-neutral-50 border-accent transition-colors",
  transparent:
    "bg-transparent text-neutral-dark border-neutral-800/60 transition-colors",
};

// コンポーネントタイプごとのテーマ拡張
type ComponentType =
  | "text"
  | "button"
  | "icon"
  | "card"
  | "badge"
  | "panel"
  | "tab"
  | "toc"
  | "breadcrumbs";

// コンポーネントタイプごとの拡張クラス
const componentExtensions: Record<ComponentType, Record<Theme, string>> = {
  text: {
    default: "",
    light: "bg-transparent dark:bg-transparent text-neutral-100",
    dark: "bg-transparent dark:bg-transparent text-neutral-800",
    primary: "bg-transparent dark:bg-transparent text-primary-dark ",
    secondary: "bg-transparent dark:bg-transparent text-neutral-dark",
    accent: "bg-transparent dark:bg-transparent text-accent",
    transparent: "bg-transparent dark:bg-transparent text-neutral-dark",
  },
  button: {
    default:
      "bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 border-neutral-dark transition-colors",
    light:
      "hover:bg-neutral-200 hover:text-neutral-800 active:bg-neutral shadow-sm font-bold border ",
    dark: "bg-zinc-700 text-zinc-50 hover:bg-neutral-700 hover:text-neutral-200 active:bg-neutral-200  shadow-sm font-bold",
    primary:
      "bg-primary-dark text-neutral-light dark:text-primary-dark dark:bg-primary-light hover:opacity-90 active:bg-primary-dark shadow-sm font-bold",
    secondary:
      "bg-secondary-dark text-neutral-light dark:text-secondary-dark dark:bg-secondary-light hover:opacity-90 active:bg-secondary-dark shadow-sm font-bold",
    accent:
      "bg-accent text-neutral-light hover:bg-accent-light active:bg-accent-dark shadow-sm font-bold",
    transparent:
      "hover:bg-neutral-light active:bg-neutral-dark hover:text-current border shadow-sm font-bold",
  },
  icon: {
    default: "text-neutral-dark hover:text-neutral active:bg-primary-dark",
    light:
      "bg-transparent dark:bg-transparent text-neutral-400 border-neutral-dark/30 hover:text-neutral-light active:bg-neutral-dark shadow-sm",
    dark: "bg-transparent dark:bg-transparent text-neutral-700 dark:text-neutral-200 hover:text-neutral-light active:bg-neutral-dark shadow-sm",
    primary:
      "bg-transparent dark:bg-transparent text-primary hover:text-primary-dark active:bg-primary-dark",
    secondary:
      "bg-transparent dark:bg-transparent text-secondary hover:text-secondary-dark active:bg-secondary-dark shadow-sm",
    accent:
      "bg-transparent dark:bg-transparent text-accent hover:opacity-90 active:bg-accent shadow-sm",
    transparent:
      "bg-transparent dark:bg-transparent text-neutral-dark hover:text-neutral-light active:bg-neutral-dark border shadow-sm",
  },
  card: {
    default: "bg-zinc-300/10 border-zinc-300/50 shadow-sm hover:shadow",
    light: "shadow-sm hover:shadow",
    dark: "bg-neutral-900/90 dark:bg-neutral-600/10 shadow-sm hover:shadow",
    primary: "shadow-sm hover:shadow",
    secondary: "shadow-sm hover:shadow",
    accent: "shadow-sm hover:shadow",
    transparent: "shadow-sm hover:shadow",
  },
  badge: {
    default: "text-xs font-semibold border border-neutral-500/20",
    light: "text-neutral-700 bg-neutral-100/90 text-xs font-semibold",
    dark: "text-neutral-50 bg-neutral-800/90 text-xs font-semibold",
    primary: "text-primary-dark bg-neutral-500/10 text-xs font-bold",
    secondary:
      "text-secondary-dark bg-neutral-500/10 hover:bg-secondary-light hover:text-secondary-dark text-xs font-bold",
    accent: "text-accent-dark bg-neutral-500/10 text-xs font-bold",
    transparent: "bg-neutral-500/10 text-xs font-bold",
  },
  panel: {
    default: "p-4  rounded",
    light: "p-4  rounded",
    dark: "p-4  rounded",
    primary: "p-4  rounded",
    secondary: "p-4  rounded",
    accent: "p-4  rounded",
    transparent: "p-4  rounded",
  },
  tab: {
    default: "hover:text-neutral active:bg-primary-dark",
    light:
      "bg-neutral-light text-neutral-dark data-[selected=true]:text-neutral-dark data-[selected=true]:border-neutral data-[selected=false]:bg-neutral-500/20 data-[selected=false]:text-neutral-800/70 dark:data-[selected=false]:text-neutral-200/70 data-[selected=false]:hover:bg-neutral hover:text-neutral-dark active:bg-neutral-light",
    dark: "bg-neutral-dark text-neutral-light data-[selected=true]:text-neutral-light data-[selected=true]:border-neutral data-[selected=false]:bg-neutral-500/20 dark:data-[selected=false]:text-neutral-200/70 data-[selected=false]:text-neutral-dark data-[selected=false]:hover:bg-neutral hover:text-neutral-light active:bg-neutral-dark",
    primary:
      "bg-primary-dark text-primary-light data-[selected=true]:text-neutral-light data-[selected=true]:border-primary data-[selected=false]:bg-neutral-500/20 data-[selected=false]:text-primary-dark data-[selected=false]:hover:bg-primary hover:text-primary-light active:bg-primary-dark",
    secondary:
      "bg-secondary-dark text-secondary-light data-[selected=true]:text-neutral-light data-[selected=true]:border-secondary-light data-[selected=false]:bg-neutral-500/20 data-[selected=false]:text-secondary-dark data-[selected=false]:hover:bg-secondary data-[selected=false]:hover:text-secondary-dark hover:text-secondary-light active:bg-secondary-dark",
    accent:
      "bg-accent-dark text-accent-light data-[selected=true]:text-neutral-light data-[selected=true]:border-accent-light data-[selected=false]:bg-neutral-500/20 data-[selected=false]:text-accent-dark data-[selected=false]:hover:bg-accent hover:text-accent-light active:bg-accent-dark",
    transparent:
      "bg-transparent text-neutral-dark data-[selected=true]:text-primary data-[selected=true]:border-primary data-[selected=false]:text-neutral-dark data-[selected=false]:hover:text-primary-dark hover:text-neutral-light active:bg-neutral-dark",
  },
  toc: {
    default: "text-neutral-800 border border-neutral-500/60",
    light: "bg-neutral-100 text-neutral-800 border border-neutral/20",
    dark: "bg-neutral-800/80 text-neutral-100 border border-neutral-200/20",
    primary: "bg-neutral-100/50 text-neutral-800 border border-primary",
    secondary: "bg-neutral-light text-neutral-800 border border-secondary",
    accent: "bg-neutral-100/50 text-neutral-800 border border-accent",
    transparent:
      "bg-transparent text-neutral-dark border border-neutral-800/10",
  },
  breadcrumbs: {
    default: "p-4 bg-neutral",
    light: "p-4 bg-neutral-light",
    dark: "p-4 bg-neutral-dark dark:bg-neutral-800/80",
    primary: "p-4 bg-primary-light dark:bg-primary-dark",
    secondary: "p-4 bg-secondary-light dark:bg-secondary-dark",
    accent: "p-4 bg-accent",
    transparent: "p-4 bg-transparent",
  },
};

/**
 * テーマと追加クラスを組み合わせる関数
 */
/**
 * テーマと追加クラスを組み合わせる関数
 * 優先順位: additionalClasses > componentClasses > baseClasses
 */
export function getThemeClasses(
  theme: Theme = "primary",
  component?: ComponentType,
  additionalClasses: string = "",
): string {
  // 1. ベースのテーマクラスを取得
  let baseClasses = baseThemeClasses[theme];
  let componentClasses = "";

  // 2. コンポーネント固有のスタイルがある場合
  if (component && componentExtensions[component]) {
    componentClasses = componentExtensions[component][theme];

    // プロパティの重複を解決
    const componentProperties = extractProperties(componentClasses);

    // コンポーネント固有のプロパティを優先
    baseClasses = removeOverlappingProperties(baseClasses, componentProperties);
  }

  // ベースとコンポーネントを結合
  let combinedClasses = baseClasses + " " + componentClasses;

  // 3. 追加クラスとの重複も処理
  if (additionalClasses) {
    const additionalProperties = extractProperties(additionalClasses);
    combinedClasses = removeOverlappingProperties(
      combinedClasses,
      additionalProperties,
    );
    combinedClasses += " " + additionalClasses;
  }

  // 余分な空白を整理して返す
  return combinedClasses.trim().replace(/\s+/g, " ");
}

// プロパティ抽出ユーティリティ
function extractProperties(classString: string): Set<string> {
  const properties = new Set<string>();
  const classes = classString.split(" ");

  // Tailwindの主要なプロパティプレフィックス
  const prefixes = [
    "bg",
    "text",
    "shadow",
    "ring",
    "outline",
    "font",
    "p",
    "m",
    "px",
    "py",
    "mx",
    "my",
    "pt",
    "pr",
    "pb",
    "pl",
    "mt",
    "mr",
    "mb",
    "ml",
    "w",
    "h",
    "min-w",
    "min-h",
    "max-w",
    "max-h",
    "flex",
    "grid",
    "rounded",
    "translate",
    "rotate",
    "scale",
    "skew",
    "opacity",
    "transition",
  ];

  classes.forEach((cls) => {
    if (!cls) return;

    // 各プレフィックスに対してチェック
    for (const prefix of prefixes) {
      // 完全一致または -で続くものを検出
      if (cls === prefix || cls.startsWith(`${prefix}-`)) {
        // "p-4" なら "p"、"bg-red-500" なら "bg" を抽出
        properties.add(prefix);
        break;
      }
    }

    // hover:やfocus:のような修飾子付きのものもチェック
    const modifierMatch = cls.match(/^([^:]+):(.*)/);
    if (modifierMatch) {
      const baseClass = modifierMatch[2];
      for (const prefix of prefixes) {
        if (baseClass === prefix || baseClass.startsWith(`${prefix}-`)) {
          // "hover:bg-red-500" なら "hover:bg" を抽出
          properties.add(`${modifierMatch[1]}:${prefix}`);
          break;
        }
      }
    }
  });

  return properties;
}

// 重複プロパティの削除
function removeOverlappingProperties(
  classString: string,
  propertiesToRemove: Set<string>,
): string {
  if (!classString) return "";

  const classes = classString.split(" ").filter(Boolean);
  const filteredClasses = [];

  for (const cls of classes) {
    let shouldKeep = true;

    // 修飾子付きのクラス（hover:, focus:など）をチェック
    const modifierMatch = cls.match(/^([^:]+):(.*)/);
    if (modifierMatch) {
      const modifier = modifierMatch[1]; // hover, focusなど
      const baseClass = modifierMatch[2]; // bg-red-500など

      // 修飾子付きのプロパティ (例: "hover:bg") を確認
      for (const prop of propertiesToRemove) {
        if (prop === `${modifier}:${baseClass.split("-")[0]}`) {
          shouldKeep = false;
          break;
        }
      }
    } else {
      // 通常のプロパティをチェック
      for (const prop of propertiesToRemove) {
        if (
          !prop.includes(":") &&
          (cls === prop || cls.startsWith(`${prop}-`))
        ) {
          shouldKeep = false;
          break;
        }
      }
    }

    if (shouldKeep) {
      filteredClasses.push(cls);
    }
  }

  return filteredClasses.join(" ");
}

// オブジェクト形式のクラスリストを文字列に変換するヘルパー関数
export function classesToString(classes: Record<string, boolean>): string {
  return Object.entries(classes)
    .filter(([_, include]) => include)
    .map(([className]) => className)
    .filter((className) => className) // 空文字列を除外
    .join(" ");
}

/**
 * テーマごとのCSS変数を取得する関数
 */
export function getThemeVars(theme: Theme = "primary"): Record<string, string> {
  const themeVars = {
    light: {
      "--bg-color": "var(--neutral-light)",
      "--text-color": "var(--neutral-dark)",
      "--border-color": "var(--neutral)",
    },
    dark: {
      "--bg-color": "var(--neutral-dark)",
      "--text-color": "var(--neutral-light)",
      "--border-color": "var(--neutral)",
    },
    primary: {
      "--bg-color": "var(--primary)",
      "--text-color": "white",
      "--border-color": "var(--primary-dark)",
    },
    secondary: {
      "--bg-color": "var(--secondary)",
      "--text-color": "white",
      "--border-color": "var(--secondary-dark)",
    },
    transparent: {
      "--bg-color": "transparent",
      "--text-color": "var(--neutral-dark)",
      "--border-color": "var(--neutral-dark)",
    },
  };

  return themeVars[theme];
}

// グローバルテーマをローカルテーマにマッピング
export const themeMapping: Record<GlobalTheme, Record<string, Theme>> = {
  light: {
    button: "light",
    card: "light",
    toggle: "light",
  },
  dark: {
    button: "dark",
    card: "dark",
    toggle: "dark",
  },
  corporate: {
    button: "primary",
    card: "light",
    toggle: "secondary",
  },
  casual: {
    button: "secondary",
    card: "primary",
    toggle: "primary",
  },
};
