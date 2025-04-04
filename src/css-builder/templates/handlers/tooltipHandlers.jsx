// handlers/tooltipHandlers.jsx
// ツールチップ関連コンポーネントのハンドラー

import React from 'react';
import { sampleIcon, createHandlerResult, ensureBaseClass } from './common';

// デコレーターの挙動を回避するための特殊コンポーネント
// プレビューコンテナにclassNameが自動で追加されないようにするためのもの
const SpecialContainer = ({ children, layoutClass = '' }) => {
  // data-skip-decoration属性をつけて、デコレーターに処理をスキップさせる合図にする
  return (
    <div 
      data-skip-decoration="true" 
      className={`preview-container p-12 flex justify-center items-center ${layoutClass}`}
    >
      {children}
    </div>
  );
};

// ベーシックなツールチップハンドラー（ホバー時表示）
export const tooltipHandler = (options) => {
  const { classString = '', selectedModifiers = [] } = options;

  // ベースクラスを確実に含める
  const enhancedClassString = ensureBaseClass(classString, 'tooltip-base');

  // モディファイアによる条件分岐
  const isBottom = selectedModifiers.includes('tooltip-bottom');
  const isLeft = selectedModifiers.includes('tooltip-left');
  const isRight = selectedModifiers.includes('tooltip-right');
  const isAlways = selectedModifiers.includes('tooltip-always');
  const isWide = selectedModifiers.includes('tooltip-wide');
  const isNoArrow = selectedModifiers.includes('tooltip-no-arrow');
  const isScale = selectedModifiers.includes('tooltip-scale');
  
  // ツールチップのサンプルテキスト
  let tooltipText = 'これはツールチップです';
  
  // 位置に応じたテキスト変更
  if (isBottom) tooltipText = '下に表示されるツールチップ';
  if (isLeft) tooltipText = '左に表示されるツールチップ';
  if (isRight) tooltipText = '右に表示されるツールチップ';
  if (isWide) tooltipText = 'これは長いテキストを含むツールチップです。複数行にわたる内容を表示する場合に使用します。';
  
  // 表示テキスト
  const displayText = isAlways ? 'ツールチップ常時表示' : 'ホバーしてください';
  
  // HTML文字列の生成（これがCode Displayに表示されるコード）
  const htmlString = `<span class="${enhancedClassString}" data-tooltip="${tooltipText}">
  ${displayText}
</span>`;
  
  // SpecialContainerを使ってデコレーション回避
  const reactElement = (
    <SpecialContainer>
      <span className={enhancedClassString} data-tooltip={tooltipText}>
        {displayText}
      </span>
    </SpecialContainer>
  );
  
  // 特殊なフラグを設定して、コード生成時に参照されるようにする
  return {
    reactElement,
    htmlString,
    // コード生成用のフラグ
    skipDecoration: true  
  };
};

// デモ用ツールチップハンドラー（ホバー要素と表示例を両方表示）
export const tooltipDemoHandler = (options) => {
  const { classString = '', selectedModifiers = [], baseClass = 'tooltip-base' } = options;
  
  // ベースクラスを確実に含める
  const enhancedClassString = ensureBaseClass(classString, 'tooltip-base');
  
  // モディファイアによる条件分岐
  const isBottom = selectedModifiers.includes('tooltip-bottom');
  const isLeft = selectedModifiers.includes('tooltip-left');
  const isRight = selectedModifiers.includes('tooltip-right');
  const isWide = selectedModifiers.includes('tooltip-wide');
  const isNoArrow = selectedModifiers.includes('tooltip-no-arrow');
  const isScale = selectedModifiers.includes('tooltip-scale');
  
  // ツールチップのサンプルテキスト
  let tooltipText = 'これはツールチップです';
  
  // 位置に応じたテキスト変更
  if (isBottom) tooltipText = '下に表示されるツールチップ';
  if (isLeft) tooltipText = '左に表示されるツールチップ';
  if (isRight) tooltipText = '右に表示されるツールチップ';
  if (isWide) tooltipText = 'これは長いテキストを含むツールチップです。複数行にわたる内容を表示する場合に使用します。';
  
  // 通常要素とツールチップ常時表示要素のクラス
  const hoverClassString = enhancedClassString;
  const alwaysClassString = `${enhancedClassString} tooltip-always`;
  
  // 位置に応じたレイアウト
  let containerLayout = 'flex-col space-y-16'; // デフォルトと上表示
  if (isBottom) containerLayout = 'flex-col-reverse space-y-reverse space-y-16';
  if (isLeft) containerLayout = 'flex-row space-x-32';
  if (isRight) containerLayout = 'flex-row-reverse space-x-32 space-x-reverse';
  
  // HTML文字列の生成
  const htmlString = `<!-- ホバーで表示するツールチップ -->
<span class="${hoverClassString}" data-tooltip="${tooltipText}">
  ホバーしてください
</span>

<!-- 常時表示のツールチップ例（デモ用） -->
<span class="${alwaysClassString}" data-tooltip="${tooltipText}">
  表示例
</span>`;
  
  // SpecialContainerを使ってデコレーション回避
  const reactElement = (
    <SpecialContainer layoutClass={containerLayout}>
      <div className="flex flex-col items-center">
        <span className={hoverClassString} data-tooltip={tooltipText}>
          ホバーしてください
        </span>
        <p className="text-xs text-gray-500 mt-2">↑ ホバーすると表示</p>
      </div>
      
      <div className="flex flex-col items-center">
        <span className={alwaysClassString} data-tooltip={tooltipText}>
          表示例
        </span>
        <p className="text-xs text-gray-500 mt-2">↑ 表示されたツールチップ</p>
      </div>
    </SpecialContainer>
  );
  
  // 特殊なフラグを設定
  return {
    reactElement,
    htmlString,
    // コード生成用のフラグ
    skipDecoration: true
  };
};

// エクスポートするハンドラーマップ
export const tooltipHandlers = {
  tooltip: tooltipDemoHandler, // デフォルトをデモハンドラーに変更
  'tooltip-hover': tooltipHandler, // 元のホバーハンドラーも残しておく
};
