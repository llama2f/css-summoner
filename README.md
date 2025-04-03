# CSS Builder 型定義・コンポーネント生成ツール

CSSファイルからコンポーネント情報を抽出し、TypeScript型定義、Astroドキュメントページ、Astroコンポーネントを生成するツールです。また、カスタムクラスビルダーUIも含んでおり、コンポーネントを視覚的に構築することができます。

サブモジュールとしてメインプロジェクトに組み込み可能です。

## インストール

```bash
# 元のプロジェクトで以下を実行
cd /home/caoap/projects/s-farm
git submodule add https://github.com/llama2f/css-builder.git src/css-builder
git commit -m "Add css-builder as a submodule"
```

## 機能

- CSSファイル内のアノテーションからコンポーネント情報を抽出
- TypeScript型定義ファイルの自動生成
- Astroドキュメントページの生成
- Astroコンポーネントの生成
- 自動生成データと設定を統合するマッピングファイルの生成
- プロジェクトルートの自動検出
- ファイルタイプ別上書き設定
- カスタムクラスビルダーUI（コンポーネントのプレビューと構築）

## 使い方

### 基本的な使い方

```bash
# 型定義、ドキュメントページを生成（デフォルト動作）
node scripts/css-builder/index.cjs

# すべて生成（型定義、ドキュメント、コンポーネント）
node scripts/css-builder/index.cjs --all

# ドキュメントページのみ生成
node scripts/css-builder/index.cjs --docs

# Astroコンポーネントのみ生成
node scripts/css-builder/index.cjs --components

# 型定義のみ生成
node scripts/css-builder/index.cjs --types

# 強制上書きオプション（既存ファイルの上書き確認なし）
node scripts/css-builder/index.cjs --all --force
```

### 詳細ログと出力制御

```bash
# 詳細なログを表示
node scripts/css-builder/index.cjs --verbose

# 最小限のログのみ表示
node scripts/css-builder/index.cjs --silent

# 出力先を変更（環境変数）
CSS_BUILDER_OUTPUT_PATH=/path/to/output/directory node scripts/css-builder/index.cjs
```

### 環境変数による設定

```bash
# 強制上書きモードを有効化
CSS_BUILDER_FORCE=true node scripts/css-builder/index.cjs

# 詳細ログを表示
CSS_BUILDER_VERBOSE=true node scripts/css-builder/index.cjs

# 最小限のログのみ表示
CSS_BUILDER_SILENT=true node scripts/css-builder/index.cjs
```

### スクリプトのセットアップ（package.json）

```json
{
	"scripts": {
		"css": "node scripts/css-builder/index.cjs",
		"css-docs": "node scripts/css-builder/index.cjs --docs",
		"css-components": "node scripts/css-builder/index.cjs --components",
		"css-types": "node scripts/css-builder/index.cjs --types",
		"css-all": "node scripts/css-builder/index.cjs --all"
	}
}
```

これにより、以下のコマンドが使用できるようになります。

```bash
# 型定義とドキュメントを生成
npm run css

# ドキュメントページのみ生成
npm run css-docs

# Astroコンポーネントのみ生成
npm run css-components

# 型定義のみ生成
npm run css-types

# すべて生成
npm run css-all
```

yarnの場合

```bash
# 型定義とドキュメント生成
yarn css
# ドキュメントページのみ生成
yarn css-docs
# Astroコンポーネントのみ生成
yarn css-components
# 型定義のみ生成
yarn css-types
# すべて生成
yarn css-all
```

## CSSアノテーションの書き方

CSSファイル内にアノテーションを追加して、コンポーネント情報を提供します。

### 基本形式

```css
/* 
 * @component: コンポーネント名
 * @variant: バリアント名
 * @description: 説明文
 * @category: カテゴリー名（任意）
 * @example: 使用例コード（任意）
 */
.クラス名 {
	/* スタイル定義 */
}
```

### アノテーション項目の説明

| 項目         | 説明                                                     | 必須 |
| ------------ | -------------------------------------------------------- | ---- |
| @component   | コンポーネントタイプ（例: button, card, heading-formal） | ✅   |
| @variant     | バリアント名（例: primary, secondary, base）             | ✅   |
| @description | クラスの説明文                                           | ✅   |
| @category    | コンポーネントのカテゴリ (例: interactive, container)    | ❌   |
| @example     | 使用例のHTMLコード                                       | ❌   |

### 重要なポイント

- `@variant: base` は特別な意味を持ち、そのクラスがコンポーネントのベースクラスであることを示します
- アノテーションブロックの直後に `.クラス名 {` という形式のセレクタが必要です
- 複数行の例を含めることができます（インデントに注意）

### アノテーション例

```css
/* 
 * @component: button
 * @variant: base
 * @description: すべてのボタンの基本スタイル
 * @category: interactive
 */
.btn-base {
	/* スタイル定義 */
}

/* 
 * @component: button
 * @variant: primary
 * @description: プライマリカラーを使用した重要なアクション用ボタン
 * @category: interactive
 * @example: <button class="btn-base btn-primary">プライマリボタン</button>
 *           <button class="btn-base btn-primary btn-lg">大きいプライマリボタン</button>
 */
.btn-primary {
	/* スタイル定義 */
}
```

## 生成されるファイル

### 自動生成ファイル

- `autoClassMappings.js`: CSSから抽出されたコンポーネント情報
- `classMappings.js`: インポート統合用ファイル

### 設定ファイル（初回実行時のみ生成）

- `classMappingsConfig.js`: 手動設定のためのファイル（サイズ、モディファイア等）

### 型定義ファイル（--typesオプション使用時）

- `types/[ComponentName].d.ts`: 各コンポーネントの型定義
- `types/index.d.ts`: 型定義のインデックスファイル

### Astroドキュメントページ（--docsオプション使用時）

- `src/pages/docs/components/[component-type].astro`: コンポーネントのドキュメントページ

### Astroコンポーネント（--componentsオプション使用時）

- `src/design/css-builder/dist/components/[ComponentName].astro`: 生成されたAstroコンポーネント

## カスタマイズ

### 設定ファイルのカスタマイズ

`config.cjs` ファイルを編集して、ディレクトリパスや各種設定を変更できます。

```javascript
// config.cjs
const paths = {
	// ソースディレクトリ
	styles: resolveProjectPath('src/design/css-builder/styles/'),

	// 出力ディレクトリ
	output: {
		cssBuilder: resolveProjectPath('src/design/css-builder/'),
		types: resolveProjectPath('src/design/css-builder/types/'),
		docs: resolveProjectPath('src/pages/docs/components/'),
		components: resolveProjectPath('src/design/css-builder/dist/components/'),
		// ...
	},
	// ...
}
```

### ファイル上書き設定のカスタマイズ

ファイルタイプごとに上書きの可否を設定できます。デフォルトではクラスマッピング、型定義、Astroドキュメントページの上書きが有効になっています。

```javascript
// config.cjs
const config = {
	// ...
	// ファイル上書き設定
	fileOperations: {
		// グローバル設定（コマンドラインの--forceオプションで上書き可能）
		force: false, // 既存ファイルを確認なしに上書きするかどうか（全体のデフォルト値）

		// 個別ファイルタイプごとの上書き設定
		forceByType: {
			mappings: true, // クラスマッピング関連ファイル（デフォルトで上書き有効）
			types: true, // 型定義ファイル（デフォルトで上書き有効）
			docs: true, // Astroドキュメントページ（デフォルトで上書き有効）
			components: false, // Astroコンポーネント
		},

		// バックアップの設定
		backup: {
			enabled: true, // バックアップを作成するかどうか
			maxBackups: 5, // 保持する最大バックアップ数（0=無制限）
		},
	},
}
```

### プロジェクトルート検出

スクリプトはプロジェクトルートを自動検出します（package.jsonがあるディレクトリが基準）。ディレクトリ構造を変更しても、自動的に正しいパスを解決します。

```javascript
/**
 * プロジェクトルートを自動検出
 */
function findProjectRoot() {
	let currentDir = __dirname
	// package.jsonを見つけるまで親ディレクトリを遡る
	for (let i = 0; i < 10; i++) {
		if (fs.existsSync(path.join(currentDir, 'package.json'))) {
			return currentDir
		}
		// 親ディレクトリに移動
		const parentDir = path.dirname(currentDir)
		if (parentDir === currentDir) {
			break
		}
		currentDir = parentDir
	}

	// 見つからない場合はデフォルト値を使用
	return path.resolve(__dirname, '../../')
}
```

### コンポーネント固有の設定

`classMappingsConfig.js` ファイルを編集して、各コンポーネントの設定をカスタマイズできます。

```javascript
// サイズ設定の例
export const sizes = {
	button: [
		{ value: 'btn-xs', label: 'XS' },
		{ value: 'btn-sm', label: 'Small' },
		// ...
	],
	// ...他のコンポーネント
}

// モディファイア設定の例
export const modifiers = {
	button: [
		{
			value: 'btn-shadow',
			label: '影付き',
			description: 'ボタンに影を付けます',
		},
		// ...
	],
	// ...
}
```

## カスタムクラスビルダーUIの使用方法

カスタムクラスビルダーUIを使用すると、コンポーネントを視覚的に構築し、適切なクラスの組み合わせを確認できます。

### 機能概要

- コンポーネントタイプの選択（ボタン、カード、フォームなど）
- バリアントの選択（プライマリ、セカンダリなど）
- サイズの選択（小、中、大など）
- 角丸の選択
- モディファイアの追加（影、アニメーションなど）
- カスタムクラスの追加
- リアルタイムプレビュー
- 生成されたコードの表示とコピー

### アーキテクチャ

カスタムクラスビルダーUIは以下のコンポーネントで構成されています：

1. **ClassBuilder**: メインのアプリケーションコンポーネント
2. **コンポーネントセレクター**: コンポーネントタイプやバリアントの選択UI
3. **プレビュー**: 選択したコンポーネントのリアルタイムプレビュー
4. **コード表示**: 生成されたHTMLコード
5. **テンプレートエンジン**: コンポーネントの表示テンプレートを生成

### テンプレートシステム

テンプレートシステムは以下の階層で構成されています：

1. **コンポーネントレジストリ**:
   - `components`: 直接名前で検索できる具体的なコンポーネントハンドラー（高速検索用）
   - `patterns`: 正規表現パターンで検索される汎用的なハンドラー（柔軟性のため）

2. **ハンドラー**:
   - 各コンポーネントタイプ（button, card, form等）ごとに専用のハンドラーセット
   - 各バリアント（form-input, card-title等）ごとに個別のハンドラー関数

3. **テンプレートエンジン**:
   - バリアント情報の処理
   - 適切なハンドラーの検索と実行
   - フォールバック処理

### 新しいコンポーネントの追加方法

1. **CSSファイルでアノテーションを追加**:
   ```css
   /* 
    * @component: 新コンポーネント名
    * @variant: バリアント名
    * @description: 説明文
    * @category: カテゴリー名
    */
   .新しいクラス名 {
     /* スタイル定義 */
   }
   ```

2. **ハンドラーを実装**:
   - `templates/handlers/`に新規または既存のファイルでハンドラーを実装
   - 各バリアント用の個別ハンドラー関数を作成
   - ハンドラーをエクスポートオブジェクトに追加

3. **レジストリに登録**:
   - `registry.jsx`でハンドラーをインポートして登録

## トラブルシューティング

### クラスが認識されない場合

- アノテーション形式が正しいか確認（スペースや改行に注意）
- アノテーションブロックの直後にクラスセレクタがあるか確認
- CSSファイルが `config.paths.styles` で指定されたディレクトリにあるか確認

### 型定義が生成されない場合

- 実行時のログを確認（`--verbose` オプションで詳細なログを表示）
- 出力ディレクトリに書き込み権限があるか確認
- ディレクトリパスが正しく設定されているか確認

### コンポーネントが正しく表示されない場合

- ブラウザのコンソールでエラーを確認
- ハンドラーが正しく実装・登録されているか確認
- バリアント名がCSSのアノテーションと一致しているか確認

### バリアントハンドラーが動作しない場合

- バリアント情報が正しく渡されているか確認
- レジストリに適切なハンドラーが登録されているか確認
- テンプレートエンジンのデバッグログを有効にして処理を追跡

### 既存のファイルが上書きされない場合

- 対象ファイルタイプの上書き設定を `config.js` で確認
- `--force` オプションを使用して強制上書きを有効にする
- 環境変数 `CSS_BUILDER_FORCE=true` を設定

### パスが見つからない場合

- `--verbose` オプションを使用して詳細なログを表示
- プロジェクトルートが正しく検出されているか確認
- `config.cjs` の `paths` 設定を確認