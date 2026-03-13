import { useEffect, useRef } from 'react';

/**
 * useConnectionGuard - 連線守衛 Hook
 * @param {boolean} hasData - 目前是否有收到數據的狀態
 * @param {Function} onReset - 當超時需要重置時執行的函數
 * @param {number} timeout - 判定斷連的毫秒數
 */
export const useConnectionGuard = (hasData, onReset, timeout = 500) => {
  const lastDataTime = useRef(null);

  // 提供給外部更新時間的函數
  const updateHeartbeat = () => {
    lastDataTime.current = Date.now();
  };

  // 初始化時間戳（只在第一次有數據時）
  useEffect(() => {
    if (hasData && lastDataTime.current === null) {
      lastDataTime.current = Date.now();
    }
  }, [hasData]);

  useEffect(() => {
    if (!hasData) return;

    const checkInterval = setInterval(() => {
      if (lastDataTime.current === null) return;
      const now = Date.now();
      if (now - lastDataTime.current > timeout) {
        onReset(); // 執行重置邏輯
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, [hasData, onReset, timeout]);

  return { updateHeartbeat };
};