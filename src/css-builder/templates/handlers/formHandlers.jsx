// handlers/formHandlers.jsx
// フォーム関連コンポーネントのハンドラー

import React from 'react'
import { createHandlerResult } from './common'

/**
 * フォーム要素ハンドラー生成のためのファクトリー関数
 * @param {Object} config - ハンドラーの設定
 * @param {string} config.elementType - 要素のタイプ（input, textarea, selectなど）
 * @param {string} config.label - ラベルテキスト
 * @param {Object} config.props - 要素に渡すprops
 * @param {Function} config.renderCustom - カスタムレンダリング関数（オプション）
 * @returns {Function} ハンドラー関数
 */
const createFormElementHandler = (config) => {
  const {
    elementType = 'input',
    label = 'ラベル',
    props = {},
    renderCustom = null
  } = config;
  
  // 要素タイプに基づくデフォルトprops
  const defaultProps = {
    input: {
      type: 'text',
      placeholder: 'テキストを入力'
    },
    textarea: {
      rows: '4',
      placeholder: '複数行のテキストを入力'
    },
    select: {
      children: [
        <option key="empty" value="">項目を選択</option>,
        <option key="1" value="1">選択肢1</option>,
        <option key="2" value="2">選択肢2</option>,
        <option key="3" value="3">選択肢3</option>
      ]
    },
    checkbox: {
      type: 'checkbox',
      id: 'sample-checkbox'
    },
    radio: {
      type: 'radio',
      name: 'sample-radio-group',
      id: 'sample-radio'
    }
  };
  
  // 実際のハンドラー関数を返す
  return (options) => {
    const { classString = '' } = options;
    
    // カスタムレンダリング関数があれば使用
    if (renderCustom) {
      return renderCustom(options, classString);
    }
    
    // 要素タイプに応じたpropsを組み合わせる
    const elementProps = {
      ...(defaultProps[elementType] || {}),
      ...props,
      className: classString
    };
    
    let reactElement, htmlString;
    
    // 要素タイプに応じたレンダリング処理
    switch (elementType) {
      case 'input':
      case 'textarea':
      case 'select':
        // 標準的なフォーム要素（ラベル + 要素）
        const Element = elementType === 'input' ? 'input' : 
                       elementType === 'textarea' ? 'textarea' : 'select';
        
        const id = `sample-${elementType}`;
        reactElement = (
          <div>
            <label htmlFor={id} className='block mb-2'>{label}</label>
            <Element id={id} {...elementProps}>
              {elementType === 'select' && elementProps.children}
            </Element>
          </div>
        );
        
        // HTML文字列の生成
        if (elementType === 'select') {
          // select要素用のHTML
          const options = elementProps.children.map(child => {
            if (!child || !child.props) return '';
            const { value = '', children } = child.props;
            return `    <option value="${value}">${children}</option>`;
          }).join('\n');
          
          htmlString = `<div>
  <label for="${id}" class="block mb-2">${label}</label>
  <select id="${id}" class="${classString}">
${options}
  </select>
</div>`;
        } else {
          // input/textarea要素用のHTML
          const placeholder = elementProps.placeholder || '';
          if (elementType === 'textarea') {
            htmlString = `<div>
  <label for="${id}" class="block mb-2">${label}</label>
  <textarea id="${id}" class="${classString}" rows="${elementProps.rows || '4'}" placeholder="${placeholder}"></textarea>
</div>`;
          } else {
            htmlString = `<div>
  <label for="${id}" class="block mb-2">${label}</label>
  <input id="${id}" type="${elementProps.type || 'text'}" class="${classString}" placeholder="${placeholder}" />
</div>`;
          }
        }
        break;
        
      case 'checkbox':
      case 'radio':
        // チェックボックス/ラジオボタン（要素 + ラベル）
        const inputId = elementProps.id || `sample-${elementType}`;
        reactElement = (
          <div className='flex items-center'>
            <input id={inputId} {...elementProps} />
            <label htmlFor={inputId} className='ml-2'>{label}</label>
          </div>
        );
        
        htmlString = `<div class="flex items-center">
  <input id="${inputId}" type="${elementType}"${elementType === 'radio' ? ` name="${elementProps.name || 'sample-radio-group'}"` : ''} class="${classString}" />
  <label for="${inputId}" class="ml-2">${label}</label>
</div>`;
        break;
        
      default:
        // デフォルトの場合
        reactElement = (
          <div>
            <label htmlFor={`sample-form`} className='block mb-2'>{label}</label>
            <input type='text' id='sample-form' className={classString} placeholder={elementProps.placeholder || ''} />
          </div>
        );
        
        htmlString = `<div>
  <label for="sample-form" class="block mb-2">${label}</label>
  <input id="sample-form" type="text" class="${classString}" placeholder="${elementProps.placeholder || ''}" />
</div>`;
    }
    
    return createHandlerResult(reactElement, htmlString);
  };
};

// フォーム入力ハンドラー
export const formInputHandler = createFormElementHandler({
  elementType: 'input',
  label: 'labelテキスト',
  props: {
    placeholder: 'テキストを入力'
  }
});

// セレクトボックスハンドラー
export const formSelectHandler = createFormElementHandler({
  elementType: 'select',
  label: 'labelテキスト'
});

// チェックボックスハンドラー
export const formCheckboxHandler = createFormElementHandler({
  elementType: 'checkbox',
  label: 'チェックボックスlabel'
});

// ラジオボタンハンドラー
export const formRadioHandler = createFormElementHandler({
  elementType: 'radio',
  label: 'ラジオボタンlabel'
});

// テキストエリアハンドラー
export const formTextareaHandler = createFormElementHandler({
  elementType: 'textarea',
  label: 'テキストエリアラベル'
});

// 検索フォームハンドラー - カスタムレンダリング使用
export const formSearchHandler = createFormElementHandler({
  elementType: 'input',
  label: '検索',
  props: {
    type: 'search',
    placeholder: '検索キーワードを入力'
  },
  renderCustom: (options, classString) => {
    const reactElement = (
      <div>
        <label htmlFor='sample-search' className='block mb-2'>検索</label>
        <div className='relative'>
          <input
            id='sample-search'
            type='search'
            className={classString}
            placeholder='検索キーワードを入力'
          />
          <span className='absolute right-3 top-1/2 transform -translate-y-1/2'>
            🔍
          </span>
        </div>
      </div>
    );

    const htmlString = `<div>
  <label for="sample-search" class="block mb-2">検索</label>
  <div class="relative">
    <input id="sample-search" type="search" class="${classString}" placeholder="検索キーワードを入力" />
    <span class="absolute right-3 top-1/2 transform -translate-y-1/2">🔍</span>
  </div>
</div>`;

    return createHandlerResult(reactElement, htmlString);
  }
});

// スイッチハンドラー - カスタムレンダリング使用
export const formSwitchHandler = createFormElementHandler({
  elementType: 'custom',
  label: 'スイッチラベル',
  renderCustom: (options, classString) => {
    const reactElement = (
      <div className='flex items-center'>
        <div className={`form-switch ${classString}`}>
          <input type='checkbox' className='form-switch-input' id='sample-switch' />
          <label className='form-switch-label' htmlFor='sample-switch'></label>
        </div>
        <label htmlFor='sample-switch' className='ml-2'>スイッチラベル</label>
      </div>
    );

    const htmlString = `<div class="flex items-center">
  <div class="form-switch ${classString}">
    <input type="checkbox" class="form-switch-input" id="sample-switch" />
    <label class="form-switch-label" for="sample-switch"></label>
  </div>
  <label for="sample-switch" class="ml-2">スイッチラベル</label>
</div>`;

    return createHandlerResult(reactElement, htmlString);
  }
});

// フォームフィードバックハンドラー - カスタムレンダリング使用
export const formFeedbackHandler = createFormElementHandler({
  elementType: 'custom',
  renderCustom: (options, classString) => {
    const reactElement = (
      <div>
        <div className={`form-feedback is-valid ${classString} mb-2`}>
          正常な入力です
        </div>
        <div className={`form-feedback is-invalid ${classString}`}>
          エラー: 入力が不正です
        </div>
      </div>
    );

    const htmlString = `<div>
  <div class="form-feedback is-valid ${classString} mb-2">正常な入力です</div>
  <div class="form-feedback is-invalid ${classString}">エラー: 入力が不正です</div>
</div>`;

    return createHandlerResult(reactElement, htmlString);
  }
});

// フォームハンドラーマップ
export const formHandlers = {
	'form-input': formInputHandler,
	'form-select': formSelectHandler,
	'form-checkbox': formCheckboxHandler,
	'form-radio': formRadioHandler,
	'form-textarea': formTextareaHandler,
	'form-search': formSearchHandler,
	'form-switch': formSwitchHandler,
	'form-feedback': formFeedbackHandler
}
