import { useRef, useCallback } from 'react';

/**
 * useCollision - 專門處理碰撞偵測與邏輯回饋
 * @param {Object} socket - Socket 實例用於發送震動指令
 * @param {Function} applyBounce - 來自 useLiquidHaptic 的回彈函數
 */
export const useCollision = (socket, applyBounce) => {
  const lastVibrateTime = useRef(0);

  const checkCollision = useCallback((x, y, limitX, limitY) => {
    // 1. 判定各個方向的碰撞狀態
    const hitStatus = {
      left: x < -limitX,
      right: x > limitX,
      top: y < -limitY,
      bottom: y > limitY
    };

    const isHitting = Object.values(hitStatus).some(Boolean);

    if (isHitting) {
      // A. 執行物理回彈 (如果 applyBounce 存在)
      if (applyBounce) {
        applyBounce(hitStatus, 8); // 8 是回彈力道
      }

      // B. 處理通訊指令 (震動)
      const now = Date.now();
      if (socket && now - lastVibrateTime.current > 300) {
        socket.emit('trigger-vibrate');
        lastVibrateTime.current = now;
      }
    }

    return hitStatus;
  }, [socket, applyBounce]);

  return { checkCollision };
};