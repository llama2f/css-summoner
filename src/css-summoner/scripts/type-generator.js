// type-generator.js - TypeScript型定義を生成するモジュール (ESM版)
import fs from 'fs'; // fsモジュールをインポート
import path from 'path';
import config from './config.js'; // config.js をインポート
import { logger, fileUtils, stringUtils } from './utils.js'; // utils.js をインポート

/**
 * 型定義生成モジュール
 */
const typeGenerator = {
  /**
   * コンポーネントの型定義を生成する
   * @param {string} componentType コンポーネントタイプ
   * @param {Array} variants バリアントの配列 [{ value: string, label: string }]
   * @param {Array} sizes サイズオプションの配列 [{ value: string, label: string }]
   * @param {Array} borderRadius 角丸オプションの配列 [{ value: string, label: string }]
   * @param {Array} modifiers モディファイアの配列 [{ value: string, label: string }]
   * @param {string} category コンポーネントのカテゴリ
   * @returns {string} TypeScript型定義の内容
   */
  createTypeDefinition: (
    componentType,
    variants = [], // デフォルト値を空配列に
    sizes = [],
    borderRadius = [],
    modifiers = [],
    category = 'UI Components' // デフォルトカテゴリ
  ) => {
    const { toPascalCase, extractVariantName, extractSizeName, extractModifierName } = stringUtils;
    const componentName = toPascalCase(componentType);

    // バリアント型の生成 (値が存在する場合のみ)
    const variantType = variants.length > 0
      ? variants.map(v => `'${extractVariantName(v.value)}'`).join(' | ')
      : 'string'; // バリアントがない場合は string

    // サイズ型の生成 (値が存在する場合のみ)
    const sizeType = sizes.length > 0
      ? sizes.map(s => `'${extractSizeName(s.value)}'`).join(' | ')
      : 'string'; // サイズがない場合は string

    // 角丸型の生成 (値が存在する場合のみ)
    const radiusType = borderRadius.length > 0
      ? borderRadius.map(r => `'${r.value}'`).join(' | ') // 角丸は value をそのまま使うことが多い
      : 'string'; // 角丸がない場合は string

    // モディファイア型の生成 (値が存在する場合のみ)
    const modifierType = modifiers.length > 0
      ? modifiers.map(m => `'${extractModifierName(m.value)}'`).join(' | ')
      : 'string'; // モディファイアがない場合は string

    // デフォルト値の取得（配列の最初の要素、なければ空文字）
    const defaultVariant = variants.length > 0 ? extractVariantName(variants[0].value) : '';
    const defaultSize = sizes.length > 0 ? extractSizeName(sizes[0].value) : '';

    return `/**
 * ${componentName} コンポーネントのプロパティ型定義
 * カテゴリ: ${category}
 */
export interface ${componentName}${config.typeGenerator.interfaceNameSuffix} {
  /**
   * コンポーネントの視覚的なスタイルバリアント。
   * @default "${defaultVariant}"
   */
  variant?: ${variantType};

  /**
   * コンポーネントのサイズ。
   * @default "${defaultSize}"
   */
  size?: ${sizeType};

  /**
   * コンポーネントの角丸の程度。
   */
  radius?: ${radiusType};

  /**
   * 追加のスタイル修飾子 (例: 影、アニメーション)。
   * @example ["shadow", "animate-up"]
   */
  modifiers?: Array<${modifierType}>;

  /**
   * Tailwindクラスなど、追加で適用するCSSクラス文字列。
   */
  addClass?: string;

  /**
   * コンポーネント内に表示される子要素 (Reactノード)。
   */
  children?: React.ReactNode; // any より React.ReactNode が望ましい

  // 必要に応じて他の共通プロパティを追加 (例: id, aria-label など)
  // id?: string;
  // 'aria-label'?: string;
}
`;
  },

  /**
   * すべてのコンポーネントのインデックス型定義ファイルを生成
   * @param {Object} componentTypesMap コンポーネントタイプ名をキーとするオブジェクト (例: baseClasses)
   * @param {string} typesDir 型定義ファイルを出力するディレクトリ
   * @returns {boolean} 成功したかどうか
   */
  generateIndexTypes: (componentTypesMap, typesDir = config.paths.output.types) => {
    try {
      const imports = [];
      const exports = [];

      // componentTypesMap のキー (コンポーネントタイプ名) をソートして処理
      Object.keys(componentTypesMap).sort().forEach(type => {
        const name = stringUtils.toPascalCase(type);
        const interfaceName = `${name}${config.typeGenerator.interfaceNameSuffix}`;
        // ファイルが存在するか確認してからインポート文を生成 (より安全に)
        const typeFilePath = path.join(typesDir, `${name}.d.ts`);
        if (fs.existsSync(typeFilePath)) {
            imports.push(`import type { ${interfaceName} } from './${name}';`);
            exports.push(`  ${interfaceName},`);
        } else {
            logger.warn(`インデックス生成スキップ: 型定義ファイルが見つかりません - ${typeFilePath}`);
        }
      });

      if (exports.length === 0) {
          logger.warn('エクスポートする型定義が見つからないため、インデックスファイルを生成しませんでした。');
          return true; // エラーではないのでtrueを返す
      }

      const content = `/**
 * 自動生成されたコンポーネント型定義のインデックスファイル。
 * このファイルは直接編集しないでください。変更はスクリプトによって上書きされます。
 */
${imports.join('\n')}

export type {
${exports.join('\n')}
};
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
        logger.info(`インデックス型定義ファイルを生成/更新しました: ${filePath}`);
      }

      return success;
    } catch (error) {
      logger.error('インデックス型定義ファイルの生成中にエラーが発生しました。エラー詳細:', error); // エラーオブジェクト全体を出力
      return false;
    }
  },

  /**
   * すべてのコンポーネントの型定義ファイルを生成
   * @param {Object} componentData 構造化されたコンポーネントデータ
   * @param {Object} configData 設定データ (sizes, borderRadiusOptions, modifiers を含む)
   * @param {string} typesDir 型定義ファイルを出力するディレクトリ
   * @returns {boolean} 成功したかどうか
   */
  generateTypeDefinitions: (
    componentData,
    configData, // config.js から取得した設定全体を渡す想定
    typesDir = config.paths.output.types
  ) => {
    try {
      logger.info('型定義ファイル生成を開始します...');

      // 型定義ディレクトリの存在確認
      if (!fileUtils.ensureDirectoryExists(typesDir)) {
        logger.error(`型定義ディレクトリの作成に失敗しました: ${typesDir}`);
        return false;
      }

      // 型定義用の上書き設定を使用
      const useForce = config.fileOperations.forceByType?.types ?? config.fileOperations.force;
      const useBackup = config.fileOperations.backup?.enabled ?? true;

      // 各コンポーネントタイプの型定義を生成
      let successCount = 0;
      const componentKeys = Object.keys(componentData.componentsByType || {}); // componentsByType を使用
      const totalComponents = componentKeys.length;

      if (totalComponents === 0) {
          logger.warn('型定義を生成するコンポーネントが見つかりませんでした。');
          return true; // エラーではない
      }

      componentKeys.forEach((componentType) => {
        try {
          const componentInfo = componentData.componentTypes.find(c => c.value === componentType) || {};
          const variants = componentData.componentVariants[componentType] || [];

          // サイズオプション取得 (configDataから取得)
          const sizes = configData.sizes?.[componentType] ||
                       configData.sizes?.common || [];

          // 角丸オプション取得 (configDataから取得)
          // config.js の borderRadiusOptions を参照するように修正が必要かもしれない
          // ここでは仮に configData.borderRadiusOptions を参照
          const borderRadius = configData.borderRadiusOptions?.[componentType] ||
                                configData.borderRadiusOptions?.common || [];

          // モディファイア取得 (configDataから取得)
          const modifiers = configData.modifiers?.[componentType] ||
                           configData.modifiers?.common || [];

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
            logger.verbose(`型定義ファイルを生成/更新しました: ${typeFilePath}`);
            successCount++;
          }
        } catch (error) {
          logger.error(`${componentType}の型定義生成中にエラーが発生しました:`, error);
        }
      });

      // インデックス型定義ファイルを生成 (baseClassesではなくcomponentsByTypeを渡す方が確実かも)
      const indexSuccess = typeGenerator.generateIndexTypes(componentData.componentsByType || {}, typesDir);

      logger.info(`型定義ファイル生成が完了しました (${successCount}/${totalComponents}件成功)`);

      return successCount > 0 && indexSuccess;
    } catch (error) {
      logger.error('型定義ファイル生成プロセス全体でエラーが発生しました。', error);
      return false;
    }
  }
};

export default typeGenerator;