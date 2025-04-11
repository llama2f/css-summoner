# CSS Builder ハンドラー開発ガイド

このドキュメントでは、CSS Builder にコンポーネントハンドラーを追加する方法について説明します。ハンドラーは、選択されたコンポーネントタイプに基づいてプレビュー用のReact要素を生成し、それから自動的にコード表示用のHTML文字列を生成する役割を担います。

## 目次

1.  [ハンドラーの基本概念](#ハンドラーの基本概念)
2.  [ハンドラーファイルの作成](#ハンドラーファイルの作成)
3.  [自動登録の仕組み](#自動登録の仕組み)
4.  [ハンドラーの実装詳細](#ハンドラーの実装詳細)
5.  [JSXからHTMLの自動生成](#jsxからhtmlの自動生成)
6.  [Astroコンポーネント生成のカスタマイズ (`generateAstroTemplate`)](#astroコンポーネント生成のカスタマイズ-generateastrotemplate)
7.  [ベースクラスの付与](#ベースクラスの付与)
8.  [ベストプラクティス](#ベストプラクティス)
9.  [デバッグ](#デバッグ)
10. [デバッグ](#デバッグ)

## ハンドラーの基本概念

CSS Builder では、コンポーネントタイプごとにハンドラーモジュールを作成します。これらのモジュールはビルド時に自動的に検出・登録され、実行時に非同期で読み込まれて使用されます。

### ハンドラーの役割

- プレビュー表示用の **React要素 (`reactElement`)** を生成する。
- コード表示用の **HTML文字列 (`htmlString`)** は **JSXから自動生成** される。
- ユーザーがUIで選択したクラス（バリアント、サイズ、色、モディファイアなど）を反映する。

### ハンドラーモジュールの基本構造

ハンドラーは、特定の形式でエクスポートを持つ `.jsx` ファイルとして作成します。

```jsx
// src/css-summoner/templates/handlers/auto/example.jsx
import React from 'react'
import { createHandlerResult, separateProps, sampleIcon } from '../common' // 共通ユーティリティ

// 1. メタデータ (必須)
export const metadata = {
	type: 'example', // コンポーネントタイプ (必須・一意)
	category: 'general', // カテゴリ (任意)
	description: 'ハンドラーの例', // 説明 (任意)
}

// 2. 基本レンダラー (render または variants のどちらか一方は必須)
export function render(props) {
	// プロパティを分離
	const { reactProps, domProps, commonProps } = separateProps(
		props,
		['classString', 'children'], // React特有のプロパティ
		['id', 'role'] // DOM要素に直接渡すプロパティ
	)

	// 各種プロパティの取得
	const { classString = '', children = 'Example Content' } = reactProps
	const { id, role } = domProps

	// ReactElementの生成
	const reactElement = (
		<div className={classString} id={id} role={role} {...commonProps}>
			{children}
		</div>
	)

	// createHandlerResultでReactElementからHTMLを自動生成
	return createHandlerResult(reactElement)
}

// 3. バリアント固有レンダラー (オプション)
export const variants = {
	special: (props) => {
		// プロパティを分離
		const { reactProps, domProps, commonProps } = separateProps(
			props,
			['classString', 'children'], // React特有のプロパティ
			['id', 'role'] // DOM要素に直接渡すプロパティ
		)

		// 各種プロパティの取得
		const { classString = '', children = 'Special Example' } = reactProps
		const { id, role } = domProps

		// ReactElementを生成
		const reactElement = (
			<div
				className={`${classString} special-style`}
				id={id}
				role={role}
				{...commonProps}
			>
				{children}
			</div>
		)

		// HTMLは自動生成される
		return createHandlerResult(reactElement)
	},
	// 他のバリアント...
}

// 4. プレビュー用サンプル (オプション)
export const samples = {
	default: 'デフォルト表示',
	special: '特別表示',
}

// 5. デフォルトエクスポート (必須)
export default {
	metadata,
	render, // 基本レンダラー (なければ undefined でも可)
	variants, // バリアント (なければ undefined でも可)
	samples, // サンプル (なければ undefined でも可)
}
```

## ハンドラーファイルの作成

### 1. ファイルの配置

新しいハンドラーファイルは、必ず `src/css-summoner/templates/handlers/auto/` ディレクトリ内に作成します。ファイル名はコンポーネントタイプに合わせて分かりやすく付けます（例: `button.jsx`, `card.jsx`）。

### 2. 必須のエクスポート

各ハンドラーファイルには、以下のエクスポートが **必須** です。

- `export const metadata`:
  - `type` (string): コンポーネントタイプを示す一意の識別子。これがハンドラーを特定するキーとなります。
  - `category` (string, optional): UIでの分類用カテゴリ。
  - `description` (string, optional): ハンドラーの説明。
- `export default { metadata, render, variants, samples }`:
  - 上記で定義した `metadata` と、オプションの `render`, `variants`, `samples` を含むオブジェクトをデフォルトエクスポートします。

### 3. レンダリング関数の実装 (`render` / `variants`)

- `render` または `variants` の **少なくともどちらか一方** をエクスポートする必要があります。
- これらの関数は `props` オブジェクトを引数として受け取ります。`props` には通常、UIで選択された情報（`classString`, `selectedModifiers`, `variant`, `color` など）が含まれます。
- 関数は **ReactElementを作成し、`createHandlerResult(reactElement)`** を呼び出して結果を返します。
  - **HTML文字列は自動的に生成されるため、手動で生成する必要はありません。**

### 4. オプションのエクスポート

- `export function render(props)`: コンポーネントの基本的な表示を生成します。バリアントがない場合や、デフォルトの表示に使われます。
- `export const variants = { variantName: (props) => { ... } }`: コンポーネントの特定のバリアント（UIのVariantSelectorで選択されるもの）に対応するレンダリング関数を定義します。キーがバリアント名になります。
- `export const samples = { sampleName: '...' }`: UIの特定の箇所で表示されるサンプルテキストやアイコンなどを定義します（現在は主に `button` ハンドラーなどで利用）。

## 自動登録の仕組み

`src/css-summoner/templates/handlers/auto/` ディレクトリに規約に従ったハンドラーファイルを作成するだけで、**自動的にシステムに登録**されます。

- **ビルド時:** `npm run build` (または `npm run dev`) の実行時に、`generate-handler-manifest.js` スクリプトが `auto/` ディレクトリをスキャンします。
- **マニフェスト生成:** 各ファイルの `metadata` を読み取り、ハンドラータイプ、メタデータ、実行時インポート用のパス (`/src/...`) を含む `src/css-summoner/configs/handler-manifest.json` ファイルを生成・更新します。
- **実行時:** UIコンポーネント (`TemplateRenderer`, `ClassCodeDisplay`) は、このマニフェストを参照し、必要なハンドラーモジュールを非同期で動的にインポートします。

**手動でのレジストリファイル (`registry.jsx`) への登録は不要になりました。**

### プロセス図解

```mermaid
graph TD
    subgraph Build Time
        A[npm run build] --> B(npm run generate:handlers);
        B --> C{Scan src/css-summoner/templates/handlers/auto/*.jsx};
        C --> D[Extract metadata & path];
        D --> E(Generate/Update src/css-summoner/configs/handler-manifest.json);
        E --> F[astro build];
    end

    subgraph "Runtime (Client-side)"
        G[User selects component type] --> H(componentType changes);
        H --> I[useAsyncHandler(componentType)];
        I --> J{Read handler-manifest.json};
        J -- handlerInfo --> K[import(handlerInfo.path)];
        K -- Module --> L{handlerModule state updated};
        L --> M[TemplateRenderer / ClassCodeDisplay];
        M -- options --> N(Call handlerModule.render / .variants);
        N -- reactElement --> O[Update UI Preview];
        N -- reactElement --> P[ReactDOMServer.renderToString];
        P -- htmlString --> Q[Update Code Display];
    end

    style Build Time fill:#f9f,stroke:#333,stroke-width:2px
    style Runtime fill:#ccf,stroke:#333,stroke-width:2px
```

## ハンドラーの実装詳細

### プロパティ分離パターン

ハンドラー関数内では、プロパティをその用途に応じて分離することを推奨しています。`common.jsx` に定義されている `separateProps` 関数を使用して、以下のように分類します：

```jsx
// プロパティ分離の基本的な使い方
import { separateProps } from '../common'

export function render(props) {
	// プロパティ分離
	const { reactProps, domProps, commonProps } = separateProps(
		props,
		['classString', 'children', 'selectedModifiers', 'baseClass', 'onClick'], // React特有のプロパティ
		['disabled', 'type'] // DOM要素に直接渡すプロパティ
	)

	// 各カテゴリから必要な値を取得
	const { classString = '', children = 'Example' } = reactProps
	const { disabled = false } = domProps

	// ReactElementの生成
	const reactElement = (
		<button
			className={classString}
			disabled={disabled}
			{...commonProps} // その他のプロパティを自動的に展開
		>
			{children}
		</button>
	)

	return createHandlerResult(reactElement)
}
```

プロパティは以下の3つのカテゴリに分離されます：

1. **reactProps**：React特有のプロパティ（`className`, `children`, `onClick`など）や、CSS Builder固有のプロパティ（`classString`, `baseClass`, `selectedModifiers`など）
2. **domProps**：実際のDOM要素に直接渡すプロパティ（`type`, `disabled`, `href`, `title`など）
3. **commonProps**：上記以外の、定義していないプロパティ（カスタムデータ属性など）

このパターンを適用することで、コードの可読性や保守性が向上し、プロパティの用途が明確になります。

### `props` オブジェクト

`render` および `variants` 関数に渡される `props` オブジェクトには、主に以下のプロパティが含まれる可能性があります（呼び出し元のコンポーネントによって異なります）。

- `classString` (string): UIで選択されたクラス（ベース、サイズ、色、角丸、特殊効果、追加クラスなど）が結合された文字列。
- `selectedModifiers` (string[]): 選択されたモディファイアクラス名の配列。
- `variant` (string): 選択されたバリアント名（`variants` 内の関数を呼び出す際に使用される）。
- `color` (string): 選択された色クラス名。
- `children` (any): デフォルトのコンテンツ（プレビュー用に仮のものが渡されることが多い）。
- `baseClass` (string): コンポーネントのベースクラス名（`ClassCodeDisplay` から渡される）。

ハンドラー内では、これらのプロパティを `separateProps` 関数で分類し、各カテゴリのプロパティを適切に利用してReact要素を動的に構築します。

## JSXからHTMLの自動生成

### 新しいアプローチ

CSS Builderの最新版では、手動でHTML文字列を生成する代わりに、JSXからHTMLを自動的に生成するアプローチを採用しています。これにより、以下のメリットがあります：

1. **一貫性の保証:** プレビュー表示とコード表示が常に同期されます
2. **コードの重複削減:** 一箇所でJSXを定義するだけで両方の出力が得られます
3. **保守の容易さ:** 変更が必要な場合はJSXのみを更新すれば良いです

### 実装メカニズム

内部的にはハンドラーの結果を処理する際に、ReactDOMServerを使用して次のような処理が行われます：

1. ハンドラーが `createHandlerResult(reactElement)` を呼び出します
2. `createHandlerResult` 関数内で `ReactDOMServer.renderToString(reactElement)` を使用してHTML文字列が生成されます
3. React固有の属性（`data-reactroot` など）がクリーンアップされます
4. 整形されたHTMLが生成され、コード表示に使用されます

### 使用例

基本的な使用方法：

```jsx
// ハンドラー内での使用例
import { createHandlerResult, separateProps } from '../common'

export function render(props) {
	// プロパティ分離パターンを使用
	const { reactProps, domProps, commonProps } = separateProps(
		props,
		['classString', 'children'],
		['id']
	)

	const { classString = '', children = 'Content' } = reactProps
	const { id } = domProps

	// React要素を定義
	const reactElement = (
		<div className={classString} id={id} {...commonProps}>
			{children}
		</div>
	)

	// HTMLは自動生成される
	return createHandlerResult(reactElement)
}
```

特殊なケースの処理：

```jsx
// dangerouslySetInnerHTMLを使用する場合
export function renderWithIcon(props) {
	const { reactProps, domProps, commonProps } = separateProps(
		props,
		['classString'],
		['disabled', 'type']
	)

	const { classString = '' } = reactProps
	const { disabled = false, type = 'button' } = domProps

	// 安全な方法でアイコンを挿入
	const reactElement = (
		<button
			className={classString}
			disabled={disabled}
			type={type}
			{...commonProps}
		>
			<span dangerouslySetInnerHTML={{ __html: sampleIcon }} />
			<span>ボタンテキスト</span>
		</button>
	)

	return createHandlerResult(reactElement)
}
```

### `common.jsx` ユーティリティ

`src/css-summoner/templates/handlers/common.jsx` には、ハンドラー開発に役立つユーティリティが含まれています。

- `separateProps`: プロパティを React特有、DOM要素特有、その他の共通プロパティに分離します。
- `createHandlerResult`: JSXを受け取り、それをReact要素として保存し、また同時にHTML文字列を自動生成します。ReactDOMServer.renderToStringを内部的に使用します。
- `combineClasses`: 複数のクラスソース（オブジェクト形式）を受け取り、有効なクラスを結合して単一の文字列を返します。
- `cleanupReactAttributes`: ReactDOMServerによって生成されたHTMLからReact固有の属性を除去し、整形します。
- `sampleIcon`: プレビュー用の汎用アイコンSVG文字列。

## Astroコンポーネント生成のカスタマイズ (`generateAstroTemplate`)

CSS Summoner は、`npm run generate:astro` コマンドによって `src/css-summoner/dist/components/` ディレクトリに Astro コンポーネント (`*.astro`) を自動生成する機能を持っています。デフォルトでは基本的なテンプレートが使用されますが、ハンドラーファイルで `generateAstroTemplate` 関数をエクスポートすることで、この生成プロセスをコンポーネントごとにカスタマイズできます。

### 目的

- 特定のコンポーネントに対して、デフォルトとは異なる構造やプロパティを持つ Astro コンポーネントを生成する。
- 生成される Astro コンポーネントの `Props` インターフェースを、`dist/types` に生成された型定義と連携させて型安全性を高める。
- コンポーネント固有のロジックやマークアップを Astro コンポーネントに組み込む。

### 関数のシグネチャ

```typescript
export function generateAstroTemplate(
	componentData: ComponentData, // 対応するコンポーネントの型情報 (例: dist/types/button.d.ts の ComponentData)
	options?: any // 将来的な拡張用のオプション (現在は未使用)
): string // 生成したい Astro コンポーネントの完全なコード (文字列)
```

### 引数

- `componentData`:
  - `npm run generate:types` によって `dist/types/` に生成された、そのコンポーネントに対応する型定義ファイル (`*.d.ts`) 内の `ComponentData` 型のオブジェクトです。
  - コンポーネントのプロパティ (`props`)、利用可能なサイズ (`availableSizes`)、デフォルトのクラス (`defaults`) などの情報を含みます。
- `options`: 現在は未使用ですが、将来的に生成プロセスを制御するための追加オプションが渡される可能性があります。

### 戻り値

- 生成したい Astro コンポーネントの **完全なソースコード** を文字列として返します。`---` 区切り、`import` 文、`Props` インターフェース定義、HTMLテンプレート部分など、すべてを含む必要があります。

### 使い方

1.  カスタマイズしたいコンポーネントに対応するハンドラーファイル (`src/css-summoner/ui/templates/handlers/auto/*.jsx`) を開きます。
2.  `generateAstroTemplate` 関数を定義し、`export` します。
3.  関数内で `componentData` を参照し、目的の Astro コンポーネントコードを文字列として構築して返します。
4.  `npm run generate:astro` または `npm run generate:all` を実行すると、この関数が呼び出され、返された文字列が対応する `.astro` ファイル (`dist/components/`) の内容として書き込まれます。もし `generateAstroTemplate` がエクスポートされていない場合は、デフォルトの生成ロジックが使用されます。

### 型定義との連携

`generateAstroTemplate` 関数内で `componentData.props` や `componentData.availableSizes` などを参照することで、生成される Astro コンポーネントの `Props` インターフェースを動的に、かつ型安全に定義できます。`dist/types` に生成された型定義ファイルを `import type` で参照することが重要です。

### 実装例 (`button.jsx`)

```jsx
// src/css-summoner/ui/templates/handlers/auto/button.jsx
import React from 'react';
// ... 他の import

// ★ 型定義ファイルをインポート
import type { ComponentData, Props as ButtonProps } from '../../../../dist/types/button';
import { createHandlerResult, separateProps, sampleIcon } from '../common';

// ... metadata, render, variants, samples の定義 ...

// ★ Astro コンポーネント生成をカスタマイズする関数
export function generateAstroTemplate(componentData: ComponentData): string {
  // componentData から Props インターフェースを構築
  // componentData.props を基に、より詳細な型情報を Props に反映させる
  // (ここでは簡略化のため componentData.props をそのまま利用)
  const propsEntries = Object.entries(componentData.props)
    .map(([key, prop]) => `  ${key}${prop.required ? '' : '?'}: ${prop.type}; // ${prop.description}`)
    .join('\n');

  const propsInterface = `interface Props extends Omit<ButtonProps, 'class'>, HTMLAttributes<'button'> {
${propsEntries}
  class?: string; // class プロパティを明示的に追加 (ButtonProps から Omit したため)
}`;

  // Astro コンポーネントのコードを文字列として生成
  return `---
// Generated by CSS Summoner
import type { HTMLAttributes } from 'astro/types';
import type { Props as ButtonProps } from '../types/button'; // 元の型定義も参照可能

// 生成された Props インターフェース
${propsInterface}

const {
  variant = '${componentData.defaults?.variant || ''}',
  color = '${componentData.defaults?.color || ''}',
  size = '${componentData.defaults?.size || ''}',
  borderRadius = '${componentData.defaults?.borderRadius || ''}',
  // ... componentData.props に基づく他のデフォルト値 ...
  class: className, // 'class' プロパティを 'className' にリネーム
  ...rest // 残りのプロパティ
} = Astro.props;

// クラス名の組み立てロジック（例）
// ここでは単純化していますが、実際には componentData の情報を使って
// より動的にクラスを組み立てることができます。
const baseClass = 'btn'; // componentData.baseClass などから取得可能
const classes = [
  baseClass,
  variant && \`\${baseClass}-\${variant}\`,
  color && \`\${baseClass}-\${color}\`,
  size && \`\${baseClass}-\${size}\`,
  borderRadius && \`rounded-\${borderRadius}\`,
  className,
].filter(Boolean).join(' ');

---
<button class={classes} {...rest}>
  <slot />
</button>
`;
}

// デフォルトエクスポートに generateAstroTemplate を含める
export default {
  metadata,
  render,
  variants,
  samples,
  generateAstroTemplate, // ★ 追加
};

```

この例では、`componentData` を利用して `Props` インターフェースを動的に生成し、デフォルト値も設定しています。また、クラス名の組み立てロジックも含まれています（実際のプロジェクトではより洗練されたロジックが必要になる場合があります）。

## ベースクラスの付与

CSS Builderでは、コンポーネントタイプに応じたベースクラスが付与される仕組みがあります：

1. **基本的な仕組み：** `src/css-summoner/classMappings.js` の `baseClasses` オブジェクトに定義されたベースクラスのみが対応するコンポーネントタイプに付与されます。マッピングに存在しないコンポーネントタイプには自動でベースクラスは生成されません。

2. **付与をスキップする方法：** `baseClasses` マッピングに定義されているベースクラスの付与をスキップしたい場合は、ハンドラー内で `skipDecoration: true` フラグを使用できます：
   ```jsx
   return { ...createHandlerResult(reactElement), skipDecoration: true }
   ```

**ベースクラスの動作例：**

```jsx
// 例: 通常の場合（baseClassesマッピングに定義されている場合のみ付与される）
export function render(props) {
	// ...props の処理...
	const reactElement = <div className={classString}>...</div>
	return createHandlerResult(reactElement)
	// 結果：classNameに baseClass が追加される（baseClassesマッピングに定義されている場合のみ）
}

// 例: 付与をスキップする場合
export function render(props) {
	// ...props の処理...
	const reactElement = <div className={classString}>...</div>
	return { ...createHandlerResult(reactElement), skipDecoration: true }
	// 結果：classNameはそのまま保持される（baseClass は追加されない）
}

const reactElement = <div className={classString}>...</div>
return createHandlerResult(reactElement)
// 結果：classNameに baseClass が自動的に追加される（存在する場合）

// 例: 自動付与をスキップする場合
export function render(props) {
	// ...props の処...
	const reactElement = <div className={classString}>...</div>
	return { ...createHandlerResult(reactElement), skipDecoration: true }
	// 結果：classNameはそのまま保持される（baseClass は追加されない）
}
```

## ベストプラクティス

- **プロパティ分離の一貫性:** ハンドラー関数内ではすべて `separateProps` 関数を使用してプロパティを適切に分離しましょう。
- **クラスの結合:** ハンドラー内でクラスを動的に追加・変更する場合、`combineClasses` ユーティリティを使用して、クラスの重複や競合を適切に処理しましょう。
- **HTMLの自動生成:** 手動でHTML文字列を生成するのではなく、`createHandlerResult(reactElement)` に頼り、JSXから自動的にHTMLを生成しましょう。
- **モディファイアの活用:** `props.selectedModifiers` 配列を確認し、特定のモディファイアが選択されている場合に表示や構造を変化させるロジックを実装しましょう。
- **サブコンポーネント:** 複雑なReact要素を生成する場合、ハンドラーファイル内で小さなサブコンポーネントに分割すると見通しが良くなります。

## デバッグ

- **`console.log`:** ハンドラー関数内で `console.log(props)` を使用して、渡されているプロパティを確認するのが最も基本的なデバッグ方法です。
- **ブラウザ開発者ツール:** 非同期ロードのエラーやレンダリング時のエラーは、ブラウザの開発者ツールのコンソールに出力されます。`useAsyncHandler`, `TemplateRenderer`, `ClassCodeDisplay` 内のエラーログも確認してください。
- **マニフェストファイルの確認:** `npm run generate:handlers` を実行後、`src/css-summoner/configs/handler-manifest.json` が正しく生成・更新されているか確認してください。特に `path` が正しい形式 (`/src/...`) になっているか確認します。
