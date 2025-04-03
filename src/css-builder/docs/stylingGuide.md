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

### 5. 組み合わせによるスタイリング

コンポーネントは以下のようなクラスの組み合わせで構築します：

1. **ベースクラス**（必須）
   - `[component]-base` - すべてのコンポーネントに必要な基本スタイル

2. **バリアントクラス**（必須）
   - `[component]-primary`, `[component]-outline-secondary` など

3. **サイズクラス**（オプション）
   - `[component]-xs`, `[component]-sm`, `[component]-md` など

4. **形状クラス**（オプション）
   - `[component]-rounded-sm`, `[component]-rounded-lg` など

5. **エフェクトクラス**（オプション）
   - `[component]-shadow`, `[component]-full` など

6. **アニメーションクラス**（オプション）
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
.dark .btn-outline-neutral {
  color: var(--btn-neutral-bg);
}

/* または */
:root.dark {
  --btn-neutral-bg: var(--neutral, #242424);
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

## Tailwindとの連携

- `@apply` ディレクティブを使用してTailwindのユーティリティクラスを適用
- Tailwindのブレークポイントとの一貫性を保持
- カスタムプロパティ（CSS変数）を使用して値を一元管理
- サイズ、影、余白などの値は基本的にTailwindのプリセット値を使用

```css
/* Tailwindのシャドウを参照する例 */
.btn-shadow {
  /* カスタム変数で参照 */
  box-shadow: var(--btn-shadow-md);
}

/* または直接Tailwindクラスを適用 */
.btn-shadow {
  @apply shadow-md;
}

/* ホバー時の拡張 */
.btn-shadow:hover {
  @apply shadow-lg;
}
```

## アクセシビリティへの配慮

- フォーカス状態に対応したスタイル
- 十分なコントラスト比
- aria属性に対応したスタイリング
- キーボードナビゲーションのサポート

```css
/* アクセシビリティ対応の例 */
.btn-base:focus-visible {
  @apply outline-none ring-2 ring-offset-2 ring-primary;
}

.btn-base[aria-disabled='true'] {
  @apply cursor-not-allowed;
  opacity: var(--btn-disabled-opacity, 0.6);
}
```

## パフォーマンス最適化

- 必要最小限のセレクタ使用
- CSS変数による値の一元管理
- @layerによる効率的なCSSの構造化
- メディアクエリの最適な使用

## ベストプラクティス

1. **一貫性を保つ**
   - 命名規則に従う（[component]-[variant]）
   - 変数の命名規則を守る（--[component]-[property]）
   - アノテーションを正確に記述する

2. **コンポーネントの分割**
   - 関連する機能ごとにファイルを分割
   - base.css, variants.css, utilities.cssの役割を遵守

3. **変数の活用**
   - ハードコーディングされた値は避け、変数を使用
   - コンポーネント固有の変数は接頭辞をつける（--btn-*, --card-*）
   - フォールバック値を指定する（var(--primary, #1a568e)）

4. **コメントの活用**
   - コードの意図を説明するコメントを追加
   - 複雑なセレクタや計算にはコメントを付ける

5. **アノテーションの最新化**
   - スタイルを変更する際はアノテーションも更新する
   - 例（@example）は実際に機能するコードにする

## 使用例

### 基本的な使用法

```html
<!-- 基本的なプライマリボタン -->
<button class="btn-base btn-primary">プライマリボタン</button>

<!-- サイズ付きのカード -->
<div class="card-base card-default card-lg">
  <div class="card-header">タイトル</div>
  <div class="card-body">内容がここに入ります</div>
</div>

<!-- 見出し -->
<h2 class="heading-base heading-section">セクション見出し</h2>
```

### 高度な使用例

```html
<!-- 角丸と影付きのゴーストボタン -->
<button class="btn-base btn-ghost-primary btn-rounded-full btn-shadow">
  角丸と影付きゴーストボタン
</button>

<!-- アイコン付きのフォーム入力 -->
<div class="form-group">
  <label class="form-label" for="username">ユーザー名</label>
  <div class="form-input-wrapper form-input-icon-left">
    <input type="text" id="username" class="form-input-base form-input-outlined">
    <span class="form-input-icon">
      <svg>...</svg>
    </span>
  </div>
</div>

<!-- アニメーション付きのカード -->
<div class="card-base card-primary card-shadow card-animate-up">
  <div class="card-header">アニメーションカード</div>
  <div class="card-body">ホバーすると上に移動します</div>
</div>
```

## 特記事項

1. **アノテーション対応**: 各クラスにはCSSビルダーが解析するためのアノテーションが付与されています。

2. **Tailwindとの互換性**: 一部のクラスは`@apply`を使用してTailwindクラスを適用しています。サイズや影は基本的にTailwindのプリセット値を使用します。

3. **印刷対応**: 印刷時には省インク効果があるようにスタイルが自動調整されます。

4. **アクセシビリティ**: aria属性やフォーカス状態に対応したスタイルが含まれています。

5. **ダークモード対応**: `.dark`クラスや`:root.dark`セレクタを使用したダークモード対応が実装されています。
