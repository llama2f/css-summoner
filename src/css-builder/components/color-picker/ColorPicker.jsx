import React, { useState, useEffect, useCallback } from 'react';
import { defaultCustomColor, getContrastTextColor } from '@/css-builder/configs/colors';

/**
 * カスタムカラーピッカーコンポーネント
 * 色の選択とカスタマイズのためのインターフェース
 * 
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.initialColor - 初期色（HEX形式）
 * @param {Function} props.onColorChange - 色変更時のコールバック関数
 * @param {boolean} props.isOpen - ピッカーの表示状態
 * @param {Function} props.onClose - ピッカーを閉じる際のコールバック
 */
const ColorPicker = ({ initialColor = defaultCustomColor.mainColor, onColorChange, isOpen, onClose }) => {
  // 色の状態管理
  const [mainColor, setMainColor] = useState(initialColor);
  const [textColor, setTextColor] = useState(defaultCustomColor.textColor);
  const [autoTextColor, setAutoTextColor] = useState(defaultCustomColor.autoTextColor);
  const [autoBorderColor, setAutoBorderColor] = useState(defaultCustomColor.autoBorderColor);
  const [presetColors] = useState([
    '#6366f1', // インディゴ
    '#f43f5e', // ローズ
    '#22c55e', // グリーン
    '#eab308', // イエロー
    '#3b82f6', // ブルー
    '#a855f7', // パープル
    '#a3e635', // ライム
    '#ec4899', // ピンク
    '#14b8a6', // ティール
    '#f97316', // オレンジ
    '#64748b', // スレート
    '#0f172a', // ダークスレート
  ]);

  // テキスト色の自動設定
  useEffect(() => {
    if (autoTextColor) {
      setTextColor(getContrastTextColor(mainColor));
    }
  }, [mainColor, autoTextColor]);

  // 色の変更をハンドル
  const handleColorChange = useCallback(() => {
    const borderColor = autoBorderColor ? mainColor : null;
    
    // CSS変数を設定
    document.documentElement.style.setProperty('--custom-color', mainColor);
    document.documentElement.style.setProperty('--custom-text-color', textColor);
    
    if (borderColor) {
      document.documentElement.style.setProperty('--custom-border-color', borderColor);
    }
    
    // ホバー色と押下色を自動計算
    const hoverColor = `color-mix(in srgb, ${mainColor}, #000 10%)`;
    const activeColor = `color-mix(in srgb, ${mainColor}, #000 20%)`;
    document.documentElement.style.setProperty('--custom-hover-color', hoverColor);
    document.documentElement.style.setProperty('--custom-active-color', activeColor);
    
    // 親コンポーネントに通知
    if (onColorChange) {
      onColorChange({
        mainColor,
        textColor,
        autoTextColor,
        autoBorderColor
      });
    }
  }, [mainColor, textColor, autoTextColor, autoBorderColor, onColorChange]);

  // 色変更時に自動でハンドラーを呼び出す
  useEffect(() => {
    handleColorChange();
  }, [mainColor, textColor, autoTextColor, autoBorderColor, handleColorChange]);

  // 表示されていない場合は何も描画しない
  if (!isOpen) return null;

  return (
    <div className="color-picker-container fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="color-picker-panel bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">カスタムカラー設定</h3>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
          >
            ✕
          </button>
        </div>
        
        {/* プレビュー */}
        <div 
          className="preview-box h-16 mb-4 rounded flex items-center justify-center"
          style={{ 
            backgroundColor: mainColor,
            color: textColor,
            border: `1px solid ${autoBorderColor ? mainColor : '#ccc'}`
          }}
        >
          <span className="text-lg font-medium">プレビュー</span>
        </div>
        
        {/* カラー選択 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">メインカラー</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={mainColor}
              onChange={(e) => setMainColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={mainColor}
              onChange={(e) => setMainColor(e.target.value)}
              className="flex-1 border rounded p-2 text-sm"
            />
          </div>
        </div>
        
        {/* プリセットカラー */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">プリセットカラー</label>
          <div className="grid grid-cols-6 gap-2">
            {presetColors.map((color, index) => (
              <button
                key={index}
                className={`w-8 h-8 rounded-full border ${mainColor === color ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setMainColor(color)}
                aria-label={`プリセットカラー ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* テキストカラー */}
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <label className="text-sm font-medium">テキストカラー</label>
            <div className="ml-auto">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={autoTextColor}
                  onChange={(e) => setAutoTextColor(e.target.checked)}
                  className="mr-1"
                />
                <span className="text-xs">自動設定</span>
              </label>
            </div>
          </div>
          
          <div className={`flex gap-2 items-center ${autoTextColor ? 'opacity-50' : ''}`}>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              disabled={autoTextColor}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              disabled={autoTextColor}
              className="flex-1 border rounded p-2 text-sm"
            />
          </div>
        </div>
        
        {/* ボーダーカラー */}
        <div className="mb-4">
          <div className="flex items-center">
            <label className="text-sm font-medium">ボーダーカラー</label>
            <div className="ml-auto">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={autoBorderColor}
                  onChange={(e) => setAutoBorderColor(e.target.checked)}
                  className="mr-1"
                />
                <span className="text-xs">自動設定 (メインカラーと同じ)</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* 操作ボタン */}
        <div className="flex justify-end gap-2 mt-6">
          <button 
            onClick={onClose}
            className="btn-base btn-ghost color-primary px-4 py-2 rounded"
          >
            閉じる
          </button>
          <button 
            onClick={() => {
              handleColorChange();
              onClose();
            }}
            className="btn-base btn-solid color-primary px-4 py-2 rounded"
          >
            適用
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
