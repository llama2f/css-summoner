# CSS Builder スタイリングガイド

このドキュメントでは、CSS Builderプロジェクト内のコンポーネントの構造、各ファイルの役割、およびスタイリング方法について説明します。このガイドラインに従うことで、一貫性のあるスタイリングとメンテナンス性の高いコードを実現できます。

## フォルダ構成

CSS Builderのスタイルコンポーネントは以下のような構造になっています：

```
/src/css-builder/styles/
├── button/           # ボタンコンポーネント
│   ├── base.css      # 基本スタイルと変数定義
│   ├── variants.css  # バリアントスタイル
│   ├── utilities.css # ユーティリティクラス
│   └── index.css     # インポート管理
├── card/             # カードコンポーネント
├── form/             # フォームコンポーネント
├── heading/          # 見出しコンポーネント
├── colors/           # カラー定義
│   ├── base.css      # ベースカラー変数
│   ├── variants.css  # カラーバリエーション
│   └── monochrome.css # モノクロベース
├── ...
├── styles.css        # 全体スタイル
├── class-builder.css # カスタムクラスビルダーUI用スタイル
├── builder.css       # ビルダー機能用スタイル
├── utils.css         # 共通ユーティリティ
└── all-components.css # すべてのコンポーネントのインポート
```

## コンポーネント構造

各コンポーネントは、次のパターンに従ってファイルが組織されています：

### 1. base.css

- **主な役割**: ベーススタイルの定義とCSS変数の宣言
- **内容**:
  - コンポーネント固有のCSS変数
  - ダークモード用の変数
  - 印刷用スタイル調整
  - 基本的なコンポーネントスタイル（`.[component]-base`）の定義
  - フォーカス、ホバー、アクティブなどの状態スタイル

### 2. variants.css

- **主な役割**: 各種バリアント（種類）のスタイル定義
- **内容**:
  - カラーバリエーション（primary, secondary, accent, neutral, light, dark）
  - レイアウトバリエーション（サイズ、配置など）
  - スタイルバリエーション（outline, ghost, gradient, link など）
  - 特殊バリエーション（コンポーネント固有のバリアント）

### 3. utilities.css

- **主な役割**: サイズや形状などのユーティリティクラスとモディファイア
- **内容**:
  - サイズバリエーション（xs, sm, md, lg, xl）
  - 形状バリエーション（rounded, square）
  - エフェクトクラス（shadow, full）
  - アニメーションクラス（animate-up, animate-down, animate-pulse）
  - レイアウト調整クラス（配置、マージン、パディング）
  - 印刷時のスタイル調整

### 4. index.css

- **主な役割**: コンポーネント全体のインポート管理とメタ情報
- **内容**:
  - 各スタイルファイルのインポート
  - コンポーネントの説明と使用例のコメント
  - バージョン情報やメンテナンス情報

## 新しいスタイリング方法：モノクロームとカラーセレクタ

### 1. モノクロベースのスタイリング

モノクロベーススタイルは、コンポーネントの基本構造を色に依存せず定義するアプローチです。これにより、カラーセレクタを使用して後からカラーバリエーションを適用できるようになります。

```css
/* モノクロベースのボタン定義例 */
.btn-base {
  @apply inline-flex items-center justify-center;
  @apply font-medium text-center whitespace-nowrap;
  @apply select-none cursor-pointer;
  @apply transition-all duration-200;
  
  /* カラー関連のスタイルをここでは定義しない */
  /* 代わりにカラークラスで上書きできるようにする */
}

/* ホバー/フォーカスのベース振る舞い（カラー非依存） */
.btn-base:hover, .btn-base:focus-visible {
  @apply outline-none;
  /* 個別カラークラスで色を定義 */
}
```

#### モノクロベースの利点

- **コンポーネントの再利用性向上**: 色の定義から独立した構造設計により、様々なテーマに適応しやすくなります
- **テーマ切り替えの簡素化**: ダークモードなどのテーマ切り替えが容易になります
- **カラーシステムの統一**: アプリケーション全体で一貫したカラーシステムを維持できます
- **アクセシビリティの向上**: コントラスト比を一元管理しやすくなります

### 2. カラーセレクタ

カラーセレクタを使用して、モノクロベースのコンポーネントに色を適用します。これは `.color-[variant]` クラスを使用して実現されます。

```css
/* カラーセレクタクラスの例 */
.color-primary {
  background-color: var(--primary);
  color: var(--primary-text);
  border-color: var(--primary-border, var(--primary));
}

.color-secondary {
  background-color: var(--secondary);
  color: var(--secondary-text);
  border-color: var(--secondary-border, var(--secondary));
}

/* バリエーション（アウトライン、ゴーストなど）のためのクラス */
.btn-outline.color-primary {
  background-color: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
}

/* ホバー状態 */
.color-primary:hover {
  background-color: var(--primary-hover, var(--primary-dark, var(--primary)));
}
```

#### カラーセレクタの使用例

```html
<!-- プライマリカラーのボタン -->
<button class="btn-base btn-solid color-primary">プライマリボタン</button>

<!-- セカンダリカラーのアウトラインボタン -->
<button class="btn-base btn-outline color-secondary">セカンダリアウトライン</button>

<!-- アクセントカラーのカード -->
<div class="card-base color-accent">
  <div class="card-header">アクセントカード</div>
  <div class="card-body">内容</div>
</div>
```

### 3. カスタムカラー設定

カスタムカラーピッカーを使用して、あらかじめ定義されたカラーテーマ以外のカスタムカラーを適用できます。

#### カスタムカラーの使用方法

1. クラスビルダーUIでカラーセレクタから「カスタム」を選択
2. カラーピッカーが表示され、以下の設定が可能：
   - メインカラー：コンポーネントの主要色
   - テキストカラー：テキストの色（自動設定可能）
   - ボーダーカラー：境界線の色（自動設定可能）
3. プリセットカラーから選択するか、HEX値を直接入力
4. 「適用」をクリックして設定を保存

```html
<!-- カスタムカラーのボタン -->
<button class="btn-base btn-solid color-custom">カスタムカラーボタン</button>
```

カスタムカラーは次のCSS変数を自動的に設定します：
- `--custom-color`: メインのカスタムカラー
- `--custom-text-color`: テキスト色
- `--custom-border-color`: ボーダー色
- `--custom-hover-color`: ホバー時の色（自動計算）
- `--custom-active-color`: アクティブ時の色（自動計算）

## スタイリング方法

### 1. Tailwind CSSレイヤーの活用

プロジェクトでは、次のCSSレイヤーを使用してスタイルの優先順位を管理しています：

```css
/* base.cssでの使用例 */
@layer base {
  :root {
    /* 基本変数定義 */
    --primary: #1a568e;
    --secondary: #95c75d;
    --accent: #ef6428;
  }
  
  /* ベースコンポーネントスタイル */
  .btn-base {
    @apply inline-flex items-center justify-center;
    @apply font-medium text-center whitespace-nowrap;
    @apply select-none cursor-pointer;
  }
}

/* variants.cssでの使用例 */
@layer components {
  .btn-primary {
    background-color: var(--btn-primary-bg);
    color: var(--btn-primary-text);
  }
}

/* utilities.cssでの使用例 */
@layer utilities {
  .btn-shadow {
    box-shadow: var(--btn-shadow-md);
  }
}
```

これにより、スタイルの詳細度の問題を解決し、一貫性のあるスタイルの適用を実現します。

### 2. CSSアノテーション

コンポーネント情報を抽出するためのアノテーションが各クラスに付与されています：

```css
/* 
 * @component: [コンポーネント名]  // コンポーネント名
 * @variant: [バリアント名]       // バリアント名 
 * @description: [説明文]         // 説明
 * @category: [カテゴリ名]        // カテゴリ
 * @example: [使用例のHTMLコード]  // 使用例
 */
.[クラス名] {
  // スタイル定義
}
```

このアノテーションは以下の目的で使用されます：
- TypeScript型定義ファイルの自動生成
- Astroドキュメントページの生成
- Astroコンポーネントの生成
- カスタムクラスビルダーUIでの表示

### 3. CSS変数を活用したテーマ設定

CSS変数を使用して、テーマやコンポーネントの設定を一元管理します。フォールバック値も指定して安全性を高めます。

```css
/* グローバル変数定義の例 */
:root {
  /* カラー変数（プロジェクト全体で使用） */
  --primary: #1a568e;
  --secondary: #95c75d;
  --accent: #ef6428;
  --neutral-light: #fafafa;
  --neutral: #e4e4e4;
  --neutral-dark: #242424;
}

/* コンポーネント固有の変数定義の例 */
:root {
  /* ボタン用変数 - フォールバック値を含む */
  --btn-font-family: var(--font, sans-serif);
  --btn-padding-x-md: 1rem;
  --btn-padding-y-md: 0.625rem;
  
  /* カラー変数 - グローバル変数の参照とフォールバック */
  --btn-primary-bg: var(--primary, #1a568e);
  --btn-primary-text: var(--neutral-light, #fafafa);
  --btn-shadow-md: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
}

/* ダークモード用の変数上書き */
:root.dark {
  --btn-primary-bg: var(--primary-dark, #0e2c47);
  --btn-primary-text: var(--neutral-light, #fafafa);
}

/* 印刷用の変数上書き */
@media print {
  :root {
    --btn-padding-x-md: 0.5rem;
    --btn-padding-y-md: 0.25rem;
    --btn-shadow-md: none;
  }
}
```

変数の命名規則：
- グローバル変数：`--[property-name]`
- コンポーネント変数：`--[component]-[property-name]`
- 状態変数：`--[component]-[state]-[property-name]`
- カラー変数：`--[color-name]`, `--[color-name]-light`, `--[color-name]-dark`

### 4. Tailwindの活用とカスタム設定

サイズ、間隔、影などの値は基本的にTailwindのユーティリティクラスを使用します。カスタム値が必要な場合は、Tailwindの値を参照するようにします。

```css
/* Tailwindユーティリティの使用例 */
.card-header {
  @apply p-4 border-b font-semibold;
}

.btn-base {
  @apply inline-flex items-center justify-center;
  @apply font-medium text-center whitespace-nowrap;
  @apply select-none cursor-pointer;
}

/* カスタム値が必要な場合はTailwindの値を参照 */
:root {
  --btn-border-radius: 0.375rem; /* rounded-md */
  --btn-border-radius-sm: 0.25rem; /* rounded-sm */
  --btn-border-radius-lg: 0.5rem; /* rounded-lg */
}
```

### 5. 新しいクラスの組み合わせ方法

コンポーネントは以下のようなクラスの組み合わせで構築します：

1. **ベースクラス**（必須）
   - `[component]-base` - すべてのコンポーネントに必要な基本スタイル

2. **スタイルバリアント**（必須）
   - `[component]-solid`, `[component]-outline` など

3. **カラーセレクタ**（必須）
   - `color-primary`, `color-secondary`, `color-custom` など

4. **サイズクラス**（オプション）
   - `[component]-xs`, `[component]-sm`, `[component]-md` など

5. **形状クラス**（オプション）
   - `[component]-rounded-sm`, `[component]-rounded-lg` など

6. **エフェクトクラス**（オプション）
   - `[component]-shadow`, `[component]-full` など

7. **アニメーションクラス**（オプション）
   - `[component]-animate-up`, `[component]-animate-pulse` など

### 6. レスポンシブデザイン

- 基本的にすべてのコンポーネントは自動的にレスポンシブ対応
- サイズはremとemベースで相対指定
- 必要に応じてTailwindのブレークポイントクラスと併用

```css
/* レスポンシブデザインの例 */
.btn-full {
  @apply w-full;
}

/* モバイル向け調整 */
@media (max-width: 640px) {
  .class-builder-option {
    @apply text-xs px-2 py-0.5;
  }
}
```

### 7. メディアクエリとモード

```css
/* 印刷用のスタイル調整 */
@media print {
  .btn-animate-up {
    transform: none !important;
    animation: none !important;
  }
}

/* ダークモード用のスタイル */
.dark .color-primary {
  --primary: var(--primary-dark, #0e2c47);
  --primary-text: var(--neutral-light, #fafafa);
}

/* または */
:root.dark {
  --primary: #0e2c47;
  --neutral-light: #fafafa;
}
```

## アノテーション項目の説明

| 項目         | 説明                                                     | 必須 |
| ------------ | -------------------------------------------------------- | ---- |
| @component   | コンポーネントタイプ（例: button, card, heading）        | ✅   |
| @variant     | バリアント名（例: primary, secondary, base）             | ✅   |
| @description | クラスの説明文                                           | ✅   |
| @category    | コンポーネントのカテゴリ (例: interactive, container)    | ❌   |
| @example     | 使用例のHTMLコード                                       | ❌   |

### 注意点

- `@variant: base` は特別な意味を持ち、そのクラスがコンポーネントのベースクラスであることを示します
- アノテーションブロックの直後に `.[クラス名] {` という形式のセレクタが必要です
- 複数行の例を含めることができます（インデントに注意）

## カラーアノテーションの例

```css
/* 
 * @component: color
 * @variant: primary
 * @description: プライマリカラーを適用するためのユーティリティクラス
 * @category: color
 * @example: <button class="btn-base btn-solid color-primary">プライマリボタン</button>
 */
.color-primary {
  background-color: var(--primary);
  color: var(--primary-text);
  border-color: var(--primary-border, var(--primary));
}

/* 
 * @component: color
 * @variant: custom
 * @description: カスタムカラーピッカーで設定した色を適用するユーティリティクラス
 * @category: color
 * @example: <button class="btn-base btn-solid color-custom">カスタムカラーボタン</button>
 */
.color-custom {
  background-color: var(--custom-color, #6366f1);
  color: var(--custom-text-color, #ffffff);
  border-color: var(--custom-border-color, var(--custom-color, #6366f1));
}
```

## カラーセレクタの設定

カラーセレクタの設定は `configs/colors.js` で行います。以下の情報を定義します：

- **value**: カラークラス名（例: `color-primary`）
- **label**: UI表示名（例: `プライマリ`）
- **description**: 説明文
- **cssVar**: 対応するCSS変数名（例: `--primary`）
- **isCustom**: カスタムカラーかどうか

```javascript
export const colorRegistry = {
  primary: {
    value: 'color-primary',
    label: 'プライマリ',
    description: '主要なアクションに使用する色',
    cssVar: '--primary'
  },
  // ... 他のカラー
  custom: {
    value: 'color-custom',
    label: 'カスタム',
    description: 'カラーピッカーで選択したカスタム色',
    cssVar: '--custom-color',
    isCustom: true
  }
}
```

## アクセシビリティへの配慮

- フォーカス状態に対応したスタイル
- 十分なコントラスト比（カスタムカラーでも自動計算）
- aria属性に対応したスタイリング
- キーボードナビゲーションのサポート

```css
/* アクセシビリティ対応の例 */
.btn-base:focus-visible {
  @apply outline-none ring-2 ring-offset-2;
  ring-color: var(--focus-ring-color, var(--primary, #1a568e));
}

.btn-base[aria-disabled='true'] {
  @apply cursor-not-allowed;
  opacity: var(--btn-disabled-opacity, 0.6);
}
```

## カスタムカラーとアクセシビリティ

カスタムカラーピッカーは自動的にコントラスト比を計算し、適切なテキスト色を提案します。

```javascript
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
```

## ベストプラクティス

1. **モノクロベースとカラーセレクタの分離**
   - コンポーネントの構造と色を分離して設計する
   - カラーセレクタクラスを使用して色を適用する
   - カスタムカラーが必要な場合はカラーピッカーを活用する

2. **一貫性を保つ**
   - 命名規則に従う（[component]-[variant]）
   - 変数の命名規則を守る（--[component]-[property]）
   - アノテーションを正確に記述する

3. **コンポーネントの分割**
   - 関連する機能ごとにファイルを分割
   - base.css, variants.css, utilities.cssの役割を遵守

4. **変数の活用**
   - ハードコーディングされた値は避け、変数を使用
   - コンポーネント固有の変数は接頭辞をつける（--btn-*, --card-*）
   - フォールバック値を指定する（var(--primary, #1a568e)）

5. **コメントの活用**
   - コードの意図を説明するコメントを追加
   - 複雑なセレクタや計算にはコメントを付ける

6. **アノテーションの最新化**
   - スタイルを変更する際はアノテーションも更新する
   - 例（@example）は実際に機能するコードにする

## 使用例

### 基本的な使用法（新しいスタイル）

```html
<!-- 基本的なプライマリボタン -->
<button class="btn-base btn-solid color-primary">プライマリボタン</button>

<!-- アウトラインのセカンダリボタン -->
<button class="btn-base btn-outline color-secondary">セカンダリアウトライン</button>

<!-- カスタムカラーのボタン -->
<button class="btn-base btn-solid color-custom">カスタムカラーボタン</button>

<!-- サイズ付きのカード -->
<div class="card-base color-neutral card-lg">
  <div class="card-header">タイトル</div>
  <div class="card-body">内容がここに入ります</div>
</div>

<!-- アクセントカラーの見出し -->
<h2 class="heading-base heading-section color-accent">セクション見出し</h2>
```

### 高度な使用例

```html
<!-- 角丸と影付きのゴーストボタン -->
<button class="btn-base btn-ghost color-primary btn-rounded-full btn-shadow">
  角丸と影付きゴーストボタン
</button>

<!-- アイコン付きのフォーム入力 -->
<div class="form-group">
  <label class="form-label color-dark" for="username">ユーザー名</label>
  <div class="form-input-wrapper form-input-icon-left">
    <input type="text" id="username" class="form-input-base form-input-outlined color-neutral">
    <span class="form-input-icon">
      <svg>...</svg>
    </span>
  </div>
</div>

<!-- アニメーション付きのカード -->
<div class="card-base color-primary card-shadow card-animate-up">
  <div class="card-header">アニメーションカード</div>
  <div class="card-body">ホバーすると上に移動します</div>
</div>
```

## 特記事項

1. **カラーセレクタの切り替え**: 同じコンポーネントでも、カラーセレクタを変更することで色を簡単に切り替えられます。

2. **カスタムカラーの利用**: カラーピッカーを使用して、特定のブランドカラーやプロジェクト固有の色を設定できます。

3. **コントラスト自動調整**: カスタムカラー選択時に、テキスト色を背景色に基づいて自動調整することで、アクセシビリティの基準を満たしやすくなります。

4. **印刷対応**: 印刷時には省インク効果があるようにスタイルが自動調整されます。

5. **アクセシビリティ**: aria属性やフォーカス状態に対応したスタイルが含まれています。

6. **ダークモード対応**: `.dark`クラスや`:root.dark`セレクタを使用したダークモード対応が実装されています。