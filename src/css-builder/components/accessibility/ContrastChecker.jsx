import React from 'react';
import PropTypes from 'prop-types';
import { calculateContrast, getContrastRating } from '@/css-builder/utils/contrastUtils';

/**
 * コントラスト比チェッカーコンポーネント
 * 
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.backgroundColor - 背景色の16進数カラーコード
 * @param {string} props.textColor - テキスト色の16進数カラーコード
 * @param {boolean} props.showDetails - 詳細な情報を表示するかどうか
 */
const ContrastChecker = ({ backgroundColor, textColor, showDetails = false }) => {
  // コントラスト比の計算
  const contrastRatio = calculateContrast(backgroundColor, textColor);
  
  // 計算できない場合はnullを返す
  if (contrastRatio === null) return null;
  
  // WCAGの基準に対するレベル判定
  const wcagLevel = getContrastRating(contrastRatio);
  
  return (
    <div className="contrast-checker mt-2 p-3 border rounded bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="font-medium">コントラスト比:</div>
        <div className="flex items-center gap-2">
          <span className={`font-bold ${wcagLevel.color}`}>
            {contrastRatio.toFixed(2)}:1
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${wcagLevel.level === 'Fail' ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`}>
            {wcagLevel.level}
          </span>
        </div>
      </div>
      
      {/* 詳細情報セクション */}
      {showDetails && (
        <div className="mt-3 border-t pt-3">
          {/* サンプルテキスト */}
          <div className="mt-2 p-3 rounded relative" style={{ 
            backgroundColor, 
            color: textColor,
            border: '1px solid #eee'
          }}>
            <p className="text-sm mb-2">通常テキスト（14px）サンプル</p>
            <p className="text-lg mb-2">大きいテキスト（18px）サンプル</p>
            <p className="text-xl font-bold">見出しテキスト（太字）サンプル</p>
            <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-white text-gray-800 shadow-sm">
              サンプルテキスト
            </div>
          </div>
          
          {/* コントラスト基準の説明 */}
          <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <div className="font-medium mb-1">WCAG基準</div>
            <div className="flex justify-between mb-1">
              <span>通常テキスト (AA): 4.5:1以上</span>
              <span className={contrastRatio >= 4.5 ? 'text-green-600' : 'text-red-600'}>
                {contrastRatio >= 4.5 ? '✓ 合格' : '✗ 不合格'}
              </span>
            </div>
            <div className="flex justify-between mb-1">
              <span>大きいテキスト (AA): 3:1以上</span>
              <span className={contrastRatio >= 3 ? 'text-green-600' : 'text-red-600'}>
                {contrastRatio >= 3 ? '✓ 合格' : '✗ 不合格'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>最高水準 (AAA): 7:1以上</span>
              <span className={contrastRatio >= 7 ? 'text-green-600' : 'text-red-600'}>
                {contrastRatio >= 7 ? '✓ 合格' : '✗ 不合格'}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* ガイダンスメッセージ */}
      {wcagLevel.level === 'Fail' && (
        <div className="mt-2 text-sm text-red-600">
          <p>コントラストが不十分です。読みやすさのために色の組み合わせを調整してください。</p>
        </div>
      )}
    </div>
  );
};

ContrastChecker.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  showDetails: PropTypes.bool
};

export default ContrastChecker;
