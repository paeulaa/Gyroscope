import React, { useState, useEffect, useRef } from 'react';
import { useLiquidHaptic } from './useLiquidHaptic';
import { useCollision } from './useCollision';
import { useConnectionGuard } from './useConnectionGuard';
import DebugConsole from './DebugConsole';       // Debug 面板（已整合 FPS 功能）
import Button from './Button';
import {
  containerStyle,
  backButtonStyle,
  gridStyle,
  dotBaseStyle,
  standbyTextStyle
} from '../style/CommonStyles.js';
import { theme } from '../style/theme.js';

const MAX_ANGLE = 15;
const RANGE_FACTOR = 0.95;

const DisplayView = ({ socket, goBack }) => {
  const [hasData, setHasData] = useState(false);
  const [showDebug, setShowDebug] = useState(false); // 控制面板顯示
  const clickCount = useRef(0);
  
  // 💡 3. 定義物理參數狀態 (讓 Slider 可以更動)
  const [config, setConfig] = useState({
    lerp: 0.45,
    stretch: 0.15,
    bounce: 8
  });

  const canvasRef = useRef(null);
  const dotRef = useRef(null);
  const targetPos = useRef({ x: 0, y: 0, shadow: 0 });
  const requestRef = useRef();
  const debugConsoleRef = useRef(null); // DebugConsole 的 ref

  // 物理手感 Hook (傳入動態 config)
  const { calculateHapticStyle, applyBounce } = useLiquidHaptic({
    LERP_FACTOR: config.lerp,
    SENSITIVITY: 40,
    MAX_STRETCH: config.stretch
  });
  
  // 6. 碰撞邏輯 Hook (傳入動態彈力)
  const { checkCollision } = useCollision(socket, applyBounce ? (status) => applyBounce(status, config.bounce) : null);

  const { updateHeartbeat } = useConnectionGuard(hasData, () => {
    targetPos.current = { x: 0, y: 0, shadow: 0 };
  }, 500);

  const clickTimeoutRef = useRef(null);

  // 隱藏面板觸發邏輯：連點三次
  const handleCanvasClick = (e) => {
    // 防止點擊按鈕時觸發
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    
    clickCount.current++;
    
    // 清除之前的 timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    if (clickCount.current >= 3) {
      setShowDebug(!showDebug);
      clickCount.current = 0;
    } else {
      // 設置新的 timeout，500ms 內沒有新點擊就重置計數
      clickTimeoutRef.current = setTimeout(() => {
        clickCount.current = 0;
      }, 500);
    }
  };

  // 清理 timeout
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleData = (data) => {
      setHasData(true);
      // 記錄數據流入供 DebugConsole 的 FPS 面板顯示
      if (debugConsoleRef.current) {
        debugConsoleRef.current.recordDataIn();
      }
      updateHeartbeat();
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      const canvasRect = canvas.getBoundingClientRect();

      const normalizedAlpha = data.alpha / MAX_ANGLE;
      const normalizedBeta = data.beta / MAX_ANGLE;
      const expAlpha = Math.sign(normalizedAlpha) * Math.pow(Math.abs(normalizedAlpha), 1.1);
      const expBeta = Math.sign(normalizedBeta) * Math.pow(Math.abs(normalizedBeta), 1.1);

      targetPos.current = {
        x: expAlpha * (canvasRect.width / 2) * RANGE_FACTOR * -1,
        y: expBeta * (canvasRect.height / 2) * RANGE_FACTOR * -1,
        shadow: Math.min(1, Math.hypot(data.alpha, data.beta) / MAX_ANGLE)
      };
    };
    socket.on('gyro-data-received', handleData);
    return () => socket.off('gyro-data-received', handleData);
  }, [socket, hasData, updateHeartbeat]);

  useEffect(() => {
    const animate = () => {
      if (dotRef.current && canvasRef.current) {
        const haptic = calculateHapticStyle(targetPos.current);
        dotRef.current.style.transform = haptic.transform;
        dotRef.current.style.boxShadow = haptic.boxShadow;

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const limitX = (canvasRect.width / 2) * RANGE_FACTOR;
        const limitY = (canvasRect.height / 2) * RANGE_FACTOR;
        checkCollision(haptic.x, haptic.y, limitX, limitY);
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [calculateHapticStyle, checkCollision]);

  return (
    <div style={containerStyle} onClick={handleCanvasClick}>
      <Button variant="back" onClick={goBack} style={backButtonStyle}>← Back</Button>

      {/* 臨時測試按鈕：切換 Debug 模式 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowDebug(!showDebug);
        }}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 20,
          padding: '8px 16px',
          backgroundColor: showDebug ? theme.colors.success : theme.colors.primary,
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        {showDebug ? 'Hide Debug' : 'Show Debug'}
      </button>

      {/* 💡 渲染 Debug 面板（已整合 FPS 功能） */}
      {showDebug && (
        <DebugConsole 
          ref={debugConsoleRef}
          config={config} 
          setConfig={setConfig} 
        />
      )}

      <div ref={canvasRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div style={gridStyle} />
        <div ref={dotRef} style={dotBaseStyle} />
        {!hasData && (
          <div style={standbyTextStyle}>SYSTEM STANDBY - WAITING FOR LINK...</div>
        )}
      </div>
    </div>
  );
};

// 樣式已遷移到 ../style/commonStyles.js

export default DisplayView;