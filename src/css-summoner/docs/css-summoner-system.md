
```graph TD
    subgraph データ準備 [データ準備プロセス]
        direction LR
        CSS[CSSファイル<br>アノテーション付き] --> Plugin(PostCSS Plugin<br>postcss-css-annotations)
        Plugin --> ExtractedData(extracted-annotations.json<br>抽出データ)
        Configs[手動設定<br>src/css-summoner/configs/*] --> Mappings(データ統合<br>src/css-summoner/classMappings.js)
        ExtractedData --> Mappings
    end

    subgraph ビルド時生成 [ビルド時生成プロセス]
        direction LR
        Mappings --> Integration(実行スクリプト<br>src/css-summoner-integration.js)
        Integration --> Generator(各種ジェネレーター<br>scripts/generators)
        Generator --> Types(TypeScript型定義<br>src/css-summoner/types)
        Generator --> Docs(Astroドキュメント<br>src/pages/css-summoner)
        Generator --> Components(Astroコンポーネント<br>src/pages/css-summoner)
    end

    subgraph UIとプレビュー [UIとプレビュープロセス]
        direction LR
        Mappings --> UI(カスタムクラス<br>ビルダーUI<br>Classsummoner.jsx)
        UI --> Handler(ハンドラーシステム<br>templates/handlers)
        Handler --> Preview(プレビュー表示<br>ClassPreview.jsx)
        Handler --> CodeOutput(クラス文字列<br>ClassCodeDisplay.jsx)
    end

    %% 実行フローの関連付け (点線)
    Integration -.-> Plugin
    Integration -.-> Generator

```

**システム概要:**

1.  **データ準備:**
    *   CSS ファイルに記述されたアノテーション (`@component`, `@variant` など) を `postcss-css-annotations` プラグインが解析し、`extracted-annotations.json` に抽出データを出力します。
    *   サイズ、モディファイアなどの手動設定は `src/css-summoner/configs/` ディレクトリ内のファイルで管理されます。
    *   `classMappings.js` が、`extracted-annotations.json` と `configs/*` からのデータを統合し、アプリケーション全体で利用可能なデータを提供します。
2.  **ビルド時生成:**
    *   `css-summoner-integration.js` スクリプトが実行されます。
    *   このスクリプトは `classMappings.js` から統合データを取得します。
    *   取得したデータに基づき、各種ジェネレーターが TypeScript の型定義、Astro のドキュメントページ、および Astro コンポーネントを自動生成します。
3.  **UI とプレビュー:**
    *   `Classsummoner.jsx` (カスタムクラスビルダー UI) は `classMappings.js` からデータを取得し、コンポーネント選択、バリアント選択などの UI を構築します。
    *   ユーザーが UI でオプションを選択すると、対応するハンドラー (`templates/handlers`) が呼び出されます。
    *   ハンドラーは選択されたオプションに基づいてプレビュー用の HTML を生成し (`ClassPreview.jsx`)、最終的な CSS クラス文字列を生成します (`ClassCodeDisplay.jsx`)。