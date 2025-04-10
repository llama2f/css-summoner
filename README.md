# CSS Summoner 型定義・コンポーネント生成ツール

## ⚠️注意!!Warning!!

このシステムは開発途中です。内容も未完成です。あくまで参考程度に御覧ください。

This system is under development. The content is incomplete. Please use it only as a reference.

## 概要

CSSファイルからコンポーネント情報を抽出し、TypeScript型定義、Astroドキュメントページ、Astroコンポーネントを生成するツールです。また、カスタムクラスビルダーUIも含んでおり、コンポーネントを視覚的に構築することができます。

サブモジュールとしてメインプロジェクトに組み込み可能です。

## インストール

```bash
# 元のプロジェクトで以下を実行
cd /path/to/your/project
git submodule add https://github.com/llama2f/css-summoner.git src/css-summoner
git commit -m "Add css-summoner as a submodule"
```

## 機能

- CSSファイル内のアノテーションからコンポーネント情報を抽出
- TypeScript型定義ファイルの自動生成
- Astroドキュメントページの生成
- Astroコンポーネントの生成
- 自動生成データと設定を統合するマッピングファイルの生成
- **ハンドラーの自動検出とマニフェスト生成**
- プロジェクトルートの自動検出
- ファイルタイプ別上書き設定
- カスタムクラスビルダーUI（コンポーネントのプレビューと構築）
- モノクロベースのスタイル設計とカラーセレクタによる柔軟なカラー適用
- カスタムカラーピッカーによるカラーカスタマイズ
- **選択されたカスタムCSSクラスに対応するルールの表示**

## データフロー

```
CSSファイル（アノテーション付き） → PostCSSプラグイン → extracted-annotations.json
                                                          ↓
設定ファイル（configs/*.js）→ configs/index.js ----------→ classMappings.js
                                                          ↓
                                                    各種ジェネレーター → TypeScript型定義/Astroドキュメント/コンポーネント
                                                          ↓
                                                カスタムクラスビルダーUI
                                                          ↓
                                                プレビュー表示/クラス文字列
```

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
		"map": "node src/css-summoner/scripts/simple-file-mapper.js",
		"css": "node src/css-summoner/scripts/index.js",
		"css-docs": "node src/css-summoner/scripts/index.js --docs",
		"css-components": "node src/css-summoner/scripts/index.js --components",
		"css-all": "node src/css-summoner/scripts/index.js --all",
		"generate:handlers": "node src/css-summoner/scripts/generate-handler-manifest.js"
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
node src/css-summoner/scripts/index.js --verbose
node src/css-summoner/scripts/generate-handler-manifest.js # (このスクリプトは現在 --verbose 非対応)

# 最小限のログのみ表示 (--silent)
node src/css-summoner/scripts/index.js --silent

# 出力先を変更（環境変数 - index.js のみ対応）
CSS_BUILDER_OUTPUT_PATH=/path/to/output/directory node src/css-summoner/scripts/index.js
```

## CSSアノテーションの書き方

... (アノテーションの説明は省略) ...

## モノクロベースのスタイルとカラーセレクタ

... (モノクロベースとカラーセレクタの説明は省略) ...

## 新しいコンポーネントの追加方法 (ハンドラー)

カスタムクラスビルダーUIで新しいコンポーネントタイプをサポートするには、対応する「ハンドラー」を作成します。

1.  **ハンドラーファイルを作成**:
    - `src/css-summoner/templates/handlers/auto/` ディレクトリ内に、コンポーネントタイプに合わせた名前で `.jsx` ファイルを作成します (例: `myComponent.jsx`)。
2.  **必須のエクスポートを実装**:
    - `export const metadata = { type: 'my-component', ... };` を定義します (`type` は一意)。
    - `render` 関数または `variants` オブジェクトの少なくとも一方を実装し、`{ reactElement, htmlString }` を返すようにします。
    - `export default { metadata, render, variants, samples };` を定義します。
    - 詳細は `src/css-summoner/docs/handler-guide.md` を参照してください。
3.  **(自動登録)**: ファイルを保存すると、次回 `npm run dev` または `npm run build` (内部で `npm run generate:handlers` が実行される) 時に自動的に検出され、`handler-manifest.json` に登録されます。**手動での登録作業は不要です。**
4.  **UIで確認**: 開発サーバーを再起動またはページをリロードすると、新しいコンポーネントタイプがUIの選択肢に表示されます。

### ハンドラー自動検出の仕組み

`generate-handler-manifest.js` スクリプトは `auto/` ディレクトリ内のファイルを検索し、各ハンドラーのメタデータ情報を取得して `handler-manifest.json` に保存します。このマニフェストファイルはビルド時に自動的に生成・更新され、実行時にハンドラーを動的にロードするために使用されます。

## CSSクラスルール表示機能

カスタムクラスビルダーUIで選択したクラスに対応するCSSルールをリアルタイムで確認できます。この機能は:

1. 選択中のクラスに対応するCSSルールを表示
2. 複数クラスの場合はすべての関連ルールを表示
3. クラスがどのように定義されているかを直接確認可能
4. CSSルール全体をコピーして再利用可能

## 生成されるファイル

- `src/css-summoner/configs/handler-manifest.json`: **(New!)** 自動検出されたハンドラーの情報（メタデータ、パス）を格納するJSONファイル。ビルド時に生成/更新されます。
- `src/css-summoner/extracted-annotations.json`: CSSアノテーションから抽出されたコンポーネント情報（クラス名、バリアント、説明、CSSルールテキストなど）。
- `src/css-summoner/classMappings.js`: インポート統合用ファイル。extracted-annotationsのデータとconfigs/index.jsの設定を統合します。
- `src/css-summoner/classMappingsConfig.js`: 手動設定ファイル（サイズ、モディファイア等）。
- `src/css-summoner/types/`: 型定義ファイル（`npm run css -- --types` などで生成）。
- `src/pages/css-summoner/`: Astroドキュメントページ（`npm run css -- --docs` などで生成）。
- `src/css-summoner/dist/components/`: Astroコンポーネント（`npm run css -- --components` などで生成、非推奨の可能性あり）。

## カスタマイズ

### コンポーネント固有の設定

`src/css-summoner/classMappingsConfig.js` ファイルを編集して、各コンポーネントのUIオプション（サイズ、モディファイア、色など）をカスタマイズできます。

```javascript
// src/css-summoner/classMappingsConfig.js の例
export const sizes = {
	button: [
		/* ... */
	],
	// ...
}
export const modifiers = {
	button: [
		/* ... */
	],
	// ...
}
export const colorOptions = [
	/* ... */
]
```

### プロジェクト設定

AstroやTailwind CSSに関する設定は、プロジェクトルートの `astro.config.mjs` や `tailwind.config.mjs` で行います。

### ファイル上書きとバックアップ

ファイル生成時の上書き動作やバックアップ設定は、現在スクリプト (`src/css-summoner/scripts/index.js` など) 内で直接管理されています。必要に応じてスクリプトを修正してください。

## トラブルシューティング

### ハンドラーがUIに表示されない / プレビューが機能しない

- `npm run generate:handlers` を実行し、エラーが出ていないか確認します。
- `src/css-summoner/configs/handler-manifest.json` を確認し、対象ハンドラーが正しく登録され、`path` が `/src/...` 形式になっているか確認します。
- ハンドラーファイル (`auto/` 内の `.jsx`) の `export const metadata` と `export default` が規約通りか確認します。
- `render` または `variants` 関数が `{ reactElement, htmlString }` を返しているか確認します。
- ブラウザの開発者ツールでコンソールエラーを確認します (`useAsyncHandler` や `TemplateRenderer` からのエラーが出ていないか)。

### クラスが認識されない場合 (CSSアノテーション)

- アノテーション形式が正しいか確認します。
- アノテーションブロックの直後にクラスセレクタがあるか確認します。
- CSSファイルが `src/css-summoner/styles/` 以下の適切な場所にあるか確認します。

(カスタムカラー、ファイル上書き、パス関連のトラブルシューティングは省略)
