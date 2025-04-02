# CSSビルダー ファイル一覧と役割

*自動生成: 2025-04-02T00:31:13.051Z*

## ディレクトリ構造

| ディレクトリ | 説明 |
|------------|------|
| `/` | プロジェクトルート |
| `/components/common/` | components/commonディレクトリ |
| `/components/display/` | コード表示関連コンポーネント |
| `/components/preview/` | プレビュー関連コンポーネント |
| `/components/selectors/` | 選択UIコンポーネント |
| `/configs/` | 設定ファイル群 |
| `/hooks/` | hooksディレクトリ |
| `/styles/` | CSSスタイルファイル |
| `/styles/button/` | styles/buttonディレクトリ |
| `/styles/card/` | styles/cardディレクトリ |
| `/styles/form/` | styles/formディレクトリ |
| `/styles/heading/` | styles/headingディレクトリ |
| `/styles/image/` | styles/imageディレクトリ |
| `/styles/infobox/` | styles/infoboxディレクトリ |
| `/styles/text/` | styles/textディレクトリ |
| `/templates/` | テンプレートシステム |
| `/templates/core/` | テンプレートエンジンのコア機能 |
| `/templates/handlers/` | コンポーネントタイプ別のハンドラー |

## コアファイル

| ファイル | 役割 |
|---------|------|
| `ClassBuilder.jsx` | メインアプリケーションコンポーネント |
| `autoClassMappings.js` | CSSアノテーションから自動生成されたコンポーネント情報 |
| `classMappings.js` | 設定とマッピングのエントリポイント |
| `classMappingsConfig.js` | JavaScriptモジュール |

## common (components/common)

| ファイル | 役割 |
|---------|------|
| `CssVarEditor.jsx` | Reactコンポーネント |
| `Tooltip.jsx` | Reactコンポーネント |

## display (components/display)

| ファイル | 役割 |
|---------|------|
| `ClassCodeDisplay.jsx` | ClassCodeDisplay - コード表示コンポーネント |

## preview (components/preview)

| ファイル | 役割 |
|---------|------|
| `ClassPreview.jsx` | ClassPreview - プレビュー表示コンポーネント |

## selectors (components/selectors)

| ファイル | 役割 |
|---------|------|
| `BorderRadiusSelector.jsx` | BorderRadiusSelector - 選択UIコンポーネント |
| `ComponentSelector.jsx` | ComponentSelector - 選択UIコンポーネント |
| `ModifierSelector.jsx` | ModifierSelector - 選択UIコンポーネント |
| `SizeSelector.jsx` | SizeSelector - 選択UIコンポーネント |
| `SpecialClassSelector.jsx` | SpecialClassSelector - 選択UIコンポーネント |
| `VariantSelector.jsx` | VariantSelector - 選択UIコンポーネント |

## configs (configs)

| ファイル | 役割 |
|---------|------|
| `index.js` | モジュールのエクスポート用ファイル |

## hooks (hooks)

| ファイル | 役割 |
|---------|------|
| `useClassBuilder.jsx` | Reactコンポーネント |

## styles (styles)

| ファイル | 役割 |
|---------|------|
| `all-components.css` | スタイルシート |
| `builder.css` | スタイルシート |
| `base.css` | コンポーネントスタイル定義（アノテーション付き） |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |
| `base.css` | スタイルシート |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |
| `class-builder.css` | スタイルシート |
| `base.css` | スタイルシート |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |
| `base.css` | コンポーネントスタイル定義（アノテーション付き） |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |
| `base.css` | スタイルシート |
| `index.css` | スタイルシート |
| `utilities.css` | コンポーネントスタイル定義（アノテーション付き） |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |
| `base.css` | コンポーネントスタイル定義（アノテーション付き） |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |
| `styles.css` | スタイルシート |
| `base.css` | スタイルシート |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |
| `utils.css` | スタイルシート |

## button (styles/button)

| ファイル | 役割 |
|---------|------|
| `base.css` | コンポーネントスタイル定義（アノテーション付き） |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |

## card (styles/card)

| ファイル | 役割 |
|---------|------|
| `base.css` | スタイルシート |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |

## form (styles/form)

| ファイル | 役割 |
|---------|------|
| `base.css` | スタイルシート |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |

## heading (styles/heading)

| ファイル | 役割 |
|---------|------|
| `base.css` | コンポーネントスタイル定義（アノテーション付き） |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |

## image (styles/image)

| ファイル | 役割 |
|---------|------|
| `base.css` | スタイルシート |
| `index.css` | スタイルシート |
| `utilities.css` | コンポーネントスタイル定義（アノテーション付き） |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |

## infobox (styles/infobox)

| ファイル | 役割 |
|---------|------|
| `base.css` | コンポーネントスタイル定義（アノテーション付き） |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |

## text (styles/text)

| ファイル | 役割 |
|---------|------|
| `base.css` | スタイルシート |
| `index.css` | スタイルシート |
| `utilities.css` | スタイルシート |
| `variants.css` | コンポーネントスタイル定義（アノテーション付き） |

## templates (templates)

| ファイル | 役割 |
|---------|------|
| `componentFactory.jsx` | Reactコンポーネント |
| `componentHandlers.jsx` | Reactコンポーネント |
| `templateEngine.jsx` | テンプレート生成エンジン |
| `buttonHandlers.jsx` | buttonコンポーネントのテンプレート生成ハンドラー |
| `cardHandlers.jsx` | cardコンポーネントのテンプレート生成ハンドラー |
| `common.jsx` | 共通ユーティリティと定数 |
| `formHandlers.jsx` | formコンポーネントのテンプレート生成ハンドラー |
| `headingHandlers.jsx` | headingコンポーネントのテンプレート生成ハンドラー |
| `imageHandlers.jsx` | imageコンポーネントのテンプレート生成ハンドラー |
| `index.jsx` | Reactコンポーネント |
| `infoboxHandlers.jsx` | infoboxコンポーネントのテンプレート生成ハンドラー |
| `textHandlers.jsx` | textコンポーネントのテンプレート生成ハンドラー |
| `index.jsx` | Reactコンポーネント |
| `registry.jsx` | コンポーネントハンドラーの登録管理 |

## core (templates/core)

| ファイル | 役割 |
|---------|------|
| `templateEngine.jsx` | テンプレート生成エンジン |

## handlers (templates/handlers)

| ファイル | 役割 |
|---------|------|
| `buttonHandlers.jsx` | buttonコンポーネントのテンプレート生成ハンドラー |
| `cardHandlers.jsx` | cardコンポーネントのテンプレート生成ハンドラー |
| `common.jsx` | 共通ユーティリティと定数 |
| `formHandlers.jsx` | formコンポーネントのテンプレート生成ハンドラー |
| `headingHandlers.jsx` | headingコンポーネントのテンプレート生成ハンドラー |
| `imageHandlers.jsx` | imageコンポーネントのテンプレート生成ハンドラー |
| `index.jsx` | Reactコンポーネント |
| `infoboxHandlers.jsx` | infoboxコンポーネントのテンプレート生成ハンドラー |
| `textHandlers.jsx` | textコンポーネントのテンプレート生成ハンドラー |

## 使い方

このドキュメントはプロジェクトの全体像を把握するために自動生成されています。
主要コンポーネントの関係性や詳細については以下を参照してください：

1. `ClassBuilder.jsx` - メインのReactコンポーネント
2. `classMappings.js` - 設定とマッピングのエントリポイント
3. `extract-classes.cjs` - CSSアノテーション抽出スクリプト
4. `templates/` - テンプレート生成システム

ファイルマップを更新するには：

```bash
node simple-file-mapper.js [プロジェクトルートパス] [出力ファイルパス]
```
