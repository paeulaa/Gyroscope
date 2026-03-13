import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import {
  debugPanelStyle,
  sectionStyle,
  fpsRowStyle,
  dotStyle,
  subTextStyle,
  controlGroupStyle,
  labelRowStyle,
  valueStyle,
  sliderStyle,
  footerStyle
} from '../style/CommonStyles.js';
import { theme } from '../style/theme.js';

/**
 * DebugConsole - 整合監控與控制的中控面板
 * 內部整合了 FPS 計數功能
 * @param {Object} config - 物理參數狀態
 * @param {Function} setConfig - 更新物理參數的函數
 * @param {Object} ref - 用於暴露 recordDataIn 方法
 */
const DebugConsole = forwardRef(({ config, setConfig }, ref) => {
  // FPS 計數相關狀態
  const [fps, setFps] = useState(0);
  const [dataCount, setDataCount] = useState(0);
  const frameCount = useRef(0);
  const dataReceivedCount = useRef(0);
  const lastTime = useRef(null);

  // 提供給外部在收到 Socket 數據時呼叫
  const recordDataIn = () => {
    dataReceivedCount.current++;
  };

  // 暴露方法給父組件
  useImperativeHandle(ref, () => ({
    recordDataIn
  }));

  // FPS 計數邏輯
  useEffect(() => {
    // 初始化時間戳
    if (lastTime.current === null) {
      lastTime.current = performance.now();
    }

    const updateStats = () => {
      frameCount.current++;
      const now = performance.now();
      
      if (lastTime.current === null) {
        lastTime.current = now;
        requestAnimationFrame(updateStats);
        return;
      }

      const elapsed = now - lastTime.current;

      // 每秒更新一次數值
      if (elapsed >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / elapsed));
        setDataCount(Math.round((dataReceivedCount.current * 1000) / elapsed));
        
        frameCount.current = 0;
        dataReceivedCount.current = 0;
        lastTime.current = now;
      }
      requestAnimationFrame(updateStats);
    };

    const raf = requestAnimationFrame(updateStats);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div style={debugPanelStyle} onClick={(e) => e.stopPropagation()}>
      {/* --- 1. 性能指標區 (Monitoring) --- */}
      <div style={sectionStyle}>
        <div style={fpsRowStyle}>
          <div style={{ 
            ...dotStyle, 
            backgroundColor: fps < 55 ? theme.colors.error : theme.colors.success,
            boxShadow: `0 0 8px ${fps < 55 ? theme.colors.error : theme.colors.success}` 
          }} />
          <span style={{ fontWeight: '600', color: theme.colors.textMain }}>{fps} FPS Rendering</span>
        </div>
        <div style={subTextStyle}>
          Network Inflow: <span style={{ color: theme.colors.primary }}>{dataCount}</span> packets/s
        </div>
      </div>

      {/* --- 2. 物理參數控制區 (Control) --- */}
      <div style={controlGroupStyle}>
        <ControlRow 
          label="Smoothing (Lerp)" 
          value={config.lerp} 
          min="0.1" max="0.9" step="0.05"
          onChange={(v) => setConfig({ ...config, lerp: v })}
        />
        
        <ControlRow 
          label="Elasticity (Stretch)" 
          value={config.stretch} 
          min="0" max="0.4" step="0.01"
          onChange={(v) => setConfig({ ...config, stretch: v })}
        />

        <ControlRow 
          label="Impact Force (Bounce)" 
          value={config.bounce} 
          min="0" max="20" step="1"
          onChange={(v) => setConfig({ ...config, bounce: v })}
        />
      </div>

      {/* --- 3. 底部資訊 --- */}
      <div style={footerStyle}>
        REMOTE GYRO - V3 • WEBSOCKET MODE
      </div>
    </div>
  );
});

/**
 * 內部組件：封裝 Slider 邏輯
 */
const ControlRow = ({ label, value, min, max, step, onChange }) => (
  <div style={{ marginBottom: '14px' }}>
    <div style={labelRowStyle}>
      <span>{label}</span>
      <span style={valueStyle}>{value}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))} 
      style={sliderStyle} 
    />
  </div>
);

// 樣式已遷移到 ../style/commonStyles.js

DebugConsole.displayName = 'DebugConsole';

export default DebugConsole;