import React, { useState } from 'react'
import PropTypes from 'prop-types'

/**
 * アコーディオン/折りたたみコンポーネント
 * ヘッダーをクリックして中身の表示/非表示を切り替えられます
 */
const Accordion = ({
	title,
	children,
	className = '',
	initialOpen = false,
	headerRight = null,
	contentClassName = '',
}) => {
	const [isOpen, setIsOpen] = useState(initialOpen)

	return (
		<div
			className={`border border-neutral-200 dark:border-neutral-700 rounded-md ${className}`}
		>
			<div
				className='flex items-center justify-between p-3 cursor-pointer bg-neutral-100 dark:bg-neutral-800 rounded-t-md'
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className='flex items-center gap-2'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
					>
						<polyline points='6 9 12 15 18 9'></polyline>
					</svg>
					<h3 className='text-sm font-medium'>{title}</h3>
				</div>
				{headerRight && (
					<div onClick={(e) => e.stopPropagation()}>{headerRight}</div>
				)}
			</div>

			<div
				className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
			>
				<div className={`p-3 ${contentClassName}`}>{children}</div>
			</div>
		</div>
	)
}

Accordion.propTypes = {
	title: PropTypes.node.isRequired,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	initialOpen: PropTypes.bool,
	headerRight: PropTypes.node, // ヘッダー右側に配置する要素（オプション）
	contentClassName: PropTypes.string, // コンテンツエリアのクラス名
}

export default Accordion
