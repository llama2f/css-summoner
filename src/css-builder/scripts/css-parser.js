// css-parser.js - CSSファイルからアノテーション情報を抽出するモジュール (ESM版)
import fs from 'fs';
import path from 'path';
import postcss from 'postcss'; // PostCSSをインポート
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
		let root;

		try {
			// PostCSSでCSSを解析
			root = postcss.parse(cssContent, { from: filename });
		} catch (error) {
			// CSS自体の解析エラー（構文エラーなど）
			errors.push(`CSS解析エラー (${filename}): ${error.message} at line ${error.line}, column ${error.column}`);
			return { classes, errors };
		}

		let commentIndex = 0;
		// すべてのコメントノードを走査
		root.walkComments(comment => {
			commentIndex++;
			const commentText = comment.text; // コメント内容 (/* */ は含まない)
			const fullCommentText = `/*${commentText}*/`; // アノテーション抽出用に復元

			// ステップ1: 認識するアノテーションタグが一つでも含まれるかチェック
			const hasAnyRecognizedTag = config.cssParser.recognizedTags.some(tag => fullCommentText.includes(tag));
			if (!hasAnyRecognizedTag) {
				return; // アノテーションコメントでなければスキップ
			}

			// ステップ2: 必須アノテーションタグの存在チェック
			const requiredTags = config.cssParser.requiredTags || ['@component:', '@variant:', '@description:'];
			const missingTags = requiredTags.filter(tag => !fullCommentText.includes(tag));

			if (missingTags.length > 0) {
				// 必須タグがない場合はエラー報告してスキップ
				errors.push(
					`${filename} 内のコメントブロック #${commentIndex} (line ${comment.source.start.line}) に必須タグがありません: ${missingTags.join(', ')}`
				);
				return;
			}

			// ステップ3: 各アノテーションの値を抽出
			const component = cssParser.extractTagValue(fullCommentText, '@component:');
			const variant = cssParser.extractTagValue(fullCommentText, '@variant:');
			const description = cssParser.extractTagValue(fullCommentText, '@description:');
			const category = cssParser.extractTagValue(fullCommentText, '@category:') || 'other';
			const example = cssParser.extractTagValue(fullCommentText, '@example:');

			// 値の検証
			const emptyTags = [];
			if (!component) emptyTags.push('@component');
			if (!variant) emptyTags.push('@variant');
			if (!description) emptyTags.push('@description');

			if (emptyTags.length > 0) {
				errors.push(
					`${filename} 内のコメントブロック #${commentIndex} (line ${comment.source.start.line}) にタグの値がありません: ${emptyTags.join(', ')}`
				);
				return; // 値がない場合はスキップ
			}

			// ステップ4: アノテーションコメントの直後のルールノードを取得
			let nextNode = comment.next();
			// コメントとルールの間の空白ノードなどをスキップ
			while (nextNode && nextNode.type !== 'rule') {
				if (nextNode.type === 'text' && nextNode.text.trim() === '') {
					nextNode = nextNode.next();
				} else if (nextNode.type === 'comment') { // 他のコメントもスキップ
					nextNode = nextNode.next();
				}
				else {
					nextNode = null;
					break;
				}
			}


			if (nextNode && nextNode.type === 'rule') {
				const rule = nextNode;
				const ruleText = rule.toString(); // ルール全体のテキストを取得
				const selector = rule.selector;

				// セレクタから最初のクラス名（ドットなし）を抽出する試み
				const firstClassMatch = selector.match(/^\s*\.([\w-]+)/);
				const className = firstClassMatch ? firstClassMatch[1] : null;

				if (className) {
					// 抽出した情報を classes 配列に追加
					classes.push({
						component,
						variant,
						className,
						description,
						category,
						example,
						sourceFile: filename,
						ruleText, // 抽出したルールテキストを追加
						selector, // セレクタも追加
					});
				} else {
					errors.push(
						`${filename} 内のコンポーネント「${component}」(line ${comment.source.start.line}) のアノテーション直後のルール (${selector}) からクラス名を抽出できませんでした。`
					);
				}
			} else {
				errors.push(
					`${filename} 内のコンポーネント「${component}」(line ${comment.source.start.line}) のアノテーション直後にCSSルールが見つかりません。`
				);
			}
		});

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
					const relativePath = path.relative(config.paths.stylesDir, filePath);
					const fileNameForLog = relativePath.replace(/\\/g, '/');

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
					totalErrors++;
				}
			});

            // パース中のエラーがあれば表示
            if (allParseErrors.length > 0) {
                console.warn(`CSS解析中に${allParseErrors.length}件の問題が見つかりました：`);
                allParseErrors.forEach((error) => console.warn(`- ${error}`));
                totalErrors += allParseErrors.length;
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
		const componentsByType = {};
		const classRuleDetails = {}; // クラス名ごとのルール詳細を初期化

		// データの集約
		allClasses.forEach((cls) => {
			// componentTypesの構築 (重複チェック)
			if (!componentTypes.some((c) => c.value === cls.component)) {
				componentTypes.push({
					value: cls.component,
					label: cls.component
						.replace(/-/g, ' ')
						.replace(/\b[a-z]/g, (c) => c.toUpperCase()),
					category: cls.category || 'other',
				});
			}

			// componentsByTypeの構築
			if (!componentsByType[cls.component]) {
				componentsByType[cls.component] = [];
			}
			componentsByType[cls.component].push(cls);

			// baseClassesの構築 (variantが'base'の場合)
			if (cls.variant === 'base') {
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
				if (!componentVariants[cls.component].some(v => v.value === cls.className)) {
					componentVariants[cls.component].push({
						value: cls.className,
						label: cls.variant
							.replace(/-/g, ' ')
							.replace(/\b[a-z]/g, (c) => c.toUpperCase()),
					});
				}
			}

			// classDescriptionsの構築
			classDescriptions[cls.className] = cls.description;

			// componentExamplesの構築
			if (cls.example) {
				if (!componentExamples[cls.component]) {
					componentExamples[cls.component] = [];
				}
				if (!componentExamples[cls.component].some(ex => ex.variant === cls.variant && ex.className === cls.className)) {
					componentExamples[cls.component].push({
						variant: cls.variant,
						className: cls.className,
						example: cls.example,
					});
				}
			}

			// classRuleDetailsの構築 (ruleTextとselectorが存在する場合)
			if (cls.ruleText && cls.selector) {
				if (classRuleDetails[cls.className]) {
					console.warn(`警告: クラス名 '${cls.className}' に複数のルール詳細が関連付けられています。(${cls.sourceFile})`);
				}
				classRuleDetails[cls.className] = {
					ruleText: cls.ruleText,
					selector: cls.selector,
					sourceFile: cls.sourceFile,
				};
			}
		}); // <<< forEach ループの終了

		// componentTypesをカテゴリと名前でソート (ループの外)
		componentTypes.sort((a, b) => {
			if (a.category < b.category) return -1;
			if (a.category > b.category) return 1;
			if (a.label < b.label) return -1;
			if (a.label > b.label) return 1;
			return 0;
		});

		// componentVariantsをラベルでソート (ループの外)
		Object.keys(componentVariants).forEach(key => {
			componentVariants[key].sort((a, b) => a.label.localeCompare(b.label));
		});

		// baseClassが見つからないコンポーネントの警告 (ループの外)
		const missingBaseClasses = componentTypes
			.map((c) => c.value)
			.filter((component) => !baseClasses[component]);

		if (missingBaseClasses.length > 0) {
			console.warn(
				`以下のコンポーネントにベースクラス（variant: base）が見つかりませんでした: ${missingBaseClasses.join(', ')}`
			);
		}

		// 最終的な返却オブジェクトに classRuleDetails を追加 (ループの外)
		return {
			componentTypes,
			baseClasses,
			componentVariants,
			classDescriptions,
			componentExamples,
			componentsByType,
			classRuleDetails, // 追加: クラス名ごとのルール詳細
		};
	}, // <<< structureComponentData 関数の終わりにカンマを追加
}; // <<< cssParser オブジェクトリテラルの終了

export default cssParser;