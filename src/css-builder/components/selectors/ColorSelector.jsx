import React, { useState } from 'react';
import ColorPicker from '@/css-builder/components/color-picker/ColorPicker';
import { defaultCustomColor } from '@/css-builder/configs/colors';

/**
 * カラーセレクターコンポーネント
 * コンポーネントに適用する色を選択するUI
 * 
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Array} props.colors - 選択可能な色オプションの配列
 * @param {string} props.selectedColor - 現在選択されている色のクラス名
 * @param {Function} props.onSelect - 色選択時のコールバック関数
 * @param {Function} props.onTooltip - ツールチップ表示のコールバック関数
 */
const ColorSelector = ({ colors, selectedColor, onSelect, onTooltip }) => {
  // カラーピッカーの表示状態
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  // カスタムカラーの設定
  const [customColorSettings, setCustomColorSettings] = useState(defaultCustomColor);

  // カスタムカラーの変更を処理
  const handleCustomColorChange = (colorSettings) => {
    setCustomColorSettings(colorSettings);
  };

  // カスタムカラーボタンをクリックしたときの処理
  const handleCustomColorClick = (colorOption) => {
    if (colorOption.isCustom) {
      // カスタムカラーピッカーを表示
      setIsColorPickerOpen(true);
    }
    // 親コンポーネントに選択を通知
    onSelect(colorOption.value);
  };

  return (
    <div className="color-selector mb-6">
      <h2 className="label-config label-colors text-lg font-medium mb-3">カラー</h2>
      
      {/* 色選択オプション */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {colors.map((color) => (
          <button
            key={color.value}
            className={`p-2 border rounded flex items-center gap-2 ${
              selectedColor === color.value ? 'border-primary bg-primary-light/20' : 'border-neutral-200'
            }`}
            onClick={() => handleCustomColorClick(color)}
            onMouseEnter={(e) => onTooltip && onTooltip(e, color.description)}
            onMouseLeave={() => onTooltip && onTooltip(null)}
          >
            {color.value ? (
              <div 
                className="w-4 h-4 rounded-full border border-neutral-200" 
                style={{ 
                  backgroundColor: color.isCustom ? `var(--custom-color)` : `var(${color.value.replace('color-', '--')})`,
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
                }}
              ></div>
            ) : (
              <div className="w-4 h-4 rounded-full border border-dashed border-neutral-400"></div>
            )}
            <span>{color.label}</span>
          </button>
        ))}
      </div>
      
      {/* カラーホイールセクション */}
      <div className="color-wheel-section mt-2">
        <button
          className="w-full py-2 px-3 border rounded flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200"
          onClick={() => setIsColorPickerOpen(true)}
        >
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
          </span>
          <span>カラーピッカーを開く</span>
        </button>
      </div>
      
      {/* カラーピッカー */}
      {isColorPickerOpen && (
        <ColorPicker
          initialColor={customColorSettings.mainColor}
          onColorChange={handleCustomColorChange}
          isOpen={isColorPickerOpen}
          onClose={() => setIsColorPickerOpen(false)}
        />
      )}
    </div>
  );
};

export default ColorSelector;
