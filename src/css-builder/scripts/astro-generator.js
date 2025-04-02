// astro-generator.js - Astroコンポーネントを生成するモジュール (ESM版)
import path from 'path';
import config from './config.js'; // config.js をインポート
import { logger, fileUtils, stringUtils } from './utils.js'; // utils.js をインポート

/**
 * Astroコンポーネント生成モジュール
 */
const astroGenerator = {
	/**
	 * コンポーネントタイプに応じたプレビューHTMLを生成する
	 * @param {string} type コンポーネントタイプ
	 * @param {string} className クラス名
	 * @param {Object} baseClasses ベースクラスのマップ
	 * @returns {string} HTMLコード
	 */
	getComponentPreviewHtml: (type, className, baseClasses = {}) => { // baseClassesにデフォルト値
		const baseClass = baseClasses[type] || '';
		const combinedClass = [baseClass, className].filter(Boolean).join(' '); // より安全な結合

		switch (type) {
			case 'button':
				return `<button type="button" class="${combinedClass}">ボタンテキスト</button>`; // type="button" を追加
			case 'card':
				return `<div class="${combinedClass}" style="width: 100%; border: 1px dashed #ccc; padding: 1rem;"> <!-- プレビュー用スタイル -->
        <div class="card-header">
          <h3 class="card-title">カードタイトル</h3>
        </div>
        <div class="card-body">
          <p>カードコンテンツ</p>
        </div>
      </div>`;
			case 'heading-formal':
			case 'heading-casual':
			case 'heading-technical':
			case 'heading-accent':
			case 'heading':
				return `<h2 class="${combinedClass}">見出しサンプル</h2>`;
			case 'text': // text と text-quote を統合
			case 'text-quote':
				return `<p class="${combinedClass}">テキストサンプル。この文章はダミーです。</p>`;
			case 'infobox':
				return `<div class="${combinedClass}" style="width: 100%; border: 1px dashed #ccc; padding: 1rem;"> <!-- プレビュー用スタイル -->
        <p>インフォメーションメッセージ</p>
      </div>`;
			case 'form-input': // form-input は存在しない可能性？ form を想定？
			    // form コンポーネントのプレビューは複雑なので簡略化
				return `<input type="text" class="${combinedClass || 'input input-bordered'}" placeholder="テキスト入力" />`; // デフォルトクラス追加
            case 'img': // img コンポーネントのプレビュー
                return `<img src="https://via.placeholder.com/150" alt="サンプル画像" class="${combinedClass}" />`;
			// 他のコンポーネントタイプに応じたHTMLを追加
			default:
				// デフォルトはシンプルな div を表示
				return `<div class="${combinedClass}" style="border: 1px dashed #ccc; padding: 1rem;">サンプル: ${type}</div>`;
		}
	},

	/**
	 * コンポーネント例のコードを生成する
	 * @param {string} type コンポーネントタイプ
	 * @param {Object} componentExamples コンポーネント例のマップ
	 * @param {Object} baseClasses ベースクラスのマップ
	* @param {Object} componentVariants コンポーネントバリアントのマップ
	 * @returns {string} 例コード
	 */
	getComponentExampleCode: (
		type,
		componentExamples = {}, // デフォルト値
		baseClasses = {},
		componentVariants = {}
	) => {
		const examples = componentExamples[type] || [];

		// @example アノテーションがあればそれを使用
		if (examples.length > 0) {
			// HTMLエンティティをエスケープしてpreタグ内で正しく表示
			return examples.map(ex =>
			    `<code class="block whitespace-pre-wrap">${ex.example.replace(/</g, '<').replace(/>/g, '>')}</code>`
            ).join('\n\n');
		}

		// デフォルトの例を生成
		const baseClass = baseClasses[type] || '';
		const variants = componentVariants[type] || [];
		const firstVariantClass = variants[0]?.value || ''; // 最初のバリアントクラス

		let defaultExample = `<!-- 基本的な使い方 -->\n`;
		switch (type) {
			case 'button':
				defaultExample += `<button type="button" class="${[baseClass, firstVariantClass].filter(Boolean).join(' ')}">ボタンテキスト</button>\n\n`;
				defaultExample += `<!-- サイズバリエーション (例) -->\n`;
				defaultExample += `<button type="button" class="${[baseClass, firstVariantClass, 'btn-sm'].filter(Boolean).join(' ')}">小さいボタン</button>\n`;
				defaultExample += `<button type="button" class="${[baseClass, firstVariantClass, 'btn-lg'].filter(Boolean).join(' ')}">大きいボタン</button>`;
				break;
			case 'card':
				defaultExample += `<div class="${[baseClass, firstVariantClass].filter(Boolean).join(' ')}">\n`;
				defaultExample += `  <div class="card-header">\n`;
				defaultExample += `    <h3 class="card-title">カードタイトル</h3>\n`;
				defaultExample += `  </div>\n`;
				defaultExample += `  <div class="card-body">\n`;
				defaultExample += `    <p>カードのコンテンツがここに入ります。</p>\n`;
				defaultExample += `  </div>\n`;
				defaultExample += `  <div class="card-footer">\n`;
				// フッター内のボタンは具体的なクラスを指定 (例: btn-primary)
				defaultExample += `    <button type="button" class="btn btn-primary">詳細を見る</button>\n`;
				defaultExample += `  </div>\n`;
				defaultExample += `</div>`;
				break;
            case 'img':
                defaultExample += `<img src="..." alt="..." class="${[baseClass, firstVariantClass].filter(Boolean).join(' ')}" />`;
                break;
			// 他のコンポーネントタイプに応じたデフォルト例を追加
			default:
				if (baseClass || firstVariantClass) {
					defaultExample += `<div class="${[baseClass, firstVariantClass].filter(Boolean).join(' ')}">\n`;
					defaultExample += `  サンプルコンテンツ (${type})\n`;
					defaultExample += `</div>`;
				} else {
					defaultExample = `<!-- ${type}: 使用例が提供されていません -->`;
				}
				break;
		}
        // HTMLエンティティをエスケープ
		return `<code class="block whitespace-pre-wrap">${defaultExample.replace(/</g, '<').replace(/>/g, '>')}</code>`;
	},

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
import Layout from '@/layouts/Layout.astro'; // エイリアスを確認
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
                <Fragment set:html={astroGenerator.getComponentPreviewHtml(componentType, v.className, baseClasses)} />
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
          <Fragment set:html={astroGenerator.getComponentExampleCode(componentType, componentExamples, baseClasses, componentVariants)} />
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
			const success = fileUtils.safeWriteFile(filePath, astroComponentContent, {
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
	 * Astroコンポーネントを生成する (現在は未使用または非推奨の可能性)
	 * 注意: この関数はドキュメントページ生成とは異なり、再利用可能なAstroコンポーネントを生成しようとしますが、
	 * 現在のCSSベースのアプローチでは、ドキュメントページ生成の方が適している場合があります。
	 * @param {string} componentType コンポーネントタイプ
	 * @param {Object} componentData コンポーネントのデータ
	 * @param {Object} configData 設定データ
	 * @param {string} outputDir 出力ディレクトリ
	 * @returns {boolean} 成功したかどうか
	 */
	generateAstroComponent: (
		componentType,
		componentData,
		configData,
		outputDir
	) => {
	    logger.warn(`generateAstroComponent 関数は現在非推奨、または実験的な機能です。(${componentType})`);
		try {
			const { baseClasses = {}, componentVariants = {} } = componentData; // デフォルト値
			const baseClass = baseClasses[componentType] || '';
			const variants = componentVariants[componentType] || [];

			// サイズオプション取得
			const sizes = configData.sizes?.[componentType] || configData.sizes?.common || [];

			// 角丸オプション取得
			const borderRadius = configData.borderRadiusOptions?.[componentType] || configData.borderRadiusOptions?.common || [];

			// モディファイア取得
			// const modifiers = configData.modifiers?.[componentType] || configData.modifiers?.common || []; // モディファイアはPropsで受け取る想定

			// コンポーネント名（PascalCase）
			const componentName = stringUtils.toPascalCase(componentType);
            const interfaceName = `${componentName}Props`; // 型定義ファイル名と合わせる

			// Astroコンポーネントテンプレートの作成
			const astroComponentContent = `---
/**
 * ${componentName} コンポーネント（自動生成）
 *
 * このファイルはスクリプトによって自動生成されました。
 * CSSクラスベースのコンポーネントのため、Propsによる制御は限定的です。
 * 必要に応じて手動でカスタマイズしてください。
 * 型定義: ../../types/${componentName}.d.ts
 */
import type { ${interfaceName} } from '@/css-builder/types/${componentName}'; // 型定義をインポート

interface Props extends ${interfaceName} {} // 生成された型を継承

const {
  variant, // variant は型定義からデフォルト値が設定される想定
  size,    // size も同様
  radius,  // radius も同様
  modifiers = [],
  addClass = "",
  ...rest // 未定義の属性を渡せるようにする
} = Astro.props;

// マッピングオブジェクトの定義 (型安全性を高めるため、キーを型に合わせる)
const variantClasses: Record<NonNullable<Props['variant']>, string> = {
${variants.map((v) => `  "${stringUtils.extractVariantName(v.value)}": "${v.value}",`).join('\n')}
};

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
${sizes.map((s) => `  "${stringUtils.extractSizeName(s.value)}": "${s.value}",`).join('\n')}
};

const radiusClasses: Record<NonNullable<Props['radius']>, string> = {
${borderRadius.map((r) => `  "${r.value}": "${r.value}",`).join('\n')}
};

// クラスの構築
const componentClasses: (string | undefined | null)[] = [
  "${baseClass || ''}", // ベースクラス
  variant ? variantClasses[variant] : undefined, // バリアントクラス
  size ? sizeClasses[size] : undefined,          // サイズクラス
  radius ? radiusClasses[radius] : undefined,    // 角丸クラス
  ...(modifiers || []).map(mod => config.modifiers?.common?.find(m => stringUtils.extractModifierName(m.value) === mod)?.value || config.modifiers?.[componentType]?.find(m => stringUtils.extractModifierName(m.value) === mod)?.value), // モディファイア名をクラス名に変換 (要config構造確認)
  addClass // 追加クラス
];
---

<!-- ${componentName}コンポーネント -->
<!-- 基本はdivだが、コンポーネントタイプに応じて変更が必要な場合がある -->
<div class:list={componentClasses.filter(Boolean)} {...rest}>
  <slot />
</div>
`;

			// コンポーネント用の上書き設定を使用
			const useForce = config.fileOperations.forceByType?.components ?? config.fileOperations.force;
			const useBackup = config.fileOperations.backup?.enabled ?? true;

			// コンポーネントを保存
			const filePath = path.join(outputDir, `${componentName}.astro`);
			const success = fileUtils.safeWriteFile(filePath, astroComponentContent, {
				force: useForce,
				backup: useBackup,
			});

			if (success) {
				logger.verbose(`${componentName}.astro コンポーネントを生成/更新しました。`);
			}

			return success;
		} catch (error) {
			logger.error(
				`${componentType}のAstroコンポーネント生成中にエラーが発生しました:`,
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
					const success = astroGenerator.generateAstroDocPage(
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

	/**
	 * すべてのコンポーネントのAstroコンポーネントを生成する (非推奨)
	 * @param {Object} componentData コンポーネントデータ
	 * @param {Object} configData 設定データ
	 * @param {string} outputDir 出力ディレクトリ
	 * @returns {boolean} 成功したかどうか
	 */
	generateAstroComponents: (
		componentData,
		configData,
		outputDir = config.paths.output.components
	) => {
	    logger.warn('generateAstroComponents は非推奨です。ドキュメントページ生成 (generateAstroDocPages) を使用してください。');
		try {
			// logger.info('Astroコンポーネント生成を開始します...'); // 非推奨のためログレベル変更

			// 出力ディレクトリの存在確認
			if (!fileUtils.ensureDirectoryExists(outputDir)) {
			    logger.error(`Astroコンポーネント出力ディレクトリの作成に失敗: ${outputDir}`);
				return false;
			}

			// 各コンポーネントタイプごとにコンポーネントを作成
			let successCount = 0;
			const componentKeys = Object.keys(componentData.baseClasses || {}); // baseClasses を使用
			const totalComponents = componentKeys.length;

            if (totalComponents === 0) {
                logger.warn('Astroコンポーネントを生成する対象が見つかりませんでした。');
                return true; // エラーではない
            }

			componentKeys.forEach((componentType) => {
				try {
					const success = astroGenerator.generateAstroComponent(
						componentType,
						componentData,
						configData,
						outputDir
					);

					if (success) {
						successCount++;
					}
				} catch (error) {
					logger.error(
						`${componentType}のAstroコンポーネント生成中にエラーが発生しました:`,
						error
					);
				}
			});

			// logger.info(
			// 	`Astroコンポーネント生成が完了しました (${successCount}/${totalComponents}件成功)`
			// ); // 非推奨のためコメントアウト

			return successCount > 0;
		} catch (error) {
			logger.error('Astroコンポーネント生成プロセス全体でエラーが発生しました。', error);
			return false;
		}
	},
};

export default astroGenerator;