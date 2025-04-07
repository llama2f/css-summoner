import React, { useState, useEffect, useRef } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful'; // ライブラリがインストールされていることを前提

/**
 * カスタムカラーピッカーコンポーネント
 * 
 * @param {Object} props
 * @param {string} props.color - 現在選択されている色（HEX形式）
 * @param {function} props.onChange - 色が変更されたときのコールバック関数
 * @param {function} props.onClose - ピッカーを閉じるときのコールバック関数
 */
const CustomColorPicker = ({ color, onChange, onClose }) => {
  const [currentColor, setCurrentColor] = useState(color || '#1a568e'); // デフォルト色
  const pickerRef = useRef(null);

  // 色の変更を親コンポーネントに通知
  const handleColorChange = (newColor) => {
    setCurrentColor(newColor);
  };

  // 色の確定
  const handleConfirm = () => {
    onChange(currentColor);
    onClose();
  };

  // 外側クリックでピッカーを閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // カラーコードのプレビュー生成
  const generateCssVars = () => {
    // 輝度に基づいてテキスト色を決定 (明るい背景には暗いテキスト、暗い背景には明るいテキスト)
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };
    
    const rgb = hexToRgb(currentColor);
    // 輝度の計算 (BT.709式)
    const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
    const textColor = luminance > 0.5 ? '#000000' : '#ffffff';
    
    // 10%暗い色を計算（ホバー用）
    const darken = (hex, percent) => {
      const rgb = hexToRgb(hex);
      const factor = 1 - percent / 100;
      return `#${Math.round(rgb.r * factor).toString(16).padStart(2, '0')}${
        Math.round(rgb.g * factor).toString(16).padStart(2, '0')}${
        Math.round(rgb.b * factor).toString(16).padStart(2, '0')}`;
    };
    
    const hoverColor = darken(currentColor, 10);
    const activeColor = darken(currentColor, 20);
    
    return {
      '--custom-color': currentColor,
      '--custom-text-color': textColor,
      '--custom-hover-color': hoverColor,
      '--custom-active-color': activeColor
    };
  };

  // 現在の色に基づくCSS変数
  const cssVars = generateCssVars();

  return (
    <div 
      ref={pickerRef}
      className="custom-color-picker p-4 bg-white rounded-lg shadow-lg border border-neutral-200"
      style={{ width: '250px' }}
    >
      <div className="mb-4">
        <HexColorPicker color={currentColor} onChange={handleColorChange} />
      </div>
      
      <div className="flex items-center mb-4">
        <span className="text-sm mr-2">HEX:</span>
        <HexColorInput 
          className="flex-grow p-1 border rounded text-sm"
          color={currentColor} 
          onChange={handleColorChange} 
          prefixed
        />
      </div>
      
      {/* プレビュー */}
      <div className="mb-4">
        <div className="text-sm mb-1">プレビュー:</div>
        <div className="grid grid-cols-3 gap-2">
          <div 
            className="h-8 rounded flex items-center justify-center text-xs"
            style={{ backgroundColor: cssVars['--custom-color'], color: cssVars['--custom-text-color'] }}
          >
            通常
          </div>
          <div 
            className="h-8 rounded flex items-center justify-center text-xs"
            style={{ backgroundColor: cssVars['--custom-hover-color'], color: cssVars['--custom-text-color'] }}
          >
            ホバー
          </div>
          <div 
            className="h-8 rounded flex items-center justify-center text-xs"
            style={{ backgroundColor: cssVars['--custom-active-color'], color: cssVars['--custom-text-color'] }}
          >
            アクティブ
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button 
          onClick={onClose}
          className="px-3 py-1 bg-neutral-200 rounded text-sm"
        >
          キャンセル
        </button>
        <button 
          onClick={handleConfirm}
          className="px-3 py-1 bg-primary text-white rounded text-sm"
        >
          適用
        </button>
      </div>
    </div>
  );
};

export default CustomColorPicker;
