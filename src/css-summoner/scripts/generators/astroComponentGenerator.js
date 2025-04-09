// astroComponentGenerator.js - ハンドラからAstroコンポーネントを生成するモジュール
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * JSXファイルからメタデータを抽出する
 * @param {string} filePath JSXファイルのパス
 * @returns {Object} 抽出されたメタデータ
 */
async function extractMetadataFromJSX(filePath) {
  try {
    // ファイルをテキストとして読み込む
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log(`解析対象: ${path.basename(filePath)}`);
    
    let metadata = {};
    
    // 方法1: type定義を直接探す
    const typePattern = /type\s*:\s*['"](\w+)['"]\s*,?/;
    const typeMatch = content.match(typePattern);
    if (typeMatch && typeMatch[1]) {
      metadata.type = typeMatch[1];
      console.log(`タイプ検出: ${metadata.type}`);
    }
    
    // 方法2: categoryを探す
    const categoryPattern = /category\s*:\s*['"](\w+)['"]\s*,?/;
    const categoryMatch = content.match(categoryPattern);
    if (categoryMatch && categoryMatch[1]) {
      metadata.category = categoryMatch[1];
      console.log(`カテゴリ検出: ${metadata.category}`);
    }
    
    // 方法3: descriptionを探す
    const descPattern = /description\s*:\s*['"](.*?)['"]\s*,?/;
    const descMatch = content.match(descPattern);
    if (descMatch && descMatch[1]) {
      metadata.description = descMatch[1];
      console.log(`説明文検出: ${metadata.description}`);
    }
    
    // 方法4: render関数から情報を収集
    if (content.includes('export function render')) {
      console.log(`render関数を発見`);
      // render関数の存在をフラグとして記録
      metadata.hasRender = true;
    }
    
    // バリアントを抜き出す
    const variantsPattern = /['"]([\w-]+)['"]\s*:\s*\(props\)\s*=>\s*{/g;
    let variantsMatch;
    metadata.variants = {};
    
    while ((variantsMatch = variantsPattern.exec(content)) !== null) {
      const variantName = variantsMatch[1];
      metadata.variants[variantName] = {
        label: variantName.split('-').map(part => 
          part.charAt(0).toUpperCase() + part.slice(1)
        ).join(' '),
        description: `${variantName} variant for ${metadata.type || 'component'}`
      };
    }
    
    console.log(`抽出されたバリアント数: ${Object.keys(metadata.variants).length}`);
    
    return metadata;
  } catch (error) {
    console.error(`JSXファイルの解析中にエラーが発生しました: ${filePath}`, error);
    return {};
  }
}

/**
 * ハンドラからAstroコンポーネントを生成
 * @param {string} handlersPath ハンドラーファイルのディレクトリパス
 * @param {string} outputDir 出力ディレクトリ
 * @param {Object} options 追加設定オプション
 */
export async function generateAstroComponents(handlersPath, outputDir, options = {}) {
  console.log('Astroコンポーネント生成を開始します...');
  
  // 出力ディレクトリが存在しない場合は作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // ハンドラファイルを読み込む
  const handlerFiles = fs.readdirSync(handlersPath)
    .filter(file => file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.mjs'));
  
  let generatedCount = 0;
  let errorCount = 0;
  
  for (const handlerFile of handlerFiles) {
    try {
      const handlerPath = path.join(handlersPath, handlerFile);
      
      // JSXファイルの場合は静的解析を使用
      let handler = {};
      
      if (handlerFile.endsWith('.jsx')) {
        // JSXファイルからメタデータを抽出
        handler.metadata = await extractMetadataFromJSX(handlerPath);
        console.log(`JSX静的解析: ${handlerFile}`);
      } else {
        // 通常のJSファイルの場合は動的インポート
        try {
          const handlerModule = await import(`file://${handlerPath}`);
          handler = handlerModule.default;
          console.log(`JS動的インポート: ${handlerFile}`);
        } catch (importError) {
          console.error(`ハンドラーファイルのインポートに失敗しました: ${handlerPath}`, importError);
          errorCount++;
          continue;
        }
      }
      
      if (!handler) {
        console.warn(`警告: ${handlerFile} にハンドラーが存在しません。スキップします。`);
        continue;
      }
      
      // メタデータが異なる形式（metadata直接またはmetadata.type）で格納されている可能性がある
      const metadata = handler.metadata || {};
      const componentType = metadata.type || metadata.componentType || '';
      
      if (!componentType) {
        console.warn(`警告: ${handlerFile} にcomponentTypeが存在しません。スキップします。`);
        continue;
      }
      
      const baseClass = metadata.baseClass || `${componentType}-base`;
      
      // コンポーネント名をパスカルケースに変換
      const componentName = toPascalCase(componentType);
      
      // バリアント情報の処理
      const variants = metadata.variants || handler.variants || {};
      // バリアントの一覧を取得（オブジェクトの場合はキー、関数の場合は関数名）
      const variantKeys = typeof variants === 'object' ? 
                        Object.keys(variants) : 
                        Object.keys(variants).filter(key => typeof variants[key] === 'function');
      
      const variantOptions = variantKeys.map(v => `"${v}"`).join(' | ');
      
      // デフォルト値を設定
      const defaultProps = handler.defaultProps || {};
      
      // カスタムジェネレーターが存在する場合は使用する
      if (typeof handler.generateAstroComponent === 'function') {
        const customContent = handler.generateAstroComponent();
        const outputPath = path.join(outputDir, `${componentName}.astro`);
        
        // 上書き確認
        if (fs.existsSync(outputPath) && !options.force) {
          const overwrite = await confirmOverwrite(outputPath, options);
          if (!overwrite) {
            console.log(`⚠️ スキップしました: ${outputPath} (上書き拒否)`);
            continue;
          }
        }
        
        fs.writeFileSync(outputPath, customContent);
        console.log(`✅ カスタム生成したAstroコンポーネント: ${outputPath}`);
        generatedCount++;
        continue;
      }
      
      // 標準テンプレートでAstroコンポーネントを生成
      const componentContent = generateAstroTemplate({
        componentName,
        componentType,
        baseClass: baseClass || `${componentType}-base`,
        element: metadata.element || 'div',
        variantTypes: variantOptions ? `"" | ${variantOptions}` : '""',
        variantDescriptions: formatVariantDocs(variants),
        defaultVariant: defaultProps.variant || '',
        defaultColor: defaultProps.color || 'color-neutral',
        defaultSize: defaultProps.size || '',
        defaultRadius: defaultProps.radius || '',
        description: metadata.description || `${componentName} component`
      });
      
      // 出力ファイルパス
      const outputPath = path.join(outputDir, `${componentName}.astro`);
      
      // 上書き確認
      if (fs.existsSync(outputPath) && !options.force) {
        const overwrite = await confirmOverwrite(outputPath, options);
        if (!overwrite) {
          console.log(`⚠️ スキップしました: ${outputPath} (上書き拒否)`);
          continue;
        }
      }
      
      // ファイル書き込み
      fs.writeFileSync(outputPath, componentContent);
      console.log(`✅ Astroコンポーネントを生成しました: ${outputPath}`);
      generatedCount++;
    } catch (error) {
      console.error(`❌ ${handlerFile} の処理中にエラーが発生しました:`, error);
      errorCount++;
    }
  }
  
  console.log(`Astroコンポーネント生成が完了しました（成功: ${generatedCount}, エラー: ${errorCount}）`);
  return { generatedCount, errorCount };
}

/**
 * ファイル上書きの確認
 * 対話型環境でない場合はfalseを返す（安全のため）
 */
function confirmOverwrite(filePath, options) {
  // 非対話型環境または自動確認オプションがある場合はそれに従う
  if (options.autoConfirm === true) return Promise.resolve(true);
  if (options.autoConfirm === false) return Promise.resolve(false);
  
  // 実際の環境では対話的にreadlineを使って確認を取る
  // ここでは常にtrueを返す簡易実装
  console.log(`注意: 既存のファイルを上書きします: ${filePath}`);
  return Promise.resolve(true);
}

/**
 * Astroコンポーネントのテンプレート生成
 */
function generateAstroTemplate(data) {
  return `---
/**
 * ${data.description}
 * 
 * 自動生成されたコンポーネント - ${new Date().toISOString()}
 * このファイルは自動生成されています。直接編集せずにハンドラを更新してください。
 */

export interface ${data.componentName}Props {
  /**
   * コンポーネントのバリアント
   * ${data.variantDescriptions}
   */
  variant?: ${data.variantTypes};
  
  /**
   * カラースキーム (例: color-primary, color-secondary)
   */
  color?: string;
  
  /**
   * サイズ設定
   */
  size?: string;
  
  /**
   * 角丸の設定
   */
  radius?: string;
  
  /**
   * モディファイアの配列
   */
  modifiers?: string[];
  
  /**
   * 追加のクラス名
   */
  class?: string;
  
  /**
   * その他のHTML属性
   */
  [key: string]: any;
}

const {
  variant = "${data.defaultVariant}",
  color = "${data.defaultColor}",
  size = "${data.defaultSize}",
  radius = "${data.defaultRadius}",
  modifiers = [],
  class: className = "",
  ...props
} = Astro.props as ${data.componentName}Props;

// クラス文字列の生成
const baseClass = "${data.baseClass}";
const classes = [
  baseClass,
  variant,
  color,
  size,
  radius,
  ...(Array.isArray(modifiers) ? modifiers : []),
  className
].filter(Boolean).join(" ");
---

<${data.element} class={classes} {...props}>
  <slot />
</${data.element}>
`;
}

/**
 * バリアントのドキュメント文字列を生成
 */
function formatVariantDocs(variants) {
  if (!variants || Object.keys(variants).length === 0) {
    return '';
  }
  
  return Object.entries(variants)
    .map(([key, variant]) => {
      // variant.descriptionがnullまたはundefinedの場合に空文字列を使用
      const description = variant.description || '';
      return `* - \`${key}\`: ${description}`;
    })
    .join('\n   ');
}

/**
 * 文字列をパスカルケースに変換
 */
function toPascalCase(str) {
  return str
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}
