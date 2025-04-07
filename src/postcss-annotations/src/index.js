/**
 * PostCSS plugin to extract component annotations from CSS files
 * Based on the existing css-parser.js functionality
 */

/**
 * 特定のタグの値を抽出するヘルパー関数
 * @param {string} comment コメントテキスト
 * @param {string} tag タグ名（@component: など）
 * @param {Array} allTags 認識する全タグのリスト
 * @returns {string|null} 抽出した値、またはnull
 */
function extractTagValue(comment, tag, allTags) {
  const tagIndex = comment.indexOf(tag);
  if (tagIndex === -1) return null;

  // タグの後の内容を取得
  const afterTag = comment.substring(tagIndex + tag.length);

  // 次のタグまたはコメント終了までの内容を取得
  const nextTagIndex = getNextTagIndex(afterTag, allTags);
  const valueRaw =
    nextTagIndex > -1
      ? afterTag.substring(0, nextTagIndex)
      : afterTag.substring(
          0,
          afterTag.indexOf('*/') !== -1
            ? afterTag.indexOf('*/')
            : afterTag.length,
        );

  // 行頭の*や空白を削除して整形
  return valueRaw
    .split('\n')
    .map((line) => line.replace(/^\s*\*?\s*/, '').trim())
    .join('\n')
    .trim();
}

/**
 * 次のアノテーションタグの位置を見つける
 * @param {string} text テキスト
 * @param {Array} tags 認識するタグのリスト
 * @returns {number} 次のタグの位置、またはタグがない場合は-1
 */
function getNextTagIndex(text, tags) {
  const indices = tags
    .map((tag) => {
      const index = text.indexOf(tag);
      return index > -1 ? index : Infinity;
    })
    .filter((index) => index !== Infinity);

  return indices.length > 0 ? Math.min(...indices) : -1;
}

/**
 * コンポーネントデータを整理して構造化する
 * @param {Array} classes 抽出したクラス情報の配列
 * @returns {Object} 構造化したデータ
 */
function structureComponentData(classes) {
  // データ構造の初期化
  const componentTypes = {};
  const baseClasses = {};
  const componentVariants = {};
  const classDescriptions = {};
  const componentExamples = {};
  const classRuleDetails = {};

  // データの集約
  classes.forEach((cls) => {
    const {
      component,
      variant,
      className,
      description,
      category,
      example,
      ruleText,
      selector,
      sourceFile,
    } = cls;

    // componentTypesの構築
    if (!componentTypes[component]) {
      componentTypes[component] = [];
    }
    if (!componentTypes[component].includes(className)) {
      componentTypes[component].push(className);
    }

    // baseClassesの構築 (variantが'base'の場合)
    if (variant === 'base') {
      baseClasses[component] = className;
    }

    // componentVariantsの構築
    if (!componentVariants[component]) {
      componentVariants[component] = {};
    }
    componentVariants[component][variant] = className;

    // classDescriptionsの構築
    classDescriptions[className] = {
      component,
      variant,
      description,
      category: category || null,
    };

    // componentExamplesの構築
    if (example) {
      if (!componentExamples[component]) {
        componentExamples[component] = [];
      }
      componentExamples[component].push({
        variant,
        className,
        example,
      });
    }

    // classRuleDetailsの構築
    if (ruleText && selector) {
      classRuleDetails[className] = {
        ruleText,
        selector,
        sourceFile,
      };
    }
  });

  return {
    componentTypes,
    baseClasses,
    componentVariants,
    classDescriptions,
    componentExamples,
    classRuleDetails,
  };
}

/**
 * セレクタからクラス名を抽出する
 * @param {string} selector CSSセレクタ
 * @returns {string|null} 抽出したクラス名またはnull
 */
function extractClassName(selector) {
  const firstClassMatch = selector.match(/^\s*\.([\w-]+)/);
  return firstClassMatch ? firstClassMatch[1] : null;
}

/**
 * PostCSSプラグイン
 */
module.exports = (opts = {}) => {
  // デフォルトオプションとマージ
  const options = {
    outputPath: null, // 抽出データの出力先パス（指定がなければ返すだけ）
    recognizedTags: [
      '@component:',
      '@variant:',
      '@description:',
      '@category:',
      '@example:',
    ], // 認識するタグ
    requiredTags: ['@component:', '@variant:', '@description:'], // 必須タグ
    verbose: false, // 詳細なログを出力するか
    ...opts,
  };

  return {
    postcssPlugin: 'postcss-css-annotations',

    Once(root, { result }) {
      // 抽出したクラス情報
      const classes = [];
      const errors = [];

      let commentIndex = 0;

      // すべてのコメントノードを走査
      root.walkComments((comment) => {
        commentIndex++;
        const commentText = comment.text; // コメント内容 (/* */ は含まない)
        const fullCommentText = `/*${commentText}*/`; // アノテーション抽出用に復元

        // ステップ1: 認識するアノテーションタグが一つでも含まれるかチェック
        const hasAnyRecognizedTag = options.recognizedTags.some((tag) =>
          fullCommentText.includes(tag),
        );
        if (!hasAnyRecognizedTag) {
          return; // アノテーションコメントでなければスキップ
        }

        // ステップ2: 必須アノテーションタグの存在チェック
        const missingTags = options.requiredTags.filter(
          (tag) => !fullCommentText.includes(tag),
        );
        if (missingTags.length > 0) {
          const errorMsg = `${result.opts.from || 'unknown'} 内のコメントブロック #${commentIndex} (line ${comment.source.start.line}) に必須タグがありません: ${missingTags.join(', ')}`;
          errors.push(errorMsg);
          return;
        }

        // ステップ3: 各アノテーションの値を抽出
        const component = extractTagValue(
          fullCommentText,
          '@component:',
          options.recognizedTags,
        );
        const variant = extractTagValue(
          fullCommentText,
          '@variant:',
          options.recognizedTags,
        );
        const description = extractTagValue(
          fullCommentText,
          '@description:',
          options.recognizedTags,
        );
        const category =
          extractTagValue(
            fullCommentText,
            '@category:',
            options.recognizedTags,
          ) || 'other';
        const example = extractTagValue(
          fullCommentText,
          '@example:',
          options.recognizedTags,
        );

        // 値の検証
        const emptyTags = [];
        if (!component) emptyTags.push('@component');
        if (!variant) emptyTags.push('@variant');
        if (!description) emptyTags.push('@description');

        if (emptyTags.length > 0) {
          const errorMsg = `${result.opts.from || 'unknown'} 内のコメントブロック #${commentIndex} (line ${comment.source.start.line}) にタグの値がありません: ${emptyTags.join(', ')}`;
          errors.push(errorMsg);
          return;
        }

        // ステップ4: アノテーションコメントの直後のルールノードを取得
        let nextNode = comment.next();
        // コメントとルールの間の空白ノードなどをスキップ
        while (nextNode && nextNode.type !== 'rule') {
          if (nextNode.type === 'text' && nextNode.text.trim() === '') {
            nextNode = nextNode.next();
          } else if (nextNode.type === 'comment') {
            nextNode = nextNode.next();
          } else {
            nextNode = null;
            break;
          }
        }

        if (nextNode && nextNode.type === 'rule') {
          const rule = nextNode;
          const ruleText = rule.toString();
          const selector = rule.selector;

          // セレクタからクラス名を抽出
          const className = extractClassName(selector);

          if (className) {
            classes.push({
              component,
              variant,
              className,
              description,
              category,
              example,
              sourceFile: result.opts.from || 'unknown',
              ruleText,
              selector,
            });

            if (options.verbose) {
              console.log(`クラス抽出: ${className} (${component}/${variant})`);
            }
          } else {
            const errorMsg = `${result.opts.from || 'unknown'} 内のコンポーネント「${component}」(line ${comment.source.start.line}) のアノテーション直後のルール (${selector}) からクラス名を抽出できませんでした。`;
            errors.push(errorMsg);
          }
        } else {
          const errorMsg = `${result.opts.from || 'unknown'} 内のコンポーネント「${component}」(line ${comment.source.start.line}) のアノテーション直後にCSSルールが見つかりません。`;
          errors.push(errorMsg);
        }
      });

      // 抽出したデータを構造化
      const structuredData = structureComponentData(classes);

      // 追加情報
      structuredData.meta = {
        totalClasses: classes.length,
        errors: errors,
        source: result.opts.from || 'unknown',
      };

      // ベースクラスが見つからないコンポーネントの警告
      const missingBaseClasses = Object.keys(
        structuredData.componentTypes,
      ).filter((component) => !structuredData.baseClasses[component]);

      if (missingBaseClasses.length > 0) {
        const warningMsg = `以下のコンポーネントにベースクラス（variant: base）が見つかりませんでした: ${missingBaseClasses.join(', ')}`;
        errors.push(warningMsg);
        result.warn(warningMsg);
      }

      // 結果をPostCSSのメッセージとして追加
      result.messages.push({
        type: 'css-annotations-data',
        plugin: 'postcss-css-annotations',
        data: structuredData,
      });

      // エラーがあればワーニングとして追加
      errors.forEach((error) => {
        result.warn(error);
      });

      // ログ出力
      if (options.verbose) {
        console.log(
          `抽出完了: ${classes.length}個のクラスと${errors.length}個のエラーが見つかりました`,
        );
      }

      // オプションで出力先が指定されていれば、JSONとして保存
      if (options.outputPath && typeof options.outputPath === 'string') {
        try {
          const fs = require('fs');
          const path = require('path');

          // 出力ディレクトリが存在しない場合は作成
          const outputDir = path.dirname(options.outputPath);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          fs.writeFileSync(
            options.outputPath,
            JSON.stringify(structuredData, null, 2),
          );

          if (options.verbose) {
            console.log(`JSONファイルを保存しました: ${options.outputPath}`);
          }
        } catch (error) {
          const errorMsg = `JSONファイルの出力に失敗しました: ${error.message}`;
          result.warn(errorMsg);
        }
      }
    },
  };
};

// PostCSSプラグインとして登録
module.exports.postcss = true;
