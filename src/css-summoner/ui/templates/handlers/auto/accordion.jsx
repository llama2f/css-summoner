import React from 'react'
import {
	createHandlerResult,
	combineClasses,
	sampleIcon,
	separateProps,
} from '../common'

// --- メタデータ (必須) ---
// ハンドラー自動登録システムが使用します。
export const metadata = {
	type: 'accordion',
	category: 'interactive',
	description:
		'ユーザーがクリックすると内容を表示/非表示できるコンポーネントです。',
}

// --- 基本レンダラー (必須) ---
// コンポーネントの基本的な表示を定義します。
export function render(props) {
	const { reactProps, domProps, commonProps } = separateProps(
		props,
		['classString', 'children', 'selectedModifiers', 'baseClass'],
		['id', 'role']
	)

	const classString = reactProps.classString || ''
	const children =
		samples.content || reactProps.children || `${metadata.type} Content`
	const title = samples.title || `${metadata.type} Title`
	const baseClass = reactProps.baseClass || `${metadata.type}-base`

	const { id, role } = domProps

	// パネルのユニークIDを生成
	const panelId = `accordion-panel-${Math.random().toString(36).substring(7)}`

	// ReactElement: アコーディオンコンポーネント（静的なプレビュー用）
	const reactElement = (
		<div className={classString} id={id} role={role} {...commonProps}>
			<div className='accordion-item'>
				<div
					className='accordion-header'
					tabIndex={0}
					role='button'
					aria-expanded='false'
					aria-controls={panelId}
					data-accordion-toggle
				>
					<span>{title}</span>
					<span className='accordion-icon' aria-hidden='true'></span>
				</div>
				<div
					id={panelId}
					className='accordion-content'
					style={{
						maxHeight: '0px',
						overflow: 'hidden',
						transition: 'max-height 0.3s ease-out',
					}}
					aria-hidden='true'
					role='region'
					data-accordion-content
				>
					<div style={{ padding: '1rem' }}>{children}</div>
				</div>
			</div>
		</div>
	)

	// クライアントサイドでの動作の説明コメントを追加
	const result = createHandlerResult(reactElement)
	result.description = `
<div class="text-sm text-gray-700 mb-4 p-3 border border-gray-200 rounded bg-gray-50">
  <p class="font-medium mb-1">💡 アコーディオンの挙動について</p>
  <p>このコンポーネントはJavaScriptによる制御が必要です。生成されたコードを利用する際は、次のようなスクリプトを含めてください：</p>
  {/* 
     * このアコーディオンコンポーネントを動作させるには、以下のコントローラーを初期化してください：
     * パス: /src/css-summoner/ui/scripts/components/accordion-controller.js
     * 使用方法: import { initAccordions } from './path/to/accordion-controller';
     *          document.addEventListener('DOMContentLoaded', initAccordions);
     */}
</div>`

	return result
}

// --- プレビュー用サンプルデータ (オプション) ---
// ClassBuilder UI のプレビュー表示で使用されるサンプルテキストなど。
export const samples = {
	default: 'アコーディオンコンポーネント',
	title: 'アコーディオンタイトル',
	content: (
		<>
			<p>これはアコーディオンの内容です。</p>
			<p>
				テキスト、画像、その他のコンポーネントなど様々な要素を含めることができます。
			</p>
			<p>
				このアコーディオンコンポーネントを動作させるには、以下のスクリプトを使用してください：
			</p>
			<ul>
				<li>
					<a href='/src/css-summoner/ui/scripts/components/accordion-controller.js'>
						accordion-controller.js
					</a>
				</li>
				<li>
					<a href='/src/css-summoner/ui/scripts/utils/a11y-helpers.js'>
						a11y-helpers.js
					</a>
				</li>
			</ul>
		</>
	),
}

// --- Astroコンポーネント カスタム生成関数 (オプション) ---
export async function generateAstroTemplate(componentData, options = {}) {
	const { componentName, propsInterface, defaultProps, description, variants } =
		componentData

	// propsInterface を元に Astro の Props 定義を生成
	const propsDefinition = Object.entries(propsInterface)
		.map(([name, prop]) => {
			// デフォルト値の処理を追加
			const defaultValue = defaultProps[name]
				? ` = ${JSON.stringify(defaultProps[name])}`
				: ''
			// コメントを追加
			const comment = prop.description ? ` // ${prop.description}` : ''
			return `  ${name}${prop.required ? '' : '?'}: ${prop.type}${defaultValue};${comment}`
		})
		.join('\n') // 改行

	// Astro コンポーネントのテンプレート文字列
	const template = `---
// ${componentName}.astro - Generated Astro Component
// ${description || ''}

interface Props {
${propsDefinition}
  title?: string; // アコーディオンのタイトル
  expanded?: boolean; // 初期状態で開いているかどうか
  // 必要に応じて他の Props を追加
  [key: string]: any; // スロットなどのための追加プロパティを許可
}

const {
  class: className, // 'class' は予約語なので 'className' にリネーム
  title = 'アコーディオンタイトル',
  expanded = false,
  ...rest // スロットやその他の属性用
} = Astro.props;

// クラスの結合
const combinedClasses = \`accordion-base \${className || ''}\`;

// ユニークなIDを生成（実装時はより堅牢な方法が必要）
const accordionId = \`accordion-\${Math.random().toString(36).substring(7)}\`;
---

<div class={combinedClasses} {...rest}>
  <div class={\`accordion-item \${expanded ? 'is-open' : ''}\`}>
    <div 
      class="accordion-header" 
      tabindex="0" 
      role="button" 
      aria-expanded={expanded ? 'true' : 'false'}
      aria-controls={accordionId}
      data-accordion-toggle
    >
      <span>{title}</span>
      <span class="accordion-icon" aria-hidden="true"></span>
    </div>
    <div 
      id={accordionId}
      class="accordion-content"
      style={expanded ? 'max-height: 1000px;' : 'max-height: 0px; overflow: hidden;'}
      aria-hidden={expanded ? 'false' : 'true'}
      role="region"
      data-accordion-content
    >
      <div style="padding: 1rem;">
        <slot />
      </div>
    </div>
  </div>
</div>

<script>
  // アコーディオンの動作を定義するクライアントサイドのスクリプト
  document.addEventListener('DOMContentLoaded', () => {
    const headers = document.querySelectorAll('[data-accordion-toggle]');
    
    headers.forEach(header => {
      const content = header.nextElementSibling;
      const accordionItem = header.closest('.accordion-item');
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      
      // 初期状態の設定
      if (isExpanded) {
        accordionItem.classList.add('is-open');
        if (content) {
          content.style.maxHeight = \`\${content.scrollHeight}px\`;
        }
      }
      
      // クリックイベントの追加
      header.addEventListener('click', () => {
        const expanded = header.getAttribute('aria-expanded') === 'true';
        const newExpandedState = !expanded;
        
        // ARIA状態の更新
        header.setAttribute('aria-expanded', newExpandedState);
        
        if (content) {
          content.setAttribute('aria-hidden', !newExpandedState);
          
          // is-openクラスの切り替え
          if (newExpandedState) {
            accordionItem.classList.add('is-open');
            content.style.maxHeight = \`\${content.scrollHeight}px\`;
          } else {
            accordionItem.classList.remove('is-open');
            content.style.maxHeight = '0px';
          }
        }
      });
      
      // キーボード操作のサポート
      header.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          header.click();
        }
      });
    });
  });
</script>

<style>
  /* トランジションのスタイル */
  .accordion-content {
    transition: max-height 0.3s ease-out;
  }
</style>
`

	return template
}

// --- デフォルトエクスポート (必須) ---
// ハンドラー自動登録システムが使用します。
export default {
	metadata,
	render,
	samples,
	generateAstroTemplate,
}
