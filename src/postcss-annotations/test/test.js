const postcss = require('postcss');
const plugin = require('../src');

async function run(input, opts = {}) {
  const result = await postcss([plugin(opts)]).process(input, { from: 'test.css' });
  return result;
}

// テスト用CSSファイル内容
const testCSS = `
/* 
 * @component: button
 * @variant: base
 * @description: すべてのボタンの基本スタイル
 * @category: interactive
 */
.btn-base {
  display: inline-block;
  padding: 0.5rem 1rem;
}

/* 
 * @component: button
 * @variant: primary
 * @description: プライマリカラーを使用した重要なアクション用ボタン
 * @category: interactive
 * @example: <button class="btn-base btn-primary">プライマリボタン</button>
 */
.btn-primary {
  background-color: blue;
  color: white;
}

/* 通常のコメント - アノテーションではない */
.normal-class {
  margin: 1rem;
}

/* 
 * @component: card
 * @variant: base
 * @description: カードコンポーネントの基本スタイル
 */
.card {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1rem;
}
`;

async function runTest() {
  try {
    // プラグインを実行
    const result = await run(testCSS);
    
    // 結果を出力
    const message = result.messages.find(msg => msg.type === 'css-annotations-data');
    if (!message) {
      console.error('エラー: アノテーションデータが見つかりませんでした');
      return;
    }
    
    const data = message.data;
    console.log('抽出されたコンポーネントタイプ:');
    console.log(JSON.stringify(data.componentTypes, null, 2));
    
    console.log('\nベースクラス:');
    console.log(JSON.stringify(data.baseClasses, null, 2));
    
    console.log('\nコンポーネントバリアント:');
    console.log(JSON.stringify(data.componentVariants, null, 2));
    
    console.log('\nクラスの説明:');
    console.log(JSON.stringify(data.classDescriptions, null, 2));
    
    console.log('\nメタ情報:');
    console.log(JSON.stringify(data.meta, null, 2));
    
    // 検証
    console.log('\n----------------');
    console.log('検証結果:');
    
    // コンポーネント数の検証
    const componentCount = Object.keys(data.componentTypes).length;
    console.log(`コンポーネント数: ${componentCount} (期待値: 2)`);
    
    // クラス数の検証
    const classCount = Object.keys(data.classDescriptions).length;
    console.log(`クラス数: ${classCount} (期待値: 3)`);
    
    // 特定のコンポーネントの存在確認
    const hasButton = !!data.componentTypes.button;
    console.log(`buttonコンポーネントの存在: ${hasButton ? 'OK' : 'NG'}`);
    
    const hasCard = !!data.componentTypes.card;
    console.log(`cardコンポーネントの存在: ${hasCard ? 'OK' : 'NG'}`);
    
    // ベースクラスの確認
    const buttonBase = data.baseClasses.button === 'btn-base';
    console.log(`buttonのベースクラス: ${buttonBase ? 'OK' : 'NG'}`);
    
    // バリアントの確認
    const hasPrimary = data.componentVariants.button.primary === 'btn-primary';
    console.log(`buttonのprimaryバリアント: ${hasPrimary ? 'OK' : 'NG'}`);
    
    // テスト成功の判定
    const success = componentCount === 2 && classCount === 3 && hasButton && hasCard && buttonBase && hasPrimary;
    console.log(`\nテスト${success ? '成功' : '失敗'}`);
    
  } catch (error) {
    console.error('テスト実行中にエラーが発生しました:', error);
  }
}

runTest().catch(console.error);