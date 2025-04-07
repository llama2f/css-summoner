# CSS Builder ハンドラー開発ガイド 

このドキュメントでは、CSS Builder にコンポーネントハンドラーを追加する方法について説明します。ハンドラーは、選択されたコンポーネントタイプに基づいてプレビュー用のReact要素を生成し、それから自動的にコード表示用のHTML文字列を生成する役割を担います。

## 目次

1.  [ハンドラーの基本概念](#ハンドラーの基本概念)
2.  [ハンドラーファイルの作成](#ハンドラーファイルの作成)
3.  [自動登録の仕組み](#自動登録の仕組み)
4.  [ハンドラーの実装詳細](#ハンドラーの実装詳細)
5.  [JSXからHTMLの自動生成](#jsxからhtmlの自動生成)
6.  [ベストプラクティス](#ベストプラクティス)
7.  [デバッグ](#デバッグ)

## ハンドラーの基本概念

CSS Builder  では、コンポーネントタイプごとにハンドラーモジュールを作成します。これらのモジュールはビルド時に自動的に検出・登録され、実行時に非同期で読み込まれて使用されます。

### ハンドラーの役割

-   プレビュー表示用の **React要素 (`reactElement`)** を生成する。
-   コード表示用の **HTML文字列 (`htmlString`)** は **JSXから自動生成** される。
-   ユーザーがUIで選択したクラス（バリアント、サイズ、色、モディファイアなど）を反映する。

### ハンドラーモジュールの基本構造

ハンドラーは、特定の形式でエクスポートを持つ `.jsx` ファイルとして作成します。

```jsx
// src/css-summoner/templates/handlers/auto/example.jsx
import React from 'react';
import { createHandlerResult, sampleIcon } from '../common'; // 共通ユーティリティ

// 1. メタデータ (必須)
export const metadata = {
  type: 'example', // コンポーネントタイプ (必須・一意)
  category: 'general', // カテゴリ (任意)
  description: 'ハンドラーの例', // 説明 (任意)
};

// 2. 基本レンダラー (render または variants のどちらか一方は必須)
export function render(options) {
  const { classString = '', children = 'Example Content' } = options;

  // ReactElementのみを定義（HTML文字列は自動生成される）
  const reactElement = <div className={classString}>{children}</div>;
  
  // createHandlerResultでReactElementからHTMLを自動生成
  return createHandlerResult(reactElement);
}

// 3. バリアント固有レンダラー (オプション)
export const variants = {
  special: (options) => {
    const { classString = '', children = 'Special Example' } = options;
    
    // ReactElementを定義
    const reactElement = <div className={`${classString} special-style`}>{children}</div>;
    
    // HTMLは自動生成されるので、第二引数は省略
    return createHandlerResult(reactElement);
  },
  // 他のバリアント...
};

// 4. プレビュー用サンプル (オプション)
export const samples = {
  default: 'デフォルト表示',
  special: '特別表示',
};

// 5. デフォルトエクスポート (必須)
export default {
  metadata,
  render, // 基本レンダラー (なければ undefined でも可)
  variants, // バリアント (なければ undefined でも可)
  samples, // サンプル (なければ undefined でも可)
};
```

## ハンドラーファイルの作成

### 1. ファイルの配置

新しいハンドラーファイルは、必ず `src/css-summoner/templates/handlers/auto/` ディレクトリ内に作成します。ファイル名はコンポーネントタイプに合わせて分かりやすく付けます（例: `button.jsx`, `card.jsx`）。

### 2. 必須のエクスポート

各ハンドラーファイルには、以下のエクスポートが **必須** です。

-   `export const metadata`:
    -   `type` (string): コンポーネントタイプを示す一意の識別子。これがハンドラーを特定するキーとなります。
    -   `category` (string, optional): UIでの分類用カテゴリ。
    -   `description` (string, optional): ハンドラーの説明。
-   `export default { metadata, render, variants, samples }`:
    -   上記で定義した `metadata` と、オプションの `render`, `variants`, `samples` を含むオブジェクトをデフォルトエクスポートします。

### 3. レンダリング関数の実装 (`render` / `variants`)

-   `render` または `variants` の **少なくともどちらか一方** をエクスポートする必要があります。
-   これらの関数は `options` オブジェクトを引数として受け取ります。`options` には通常、UIで選択された情報（`classString`, `selectedModifiers`, `variant`, `color` など）が含まれます。
-   関数は **ReactElementを作成し、`createHandlerResult(reactElement)`** を呼び出して結果を返します。
    -   **HTML文字列は自動的に生成されるため、手動で生成する必要はありません。**

### 4. オプションのエクスポート

-   `export function render(options)`: コンポーネントの基本的な表示を生成します。バリアントがない場合や、デフォルトの表示に使われます。
-   `export const variants = { variantName: (options) => { ... } }`: コンポーネントの特定のバリアント（UIのVariantSelectorで選択されるもの）に対応するレンダリング関数を定義します。キーがバリアント名になります。
-   `export const samples = { sampleName: '...' }`: UIの特定の箇所で表示されるサンプルテキストやアイコンなどを定義します（現在は主に `button` ハンドラーなどで利用）。

## 自動登録の仕組み

`src/css-summoner/templates/handlers/auto/` ディレクトリに規約に従ったハンドラーファイルを作成するだけで、**自動的にシステムに登録**されます。

-   **ビルド時:** `npm run build` (または `npm run dev`) の実行時に、`generate-handler-manifest.js` スクリプトが `auto/` ディレクトリをスキャンします。
-   **マニフェスト生成:** 各ファイルの `metadata` を読み取り、ハンドラータイプ、メタデータ、実行時インポート用のパス (`/src/...`) を含む `src/css-summoner/configs/handler-manifest.json` ファイルを生成・更新します。
-   **実行時:** UIコンポーネント (`TemplateRenderer`, `ClassCodeDisplay`) は、このマニフェストを参照し、必要なハンドラーモジュールを非同期で動的にインポートします。

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

### `options` オブジェクト

`render` および `variants` 関数に渡される `options` オブジェクトには、主に以下のプロパティが含まれる可能性があります（呼び出し元のコンポーネントによって異なります）。

-   `classString` (string): UIで選択されたクラス（ベース、サイズ、色、角丸、特殊効果、追加クラスなど）が結合された文字列。
-   `selectedModifiers` (string[]): 選択されたモディファイアクラス名の配列。
-   `variant` (string): 選択されたバリアント名（`variants` 内の関数を呼び出す際に使用される）。
-   `color` (string): 選択された色クラス名。
-   `children` (any): デフォルトのコンテンツ（プレビュー用に仮のものが渡されることが多い）。
-   `baseClass` (string): コンポーネントのベースクラス名（`ClassCodeDisplay` から渡される）。

ハンドラー内では、これらの `options` を利用して、表示するReact要素を動的に構築します。

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
import { createHandlerResult } from '../common';

export function render(options) {
  const { classString, children } = options;
  
  // React要素のみを定義
  const reactElement = <div className={classString}>{children}</div>;
  
  // HTMLは自動生成される
  return createHandlerResult(reactElement);
}
```

特殊なケースの処理：

```jsx
// dangerouslySetInnerHTMLを使用する場合
export function renderWithIcon(options) {
  const { classString } = options;
  
  // 安全な方法でアイコンを挿入
  const reactElement = (
    <button className={classString}>
      <span dangerouslySetInnerHTML={{ __html: sampleIcon }} />
      <span>ボタンテキスト</span>
    </button>
  );
  
  return createHandlerResult(reactElement);
}
```

### `common.jsx` ユーティリティ

`src/css-summoner/templates/handlers/common.jsx` には、ハンドラー開発に役立つユーティリティが含まれています。

-   `createHandlerResult`: JSXを受け取り、それをReact要素として保存し、また同時にHTML文字列を自動生成します。ReactDOMServer.renderToStringを内部的に使用します。
-   `combineClasses`: 複数のクラスソース（オブジェクト形式）を受け取り、有効なクラスを結合して単一の文字列を返します。
-   `cleanupReactAttributes`: ReactDOMServerによって生成されたHTMLからReact固有の属性を除去し、整形します。
-   `sampleIcon`: プレビュー用の汎用アイコンSVG文字列。

```jsx
import { createHandlerResult, sampleIcon } from '../common';

export function render(options) {
  // ...
  const reactElement = (
    <button className={options.classString}>
      <span dangerouslySetInnerHTML={{ __html: sampleIcon }} />
      <span>Button</span>
    </button>
  );
  
  return createHandlerResult(reactElement);
}
```

## ベストプラクティス

-   **クラスの結合:** ハンドラー内でクラスを動的に追加・変更する場合、`clsx` や `tailwind-merge` ライブラリ、または自作の結合関数を利用して、クラスの重複や競合を適切に処理することを検討してください。`combineClasses` ユーティリティも参考になります。
-   **HTMLの可読性:** 生成する `htmlString` は、ユーザーがコピーして利用するため、適切なインデントを付けて可読性を高めてください。
-   **モディファイアの活用:** `options.selectedModifiers` 配列を確認し、特定のモディファイアが選択されている場合に表示や構造を変化させるロジックを実装します。
-   **サブコンポーネント:** 複雑なReact要素を生成する場合、ハンドラーファイル内で小さなサブコンポーネントに分割すると見通しが良くなります。

## デバッグ

-   **`console.log`:** ハンドラー関数内で `console.log(options)` を使用して、渡されているプロパティを確認するのが最も基本的なデバッグ方法です。
-   **ブラウザ開発者ツール:** 非同期ロードのエラーやレンダリング時のエラーは、ブラウザの開発者ツールのコンソールに出力されます。`useAsyncHandler`, `TemplateRenderer`, `ClassCodeDisplay` 内のエラーログも確認してください。
-   **マニフェストファイルの確認:** `npm run generate:handlers` を実行後、`src/css-summoner/configs/handler-manifest.json` が正しく生成・更新されているか確認してください。特に `path` が正しい形式 (`/src/...`) になっているか確認します。

---

このガイドに従って新しいコンポーネントハンドラーを追加することで、CSS Builderの機能を拡張できます。
