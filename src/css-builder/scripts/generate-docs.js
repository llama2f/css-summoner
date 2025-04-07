// astro-generator.js - Astroコンポーネントを生成するモジュール (ESM版)
import path from 'path';
import config from './config.js'; // config.js をインポート
import { logger, fileUtils, stringUtils } from './utils.js'; // utils.js をインポート

/**
 * Astroコンポーネント生成モジュール
 */
const docGenerator = {

	/**
	 * Astroコンポーネントのドキュメントページを生成する
	 * @param {string} componentType コンポーネントタイプ
	 * @param {Array} classes コンポーネントのクラス情報
	 * @param {Object} componentData コンポーネントデータ
	 * @param {string} outputDir 出力ディレクトリ
	 * @returns {boolean} 成功したかどうか
	 */
	generateAstroDocPage: (componentType, classes = [], componentData = {}, outputDir) => { // デフォルト値追加
		try {
			const { baseClasses = {}, componentVariants = {}, componentExamples = {} } = componentData; // デフォルト値

			const componentLabel = componentType
				.replace(/-/g, ' ')
				.replace(/\b[a-z]/g, (c) => c.toUpperCase());

			// バリアントをグループ化 (baseを除く)
			const variants = classes
				.filter((cls) => cls.variant !== 'base')
				.map((cls) => ({
					variant: cls.variant,
					className: cls.className,
					description: cls.description || '説明なし', // 説明がない場合のフォールバック
				}))
                .sort((a, b) => a.variant.localeCompare(b.variant)); // バリアント名でソート

			// ベースクラスの情報
			const baseClassInfo = classes.find((cls) => cls.variant === 'base');
            const baseClassName = baseClassInfo?.className || '';
            const baseClassDescription = baseClassInfo?.description || `${componentLabel} の基本スタイル`;

			// ソースファイルの特定 (重複排除)
			const sourceFiles = [...new Set(classes.map((cls) => cls.sourceFile).filter(Boolean))];

			// Astroページテンプレートの作成
			const astroContent = `---
/**
 * ${componentLabel} コンポーネント ドキュメント
 *
 * このファイルはスクリプトによって自動生成されました。
 * 元のCSSファイルのアノテーション、または astro-generator.js を編集してください。
 * ソース: ${sourceFiles.join(', ') || '不明'}
 */
import Layout from '@layouts/Layout.astro'; // 正しいエイリアスを使用
import Menu from '@/css-builder/layouts/Menu.astro'; // css-builder内のMenuを使用

// スタイルシートのインポート (必要に応じて調整)
// import '@/css-builder/styles/styles.css'; // 全体スタイル
// import '@/css-builder/styles/${componentType}/index.css'; // 個別スタイル (必要なら)

const pageTitle = "${componentLabel} コンポーネント";
const pageDesc = "${componentLabel} コンポーネントのスタイルバリエーションと使用例。";
---

<Layout pageTitle={pageTitle} desc={pageDesc}>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4">{pageTitle}</h1>
    <p class="text-lg text-neutral-600 mb-6">
      ${baseClassDescription}
      {baseClassName && <code class="ml-2 text-sm bg-neutral-200 p-1 rounded">.${baseClassName}</code>}
    </p>
    <div class="mb-6">
      <a href="/css-builder" class="text-primary hover:underline">
        ← クラスビルダーに戻る
      </a>
    </div>
    <Menu client:load /> {/* client:load を追加 */}

    {variants.length > 0 && (
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-6 border-b pb-2">バリアント</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${variants
            .map(
              (v) => `
          <div class="border rounded-lg shadow-sm overflow-hidden">
            <div class="p-4 bg-neutral-100">
              <h3 class="text-lg font-medium">${v.variant.replace(/-/g, ' ').replace(/\b[a-z]/g, (c) => c.toUpperCase())}</h3>
              <code class="block text-sm text-neutral-700 mt-1">.${v.className}</code>
            </div>
            <div class="p-4">
              <p class="text-sm text-neutral-600 mb-4">${v.description}</p>
              <div class="bg-white p-6 rounded border border-dashed flex items-center justify-center min-h-[100px]">
                <!-- HTMLをエスケープせずに埋め込む -->
                <Fragment set:html={docGenerator.getComponentPreviewHtml(componentType, v.className, baseClasses)} />
              </div>
            </div>
          </div>
          `
            )
            .join('\n')}
        </div>
      </section>
    )}

    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-6 border-b pb-2">使用例</h2>
      <div class="bg-neutral-800 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <pre class="text-sm">
          <!-- HTMLをエスケープせずに埋め込む -->
          <Fragment set:html={docGenerator.getComponentExampleCode(componentType, componentExamples, baseClasses, componentVariants)} />
        </pre>
      </div>
    </section>

    <Menu client:load /> {/* client:load を追加 */}
    <div class="mt-6">
      <a href="/css-builder" class="text-primary hover:underline">
        ← クラスビルダーに戻る
      </a>
    </div>
  </div>
</Layout>
`;

			// ドキュメント用の上書き設定を使用
			const useForce = config.fileOperations.forceByType?.docs ?? config.fileOperations.force;
			const useBackup = config.fileOperations.backup?.enabled ?? true;

			// ページを保存
			const filePath = path.join(outputDir, `${componentType}.astro`);
			const success = fileUtils.safeWriteFile(filePath, astroContent, { // 正しい変数名に修正
				force: useForce,
				backup: useBackup,
			});

			if (success) {
				logger.verbose(
					`${componentType}.astro ドキュメントページを生成/更新しました。`
				);
			}

			return success;
		} catch (error) {
			logger.error(
				`${componentType}のAstroドキュメントページ生成中にエラーが発生しました:`,
				error
			);
			return false;
		}
	},

	
	/**
	 * すべてのコンポーネントのAstroドキュメントページを生成する
	 * @param {Object} componentData コンポーネントデータ
	 * @param {Object} configData 設定データ (現在は未使用だが将来的に使う可能性)
	 * @param {string} outputDir 出力ディレクトリ
	 * @returns {boolean} 成功したかどうか
	 */
	generateAstroDocPages: (
		componentData,
		configData, // 引数は維持するが、現在は未使用
		outputDir = config.paths.output.docs
	) => {
		try {
			logger.info('Astroドキュメントページ生成を開始します...');

			// 出力ディレクトリの存在確認
			if (!fileUtils.ensureDirectoryExists(outputDir)) {
			    logger.error(`ドキュメント出力ディレクトリの作成に失敗: ${outputDir}`);
				return false;
			}

			// 各コンポーネントタイプごとにページを作成
			let successCount = 0;
			const { componentsByType = {} } = componentData; // デフォルト値
			const componentKeys = Object.keys(componentsByType);
			const totalComponents = componentKeys.length;

            if (totalComponents === 0) {
                logger.warn('ドキュメントを生成するコンポーネントが見つかりませんでした。');
                return true; // エラーではない
            }

			componentKeys.forEach((componentType) => {
				try {
					const classes = componentsByType[componentType];
					const success = docGenerator.generateAstroDocPage(
						componentType,
						classes,
						componentData, // componentData全体を渡す
						outputDir
					);

					if (success) {
						successCount++;
					}
				} catch (error) {
					logger.error(
						`${componentType}のAstroドキュメントページ生成中にエラーが発生しました:`,
						error
					);
				}
			});

			logger.info(
				`Astroドキュメントページ生成が完了しました (${successCount}/${totalComponents}件成功)`
			);

			return successCount > 0;
		} catch (error) {
			logger.error('Astroドキュメントページ生成プロセス全体でエラーが発生しました。', error);
			return false;
		}
	},


};

export default docGenerator;