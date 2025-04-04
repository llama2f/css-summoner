# CSS Builder ハンドラー開発ガイド

このドキュメントでは、CSS Builderにコンポーネントハンドラーを追加する方法について説明します。ハンドラーは、選択されたコンポーネントタイプに基づいてプレビューとHTMLコードを生成する役割を担います。

## 目次

1. [ハンドラーの基本概念](#ハンドラーの基本概念)
2. [ハンドラーファイルの作成](#ハンドラーファイルの作成)
3. [レジストリへの登録](#レジストリへの登録)
4. [特殊なケースの処理](#特殊なケースの処理)
5. [ベストプラクティス](#ベストプラクティス)
6. [デバッグとテスト](#デバッグとテスト)

## ハンドラーの基本概念

CSS Builderでは、コンポーネントタイプごとにハンドラー関数を作成し、それをレジストリに登録することで、カスタムクラスビルダーUIのプレビューとコード生成を実現しています。

### ハンドラーの役割

- プレビュー表示用のReactコンポーネントを生成
- コード表示用のHTML文字列を生成
- ユーザーのクラス選択とモディファイア選択を反映

### ハンドラーの基本構造

```jsx
export const exampleHandler = (options) => {
  const { classString = '', selectedModifiers = [] } = options;
  
  // Reactコンポーネントの作成
  const reactElement = (
    <div className={classString}>
      コンポーネントプレビュー
    </div>
  );
  
  // HTML文字列の生成
  const htmlString = `<div class="${classString}">
  コンポーネントコード
</div>`;
  
  // 結果を返す
  return createHandlerResult(reactElement, htmlString);
};
```

## ハンドラーファイルの作成

### 1. 新しいハンドラーファイルの作成

`src/css-builder/templates/handlers/`ディレクトリに新しいファイルを作成します。
命名規則は`[componentName]Handlers.jsx`です。

```jsx
// src/css-builder/templates/handlers/newComponentHandlers.jsx
import React from 'react';
import { sampleIcon, createHandlerResult } from './common';

// メインハンドラー
export const newComponentHandler = (options) => {
  const { classString = '', selectedModifiers = [] } = options;
  
  // モディファイアによる条件分岐
  const hasSpecialFeature = selectedModifiers.includes('special-feature');
  
  // Reactコンポーネント
  const reactElement = (
    <div className={classString}>
      {hasSpecialFeature ? '特殊機能付き' : '標準表示'}
    </div>
  );
  
  // HTML文字列
  const htmlString = `<div class="${classString}">
  ${hasSpecialFeature ? '特殊機能付き' : '標準表示'}
</div>`;
  
  return createHandlerResult(reactElement, htmlString);
};

// エクスポートするハンドラーマップ
export const newComponentHandlers = {
  'new-component': newComponentHandler,
  // バリアント用ハンドラーもここに追加
};
```

### 2. `common.jsx`のユーティリティの活用

`common.jsx`には便利なユーティリティ関数が用意されています：

- `createHandlerResult`: reactElementとhtmlStringを含むオブジェクトを生成
- `ensureBaseClass`: 指定したベースクラスを確実にクラス文字列に含める
- `combineClasses`: 複数のクラスを結合する

```jsx
import { createHandlerResult, ensureBaseClass, combineClasses } from './common';

// ベースクラスを確実に含める
const enhancedClassString = ensureBaseClass(classString, 'new-component-base');
```

## レジストリへの登録

新しく作成したハンドラーをシステムで利用可能にするには、レジストリに登録する必要があります。

### 1. レジストリファイルを編集

`src/css-builder/templates/registry.jsx`を開き、以下の手順で編集します：

```jsx
// 1. ハンドラーをインポート
import { newComponentHandlers } from './handlers/newComponentHandlers';

// 2. componentsオブジェクトに追加
const componentRegistry = {
  components: {
    ...buttonHandlers,
    ...cardHandlers,
    // 既存のハンドラー
    ...newComponentHandlers, // 追加
  },
  // ...
};
```

### 2. パターンハンドラーの登録（任意）

特定のパターンに一致するコンポーネントタイプを処理するパターンハンドラーを作成する場合は、`patterns`オブジェクトに登録します。

```jsx
// パターンハンドラーの例
export const newComponentPatternHandler = {
  '^new-.*': newComponentHandler // "new-"で始まるすべてのコンポーネントを処理
};

// レジストリへの登録
const componentRegistry = {
  // ...
  patterns: {
    ...headingPatternHandler,
    ...newComponentPatternHandler, // 追加
  },
  // ...
};
```

## 特殊なケースの処理

### 1. プレビューコンテナのカスタマイズ

コンポーネントによっては、プレビュー表示のコンテナに特別な処理が必要な場合があります。例えば、ツールチップコンポーネントでは、プレビューコンテナにベースクラスが適用されないようにする必要があります。

```jsx
// 特殊なコンテナコンポーネント
const SpecialContainer = ({ children, layoutClass = '' }) => {
  return (
    <div 
      data-skip-decoration="true" 
      className={`preview-container ${layoutClass}`}
    >
      {children}
    </div>
  );
};

// ハンドラーでの使用
const reactElement = (
  <SpecialContainer>
    <span className={enhancedClassString}>
      実際のコンポーネント
    </span>
  </SpecialContainer>
);

// skipDecorationフラグを設定
return {
  reactElement,
  htmlString,
  skipDecoration: true // デコレーターを回避
};
```

### 2. 複数の表示状態を示す

状態の異なる複数のコンポーネントを同時に表示したい場合：

```jsx
// 複数の状態を表示するハンドラー
export const multiStateHandler = (options) => {
  const { classString = '' } = options;
  
  // 状態ごとのクラス
  const normalState = classString;
  const activeState = `${classString} component-active`;
  
  // 複数の状態を表示するReactコンポーネント
  const reactElement = (
    <div className="preview-container flex space-x-4">
      <div className={normalState}>通常状態</div>
      <div className={activeState}>アクティブ状態</div>
    </div>
  );
  
  // HTML文字列は基本コンポーネントのみ
  const htmlString = `<div class="${classString}">
  コンポーネント
</div>`;
  
  return createHandlerResult(reactElement, htmlString);
};
```

## ベストプラクティス

### 1. コンポーネントのベースクラスを確実に含める

ユーザーがバリアントクラスのみを選択した場合でも、ベースクラスが確実に含まれるようにします：

```jsx
const enhancedClassString = ensureBaseClass(classString, 'component-base');
```

### 2. 可読性の高いHTML文字列を生成

生成されるHTMLコードは、ユーザーがコピーして使用するものなので、適切にインデントして可読性を高めます：

```jsx
const htmlString = `<div class="${classString}">
  <div class="component-inner">
    コンテンツ
  </div>
</div>`;
```

### 3. モディファイアの確認

ユーザーが選択したモディファイアに基づいてコンポーネントの見た目や動作を調整します：

```jsx
const hasIcon = selectedModifiers.includes('component-with-icon');
const isLarge = selectedModifiers.includes('component-lg');

// 条件に基づいてコンテンツを調整
const content = hasIcon 
  ? `${sampleIcon} テキスト` 
  : 'テキスト';

// サイズクラスに基づいてスタイルを調整
const sizeClass = isLarge ? 'text-lg p-4' : 'text-base p-2';
```

### 4. 再利用可能なサブコンポーネント

複雑なコンポーネントの場合、再利用可能なサブコンポーネントに分割します：

```jsx
// 内部利用のサブコンポーネント
const ComponentHeader = ({ title, className }) => (
  <div className={`component-header ${className}`}>{title}</div>
);

const ComponentBody = ({ content, className }) => (
  <div className={`component-body ${className}`}>{content}</div>
);

// ハンドラーでの利用
const reactElement = (
  <div className={classString}>
    <ComponentHeader title="タイトル" className="mb-2" />
    <ComponentBody content="内容" className="p-4" />
  </div>
);
```

## デバッグとテスト

### 1. ログの活用

開発中は`console.log`を使用して、渡されるオプションや生成される要素を確認します：

```jsx
export const debugHandler = (options) => {
  console.log('Handler options:', options);
  
  // 通常の処理
  const result = createHandlerResult(reactElement, htmlString);
  console.log('Handler result:', result);
  
  return result;
};
```

### 2. エラーハンドリング

ハンドラー内でエラーが発生した場合にも対応できるようにします：

```jsx
export const safeHandler = (options) => {
  try {
    // 通常の処理
    return createHandlerResult(reactElement, htmlString);
  } catch (error) {
    console.error('Handler error:', error);
    
    // エラー表示用のフォールバック
    const errorElement = (
      <div className="p-4 border border-red-500 bg-red-100 text-red-700">
        コンポーネントの生成中にエラーが発生しました
      </div>
    );
    
    const errorHtml = `<!-- Error: ${error.message} -->
<div class="error">エラーが発生しました</div>`;
    
    return createHandlerResult(errorElement, errorHtml);
  }
};
```

### 3. プレビューモードでのテスト

`forPreview`フラグを確認して、プレビュー表示用に特別な処理を行うことができます：

```jsx
export const previewAwareHandler = (options) => {
  const { forPreview = false } = options;
  
  if (forPreview) {
    // プレビュー用の軽量バージョン
    return createHandlerResult(previewElement, htmlString);
  }
  
  // 通常バージョン
  return createHandlerResult(reactElement, htmlString);
};
```

---

このガイドラインに従って新しいコンポーネントハンドラーを追加することで、CSS Builderの機能を拡張し、より多様なコンポーネントをサポートすることができます。既存のハンドラーを参考にしながら、一貫性のあるユーザー体験を提供するよう心がけてください。
