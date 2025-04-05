# CSS Builder 型定義・コンポーネント生成ツール

CSSファイルからコンポーネント情報を抽出し、TypeScript型定義、Astroドキュメントページ、Astroコンポーネントを生成するツールです。また、カスタムクラスビルダーUIも含んでおり、コンポーネントを視覚的に構築することができます。

サブモジュールとしてメインプロジェクトに組み込み可能です。

## インストール

```bash
# 元のプロジェクトで以下を実行
cd /path/to/your/project
git submodule add https://github.com/llama2f/css-builder.git src/css-builder
git commit -m "Add css-builder as a submodule"
```

## 機能

-   CSSファイル内のアノテーションからコンポーネント情報を抽出
-   TypeScript型定義ファイルの自動生成
-   Astroドキュメントページの生成
-   Astroコンポーネントの生成
-   自動生成データと設定を統合するマッピングファイルの生成
-   **ハンドラーの自動検出とマニフェスト生成**
-   プロジェクトルートの自動検出
-   ファイルタイプ別上書き設定
-   カスタムクラスビルダーUI（コンポーネントのプレビューと構築）
-   モノクロベースのスタイル設計とカラーセレクタによる柔軟なカラー適用
-   カスタムカラーピッカーによるカラーカスタマイズ

## 使い方

### スクリプトのセットアップ（package.json）

```json
{
	"scripts": {
		"dev": "astro dev --host --port 5000",
		"start": "astro dev",
		"build": "npm run generate:handlers && astro build",
		"preview": "astro preview",
		"astro": "astro",
		"lint": "eslint .",
		"check": "astro check",
		"map": "node src/css-builder/scripts/simple-file-mapper.js",
		"css": "node src/css-builder/scripts/index.js",
		"css-docs": "node src/css-builder/scripts/index.js --docs",
		"css-components": "node src/css-builder/scripts/index.js --components",
		"css-all": "node src/css-builder/scripts/index.js --all",
		"generate:handlers": "node src/css-builder/scripts/generate-handler-manifest.js"
	}
}
```

### 主なスクリプト

```bash
# 開発サーバーを起動 (UIアクセス用)
npm run dev

# ハンドラーマニフェストを生成 (ビルド時に自動実行される)
npm run generate:handlers

# CSS情報から各種ファイルを生成 (型定義、ドキュメントなど)
npm run css       # デフォルト (型定義、ドキュメント)
npm run css-docs  # ドキュメントのみ
npm run css-components # Astroコンポーネントのみ (注意: 現在の推奨構成ではない可能性)
npm run css-all   # すべて生成

# 本番ビルド (ハンドラーマニフェスト生成後にAstroビルド)
npm run build
```

(yarn を使用している場合は `npm run` を `yarn` に置き換えてください)

### 詳細ログと出力制御

```bash
# 詳細なログを表示 (--verbose)
node src/css-builder/scripts/index.js --verbose
node src/css-builder/scripts/generate-handler-manifest.js # (このスクリプトは現在 --verbose 非対応)

# 最小限のログのみ表示 (--silent)
node src/css-builder/scripts/index.js --silent

# 出力先を変更（環境変数 - index.js のみ対応）
CSS_BUILDER_OUTPUT_PATH=/path/to/output/directory node src/css-builder/scripts/index.js
```

## CSSアノテーションの書き方

(このセクションは変更なし)

... (アノテーションの説明は省略) ...

## モノクロベースのスタイルとカラーセレクタ

(このセクションは変更なし)

... (モノクロベースとカラーセレクタの説明は省略) ...

## 新しいコンポーネントの追加方法 (ハンドラー)

カスタムクラスビルダーUIで新しいコンポーネントタイプをサポートするには、対応する「ハンドラー」を作成します。

1.  **ハンドラーファイルを作成**:
    *   `src/css-builder/templates/handlers/auto/` ディレクトリ内に、コンポーネントタイプに合わせた名前で `.jsx` ファイルを作成します (例: `myComponent.jsx`)。
2.  **必須のエクスポートを実装**:
    *   `export const metadata = { type: 'my-component', ... };` を定義します (`type` は一意)。
    *   `render` 関数または `variants` オブジェクトの少なくとも一方を実装し、`{ reactElement, htmlString }` を返すようにします。
    *   `export default { metadata, render, variants, samples };` を定義します。
    *   詳細は `src/css-builder/docs/handler-guide.md` を参照してください。
3.  **(自動登録)**: ファイルを保存すると、次回 `npm run dev` または `npm run build` (内部で `npm run generate:handlers` が実行される) 時に自動的に検出され、`handler-manifest.json` に登録されます。**手動での登録作業は不要です。**
4.  **UIで確認**: 開発サーバーを再起動またはページをリロードすると、新しいコンポーネントタイプがUIの選択肢に表示されます。

## 生成されるファイル

-   `src/css-builder/configs/handler-manifest.json`: **(New!)** 自動検出されたハンドラーの情報（メタデータ、パス）を格納するJSONファイル。ビルド時に生成/更新されます。
-   `src/css-builder/autoClassMappings.js`: CSSアノテーションから抽出されたコンポーネント情報。
-   `src/css-builder/classMappings.js`: インポート統合用ファイル。
-   `src/css-builder/classMappingsConfig.js`: 手動設定ファイル（サイズ、モディファイア等）。
-   `src/css-builder/types/`: 型定義ファイル（`npm run css -- --types` などで生成）。
-   `src/pages/css-builder/`: Astroドキュメントページ（`npm run css -- --docs` などで生成）。
-   `src/css-builder/dist/components/`: Astroコンポーネント（`npm run css -- --components` などで生成、非推奨の可能性あり）。

## カスタマイズ

### コンポーネント固有の設定

`src/css-builder/classMappingsConfig.js` ファイルを編集して、各コンポーネントのUIオプション（サイズ、モディファイア、色など）をカスタマイズできます。

```javascript
// src/css-builder/classMappingsConfig.js の例
export const sizes = {
  button: [ /* ... */ ],
  // ...
};
export const modifiers = {
  button: [ /* ... */ ],
  // ...
};
export const colorOptions = [ /* ... */ ];
```

### プロジェクト設定

AstroやTailwind CSSに関する設定は、プロジェクトルートの `astro.config.mjs` や `tailwind.config.mjs` で行います。

### ファイル上書きとバックアップ

ファイル生成時の上書き動作やバックアップ設定は、現在スクリプト (`src/css-builder/scripts/index.js` など) 内で直接管理されています。必要に応じてスクリプトを修正してください。

## トラブルシューティング

### ハンドラーがUIに表示されない / プレビューが機能しない

-   `npm run generate:handlers` を実行し、エラーが出ていないか確認します。
-   `src/css-builder/configs/handler-manifest.json` を確認し、対象ハンドラーが正しく登録され、`path` が `/src/...` 形式になっているか確認します。
-   ハンドラーファイル (`auto/` 内の `.jsx`) の `export const metadata` と `export default` が規約通りか確認します。
-   `render` または `variants` 関数が `{ reactElement, htmlString }` を返しているか確認します。
-   ブラウザの開発者ツールでコンソールエラーを確認します (`useAsyncHandler` や `TemplateRenderer` からのエラーが出ていないか)。

### クラスが認識されない場合 (CSSアノテーション)

-   アノテーション形式が正しいか確認します。
-   アノテーションブロックの直後にクラスセレクタがあるか確認します。
-   CSSファイルが `src/css-builder/styles/` 以下の適切な場所にあるか確認します。

(カスタムカラー、ファイル上書き、パス関連のトラブルシューティングは省略)