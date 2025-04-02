// type-generator.cjs - TypeScript型定義を生成するモジュール
const path = require('path');
const config = require('./config.cjs');
const { logger, fileUtils, stringUtils } = require('./utils.cjs');

/**
 * 型定義生成モジュール
 */
const typeGenerator = {
  /**
   * コンポーネントの型定義を生成する
   * @param {string} componentType コンポーネントタイプ
   * @param {Array} variants バリアントの配列
   * @param {Array} sizes サイズオプションの配列
   * @param {Array} borderRadius 角丸オプションの配列
   * @param {Array} modifiers モディファイアの配列
   * @param {string} category コンポーネントのカテゴリ
   * @returns {string} TypeScript型定義の内容
   */
  createTypeDefinition: (
    componentType,
    variants,
    sizes,
    borderRadius,
    modifiers,
    category
  ) => {
    const { toPascalCase, extractVariantName, extractSizeName } = stringUtils;
    const componentName = toPascalCase(componentType);
    
    // バリアント型の生成
    const variantType = variants.length > 0
      ? variants.map(v => `'${extractVariantName(v.value)}'`).join(' | ')
      : 'string';
    
    // サイズ型の生成
    const sizeType = sizes.length > 0
      ? sizes.map(s => `'${extractSizeName(s.value)}'`).join(' | ')
      : 'string';
    
    // 角丸型の生成
    const radiusType = borderRadius.length > 0
      ? borderRadius.map(r => `'${r.value}'`).join(' | ')
      : 'string';
    
    // モディファイア型の生成
    const modifierType = modifiers.length > 0
      ? modifiers.map(m => `'${stringUtils.extractModifierName(m.value)}'`).join(' | ')
      : 'string';
    
    return `/**
 * ${componentName} コンポーネントの型定義
 * @category ${category || 'UI Components'}
 */

export interface ${componentName}${config.typeGenerator.interfaceNameSuffix} {
  /**
   * コンポーネントのバリアント
   * @default "${variants.length > 0 ? extractVariantName(variants[0].value) : ''}"
   */
  variant?: ${variantType};
  
  /**
   * コンポーネントのサイズ
   * @default "${sizes.length > 0 ? extractSizeName(sizes[0].value) : ''}"
   */
  size?: ${sizeType};
  
  /**
   * 角丸の設定
   */
  radius?: ${radiusType};
  
  /**
   * 追加のモディファイア
   * @example ["shadow", "animate-up"]
   */
  modifiers?: Array<${modifierType}>;
  
  /**
   * 追加のCSSクラス
   */
  addClass?: string;
  
  /**
   * 子要素
   */
  children?: any;
}
`;
  },
  
  /**
   * すべてのコンポーネントのインデックス型定義ファイルを生成
   * @param {Object} componentTypes コンポーネントタイプのマップ
   * @param {string} typesDir 型定義ファイルを出力するディレクトリ
   * @returns {boolean} 成功したかどうか
   */
  generateIndexTypes: (componentTypes, typesDir = config.paths.output.types) => {
    try {
      const imports = [];
      const exports = [];
      
      Object.keys(componentTypes).forEach(type => {
        const name = stringUtils.toPascalCase(type);
        const interfaceName = `${name}${config.typeGenerator.interfaceNameSuffix}`;
        imports.push(`import type { ${interfaceName} } from './${name}';`);
        exports.push(`  ${interfaceName},`);
      });
      
      const content = `/**
 * 自動生成された型定義のインデックス
 */
${imports.join('\n')}

export {
${exports.join('\n')}
}
`;
      
      // 型定義用の上書き設定を使用
      const useForce = config.fileOperations.forceByType?.types ?? config.fileOperations.force;
      const useBackup = config.fileOperations.backup?.enabled ?? true;
      
      const filePath = path.join(typesDir, 'index.d.ts');
      const success = fileUtils.safeWriteFile(filePath, content, {
        force: useForce,
        backup: useBackup
      });
      
      if (success) {
        logger.info(`インデックス型定義ファイルを生成しました: ${filePath}`);
      }
      
      return success;
    } catch (error) {
      logger.error('インデックス型定義ファイルの生成に失敗しました。', error);
      return false;
    }
  },
  
  /**
   * すべてのコンポーネントの型定義ファイルを生成
   * @param {Object} componentData コンポーネントデータ
   * @param {Object} configData 設定データ
   * @param {string} typesDir 型定義ファイルを出力するディレクトリ
   * @returns {boolean} 成功したかどうか
   */
  generateTypeDefinitions: (
    componentData,
    configData,
    typesDir = config.paths.output.types
  ) => {
    try {
      logger.info('型定義ファイル生成を開始します...');
      
      // 型定義ディレクトリの存在確認
      if (!fileUtils.ensureDirectoryExists(typesDir)) {
        return false;
      }
      
      // 型定義用の上書き設定を使用
      const useForce = config.fileOperations.forceByType?.types ?? config.fileOperations.force;
      const useBackup = config.fileOperations.backup?.enabled ?? true;
      
      // 各コンポーネントタイプの型定義を生成
      let successCount = 0;
      const totalComponents = Object.keys(componentData.baseClasses).length;
      
      Object.keys(componentData.baseClasses).forEach((componentType) => {
        try {
          const componentInfo = componentData.componentTypes.find(c => c.value === componentType) || {};
          const baseClass = componentData.baseClasses[componentType];
          const variants = componentData.componentVariants[componentType] || [];
          
          // サイズオプション取得
          const sizes = configData.sizes[componentType] || 
                       configData.sizes.common || [];
          
          // 角丸オプション取得
          const borderRadius = configData.componentBorderRadius?.[componentType] || 
                              configData.borderRadiusOptions || [];
          
          // モディファイア取得
          const modifiers = configData.modifiers[componentType] || 
                           configData.modifiers.common || [];
          
          // 型定義を生成
          const typeDefinition = typeGenerator.createTypeDefinition(
            componentType,
            variants,
            sizes,
            borderRadius,
            modifiers,
            componentInfo.category
          );
          
          // ファイル名はPascalCaseに変換
          const typeName = stringUtils.toPascalCase(componentType);
          const typeFilePath = path.join(typesDir, `${typeName}.d.ts`);
          
          // 型定義ファイルを保存
          const success = fileUtils.safeWriteFile(typeFilePath, typeDefinition, {
            force: useForce,
            backup: useBackup
          });
          
          if (success) {
            logger.verbose(`型定義ファイルを生成しました: ${typeFilePath}`);
            successCount++;
          }
        } catch (error) {
          logger.error(`${componentType}の型定義生成中にエラーが発生しました:`, error);
        }
      });
      
      // インデックス型定義ファイルを生成
      const indexSuccess = typeGenerator.generateIndexTypes(componentData.baseClasses, typesDir);
      
      logger.info(`型定義ファイル生成が完了しました (${successCount}/${totalComponents}件成功)`);
      
      return successCount > 0 && indexSuccess;
    } catch (error) {
      logger.error('型定義ファイル生成に失敗しました。', error);
      return false;
    }
  }
};

module.exports = typeGenerator;
