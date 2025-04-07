# CSSビルダー ファイル一覧と役割

*自動生成: 2025-04-07T05:52:33.522Z*

## ディレクトリ構造

```
.
  ├── components (UIコンポーネント (React))
  │ ├── accessibility (components/accessibilityディレクトリ)
  │ ├── astro (UIコンポーネント (Astro))
  │ ├── color (components/colorディレクトリ)
  │ ├── color-picker (components/color-pickerディレクトリ)
  │ ├── common (共通UIコンポーネント)
  │ ├── display (コード表示関連コンポーネント)
  │ ├── preview (プレビュー関連コンポーネント)
  │ ├── selectors (選択UIコンポーネント)
  ├── configs (設定ファイル群 (クラスビルダーUI用))
  ├── docs (ドキュメントファイル)
  ├── generators (generatorsディレクトリ)
  ├── hooks (Reactカスタムフック)
  ├── layouts (Astroレイアウトコンポーネント)
  ├── scripts (ビルド・自動化スクリプト)
  ├── styles (CSSスタイルファイル)
  │ ├── badge (styles/badgeディレクトリ)
  │ ├── button (Buttonコンポーネント用スタイル)
  │ ├── card (Cardコンポーネント用スタイル)
  │ ├── colors (styles/colorsディレクトリ)
  │ ├── form (Form関連要素用スタイル)
  │ ├── heading (Headingコンポーネント用スタイル)
  │ ├── image (Image関連要素用スタイル)
  │ ├── infobox (Infoboxコンポーネント用スタイル)
  │ ├── text (Text装飾用スタイル)
  │ ├── tooltip (styles/tooltipディレクトリ)
  ├── templates (コンポーネントプレビューテンプレートシステム)
  │ ├── core (テンプレートエンジンのコア機能)
  │ ├── handlers (コンポーネントタイプ別のプレビューハンドラー)
  │ │ ├── auto (templates/handlers/autoディレクトリ)
  ├── types (TypeScript型定義)
  ├── utils (utilsディレクトリ)
```

## ファイル詳細

### ルート (/)

| ファイル | 役割 |
|---------|------|
| `ClassBuilder.jsx` | メインアプリケーションコンポーネント |
| `classMappings.js` | 設定とマッピングのエントリポイント |

### components/accessibility/

| ファイル | 役割 |
|---------|------|
| `ContrastChecker.jsx` | React UIコンポーネント - ContrastChecker |

### components/astro/

| ファイル | 役割 |
|---------|------|
| `ExamplePreview.astro` | Astro UIコンポーネント - ExamplePreview |
| `FontAwesomeIcon.astro` | Astro UIコンポーネント - FontAwesomeIcon |
| `ThemeSwitcher.astro` | Astro UIコンポーネント - ThemeSwitcher |
| `ToggleSwitch.astro` | Astro UIコンポーネント - ToggleSwitch |
| `VariantPreview.astro` | Astro UIコンポーネント - VariantPreview |
| `theme.ts` | その他のファイル |

### components/color/

| ファイル | 役割 |
|---------|------|
| `CustomColorPicker.jsx` | React UIコンポーネント - CustomColorPicker |

### components/color-picker/

| ファイル | 役割 |
|---------|------|
| `ColorPicker.jsx` | React UIコンポーネント - ColorPicker |

### components/common/

| ファイル | 役割 |
|---------|------|
| `CssVarEditor.jsx` | React UIコンポーネント - CssVarEditor |
| `Tooltip.jsx` | React UIコンポーネント - Tooltip |

### components/display/

| ファイル | 役割 |
|---------|------|
| `ClassCodeDisplay.jsx` | ClassCodeDisplay - コード表示コンポーネント |

### components/preview/

| ファイル | 役割 |
|---------|------|
| `ClassPreview.jsx` | ClassPreview - プレビュー表示コンポーネント |

### components/selectors/

| ファイル | 役割 |
|---------|------|
| `BorderRadiusSelector.jsx` | BorderRadiusSelector - 選択UIコンポーネント |
| `ColorSelector.jsx` | ColorSelector - 選択UIコンポーネント |
| `ComponentSelector.jsx` | ComponentSelector - 選択UIコンポーネント |
| `ModifierSelector.jsx` | ModifierSelector - 選択UIコンポーネント |
| `SizeSelector.jsx` | SizeSelector - 選択UIコンポーネント |
| `SpecialClassSelector.jsx` | SpecialClassSelector - 選択UIコンポーネント |
| `VariantSelector.jsx` | VariantSelector - 選択UIコンポーネント |

### configs/

| ファイル | 役割 |
|---------|------|
| `borderRadius.mjs` | borderRadiusの設定定義 (UI用) |
| `colors.js` | colorsの設定定義 (UI用) |
| `index.js` | モジュールのエクスポート用ファイル |
| `modifiers.mjs` | modifiersの設定定義 (UI用) |
| `sizes.mjs` | sizesの設定定義 (UI用) |
| `specialClasses.mjs` | specialClassesの設定定義 (UI用) |

### docs/

| ファイル | 役割 |
|---------|------|
| `color-system.md` | Markdownドキュメント |
| `css-summoner-system.md` | Markdownドキュメント |
| `file-map.md` | Markdownドキュメント |
| `handler-guide.md` | Markdownドキュメント |
| `stylingGuide.md` | Markdownドキュメント |
| `todo.md` | Markdownドキュメント |
| `テンプレートハンドラー移行ガイド.md` | Markdownドキュメント |

### generators/

| ファイル | 役割 |
|---------|------|
| `astroComponentGenerator.js` | JavaScriptモジュール |

### hooks/

| ファイル | 役割 |
|---------|------|
| `useAsyncHandler.jsx` | Reactコンポーネント |
| `useClassBuilder.jsx` | Reactコンポーネント |

### layouts/

| ファイル | 役割 |
|---------|------|
| `DocLayout.astro` | Astroレイアウト - DocLayout |
| `Footer.astro` | Astroレイアウト - Footer |
| `Head.astro` | Astroレイアウト - Head |
| `Header.astro` | Astroレイアウト - Header |
| `Layout.astro` | Astroレイアウト - Layout |
| `Menu.astro` | Astroレイアウト - Menu |

### scripts/

| ファイル | 役割 |
|---------|------|
| `config.js` | スクリプト設定ファイル |
| `css-builder.cjs` | JavaScript CommonJS Module |
| `extract-jsx.js` | JavaScriptモジュール |
| `generate-astro.js` | JavaScriptモジュール |
| `generate-docs.js` | JavaScriptモジュール |
| `generate-handler-manifest.js` | JavaScriptモジュール |
| `simple-file-mapper.js` | このファイルマップ生成スクリプト |
| `type-generator.js` | 型定義生成スクリプト |
| `utils.js` | スクリプト共通ユーティリティ |

### styles/

| ファイル | 役割 |
|---------|------|
| `all-components.css` | スタイルシート |
| `builder.css` | スタイルシート |
| `class-builder.css` | スタイルシート |
| `styles.css` | スタイルシート |
| `utils.css` | スタイルシート |

### styles/badge/

| ファイル | 役割 |
|---------|------|
| `base.css` | コンポーネントスタイル定義（アノテーション付き） |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants-monochrome.css` | コンポーネントスタイル定義（アノテーション付き） |

### styles/button/

| ファイル | 役割 |
|---------|------|
| `base.css` | コンポーネントスタイル定義（アノテーション付き） |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants-monochrome.css` | コンポーネントスタイル定義（アノテーション付き） |

### styles/card/

| ファイル | 役割 |
|---------|------|
| `base.css` | コンポーネントスタイル定義（アノテーション付き） |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |

### styles/colors/

| ファイル | 役割 |
|---------|------|
| `color-system.css` | スタイルシート |
| `custom-color.css` | スタイルシート |

### styles/form/

| ファイル | 役割 |
|---------|------|
| `base.css` | スタイルシート |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |

### styles/heading/

| ファイル | 役割 |
|---------|------|
| `base.css` | コンポーネントスタイル定義（アノテーション付き） |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants-monochrome.css` | コンポーネントスタイル定義（アノテーション付き） |

### styles/image/

| ファイル | 役割 |
|---------|------|
| `base.css` | スタイルシート |
| `index.css` | スタイルシート |
| `utilities.css` | コンポーネントスタイル定義（アノテーション付き） |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |

### styles/infobox/

| ファイル | 役割 |
|---------|------|
| `base.css` | コンポーネントスタイル定義（アノテーション付き） |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |

### styles/text/

| ファイル | 役割 |
|---------|------|
| `base.css` | コンポーネントスタイル定義（アノテーション付き） |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |

### styles/tooltip/

| ファイル | 役割 |
|---------|------|
| `base.css` | コンポーネントスタイル定義（アノテーション付き） |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |

### templates/

| ファイル | 役割 |
|---------|------|
| `componentFactory.jsx` | Reactコンポーネント |
| `componentHandlers.jsx` | Reactコンポーネント |

### templates/core/

| ファイル | 役割 |
|---------|------|
| `templateEngine.jsx` | テンプレート生成エンジン |

### templates/handlers/

| ファイル | 役割 |
|---------|------|
| `badgeHandlers.jsx` | badgeコンポーネントのテンプレート生成ハンドラー |
| `buttonHandlers.jsx` | buttonコンポーネントのテンプレート生成ハンドラー |
| `cardHandlers.jsx` | cardコンポーネントのテンプレート生成ハンドラー |
| `common.jsx` | 共通ユーティリティと定数 |
| `formHandlers.jsx` | formコンポーネントのテンプレート生成ハンドラー |
| `headingHandlers.jsx` | headingコンポーネントのテンプレート生成ハンドラー |
| `imageHandlers.jsx` | imageコンポーネントのテンプレート生成ハンドラー |
| `index.jsx` | Reactコンポーネント |
| `infoboxHandlers.jsx` | infoboxコンポーネントのテンプレート生成ハンドラー |
| `textHandlers.jsx` | textコンポーネントのテンプレート生成ハンドラー |
| `tooltipHandlers.jsx` | tooltipコンポーネントのテンプレート生成ハンドラー |

### templates/handlers/auto/

| ファイル | 役割 |
|---------|------|
| `badge.jsx` | Reactコンポーネント |
| `button.jsx` | Reactコンポーネント |
| `card.jsx` | Reactコンポーネント |
| `form.jsx` | Reactコンポーネント |
| `heading.jsx` | Reactコンポーネント |
| `image.jsx` | Reactコンポーネント |
| `infobox.jsx` | Reactコンポーネント |
| `text.jsx` | Reactコンポーネント |
| `tooltip.jsx` | Reactコンポーネント |

### types/

| ファイル | 役割 |
|---------|------|
| `Badge.d.ts` | その他のファイル |
| `Button.d.ts` | その他のファイル |
| `Card.d.ts` | その他のファイル |
| `Form.d.ts` | その他のファイル |
| `Heading.d.ts` | その他のファイル |
| `Img.d.ts` | その他のファイル |
| `Infobox.d.ts` | その他のファイル |
| `Text.d.ts` | その他のファイル |
| `Tooltip.d.ts` | その他のファイル |
| `index.d.ts` | その他のファイル |

### utils/

| ファイル | 役割 |
|---------|------|
| `contrastUtils.js` | JavaScriptモジュール |

## 使い方

このドキュメントはプロジェクトの全体像を把握するために自動生成されています。
主要な機能やスクリプトについては以下を参照してください：

*   **UI:** `ClassBuilder.jsx` (メインUI), `components/` (UI部品)
*   **状態管理:** `hooks/useClassBuilder.jsx`
*   **プレビュー生成:** `templates/`
*   **スタイル定義:** `styles/`
*   **クラス設定:** `configs/`, `classMappings.js`, `autoClassMappings.js`
*   **自動化スクリプト:** `scripts/` (例: `css-summoner.js`)

ファイルマップを更新するには：

```bash
npm run map
# または
node src/css-summoner/scripts/simple-file-mapper.js
```
