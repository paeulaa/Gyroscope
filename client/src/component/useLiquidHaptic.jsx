import { useRef, useCallback } from 'react';

/**
 * useLiquidHaptic - 專為流星/果凍感設計的物理手感 Hook
 * 包含 Lerp 平滑處理與動態物理形變計算
 */
export const useLiquidHaptic = (config = { LERP_FACTOR: 0.45, SENSITIVITY: 40, MAX_STRETCH: 0.15 }) => {
  const { LERP_FACTOR, SENSITIVITY, MAX_STRETCH } = config;
  
  // 核心座標緩存：儲存 Lerp 平滑後的「當前位置」
  const currentPos = useRef({ x: 0, y: 0, shadow: 0 });
  // 用來算上一幀與這一幀位移差的紀錄點
  const prevPos = useRef({ x: 0, y: 0 });

  /**
   * 核心計算函數
   * @param {Object} target - 來自 Socket 的目標座標 {x, y, shadow}
   */
  const calculateHapticStyle = useCallback((target) => {
    // 1. Lerp 線性插值計算 (平滑位置)
    currentPos.current.x += (target.x - currentPos.current.x) * LERP_FACTOR;
    currentPos.current.y += (target.y - currentPos.current.y) * LERP_FACTOR;
    currentPos.current.shadow += (target.shadow - currentPos.current.shadow) * LERP_FACTOR;

    const { x, y, shadow } = currentPos.current;

    // 2. 物理流星感運算
    const dx = x - prevPos.current.x;
    const dy = y - prevPos.current.y;
    const speed = Math.hypot(dx, dy); // 計算移動速度
    
    // 計算移動方向的角度 (弳度轉角度)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI); 

    // 計算拉長比例 (stretch)
    const stretch = Math.min(speed / SENSITIVITY, MAX_STRETCH);

    // 儲存紀錄供下一次 animate 循環計算速度
    prevPos.current = { x, y };

    // 3. 回傳最終樣式與座標
    return {
      x,
      y,
      shadow,
      // 組合變換：位移 -> 旋轉方向 -> 形變
      transform: `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg) scale(${1 + stretch}, ${1 - stretch * 0.3})`,
      // 動態光暈
      boxShadow: `0 0 ${15 + speed / 3}px ${5 + speed / 6}px rgba(99, 102, 241, ${shadow})`
    };
  }, [LERP_FACTOR, SENSITIVITY, MAX_STRETCH]);

  return { calculateHapticStyle, currentPos };
};