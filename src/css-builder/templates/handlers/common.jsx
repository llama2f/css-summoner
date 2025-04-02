// handlers/common.jsx
// 共通ユーティリティと定数

import React from 'react'

// サンプルアイコンSVG - 各種ハンドラーで共通利用
export const sampleIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="12" y1="8" x2="12" y2="16"></line>
  <line x1="8" y1="12" x2="16" y2="12"></line>
</svg>`

// 共通ハンドラーユーティリティ関数
export const createHandlerResult = (reactElement, htmlString) => {
  return { reactElement, htmlString }
}

/**
 * 各種クラスを優先順位を保ちながら結合する
 * @param {Object} options - 結合するクラスのオプション
 * @param {string} options.baseClass - ベースクラス
 * @param {string} options.variant - バリアントクラス
 * @param {string} options.size - サイズクラス
 * @param {string} options.radius - 角丸クラス
 * @param {Array} options.modifiers - モディファイア配列
 * @param {Array} options.specialClasses - 特殊クラス配列
 * @param {string} options.additional - 追加クラス
 * @returns {string} 結合されたクラス文字列
 */
export const combineClasses = ({ 
  baseClass = '', 
  variant = '', 
  size = '', 
  radius = '', 
  modifiers = [], 
  specialClasses = [], 
  additional = '' 
}) => {
  return [
    baseClass,
    variant,
    size,
    radius,
    ...(modifiers || []),
    ...(specialClasses || []),
    additional
  ].filter(Boolean).join(' ');
};

/**
 * ベースクラスが指定されているがクラス文字列に含まれていない場合に追加する
 * @param {string} classString - 元のクラス文字列
 * @param {string} baseClass - ベースクラス
 * @returns {string} ベースクラスを確実に含むクラス文字列
 */
export const ensureBaseClass = (classString, baseClass) => {
  if (!baseClass) return classString; // ベースクラスがない場合は何もしない
  if (!classString.includes(baseClass)) {
    return `${baseClass} ${classString}`.trim();
  }
  return classString;
};

/**
 * ハンドラーの結果にベースクラスを適用するデコレーター
 * @param {Object} result - ハンドラーからの結果
 * @param {React.ReactElement} result.reactElement - Reactエレメント
 * @param {string} result.htmlString - HTML文字列
 * @param {string} baseClass - ベースクラス
 * @returns {Object} 装飾された結果
 */
export const decorateWithBaseClass = (result, baseClass) => {
  if (!baseClass) return result;
  if (!result) return result;
  
  const { reactElement, htmlString } = result;
  
  // React要素のclassNameを修正
  let decoratedReactElement = reactElement;
  if (reactElement && reactElement.props) {
    decoratedReactElement = React.cloneElement(
      reactElement,
      { 
        className: ensureBaseClass(reactElement.props.className || '', baseClass) 
      }
    );
  }
  
  // HTML文字列も修正（正規表現で置換）
  const decoratedHtmlString = htmlString ? htmlString.replace(
    /class="([^"]*)"/,
    (match, classStr) => `class="${ensureBaseClass(classStr, baseClass)}"`
  ) : htmlString;
  
  return {
    reactElement: decoratedReactElement,
    htmlString: decoratedHtmlString
  };
};
