import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons'; // デフォルトアイコン例
import { buildClassString } from './common'; // 共通関数をインポート

/**
 * Badgeコンポーネントのベースハンドラ
 * @param {object} props - コンポーネントのプロパティ
 * @param {string[]} props.classList - 適用されるCSSクラスのリスト
 * @param {object} props.attributes - その他のHTML属性
 * @param {React.ReactNode} props.children - 子要素 (通常はテキストかアイコン)
 * @returns {React.ReactElement} - レンダリングされるReact要素
 */
const handleBadgeBase = ({ classList, attributes, children }) => {
	const baseClass = 'badge-base'; // 必須のベースクラス
	const finalClassList = buildClassString(baseClass, classList);

	// アイコンとテキストの判定と処理
	let iconElement = null;
	let textContent = children;

	// 子要素が配列の場合、アイコンとテキストを探す
	if (Array.isArray(children)) {
		children.forEach(child => {
			if (typeof child === 'string' || typeof child === 'number') {
				textContent = child; // テキスト内容
			} else if (React.isValidElement(child) && child.type === FontAwesomeIcon) {
				iconElement = child; // FontAwesomeアイコン要素
			}
			// 他の要素タイプは無視するか、必要に応じて処理を追加
		});
	} else if (React.isValidElement(children) && children.type === FontAwesomeIcon) {
        // 子要素がアイコンのみの場合
        iconElement = children;
        textContent = null; // テキストなし
    }


	// アイコンのみかどうかの判定 (icon-onlyクラスがあるか)
	const isIconOnly = classList.includes('badge-icon-only');

	// アイコンがある場合のクラス調整
	const iconClasses = iconElement ? buildClassString(iconElement.props.className, ['badge-icon-spacing']) : '';


	return (
		<span className={finalClassList} {...attributes}>
			{iconElement && React.cloneElement(iconElement, { className: iconClasses })}
			{!isIconOnly && textContent && <span>{textContent}</span>}
            {/* アイコンのみでテキストもない場合、デフォルトアイコンを表示するなどのフォールバックも検討可能 */}
            {isIconOnly && !iconElement && <FontAwesomeIcon icon={faStar} className="badge-icon-spacing" />}
		</span>
	);
};

// 各バリアント用のハンドラ (基本的にはベースハンドラを呼び出す)
// CSSクラスはclassListに含まれるため、ここでは特別な処理は不要な場合が多い
const handleBadgePrimary = (props) => handleBadgeBase(props);
const handleBadgeSecondary = (props) => handleBadgeBase(props);
const handleBadgeAccent = (props) => handleBadgeBase(props);
const handleBadgeNeutral = (props) => handleBadgeBase(props);
const handleBadgeSuccess = (props) => handleBadgeBase(props);
const handleBadgeWarning = (props) => handleBadgeBase(props);
const handleBadgeError = (props) => handleBadgeBase(props);
const handleBadgePrimaryOutlined = (props) => handleBadgeBase(props);
const handleBadgeSecondaryOutlined = (props) => handleBadgeBase(props);
const handleBadgeAccentOutlined = (props) => handleBadgeBase(props);
const handleBadgeNeutralOutlined = (props) => handleBadgeBase(props);
const handleBadgeSuccessOutlined = (props) => handleBadgeBase(props);
const handleBadgeWarningOutlined = (props) => handleBadgeBase(props);
const handleBadgeErrorOutlined = (props) => handleBadgeBase(props);

// サイズやモディファイアも同様にベースハンドラを呼び出す
const handleBadgeXs = (props) => handleBadgeBase(props);
const handleBadgeSm = (props) => handleBadgeBase(props);
const handleBadgeMd = (props) => handleBadgeBase(props);
const handleBadgeLg = (props) => handleBadgeBase(props);
const handleBadgeRoundedFull = (props) => handleBadgeBase(props);
const handleBadgeShadowXs = (props) => handleBadgeBase(props);
const handleBadgeShadowSm = (props) => handleBadgeBase(props);
const handleBadgeShadowMd = (props) => handleBadgeBase(props);
const handleBadgeShadowLg = (props) => handleBadgeBase(props);
const handleBadgeIconOnly = (props) => handleBadgeBase(props);
const handleBadgeIconSpacing = (props) => handleBadgeBase(props); // icon-spacing自体は要素に付与される想定

// ハンドラをエクスポート
export const badgeHandlers = {
	base: handleBadgeBase,
	primary: handleBadgePrimary,
	secondary: handleBadgeSecondary,
	accent: handleBadgeAccent,
	neutral: handleBadgeNeutral,
	success: handleBadgeSuccess,
	warning: handleBadgeWarning,
	error: handleBadgeError,
	'primary-outlined': handleBadgePrimaryOutlined,
	'secondary-outlined': handleBadgeSecondaryOutlined,
	'accent-outlined': handleBadgeAccentOutlined,
	'neutral-outlined': handleBadgeNeutralOutlined,
	'success-outlined': handleBadgeSuccessOutlined,
	'warning-outlined': handleBadgeWarningOutlined,
	'error-outlined': handleBadgeErrorOutlined,
	xs: handleBadgeXs,
	sm: handleBadgeSm,
	md: handleBadgeMd,
	lg: handleBadgeLg,
	'rounded-full': handleBadgeRoundedFull,
	'shadow-xs': handleBadgeShadowXs,
	'shadow-sm': handleBadgeShadowSm,
	'shadow-md': handleBadgeShadowMd,
	'shadow-lg': handleBadgeShadowLg,
	'icon-only': handleBadgeIconOnly,
    'icon-spacing': handleBadgeIconSpacing, // icon-spacing自体は要素に付与される想定
};

export default badgeHandlers;