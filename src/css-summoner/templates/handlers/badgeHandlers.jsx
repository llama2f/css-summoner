import React from 'react';
// sampleIcon は FontAwesome ではなく SVG 文字列を使う想定
import { sampleIcon, createHandlerResult, ensureBaseClass } from './common';

// Badge のハンドラ
const badgeHandler = (options) => {
	// classString を確実に受け取る
	const { classString = '', attributes = {} } = options;
	const baseClass = 'badge-base';
	// classString を配列に変換し、ベースクラスを確実に含める
	const classes = ensureBaseClass(classString, baseClass).split(' ').filter(Boolean);
	const finalClassString = classes.join(' '); // 最終的なクラス文字列

	// モディファイアの判定
	const isIconOnly = classes.includes('badge-icon-only');
    // アイコンスペーシングクラスの有無 (アイコン要素に付与される想定)
    // buttonHandlerに倣い、アイコン要素のクラスとして扱う
    const iconClass = classes.includes('badge-icon-spacing') ? 'badge-icon-spacing' : '';

	let reactElement;
	let htmlString;
    const textContent = 'バッジ'; // デフォルトテキスト

    // アイコン要素の生成
    // dangerouslySetInnerHTML を使うのは buttonHandler に倣う
    const iconReact = <span className={iconClass} dangerouslySetInnerHTML={{ __html: sampleIcon }} />;
    // HTML文字列用のアイコン (クラスのみ付与)
    // SVG文字列を直接埋め込む
    const iconHtml = `<span class="${iconClass}">${sampleIcon}</span>`;


	if (isIconOnly) {
		// アイコンのみの場合
		reactElement = (
			<span className={finalClassString} {...attributes}>
                {iconReact}
				<span className="sr-only">{textContent}</span> {/* スクリーンリーダー用 */}
			</span>
		);

		htmlString = `<span class="${finalClassString}" ${Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ')}>
  ${iconHtml}
  <span class="sr-only">${textContent}</span>
</span>`;
	} else {
        // アイコン + テキストの場合 (アイコンは常に表示する例)
        // 必要に応じて、特定のクラスがない場合はアイコンを表示しない等の分岐を追加可能
		reactElement = (
			<span className={finalClassString} {...attributes}>
                {iconReact} {/* アイコンを表示 */}
				<span>{textContent}</span> {/* テキストを表示 */}
			</span>
		);

		htmlString = `<span class="${finalClassString}" ${Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ')}>
  ${iconHtml} {/* アイコンを表示 */}
  <span>${textContent}</span> {/* テキストを表示 */}
</span>`;
	}

	// ハンドラの結果を生成して返す
	return createHandlerResult(reactElement, htmlString);
};

// badge コンポーネントタイプにハンドラをマッピング
export const badgeHandlers = {
	badge: badgeHandler,
};

// 注意: CSSアノテーションの @component は 'badge' とする必要があります。
//       @variant で 'base', 'primary', 'xs', 'icon-only' などが指定されますが、
//       ハンドラはコンポーネントタイプ 'badge' で呼び出され、
//       適用されるクラス全体 (classString) を受け取ります。
//       ハンドラ内で classString を解析して表示を制御します。