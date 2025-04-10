// src/css-summoner/ui/ClassBuilder.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPalette } from '@fortawesome/free-solid-svg-icons';

// 独自フック
import useClassBuilder from '@hooks/useClassBuilder.tsx';
import useComponentOptions from '@hooks/component/useComponentOptions.tsx';
import type { Option } from '@hooks/component/useComponentOptions.tsx';

// コンポーネントのインポート
import ComponentSelector from '@components/selectors/ComponentSelector';
import VariantSelector from '@components/selectors/VariantSelector';
import SizeSelector from '@components/selectors/SizeSelector.tsx';
import BorderRadiusSelector from '@components/selectors/BorderRadiusSelector';
import ModifierSelector from '@components/selectors/ModifierSelector';
import SpecialClassSelector from '@components/selectors/SpecialClassSelector';
import ColorSelector from '@components/selectors/ColorSelector';
import ClassPreview from '@components/preview/ClassPreview';
import ClassCodeDisplay from '@components/display/ClassCodeDisplay';
import MobileSideMenu from '@components/mobile/MobileSideMenu.tsx';
import CssVarEditorManager from '@components/common/CssVarEditorManager';

// 設定のインポート
import {
	componentTypes,
	baseClasses,
	componentVariants,
	classDescriptions,
} from '@/css-summoner/classMappings.js';

import {
	sizes,
	borderRadiusOptions,
	modifiers,
	specialClasses,
	colorOptions,
} from '@/css-summoner/configs';

// CustomColorSettings 型をここで定義
interface CustomColorSettings {
	mainColor: string;
	textColor: string;
	autoTextColor: boolean;
	autoBorderColor: boolean;
}

// classDescriptions の型を MobileSideMenu と合わせる
interface ClassDescriptionDetail {
    component: string;
    variant: string;
    description: string;
    category: string;
}
interface ClassDescriptions {
  [key: string]: ClassDescriptionDetail;
}


/**
 * カスタムクラスビルダーのメインコンポーネント
 */
const ClassBuilder: React.FC = () => {
	const { state, actions } = useClassBuilder();
	const { getSizeOptions, getBorderRadiusOptions, getModifierOptions } =
		useComponentOptions(state.componentType, sizes, borderRadiusOptions, modifiers);

    // ダミーの onTooltip 関数
    const handleTooltip = () => {};

	const {
		showCssVarEditor,
		toggleCssVarEditor, // この関数を window に公開する
		closeCssVarEditor,
		DesktopTrigger: CssVarEditorDesktopTrigger,
		EditorComponent: CssVarEditorComponent,
	} = CssVarEditorManager();

	const handleCustomColorChange = useCallback(
		(colorSettings: CustomColorSettings) => {
			actions.setCustomColorSettings(colorSettings);
			if (state.selectedColor !== 'theme-custom') {
				actions.setColor('theme-custom');
			}
		},
		[actions, state.selectedColor]
	);

	// デフォルトサイズ設定の useEffect (コメントアウト解除)
	useEffect(() => {
		if (state.componentType) {
			const sizeOptions = getSizeOptions();
			if (sizeOptions.length > 0) {
				const smallOption = sizeOptions.find(
					(option: Option) => option.value === 'sm' || option.value === 'btn-sm'
				);
				const sizeToSet = smallOption ? smallOption.value : sizeOptions[0].value;
				// 初回レンダリング時または componentType 変更時のみデフォルトサイズを設定
				// ユーザーが既にサイズを選択している場合は上書きしない
				if (state.size === '' || !sizeOptions.some(opt => opt.value === state.size)) {
				    actions.setSize(sizeToSet);
                }
			} else {
				if (state.size !== '') {
					actions.setSize('');
				}
			}
		}
	// }, [state.componentType, actions, getSizeOptions]); // 依存配列を元に戻す
    // getSizeOptions が componentType に依存するため、これでOK
	}, [state.componentType, actions, getSizeOptions]);

    // Header.astro のスクリプトから呼び出すための関数を window に登録
    useEffect(() => {
        // 型安全のため、既存のオブジェクトがあればマージする
        (window as any).cssBuilderActions = {
            ...(window as any).cssBuilderActions, // 既存のプロパティを保持
            toggleMobileMenu: actions.toggleMobileMenu,
            toggleCssVarEditor: toggleCssVarEditor, // CssVarEditorManager から取得した関数
            getMobileMenuState: () => state.isMobileMenuOpen, // 現在の状態を返す関数
        };

        // isMobileMenuOpen の変更を Header.astro に通知するカスタムイベント
        const menuButton = document.getElementById('mobile-menu-button');
        if (menuButton) {
            menuButton.setAttribute('aria-expanded', String(state.isMobileMenuOpen));
        }
        // カスタムイベントを発行して Header.astro 側で購読させる方がより堅牢
        // window.dispatchEvent(new CustomEvent('cssBuilderMobileMenuToggle', { detail: { isOpen: state.isMobileMenuOpen } }));


        // クリーンアップ関数: コンポーネントがアンマウントされるときに window から削除
        return () => {
            // 他の機能が cssBuilderActions を使っている可能性を考慮し、
            // このコンポーネントが追加した関数のみ削除する
            if ((window as any).cssBuilderActions) {
                delete (window as any).cssBuilderActions.toggleMobileMenu;
                delete (window as any).cssBuilderActions.toggleCssVarEditor;
                delete (window as any).cssBuilderActions.getMobileMenuState;
                // オブジェクトが空になったらオブジェクト自体も削除する (任意)
                if (Object.keys((window as any).cssBuilderActions).length === 0) {
                    delete (window as any).cssBuilderActions;
                }
            }
        };
    // }, [actions.toggleMobileMenu, toggleCssVarEditor, state.isMobileMenuOpen]);
    // toggleCssVarEditor は CssVarEditorManager から取得するため依存配列に含める
    }, [actions.toggleMobileMenu, toggleCssVarEditor, state.isMobileMenuOpen]);


    const availableVariants: Option[] = componentVariants[state.componentType as keyof typeof componentVariants] || [];
    const availableSizes: Option[] = getSizeOptions();
    const availableBorderRadii: Option[] = getBorderRadiusOptions();
    const availableModifiers: Option[] = getModifierOptions();
    const availableColors = colorOptions.filter(opt => opt.value !== '');
    const availableSpecialClasses = specialClasses.filter(opt => opt.value !== '');

	return (
		// ルート要素に ID を追加 (Header.astro の代替案で使う場合)
        // <div id="class-builder-root" className='max-w-7xl mx-auto'>
		<div className='max-w-7xl mx-auto'>
            {/* モバイル用ヘッダーは Header.astro に移動済み */}
			<div className='grid grid-cols-1 lg:grid-cols-10 gap-4 p-4 lg:p-0'>
				{/* 左側: コンポーネント選択 (lg以上) */}
				<div className='panel panel-components hidden lg:block lg:col-span-2'>
					<ComponentSelector
						componentTypes={componentTypes}
						selectedComponent={state.componentType}
						onSelect={actions.setComponentType}
					/>
				</div>

				{/* 中央: 設定パネル (lg以上) */}
				<div className='panel panel-settings hidden lg:block lg:col-span-3'>
					{availableVariants.length > 0 && (
							<VariantSelector
								variants={availableVariants}
								selectedVariant={state.componentVariant}
								onSelect={actions.setComponentVariant}
								onTooltip={handleTooltip}
								classDescriptions={classDescriptions as ClassDescriptions}
							/>
						)}
					<ColorSelector
						colors={colorOptions}
						selectedColor={state.selectedColor}
						onSelect={actions.setColor}
						onTooltip={handleTooltip}
					/>
					{availableSizes.length > 0 && (
						<SizeSelector
							sizes={availableSizes}
							selectedSize={state.size}
							onSelect={actions.setSize}
						/>
					)}
					{availableBorderRadii.length > 0 && (
						<BorderRadiusSelector
							options={availableBorderRadii}
							selectedRadius={state.borderRadius}
							onSelect={actions.setBorderRadius}
						/>
					)}
					{availableModifiers.length > 0 && (
						<ModifierSelector
							modifiers={availableModifiers}
							selectedModifiers={state.selectedModifiers}
							onToggle={actions.toggleModifier}
							onTooltip={handleTooltip}
						/>
					)}
					<SpecialClassSelector
						specialClasses={specialClasses}
						selectedSpecialClasses={state.selectedSpecialClasses}
						onToggle={actions.toggleSpecialClass}
						onTooltip={handleTooltip}
					/>
				</div>

				{/* 右側: プレビューと生成コード */}
				<div className='panel-preview lg:col-span-5'>
					<div className='flex flex-wrap items-center justify-between gap-4 pb-2 border-b dark:border-neutral-700 mb-4'>
						{/* 背景色設定 */}
						<div className='flex items-center gap-2'>
							<span className='text-sm font-medium'>background:</span>
							<div className='flex gap-1 flex-wrap'>
                                <button onClick={() => actions.setPreviewBg('bg-transparent')} className={`w-6 h-6 rounded-full border border-dashed ${state.previewBg === 'bg-transparent' ? 'ring-2 ring-primary ring-offset-1' : ''}`} aria-label='半透過' title='半透過'></button>
                                <button onClick={() => actions.setPreviewBg('bg-white')} className={`w-6 h-6 rounded-full border ${state.previewBg === 'bg-white' ? 'ring-2 ring-primary ring-offset-1' : ''}`} style={{ backgroundColor: 'white' }} aria-label='白背景' title='白背景'></button>
                                <button onClick={() => actions.setPreviewBg('bg-neutral-200')} className={`w-6 h-6 rounded-full border ${state.previewBg === 'bg-neutral-200' ? 'ring-2 ring-primary ring-offset-1' : ''}`} style={{ backgroundColor: '#e5e5e5' }} aria-label='グレー背景' title='グレー背景'></button>
                                <button onClick={() => actions.setPreviewBg('bg-neutral-800')} className={`w-6 h-6 rounded-full border ${state.previewBg === 'bg-neutral-800' ? 'ring-2 ring-primary ring-offset-1' : ''}`} style={{ backgroundColor: '#262626' }} aria-label='黒背景' title='黒背景'></button>
                                <button onClick={() => actions.setPreviewBg('bg-primary-light')} className={`w-6 h-6 rounded-full border ${state.previewBg === 'bg-primary-light' ? 'ring-2 ring-primary ring-offset-1' : ''}`} style={{ backgroundColor: 'var(--primary-light)' }} aria-label='プライマリライト背景' title='プライマリライト背景'></button>
                                <button onClick={() => actions.setPreviewBg('bg-secondary-light')} className={`w-6 h-6 rounded-full border ${state.previewBg === 'bg-secondary-light' ? 'ring-2 ring-primary ring-offset-1' : ''}`} style={{ backgroundColor: 'var(--secondary-light)' }} aria-label='セカンダリライト背景' title='セカンダリライト背景'></button>
							</div>
						</div>
                        <div className="hidden md:block">
                            <CssVarEditorDesktopTrigger />
                        </div>
					</div>
					{/* プレビュー */}
					<ClassPreview
						componentType={state.componentType}
						componentVariant={state.componentVariant}
						borderRadius={state.borderRadius}
						selectedModifiers={state.selectedModifiers}
						selectedSpecialClasses={state.selectedSpecialClasses}
						additionalClasses={state.additionalClasses}
						size={state.size}
						previewBg={state.previewBg}
						baseClass={baseClasses[state.componentType as keyof typeof baseClasses] || ''}
						selectedColor={state.selectedColor}
					/>

					{/* 追加クラス入力 */}
					<div className='mt-4 mb-4'>
						<h2 className='label-config label-custom text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1'>追加クラス</h2>
						<div className=' flex items-center gap-2'>
							<input
								type='text'
								value={state.additionalClasses}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => actions.setAdditionalClasses(e.target.value)}
								placeholder='カスタムクラスを入力'
								className='code-aria w-full input input-bordered input-sm'
							/>
						</div>
						<p className='text-xs text-neutral-500 dark:text-neutral-300 mt-1'>
							例: 'w-full mb-4 dark:bg-neutral-800'
						</p>
					</div>

					{/* 生成されたコード表示 */}
					<ClassCodeDisplay
						classString={state.generatedClassString}
						componentType={state.componentType}
						componentVariant={state.componentVariant}
						selectedModifiers={state.selectedModifiers}
						selectedColor={state.selectedColor}
					/>
				</div>
			</div>

			{/* CSS変数エディタ */}
			<CssVarEditorComponent />

			{/* モバイルサイドメニュー */}
            <MobileSideMenu
                isOpen={state.isMobileMenuOpen}
                onClose={actions.toggleMobileMenu}
                state={state}
                dispatch={actions as any}
                componentConfig={componentVariants[state.componentType as keyof typeof componentVariants]}
                availableColors={availableColors}
                availableVariants={availableVariants}
                availableSizes={availableSizes}
                availableBorderRadii={availableBorderRadii}
                availableModifiers={availableModifiers}
                availableSpecialClasses={availableSpecialClasses}
                classDescriptions={classDescriptions as ClassDescriptions}
            />
		</div>
	);
};

export default ClassBuilder;
