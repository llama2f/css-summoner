# CSSビルダー ファイル一覧と役割

*自動生成: 2025-04-22T02:48:46.911Z*

## ディレクトリ構造

```
.
  ├── configs (設定ファイル群 (クラスビルダーUI用))
  ├── scripts (ビルド・自動化スクリプト)
  │ ├── generators (scripts/generatorsディレクトリ)
  ├── styles (CSSスタイルファイル)
  │ ├── accordion (styles/accordionディレクトリ)
  │ ├── badge (styles/badgeディレクトリ)
  │ ├── button (Buttonコンポーネント用スタイル)
  │ ├── card (Cardコンポーネント用スタイル)
  │ ├── colors (styles/colorsディレクトリ)
  │ ├── form (Form関連要素用スタイル)
  │ ├── heading (Headingコンポーネント用スタイル)
  │ ├── image (Image関連要素用スタイル)
  │ ├── infobox (Infoboxコンポーネント用スタイル)
  │ ├── no-bundle (styles/no-bundleディレクトリ)
  │ ├── text (Text装飾用スタイル)
  │ ├── tooltip (styles/tooltipディレクトリ)
  ├── ui (uiディレクトリ)
  │ ├── components (ui/componentsディレクトリ)
  │ │ ├── accessibility (ui/components/accessibilityディレクトリ)
  │ │ ├── astro (ui/components/astroディレクトリ)
  │ │ ├── color (ui/components/colorディレクトリ)
  │ │ ├── color-picker (ui/components/color-pickerディレクトリ)
  │ │ ├── common (ui/components/commonディレクトリ)
  │ │ ├── display (ui/components/displayディレクトリ)
  │ │ ├── mobile (ui/components/mobileディレクトリ)
  │ │ ├── navigation (ui/components/navigationディレクトリ)
  │ │ ├── preview (ui/components/previewディレクトリ)
  │ │ ├── selectors (ui/components/selectorsディレクトリ)
  │ ├── data (ui/dataディレクトリ)
  │ ├── hooks (ui/hooksディレクトリ)
  │ ├── layouts (ui/layoutsディレクトリ)
  │ ├── scripts (ui/scriptsディレクトリ)
  │ │ ├── components (ui/scripts/componentsディレクトリ)
  │ │ ├── utils (ui/scripts/utilsディレクトリ)
  │ ├── templates (ui/templatesディレクトリ)
  │ │ ├── core (ui/templates/coreディレクトリ)
  │ │ ├── handlers (ui/templates/handlersディレクトリ)
  │ │ │ ├── auto (ui/templates/handlers/autoディレクトリ)
  ├── utils (utilsディレクトリ)
```

## ファイル詳細

### ルート (/)

| ファイル | 役割 |
|---------|------|
| `classMappings.js` | 設定とマッピングのエントリポイント |

### configs/

| ファイル | 役割 |
|---------|------|
| `borderRadius.mjs` | borderRadiusの設定定義 (UI用) |
| `colors.js` | colorsの設定定義 (UI用) |
| `index.js` | モジュールのエクスポート用ファイル |
| `modifiers.mjs` | modifiersの設定定義 (UI用) |
| `sizes.mjs` | sizesの設定定義 (UI用) |
| `specialClasses.mjs` | specialClassesの設定定義 (UI用) |

### scripts/

| ファイル | 役割 |
|---------|------|
| `clean-css-comments.js` | JavaScriptモジュール |
| `config.js` | スクリプト設定ファイル |
| `extract-jsx.js` | JavaScriptモジュール |
| `generate-astro.js` | JavaScriptモジュール |
| `generate-docs.js` | JavaScriptモジュール |
| `generate-handler-manifest.js` | JavaScriptモジュール |
| `generate-types.js` | JavaScriptモジュール |
| `simple-file-mapper.js` | このファイルマップ生成スクリプト |
| `utils.js` | スクリプト共通ユーティリティ |

### scripts/generators/

| ファイル | 役割 |
|---------|------|
| `astroComponentGenerator.js` | JavaScriptモジュール |
| `componentInterface.js` | JavaScriptモジュール |
| `type-generator.js` | 型定義生成スクリプト |

### styles/

| ファイル | 役割 |
|---------|------|
| `css-var.css` | スタイルシート |
| `utils.css` | スタイルシート |

### styles/accordion/

| ファイル | 役割 |
|---------|------|
| `base.css` | コンポーネントスタイル定義（アノテーション付き） |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants-monochrome.css` | コンポーネントスタイル定義（アノテーション付き） |

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
| `base.css` | コンポーネントスタイル定義（アノテーション付き） |
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
| `base.css` | コンポーネントスタイル定義（アノテーション付き） |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |

### styles/infobox/

| ファイル | 役割 |
|---------|------|
| `base.css` | コンポーネントスタイル定義（アノテーション付き） |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |

### styles/no-bundle/

| ファイル | 役割 |
|---------|------|
| `all-components.css` | スタイルシート |
| `builder.css` | スタイルシート |
| `class-builder.css` | スタイルシート |
| `styles.css` | スタイルシート |

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

### ui/components/accessibility/

| ファイル | 役割 |
|---------|------|
| `ContrastChecker.jsx` | Reactコンポーネント |

### ui/components/astro/

| ファイル | 役割 |
|---------|------|
| `ExamplePreview.astro` | Astroコンポーネント - ExamplePreview |
| `FontAwesomeIcon.astro` | Astroコンポーネント - FontAwesomeIcon |
| `ThemeSwitcher.astro` | Astroコンポーネント - ThemeSwitcher |
| `ToggleSwitch.astro` | Astroコンポーネント - ToggleSwitch |
| `VariantPreview.astro` | Astroコンポーネント - VariantPreview |
| `theme.ts` | その他のファイル |

### ui/components/color/

| ファイル | 役割 |
|---------|------|
| `CustomColorPicker.jsx` | Reactコンポーネント |

### ui/components/color-picker/

| ファイル | 役割 |
|---------|------|
| `ColorPicker.jsx` | Reactコンポーネント |

### ui/components/common/

| ファイル | 役割 |
|---------|------|
| `Accordion.jsx` | Reactコンポーネント |
| `CssVarEditor.jsx` | Reactコンポーネント |
| `CssVarEditorManager.jsx` | Reactコンポーネント |
| `Tooltip.jsx` | Reactコンポーネント |

### ui/components/display/

| ファイル | 役割 |
|---------|------|
| `ClassCodeDisplay.jsx` | ClassCodeDisplay - コード表示コンポーネント |

### ui/components/mobile/

| ファイル | 役割 |
|---------|------|
| `MobileDrawer.jsx` | Reactコンポーネント |

### ui/components/navigation/

| ファイル | 役割 |
|---------|------|
| `MenuButton.astro` | Astroコンポーネント - MenuButton |
| `NavDrawer.astro` | Astroコンポーネント - NavDrawer |
| `NavGroup.astro` | Astroコンポーネント - NavGroup |
| `NavLinks.astro` | Astroコンポーネント - NavLinks |
| `PageContent.astro` | Astroコンポーネント - PageContent |

### ui/components/preview/

| ファイル | 役割 |
|---------|------|
| `ClassPreview.jsx` | ClassPreview - プレビュー表示コンポーネント |

### ui/components/selectors/

| ファイル | 役割 |
|---------|------|
| `BorderRadiusSelector.jsx` | BorderRadiusSelector - 選択UIコンポーネント |
| `ColorSelector.jsx` | ColorSelector - 選択UIコンポーネント |
| `ComponentSelector.jsx` | ComponentSelector - 選択UIコンポーネント |
| `ModifierSelector.jsx` | ModifierSelector - 選択UIコンポーネント |
| `SpecialClassSelector.jsx` | SpecialClassSelector - 選択UIコンポーネント |
| `VariantSelector.jsx` | VariantSelector - 選択UIコンポーネント |

### ui/data/

| ファイル | 役割 |
|---------|------|
| `navigation.js` | JavaScriptモジュール |

### ui/hooks/

| ファイル | 役割 |
|---------|------|
| `actions.ts` | その他のファイル |
| `useAsyncHandler.jsx` | Reactコンポーネント |

### ui/layouts/

| ファイル | 役割 |
|---------|------|
| `DocLayout.astro` | Astroコンポーネント - DocLayout |
| `Footer.astro` | Astroコンポーネント - Footer |
| `Head.astro` | Astroコンポーネント - Head |
| `Header.astro` | Astroコンポーネント - Header |
| `Layout.astro` | Astroコンポーネント - Layout |
| `Menu.astro` | Astroコンポーネント - Menu |
| `PageLayout.astro` | Astroコンポーネント - PageLayout |

### ui/scripts/

| ファイル | 役割 |
|---------|------|
| `ui-controller.js` | JavaScriptモジュール |

### ui/scripts/components/

| ファイル | 役割 |
|---------|------|
| `accordion-controller.js` | JavaScriptモジュール |

### ui/scripts/utils/

| ファイル | 役割 |
|---------|------|
| `a11y-helpers.js` | JavaScriptモジュール |

### ui/templates/

| ファイル | 役割 |
|---------|------|
| `componentFactory.jsx` | Reactコンポーネント |
| `componentHandlers.jsx` | Reactコンポーネント |

### ui/templates/core/

| ファイル | 役割 |
|---------|------|
| `templateEngine.jsx` | テンプレート生成エンジン |

### ui/templates/handlers/

| ファイル | 役割 |
|---------|------|
| `common.jsx` | 共通ユーティリティと定数 |
| `index.jsx` | Reactコンポーネント |

### ui/templates/handlers/auto/

| ファイル | 役割 |
|---------|------|
| `_template.jsx` | Reactコンポーネント |
| `accordion.jsx` | Reactコンポーネント |
| `badge.jsx` | Reactコンポーネント |
| `button.jsx` | Reactコンポーネント |
| `card.jsx` | Reactコンポーネント |
| `form.jsx` | Reactコンポーネント |
| `heading.jsx` | Reactコンポーネント |
| `img.jsx` | Reactコンポーネント |
| `infobox.jsx` | Reactコンポーネント |
| `text.jsx` | Reactコンポーネント |
| `tooltip.jsx` | Reactコンポーネント |

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
