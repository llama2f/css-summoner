# postcss-css-annotations

PostCSSプラグインとして、CSSファイルからコンポーネントアノテーションを抽出します。CSS内の特別なコメント形式からコンポーネント情報を抽出し、構造化データとして提供します。

## 主な機能

- CSSファイル内のアノテーションコメントからコンポーネント情報を抽出
- コンポーネントタイプ、バリアント、説明文などの構造化データを生成
- 抽出データをPostCSSメッセージまたはJSONファイルとして出力
- [css-summoner](https://github.com/yourusername/css-summoner)と連携してTypeScript型定義、Astroドキュメント、コンポーネントを生成

## インストール

```bash
npm install --save-dev postcss postcss-css-annotations
```

## 使い方

### 基本的な使い方

```js
const postcss = require('postcss');
const cssAnnotations = require('postcss-css-annotations');

postcss([cssAnnotations()])
  .process(yourCSS, { from: 'input.css' })
  .then((result) => {
    // 抽出データを取得
    const dataMessage = result.messages.find(
      (msg) => msg.type === 'css-annotations-data',
    );
    const extractedData = dataMessage.data;
    console.log(extractedData);
  });
```

### JSON形式でデータを保存

```js
postcss([
  cssAnnotations({
    outputPath: './extracted-annotations.json',
  }),
])
  .process(yourCSS, { from: 'input.css' })
  .then((result) => {
    console.log('抽出データをJSONファイルに保存しました');
  });
```

### オプション設定

```js
postcss([
  cssAnnotations({
    // 抽出データの出力先パス（指定がなければ返すだけ）
    outputPath: './extracted-annotations.json',

    // 認識するタグ
    recognizedTags: [
      '@component:',
      '@variant:',
      '@description:',
      '@category:',
      '@example:',
    ],

    // 必須タグ
    requiredTags: ['@component:', '@variant:', '@description:'],

    // 詳細ログを表示
    verbose: true,
  }),
]);
```

## サポートするアノテーション形式

CSS内の以下のようなアノテーションコメントを認識します：

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
 */
.btn-primary {
  /* スタイル定義 */
}
```

## アノテーションタグの説明

| タグ            | 説明                                                               | 必須 |
| --------------- | ------------------------------------------------------------------ | :--: |
| `@component:`   | コンポーネントタイプ（例: button, card, alert）                    |  ✅  |
| `@variant:`     | バリアント名（例: primary, secondary, base）                       |  ✅  |
| `@description:` | クラスの説明文                                                     |  ✅  |
| `@category:`    | コンポーネントのカテゴリ（例: interactive, container, typography） |  ❌  |
| `@example:`     | 使用例のHTMLコード                                                 |  ❌  |

**注意**: `@variant: base` は特別な意味を持ち、そのクラスがコンポーネントのベースクラスであることを示します。

## 出力データ形式

プラグインは以下の構造でデータを出力します：

```js
{
  // コンポーネントタイプとそれに属するクラス名のマップ
  componentTypes: {
    "button": [
      "btn-base",
      "btn-primary"
    ]
  },

  // コンポーネントのベースクラス
  baseClasses: {
    "button": "btn-base"
  },

  // コンポーネントのバリアント
  componentVariants: {
    "button": {
      "base": "btn-base",
      "primary": "btn-primary"
    }
  },

  // クラスの詳細情報
  classDescriptions: {
    "btn-base": {
      "component": "button",
      "variant": "base",
      "description": "すべてのボタンの基本スタイル",
      "category": "interactive"
    },
    "btn-primary": {
      "component": "button",
      "variant": "primary",
      "description": "プライマリカラーを使用した重要なアクション用ボタン",
      "category": "interactive"
    }
  },

  // コンポーネントの使用例（@exampleタグがある場合）
  componentExamples: {
    "button": [
      {
        "variant": "primary",
        "className": "btn-primary",
        "example": "<button class=\"btn-base btn-primary\">プライマリボタン</button>"
      }
    ]
  },

  // CSSルールの詳細情報
  classRuleDetails: {
    "btn-base": {
      "ruleText": ".btn-base { display: inline-block; padding: 0.5rem 1rem; }",
      "selector": ".btn-base",
      "sourceFile": "input.css"
    }
  },

  // メタ情報
  meta: {
    "totalClasses": 2,
    "errors": [],
    "source": "input.css"
  }
}
```

## css-summonerとの連携

このプラグインは[css-summoner](https://github.com/yourusername/css-summoner)と組み合わせることで、
抽出したコンポーネント情報からTypeScript型定義、Astroコンポーネント、ドキュメントページを生成できます。

```js
import { processCssFiles } from 'css-summoner';

// CSSファイルからアノテーションを抽出し、様々な出力物を生成
processCssFiles({
  cssPattern: './src/styles/**/*.css',
  outputPath: './extracted-annotations.json',
  generateTypes: true,
  generateDocs: true,
  generateComponents: true,
});
```

## 実行例（コマンドライン）

```bash
# css-summonerのCLI経由で実行
npx css-summoner --all   # 全ての出力物を生成
npx css-summoner --types # 型定義のみ生成
npx css-summoner --docs  # ドキュメントページのみ生成
```

## 貢献

バグレポートや機能リクエストは[GitHub Issues](https://github.com/yourusername/postcss-css-annotations/issues)で受け付けています。

## ライセンス

MIT License
