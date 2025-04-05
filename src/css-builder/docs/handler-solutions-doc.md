# CSS Builderハンドラー自動化の問題と解決策

## 現状の問題点

1. **ブラウザ環境での動的ファイル検出の問題**:
   - Node.js依存の`glob`パッケージがブラウザで動作しない
   - `node:events`モジュールがブラウザ互換性のためにエクスターナライズされているというエラー
   - Astroのハイドレーション時にエラーが発生

2. **非同期処理と同期アクセスの不一致**:
   - ハンドラーの登録処理が非同期（`await import()`）
   - 他のコンポーネントからは同期的にアクセスされる

3. **ハンドラー構造の不一致**:
   - 既存ハンドラー: `export const badgeHandlers = { badge: badgeHandler }`
   - 自動ハンドラー: `export default { metadata, render, variants, samples }`

4. **登録と検索の不整合**:
   - ログには「自動ハンドラー登録: button (button.jsx)」と表示される
   - しかし「警告: buttonのテンプレートハンドラーが見つかりませんでした」というエラー

## 解決策の提案

以下の複数のアプローチが考えられます：

### 1. 静的ハンドラーの実装（短期的解決策）

- Node.js依存のコードを全て排除し、ハンドラーを静的に定義
- メリット: 最も確実で速く実装できる
- デメリット: 自動化の利点が失われる
- 実装方法: `index.jsx`内でハンドラーを直接定義

```jsx
// templates/handlers/index.jsx
import React from 'react';
import { createHandlerResult, sampleIcon } from './common';

// 静的に定義したハンドラー
const handlers = {
  button: {
    metadata: { type: 'button', category: 'interactive' },
    render: (props) => { /* ボタンレンダリングロジック */ },
    variants: { /* バリアント定義 */ }
  },
  card: {
    metadata: { type: 'card', category: 'containers' },
    render: (props) => { /* カードレンダリングロジック */ },
    variants: { /* バリアント定義 */ }
  }
  // 必要に応じて他のコンポーネントを追加
};

export default handlers;
```

### 2. Viteの`import.meta.glob`を使用（中期的解決策）

- Viteの組み込み機能でファイルのグロブパターンを使用
- メリット: ブラウザ互換性を保ちながら部分的な自動化が可能
- デメリット: AstroやVite特有の機能に依存する
- 実装方法:

```jsx
// templates/handlers/index.jsx
import React from 'react';

// Viteの組み込みAPIを使って自動ハンドラーを検出
const handlerModules = import.meta.glob('./auto/*.jsx', { eager: true });
const handlers = {};

// 検出されたモジュールを処理
Object.entries(handlerModules).forEach(([path, module]) => {
  const handler = module.default || module;
  
  if (handler.metadata && handler.metadata.type) {
    handlers[handler.metadata.type] = handler;
  }
});

export default handlers;
```

### 3. ビルド時の自動検出と実行時分離（長期的解決策）

- ビルド時に自動検出を行い、静的なリストを生成
- 実行時はそのリストを使用してハンドラーをインポート
- メリット: 完全な自動化と互換性の両立
- デメリット: ビルドプロセスの修正が必要
- 実装方法:
  1. ビルド時にハンドラーリストを生成するスクリプトを作成
  2. 生成されたリストを使用して実行時に各ハンドラーをインポート

## 段階的実装アプローチ

1. **第1段階（即時対応）**: 静的ハンドラー実装を一時的に導入して機能回復
2. **第2段階（改善）**: Viteの`import.meta.glob`を使用した部分的自動化へ移行
3. **第3段階（完全対応）**: ビルドプロセスを含めた自動化システムの再構築

## 技術的考慮事項

- クライアントサイドレンダリングとサーバーサイドレンダリングの責務分離
- ハンドラー登録とテンプレートエンジンのインターフェース統一
- 非同期処理を前提としたアーキテクチャへの移行

この問題は、モダンなJavaScriptフレームワークにおける「ビルド時最適化」と「実行時柔軟性」のバランスを取る典型的な例であり、将来的にはビルドパイプラインの強化が最適解となる可能性が高いです。