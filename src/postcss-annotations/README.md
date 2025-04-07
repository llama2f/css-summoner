# postcss-css-annotations

PostCSSプラグインとして、CSSファイルからコンポーネントアノテーションを抽出します。CSS内の特別なコメント形式からコンポーネント情報を抽出し、構造化データとして提供します。

## 主な機能

- CSSファイル内のアノテーションコメントからコンポーネント情報を抽出
- コンポーネントタイプ、バリアント、説明文などの構造化データを生成
- 抽出データをPostCSSメッセージまたはJSONファイルとして出力

## インストール

npmを使用する場合:
```bash
npm install --save-dev postcss postcss-css-annotations
```

yarnを使用する場合:
```bash
yarn add --dev postcss postcss-css-annotations
```

## 使い方

### PostCSS設定ファイル (`postcss.config.js`) での使用例

```js
const cssAnnotations = require('postcss-css-annotations');

module.exports = {
  plugins: [
    cssAnnotations({
      // オプション (詳細は後述)
      // outputPath: './extracted-annotations.json' 
    })
  ]
}
```

### Node.js スクリプトでの使用例

```js
const postcss = require('postcss');
const cssAnnotations = require('postcss-css-annotations');
const fs = require('fs');

const yourCSS = fs.readFileSync('input.css', 'utf8');

postcss([
  cssAnnotations({
    // オプション
  })
])
  .process(yourCSS, { from: 'input.css' })
  .then((result) => {
    // 抽出データを取得
    const dataMessage = result.messages.find(
      (msg) => msg.type === 'css-annotations-data',
    );
    if (dataMessage) {
      const extractedData = dataMessage.data;
      console.log(extractedData);
      // 必要に応じて extractedData を利用
    }

    // 警告やエラーの確認
    result.warnings().forEach(warn => {
      console.warn(warn.toString());
    });
  });
```

### コマンドラインインターフェース (CLI)

このパッケージには、コマンドラインから直接アノテーションを抽出するツールも含まれています。

```bash
# 特定のCSSファイルから抽出し、デフォルトの annotations.json に出力
npx postcss-css-annotations ./src/styles/button.css

# globパターンで複数ファイルを指定し、出力ファイル名を指定
npx postcss-css-annotations ./src/styles/**/*.css -o ./dist/component-data.json

# 詳細なログを表示
npx postcss-css-annotations ./src/styles/**/*.css -v

# ヘルプを表示
npx postcss-css-annotations --help
```

#### CLI オプション

- `<input-path>`: (必須) 入力CSSファイルまたはglobパターン。
- `-o, --output <path>`: 出力JSONファイルのパス（デフォルト: `./annotations.json`）。
- `-v, --verbose`: 詳細なログをコンソールに出力します。
- `-h, --help`: ヘルプメッセージを表示します。

## オプション設定

プラグインやCLI実行時に以下のオプションを指定できます。

```js
cssAnnotations({
  // 抽出データの出力先JSONファイルパス。
  // 指定しない場合、データはPostCSSのresult.messagesに含まれるのみ。
  outputPath: null, 

  // 認識するアノテーションタグのリスト。
  recognizedTags: [
    '@component:',
    '@variant:',
    '@description:',
    '@category:',
    '@example:',
  ],

  // 必須のアノテーションタグのリスト。
  // これらのタグがコメント内に存在しない場合、警告が出力されます。
  requiredTags: [
    '@component:',
    '@variant:',
    '@description:',
  ],

  // 詳細なログをコンソールに出力するかどうか。
  // CLIでは -v オプションで有効になります。
  verbose: false, 
})
```

## サポートするアノテーション形式

CSS内の以下のような特別なコメント形式を認識します。各アノテーションタグは行頭の `*` の有無に関わらず認識されます。

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
 @component: button
 @variant: primary
 @description: プライマリカラーを使用した重要なアクション用ボタン
 @category: interactive
 @example: <button class="btn-base btn-primary">プライマリボタン</button>
*/
.btn-primary {
  /* スタイル定義 */
}
```

## アノテーションタグの説明

| タグ            | 説明                                                               | 必須 | デフォルト値 |
| --------------- | ------------------------------------------------------------------ | :--: | :----------: |
| `@component:`   | コンポーネントタイプ（例: button, card, alert）                    |  ✅  |     なし     |
| `@variant:`     | バリアント名（例: primary, secondary, base）                       |  ✅  |     なし     |
| `@description:` | クラスの説明文                                                     |  ✅  |     なし     |
| `@category:`    | コンポーネントのカテゴリ（例: interactive, container, typography） |  ❌  |   `'other'`  |
| `@example:`     | 使用例のHTMLコード                                                 |  ❌  |     なし     |

**注意**: 
- `@variant: base` は特別な意味を持ち、そのクラスがコンポーネントのベースクラスであることを示します。各コンポーネントにはベースクラスが1つ定義されていることが期待されます。
- `@category:` が指定されていない場合、デフォルトで `'other'` が設定されます。

## 出力データ形式

プラグインはPostCSSメッセージ (`result.messages`) または指定されたJSONファイルに以下の構造でデータを出力します。

```js
{
  // コンポーネントタイプとそれに属するクラス名のマップ
  "componentTypes": {
    "button": [
      "btn-base",
      "btn-primary"
    ],
    "card": ["card"]
  },
  
  // コンポーネントのベースクラス (variant: base)
  "baseClasses": {
    "button": "btn-base",
    "card": "card"
  },
  
  // コンポーネントのバリアントと対応するクラス名
  "componentVariants": {
    "button": {
      "base": "btn-base",
      "primary": "btn-primary"
    },
    "card": {
      "base": "card"
    }
  },
  
  // クラスの詳細情報
  "classDescriptions": {
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
    },
    "card": {
       "component": "card",
       "variant": "base",
       "description": "カードコンポーネントの基本スタイル",
       "category": "other" // デフォルトカテゴリ
     }
  },
  
  // コンポーネントの使用例（@exampleタグがある場合）
  "componentExamples": {
    "button": [
      {
        "variant": "primary",
        "className": "btn-primary",
        "example": "<button class=\"btn-base btn-primary\">プライマリボタン</button>"
      }
    ]
    // cardにはexampleがないため、キーが存在しない
  },
  
  // CSSルールの詳細情報
  "classRuleDetails": {
    "btn-base": {
      "ruleText": ".btn-base {\n  display: inline-block;\n  padding: 0.5rem 1rem;\n}",
      "selector": ".btn-base",
      "sourceFile": "input.css" // 処理されたファイルパス
    },
    // ... 他のクラスのルール詳細
  },
  
  // メタ情報
  "meta": {
    "totalClasses": 3, // 抽出されたアノテーション付きクラスの総数
    "errors": [ // 処理中に発生したエラーメッセージのリスト
      // 例: "input.css 内のコメントブロック #3 に必須タグがありません: @description:"
    ],
    "source": "input.css" // 処理されたファイルパス (CLIの場合は複数の場合あり)
  }
}
```
*注意:* CLIで複数のファイルを処理した場合、`meta.source` は配列 (`sources`) になり、各データはマージされます。

## 開発

### テストの実行
```bash
yarn test 
```
または
```bash
npm test
```
Vitestによるテストが実行されます。ウォッチモードで起動します。

## 貢献

バグレポートや機能リクエストは[GitHub Issues](https://github.com/yourusername/postcss-css-annotations/issues)で受け付けています。（TODO: 正しいURLに更新）

## ライセンス

MIT License
