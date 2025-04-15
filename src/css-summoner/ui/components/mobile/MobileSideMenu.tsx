// src/css-summoner/ui/components/mobile/MobileSideMenu.tsx
import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ComponentSelector from '../selectors/ComponentSelector'; // 追加
import ColorSelector from '../selectors/ColorSelector';
import SizeSelector from '../selectors/SizeSelector';
import BorderRadiusSelector from '../selectors/BorderRadiusSelector';
import ModifierSelector from '../selectors/ModifierSelector';
import SpecialClassSelector from '../selectors/SpecialClassSelector';
import VariantSelector from '../selectors/VariantSelector';
import Accordion from '../common/Accordion';
import type { Option } from '@hooks/component/useComponentOptions.tsx';
import { ACTIONS } from '@hooks/actions.ts'; // ACTIONS をインポート (type import ではなく通常の import)

// classDescriptions の型
interface ClassDescriptionDetail {
    component: string;
    variant: string;
    description: string;
    category: string;
}
interface ClassDescription {
  [key: string]: ClassDescriptionDetail;
}

// ComponentType の型 (仮。必要なら classMappings などから取得)
interface ComponentType {
    value: string;
    label: string;
    category?: string;
}

interface MobileSideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  state: any;
  dispatch: React.Dispatch<any>;
  componentConfig: any;
  availableColors: Option[];
  availableVariants: Option[];
  availableSizes: Option[];
  availableBorderRadii: Option[];
  availableModifiers: Option[];
  availableSpecialClasses: Option[];
  classDescriptions: ClassDescription;
  componentTypes: ComponentType[]; // 追加
  onComponentSelect: (type: string) => void; // 追加 (actions.setComponentType を想定)
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
  componentTypes, // 追加
  onComponentSelect, // 追加
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

  const handleTooltip = () => {};

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } lg:hidden`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Side Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-3/5 max-w-sm bg-neutral-light dark:bg-neutral-dark shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:hidden overflow-y-auto`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="p-2">
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
            {/* コンポーネント選択を最初に追加 */}
            <Accordion title="component" initialOpen={true}> {/* defaultOpen を initialOpen に修正 */}
                <ComponentSelector
                    componentTypes={componentTypes}
                    selectedComponent={state.componentType}
                    onSelect={onComponentSelect} // Props経由で受け取った関数を使用
                />
            </Accordion>

             <Accordion title="color">
              <ColorSelector
                colors={availableColors}
                selectedColor={state.selectedColor}
                onSelect={(color: string) => dispatch({ type: ACTIONS.SET_COLOR, payload: color })} // ACTIONS 定数を使用
                onTooltip={handleTooltip}
              />
            </Accordion>

            {availableVariants && availableVariants.length > 0 && (
              <Accordion title="variant">
                <VariantSelector
                  variants={availableVariants}
                  selectedVariant={state.componentVariant}
                  onSelect={(variant: string) => dispatch({ type: ACTIONS.SET_COMPONENT_VARIANT, payload: variant })} // ACTIONS 定数を使用
                  onTooltip={handleTooltip}
                  classDescriptions={classDescriptions}
                />
              </Accordion>
            )}

            {availableSizes && availableSizes.length > 0 && (
               <Accordion title="size">
                <SizeSelector
                  sizes={availableSizes}
                  selectedSize={state.size}
                  onSelect={(size: string) => dispatch({ type: ACTIONS.SET_SIZE, payload: size })} // ACTIONS 定数を使用
                />
              </Accordion>
            )}

            {availableBorderRadii && availableBorderRadii.length > 0 && (
              <Accordion title="radius">
                <BorderRadiusSelector
                  options={availableBorderRadii}
                  selectedRadius={state.selectedBorderRadius}
                  onSelect={(radius: string) => dispatch({ type: ACTIONS.SET_BORDER_RADIUS, payload: radius })} // ACTIONS 定数を使用
                />
              </Accordion>
            )}

            {availableModifiers && availableModifiers.length > 0 && (
              <Accordion title="modifier">
                <ModifierSelector
                  idPrefix="mobile" // モバイルビュー用のプレフィックスを追加
                  modifiers={availableModifiers}
                  selectedModifiers={state.selectedModifiers} // useClassBuilder側で配列に変更が必要
                  onToggle={(modifier: string) => dispatch({ type: ACTIONS.TOGGLE_MODIFIER, payload: modifier })} // ACTIONS 定数を使用
                  onTooltip={handleTooltip}
                />
              </Accordion>
            )}

            {availableSpecialClasses && availableSpecialClasses.length > 0 && (
              <Accordion title="special">
                <SpecialClassSelector
                  specialClasses={availableSpecialClasses}
                  selectedSpecialClasses={state.selectedSpecialClasses}
                  onToggle={(specialClass: string) => dispatch({ type: ACTIONS.TOGGLE_SPECIAL_CLASS, payload: specialClass })} // ACTIONS 定数を使用
                  onTooltip={handleTooltip}
                  idPrefix='mobile'
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