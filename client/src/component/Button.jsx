import React from 'react';

/**
 * 通用按鈕組件
 * @param {string} variant - 按鈕樣式變體: 'back' | 'primary' | 'success'
 * @param {function} onClick - 點擊事件處理函數
 * @param {string} children - 按鈕文字內容
 * @param {object} className - 額外的 className
 * @param {object} style - 額外的內聯樣式
 */
const Button = ({ variant = 'primary', onClick, children, className = '', style = {} }) => {
  // 根據 variant 決定基礎樣式
  const baseStyles = {
    back: 'text-blue-500 underline bg-transparent border-none cursor-pointer',
    primary: 'px-8 py-4 rounded-full font-bold shadow-lg bg-indigo-500 text-white transition-colors',
    success: 'px-8 py-4 rounded-full font-bold shadow-lg bg-green-500 text-white transition-colors'
  };

  const baseStyle = baseStyles[variant] || baseStyles.primary;

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;

