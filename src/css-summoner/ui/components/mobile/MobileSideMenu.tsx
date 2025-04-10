import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ColorSelector from '../selectors/ColorSelector';
import SizeSelector from '../selectors/SizeSelector'; // .tsx をインポート
import BorderRadiusSelector from '../selectors/BorderRadiusSelector';
import ModifierSelector from '../selectors/ModifierSelector';
import SpecialClassSelector from '../selectors/SpecialClassSelector';
import VariantSelector from '../selectors/VariantSelector';
import Accordion from '../common/Accordion';

// 仮の型定義 - 実際の型に合わせて調整が必要
interface Option {
  value: string;
  label: string;
  description?: string;
  isCustom?: boolean;
  cssVar?: string;
}

// 実際の classDescriptions の型に合わせる
interface ClassDescriptionDetail {
    component: string;
    variant: string;
    description: string;
    category: string;
}
interface ClassDescription {
  [key: string]: ClassDescriptionDetail;
}

interface MobileSideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  state: any; // useClassBuilder の state を想定
  dispatch: React.Dispatch<any>; // useClassBuilder の dispatch を想定
  componentConfig: any; // 選択中のコンポーネント設定
  availableColors: Option[];
  availableVariants: Option[]; // Option型に変更
  availableSizes: Option[]; // Option型に変更
  availableBorderRadii: Option[]; // Option型に変更
  availableModifiers: Option[]; // Option型に変更
  availableSpecialClasses: Option[]; // Option型に変更
  classDescriptions: ClassDescription; // 追加: クラスの説明
}

const MobileSideMenu: React.FC<MobileSideMenuProps> = ({
  isOpen,
  onClose,
  state,
  dispatch,
  componentConfig,
  availableColors,
  availableVariants,
  availableSizes,
  availableBorderRadii,
  availableModifiers,
  availableSpecialClasses,
  classDescriptions,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // --- useEffect フック (変更なし) ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    else document.removeEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  // --- useEffect フック ここまで ---

  // ダミーの onTooltip 関数
  const handleTooltip = () => {};

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } md:hidden`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Side Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-neutral-light dark:bg-neutral-dark shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden overflow-y-auto`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 id="mobile-menu-title" className="text-lg font-semibold text-neutral-dark dark:text-neutral-light">設定</h2>
            <button
              onClick={onClose}
              className="text-neutral-dark dark:text-neutral-light hover:text-primary dark:hover:text-primary-light focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="メニューを閉じる"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>

          {/* --- セレクターコンポーネント --- */}
          <div className="space-y-4">
            <Accordion title="カラー">
              <ColorSelector
                colors={availableColors}
                selectedColor={state.selectedColor}
                onSelect={(color: string) => dispatch({ type: 'SET_COLOR', payload: color })}
                onTooltip={handleTooltip} // 修正: ダミー関数を渡す
              />
            </Accordion>

            {availableVariants && availableVariants.length > 0 && (
              <Accordion title="バリアント">
                <VariantSelector
                  variants={availableVariants} // 修正: Props名を変更
                  selectedVariant={state.selectedVariant}
                  onSelect={(variant: string) => dispatch({ type: 'SET_VARIANT', payload: variant })} // 修正: Props名を変更
                  onTooltip={handleTooltip} // 修正: ダミー関数を渡す
                  classDescriptions={classDescriptions} // 追加
                />
              </Accordion>
            )}

            {availableSizes && availableSizes.length > 0 && (
               <Accordion title="サイズ">
                <SizeSelector
                  sizes={availableSizes} // any キャストを削除
                  selectedSize={state.selectedSize}
                  onSelect={(size: string) => dispatch({ type: 'SET_SIZE', payload: size })}
                />
              </Accordion>
            )}

            {availableBorderRadii && availableBorderRadii.length > 0 && (
              <Accordion title="角丸">
                <BorderRadiusSelector
                  options={availableBorderRadii} // 修正: Props名を変更
                  selectedRadius={state.selectedBorderRadius} // 修正: Props名を変更
                  onSelect={(radius: string) => dispatch({ type: 'SET_BORDER_RADIUS', payload: radius })} // 修正: Props名を変更
                />
              </Accordion>
            )}

            {availableModifiers && availableModifiers.length > 0 && (
              <Accordion title="修飾子">
                <ModifierSelector
                  modifiers={availableModifiers} // 修正: Props名を変更
                  // selectedModifiers は配列を期待するが、state.selectedModifier は単一の値。
                  // useClassBuilder 側の修正が必要。一旦 string[] にキャストしてエラー回避。
                  selectedModifiers={state.selectedModifier ? [state.selectedModifier] as string[] : []}
                  onToggle={(modifier: string) => dispatch({ type: 'SET_MODIFIER', payload: modifier })} // 修正: Props名とアクションタイプを変更 (要確認)
                  onTooltip={handleTooltip} // 修正: ダミー関数を渡す
                  // componentConfig, selectedColor は ModifierSelector では不要なため削除
                />
              </Accordion>
            )}

            {availableSpecialClasses && availableSpecialClasses.length > 0 && (
              <Accordion title="特殊クラス">
                <SpecialClassSelector
                  specialClasses={availableSpecialClasses} // 修正: Props名を変更
                  selectedSpecialClasses={state.selectedSpecialClasses} // これは配列のはず
                  onToggle={(specialClass: string) => dispatch({ type: 'TOGGLE_SPECIAL_CLASS', payload: specialClass })} // 修正: Props名を変更
                  onTooltip={handleTooltip} // 修正: ダミー関数を渡す
                />
              </Accordion>
            )}
          </div>
          {/* --- セレクターコンポーネント ここまで --- */}
        </div>
      </div>
    </>
  );
};

export default MobileSideMenu;