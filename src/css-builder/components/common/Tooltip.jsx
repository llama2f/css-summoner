// components/common/Tooltip.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * ツールチップコンポーネント
 * マウスオーバー時に説明テキストを表示するためのコンポーネント
 */
const Tooltip = ({ children, text }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // マウスオーバー時にツールチップを表示
  const handleMouseEnter = (e) => {
    if (!text) return;

    setIsVisible(true);
    
    // ポジションの計算（オフセットを追加してカーソルの近くに表示）
    const x = e.clientX + 10;
    const y = e.clientY + 10;
    setPosition({ x, y });
  };

  // マウスアウト時にツールチップを非表示
  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      
      {isVisible && text && (
        <div
          className='fixed bg-neutral-800 text-white p-2 rounded text-xs z-50 max-w-xs'
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          {text}
        </div>
      )}
    </>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string
};

export default Tooltip;
