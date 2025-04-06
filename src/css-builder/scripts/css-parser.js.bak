// css-parser.js - CSSファイルからアノテーション情報を抽出するモジュール (ESM版)
import fs from 'fs';
import path from 'path';
import config from './config.js'; // config.js をインポート

/**
 * CSS解析モジュール
 */
const cssParser = {
	/**
	 * 特定のタグの値を抽出するヘルパー関数
	 * @param {string} comment コメントテキスト
	 * @param {string} tag タグ名（@component: など）
	 * @returns {string|null} 抽出した値、またはnull
	 */
	extractTagValue: (comment, tag) => {
		const tagIndex = comment.indexOf(tag);
		if (tagIndex === -1) return null;

		// タグの後の内容を取得
		const afterTag = comment.substring(tagIndex + tag.length);

		// 次のタグまたはコメント終了までの内容を取得
		const nextTagIndex = cssParser.getNextTagIndex(afterTag);
		const valueRaw =
			nextTagIndex > -1
				? afterTag.substring(0, nextTagIndex)
				: afterTag.substring(
						0,
						afterTag.indexOf('*/') !== -1
							? afterTag.indexOf('*/')
							: afterTag.length
					);

		// 行頭の*や空白を削除して整形
		return valueRaw
			.split('\n')
			.map((line) => line.replace(/^\s*\*?\s*/, '').trim())
			.join('\n')
			.trim();
	},

	/**
	 * 次のアノテーションタグの位置を見つける
	 * @param {string} text テキスト
	 * @returns {number} 次のタグの位置、またはタグがない場合は-1
	 */
	getNextTagIndex: (text) => {
		// configからタグリストを取得するように変更も検討可能
		const tags = config.cssParser.recognizedTags || [
			'@component:',
			'@variant:',
			'@description:',
			'@category:',
			'@example:',
		];
		const indices = tags
			.map((tag) => {
				const index = text.indexOf(tag);
				return index > -1 ? index : Infinity;
			})
			.filter((index) => index !== Infinity);

		return indices.length > 0 ? Math.min(...indices) : -1;
	},

	/**
	 * CSSファイルからアノテーション情報を抽出する（段階的パース方式）
	 * @param {string} cssContent CSSファイルの内容
	 * @param {string} filename ファイル名（ソース参照用）
	 * @returns {{ classes: Array, errors: Array }} クラス情報の配列とエラー情報の配列
	 */
	extractMetadata: (cssContent, filename) => {
		const classes = [];
		const errors = [];

		// ステップ1: コメントブロック全体を抽出
		const commentRegex = /\/\*[\s\S]*?\*\//g;
		let commentMatch;
		let commentIndex = 0;

		while ((commentMatch = commentRegex.exec(cssContent)) !== null) {
			commentIndex++;
			const comment = commentMatch[0];

			// ステップ2: 必須アノテーションタグの存在チェック
			const requiredTags = config.cssParser.requiredTags || ['@component:', '@variant:', '@description:'];
			const missingTags = requiredTags.filter(tag => !comment.includes(tag));

			// 必須タグがない場合はスキップ（ただし、他の@タグがあればエラー報告）
			if (missingTags.length > 0) {
				const hasAnyTag = config.cssParser.recognizedTags.some(tag => comment.includes(tag));
				if (hasAnyTag) {
					errors.push(
						`${filename}内のコメントブロック#${commentIndex}に必須タグがありません: ${missingTags.join(', ')}`
					);
				}
				continue;
			}

			// ステップ3: 各アノテーションの値を抽出
			const component = cssParser.extractTagValue(comment, '@component:');
			const variant = cssParser.extractTagValue(comment, '@variant:');
			const description = cssParser.extractTagValue(comment, '@description:');
			const category =
				cssParser.extractTagValue(comment, '@category:') || 'other'; // デフォルトカテゴリ
			const example = cssParser.extractTagValue(comment, '@example:');

			// 値の検証
			const emptyTags = [];
			if (!component) emptyTags.push('@component');
			if (!variant) emptyTags.push('@variant');
			if (!description) emptyTags.push('@description');

			if (emptyTags.length > 0) {
				errors.push(
					`${filename}内のコメントブロック#${commentIndex}にタグの値がありません: ${emptyTags.join(', ')}`
				);
				continue;
			}

			// ステップ4: アノテーション直後のクラスセレクタを検出
			const afterComment = cssContent.substring(
				commentMatch.index + comment.length
			);
			// より堅牢なクラス名検出（例：.class-name { や .class-name, など）
			const classNameMatch = afterComment.match(/^\s*\.([\w-]+)\s*[\{,]/);

			if (classNameMatch) {
				classes.push({
					component,
					variant,
					className: classNameMatch[1],
					description,
					category,
					example,
					sourceFile: filename, // どのファイルから抽出されたかの情報
				});
			} else {
				errors.push(
					`${filename}内のコンポーネント「${component}」のアノテーション直後にクラスセレクタが見つかりません。`
				);
			}
		}

		return { classes, errors };
	},

	/**
	 * 指定されたディレクトリ内のすべてのCSSファイルからクラス情報を抽出する
	 * @returns {Array} すべてのCSSファイルから抽出されたクラス情報
	 */
	parseAllCssFiles: () => {
		try {
			// スタイルファイルのパスを取得
			const cssFiles = config.paths.getStyleFiles();

			if (!cssFiles || cssFiles.length === 0) {
				console.warn(`CSSファイルが見つかりませんでした。`);
				return [];
			}

			console.log(`${cssFiles.length}個のCSSファイルを見つけました。`);

			// 各CSSファイルを解析
			let allClasses = [];
			let totalErrors = 0;
			let allParseErrors = [];

			cssFiles.forEach((filePath) => {
				try {
					const cssContent = fs.readFileSync(filePath, 'utf8');
					// ファイル名をディレクトリ名 + / + ファイル名にする（例: button/base.css）
					const relativePath = path.relative(config.paths.stylesDir, filePath);
					const fileNameForLog = relativePath.replace(/\\/g, '/'); // Windowsパス対策

					if (cssContent) {
						const { classes, errors } = cssParser.extractMetadata(cssContent, fileNameForLog);
						if (classes.length > 0) {
						    console.log(
							    `${fileNameForLog}から${classes.length}個のクラスを抽出しました。`
						    );
						    allClasses = allClasses.concat(classes);
                        }
						if (errors.length > 0) {
							allParseErrors = allParseErrors.concat(errors);
						}
					}
				} catch (error) {
					console.error(`${filePath}の読み込み/解析中にエラーが発生しました。`, error);
					totalErrors++; // ファイル読み込み自体のエラー
				}
			});

            // パース中のエラーがあれば表示
            if (allParseErrors.length > 0) {
                console.warn(`CSS解析中に${allParseErrors.length}件の問題が見つかりました：`);
                allParseErrors.forEach((error) => console.warn(`- ${error}`));
                totalErrors += allParseErrors.length; // パースエラーも総エラー数に加算
            }

			// 結果の集計
			console.log(
				`合計${allClasses.length}個のクラスを抽出しました。${totalErrors > 0 ? `${totalErrors}件のエラー/警告がありました。` : ''}`
			);
			return allClasses;
		} catch (error) {
			console.error(`CSSファイルの解析プロセス全体でエラーが発生しました。`, error);
			return [];
		}
	},

	/**
	 * 抽出したクラス情報から構造化データを生成する
	 * @param {Array} allClasses 抽出したクラス情報の配列
	 * @returns {Object} 構造化されたコンポーネントデータ
	 */
	structureComponentData: (allClasses) => {
		// 初期化
		const componentTypes = [];
		const baseClasses = {};
		const componentVariants = {};
		const classDescriptions = {};
		const componentExamples = {};
		const componentsByType = {}; // コンポーネントタイプごとの全クラス情報

		// データの集約
		allClasses.forEach((cls) => {
			// componentTypesの構築 (重複チェック)
			if (!componentTypes.some((c) => c.value === cls.component)) {
				componentTypes.push({
					value: cls.component,
					label: cls.component // ラベルは後で整形可能
						.replace(/-/g, ' ')
						.replace(/\b[a-z]/g, (c) => c.toUpperCase()),
					category: cls.category || 'other', // カテゴリがない場合はother
				});
			}

			// コンポーネントタイプごとにクラスを整理
			if (!componentsByType[cls.component]) {
				componentsByType[cls.component] = [];
			}
			componentsByType[cls.component].push(cls);

			// baseClassesの構築 (variantが'base'の場合)
			if (cls.variant === 'base') {
				// 既に設定されている場合は警告を出す（通常は一つのはず）
				if (baseClasses[cls.component]) {
					console.warn(`警告: コンポーネント '${cls.component}' に複数のベースクラスが定義されています。(${baseClasses[cls.component]}, ${cls.className})`);
				}
				baseClasses[cls.component] = cls.className;
			}

			// componentVariantsの構築 (variantが'base'でない場合)
			if (cls.variant !== 'base') {
				if (!componentVariants[cls.component]) {
					componentVariants[cls.component] = [];
				}
				// 重複チェック
				if (!componentVariants[cls.component].some(v => v.value === cls.className)) {
					componentVariants[cls.component].push({
						value: cls.className,
						label: cls.variant // ラベルはvariant名をそのまま使うか、整形するか選択
							.replace(/-/g, ' ')
							.replace(/\b[a-z]/g, (c) => c.toUpperCase()),
					});
				}
			}

			// classDescriptionsの構築
			classDescriptions[cls.className] = cls.description;

			// 例を保存
			if (cls.example) {
				if (!componentExamples[cls.component]) {
					componentExamples[cls.component] = [];
				}
				// 重複チェック（同じvariantで複数の例がある場合など考慮）
				if (!componentExamples[cls.component].some(ex => ex.variant === cls.variant && ex.className === cls.className)) {
					componentExamples[cls.component].push({
						variant: cls.variant,
						className: cls.className,
						example: cls.example,
					});
				}
			}
		});

		// componentTypesをカテゴリと名前でソート
		componentTypes.sort((a, b) => {
			if (a.category < b.category) return -1;
			if (a.category > b.category) return 1;
			if (a.label < b.label) return -1;
			if (a.label > b.label) return 1;
			return 0;
		});

		// componentVariantsをラベルでソート
		Object.keys(componentVariants).forEach(key => {
			componentVariants[key].sort((a, b) => a.label.localeCompare(b.label));
		});


		// baseClassが見つからないコンポーネントの警告
		const missingBaseClasses = componentTypes
			.map((c) => c.value)
			.filter((component) => !baseClasses[component]);

		if (missingBaseClasses.length > 0) {
			console.warn(
				`以下のコンポーネントにベースクラス（variant: base）が見つかりませんでした: ${missingBaseClasses.join(', ')}`
			);
		}

		return {
			componentTypes,
			baseClasses,
			componentVariants,
			classDescriptions,
			componentExamples,
			componentsByType, // 追加: コンポーネントごとの全情報
		};
	},
};

export default cssParser;