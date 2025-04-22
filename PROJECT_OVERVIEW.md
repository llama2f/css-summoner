# プロジェクト概要: CSS Summoner

## 1. 目的

- CSSファイル内のアノテーションからコンポーネント情報を抽出し、TypeScriptの型定義、Astroのドキュメントページ、およびAstroコンポーネントを自動生成するツールです。ハンドラーを通じて Astro コンポーネントの生成内容をカスタマイズすることも可能です。
- カスタムクラスビルダーUIを提供し、コンポーネントの視覚的な構築とプレビューを可能にします。

## 2. 主な機能

- **CSSアノテーション抽出:** `postcss-annotations` プラグインを利用し、CSSファイルから情報を抽出して `extracted-annotations.json` を生成します。
- **TypeScript型定義生成:** 抽出情報と設定に基づき、`src/css-summoner/dist/types/` に型定義ファイル (`*.d.ts`) を生成します（コンポーネント固有のサイズ定義も反映）。
- **Astroドキュメント生成:** `src/pages/css-summoner/` にコンポーネントのドキュメントページ (`*.astro`) を生成します。
- **Astroコンポーネント生成:** `src/css-summoner/dist/components/` にAstroコンポーネント (`*.astro`) を生成します。ハンドラーファイル (`templates/handlers/auto/*.jsx`) で `generateAstroTemplate` 関数をエクスポートすることで、生成されるコンポーネントの内容をカスタマイズできます。
- **マッピングファイル生成:** 設定ファイル (`configs/`) と抽出データ (`extracted-annotations.json`) を統合した `classMappings.js` を生成します。
- **ハンドラー自動検出:** プレビュー用ハンドラー (`templates/handlers/auto/*.jsx`) を自動検出し、`configs/handler-manifest.json` を生成・更新します。
- **カスタムクラスビルダーUI:** (`ui/ClassBuilder.jsx` および `ui/` ディレクトリ)
  - コンポーネントの視覚的なプレビューと構築。
  - モノクロベースのスタイル設計とカラーセレクタによる柔軟なカラー適用。
  - カスタムカラーピッカーによるカラーカスタマイズ。
  - 選択されたカスタムCSSクラスに対応するCSSルールの表示。

## 3. 技術スタック

- **フロントエンド:** Astro, React, TypeScript
- **スタイリング:** Tailwind CSS (`tailwind.config.mjs`)
- **CSS処理:** PostCSS (`postcss-annotations` プラグイン)
- **開発環境:** Node.js (スクリプト実行)

## 4. データフロー

```mermaid
graph LR
    A["CSSファイル (アノテーション付き)"] -- postcss-annotations --> B(extracted-annotations.json);
    C["設定ファイル (configs/*.js)"] --> D(configs/index.js);
    E["ハンドラー (templates/handlers/auto/*.jsx)"] -- scripts/generate-handler-manifest.js --> F(configs/handler-manifest.json);
    B -- scripts/index.js --> G[classMappings.js];
    D -- scripts/index.js --> G;
    G -- scripts/generators/type-generator.js --> H1[dist/types/*.d.ts];
    G -- scripts/generators/generate-docs.js --> H2[src/pages/css-summoner/*.astro];
    G -- scripts/generators/astroComponentGenerator.js &lt;-- E --> H3[dist/components/*.astro]; {ハンドラーによるカスタマイズ}
    G -- ui/ClassBuilder.jsx --> I[カスタムクラスビルダーUI];
    F -- ui/ClassBuilder.jsx --> I;
    I -- ユーザー --> J["プレビュー表示 / クラス文字列"];

    subgraph 生成物
        direction TB
        B
        F
        G
        H1
        H2
        H3
    end

    style B fill:#f9f,stroke:#333,stroke-width:2px;
    style F fill:#f9f,stroke:#333,stroke-width:2px;
    style G fill:#ccf,stroke:#333,stroke-width:2px;
    style H1 fill:#cfc,stroke:#333,stroke-width:2px;
    style H2 fill:#cfc,stroke:#333,stroke-width:2px;
    style H3 fill:#cfc,stroke:#333,stroke-width:2px;
    style I fill:#ff9,stroke:#333,stroke-width:2px;
```

## 5. ディレクトリ構造の概要 (`src/css-summoner/`)

```
.
├── configs/ (設定ファイル群 - クラスビルダーUI用)
│   ├── borderRadius.mjs
│   ├── colors.js
│   ├── index.js (モジュールのエクスポート用)
│   ├── modifiers.mjs
│   ├── sizes.mjs
│   └── specialClasses.mjs
├── scripts/ (ビルド・自動化スクリプト)
│   ├── generators/ (コード生成用スクリプト)
│   │   ├── astroComponentGenerator.js
│   │   ├── componentInterface.js
│   │   └── type-generator.js (型定義生成)
│   ├── clean-css-comments.js
│   ├── config.js
│   ├── extract-jsx.js
│   ├── generate-astro.js
│   ├── generate-docs.js
│   ├── generate-handler-manifest.js
│   ├── generate-types.js
│   ├── simple-file-mapper.js (ファイルマップ生成)
│   └── utils.js (スクリプト共通ユーティリティ)
├── styles/ (CSSスタイルファイル)
│   ├── accordion/ (Accordionコンポーネント用スタイル)
│   ├── badge/ (Badgeコンポーネント用スタイル)
│   ├── button/ (Buttonコンポーネント用スタイル)
│   ├── card/ (Cardコンポーネント用スタイル)
│   ├── colors/ (カラーシステム定義)
│   ├── form/ (Form関連要素用スタイル)
│   ├── heading/ (Headingコンポーネント用スタイル)
│   ├── image/ (Image関連要素用スタイル)
│   ├── infobox/ (Infoboxコンポーネント用スタイル)
│   ├── no-bundle/ (バンドル対象外のスタイル)
│   ├── text/ (Text装飾用スタイル)
│   ├── tooltip/ (Tooltipコンポーネント用スタイル)
│   ├── css-var.css
│   └── utils.css
├── ui/ (UI関連ファイル)
│   ├── components/ (UIコンポーネント)
│   │   ├── accessibility/ (アクセシビリティ関連)
│   │   ├── astro/ (Astroコンポーネント群)
│   │   ├── color/ (カラー関連UI)
│   │   ├── color-picker/ (カラーピッカーUI)
│   │   ├── common/ (共通コンポーネント)
│   │   ├── display/ (表示用コンポーネント)
│   │   ├── mobile/ (モバイル用コンポーネント)
│   │   ├── navigation/ (ナビゲーション関連)
│   │   ├── preview/ (プレビュー表示コンポーネント)
│   │   └── selectors/ (各種選択UIコンポーネント)
│   ├── data/ (UIデータ定義)
│   ├── hooks/ (Reactカスタムフック)
│   ├── layouts/ (レイアウトコンポーネント)
│   ├── scripts/ (UIスクリプト)
│   │   ├── components/ (コンポーネント固有スクリプト)
│   │   └── utils/ (UIユーティリティ)
│   ├── templates/ (テンプレート関連)
│   │   ├── core/ (コアテンプレートエンジン)
│   │   ├── handlers/ (ハンドラー関連)
│   │   │   └── auto/ (自動検出ハンドラー群)
│   │   ├── componentFactory.jsx
│   │   └── componentHandlers.jsx
│   └── ClassBuilder.jsx (メインUIエントリポイント)
├── utils/ (ユーティリティ関数)
│   └── contrastUtils.js
├── classMappings.js (生成物: 設定とマッピングのエントリポイント)
├── extracted-annotations.json (生成物: CSSアノテーション抽出結果)
└── handler-manifest.json (生成物: ハンドラー自動検出結果)
```

主な生成アセット:

- `dist/types/`: 生成されたTypeScript型定義ファイル
- `dist/components/`: 生成されたAstroコンポーネント
- `src/pages/css-summoner/`: 生成されたAstroドキュメントページ

## 6. 主な使い方 (スクリプト)

- `npm run dev`: 開発サーバー起動 (CSSバンドル＆セットアップ)
- `npm run build`: 本番ビルド (CSSバンドル＆セットアップ + Astroビルド)
- `npm run css`: 型定義、ドキュメント生成
- `npm run map`: ファイルマップ (`file-map.md`) 更新
- `npm run setup`: ハンドラーからの生成、Astroコンポーネント生成
- `npm run bundle-css`: CSSファイルをバンドル
