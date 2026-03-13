import React, { useState, useCallback, useEffect, useRef } from 'react';
import Button from './Button';

const DEAD_ZONE = 0.1; 
const MAX_ANGLE = 15; 

const ControllerView = ({ socket, goBack, setStatus }) => {
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [offsetAlpha, setOffsetAlpha] = useState(0); 
  const [offsetBeta, setOffsetBeta] = useState(0);
  const [rawAngles, setRawAngles] = useState({ alpha: '0.00', beta: '0.00' });

  // 💡 use useRef to store the latest handleOrientation, avoid the listener getting the old State
  const handlerRef = useRef();
  // 建立一個隱形的 Select 元素來觸發 iOS 震動
  const hapticTriggerRef = useRef(null);
  useEffect(() => {
    if (!socket) return;

    const handleVibrate = () => {
      // --- 1. Android 方案 ---
      if (window.navigator?.vibrate) {
        window.navigator.vibrate(40); 
      }

      // --- 2. iOS 專用隱形觸發 (優化版) ---
      if (hapticTriggerRef.current) {
        const select = hapticTriggerRef.current;
        
        // 快速切換索引
        select.selectedIndex = select.selectedIndex === 0 ? 1 : 0;
        
        // 💡 使用 dispatchEvent 代替 focus()，
        // 這樣可以觸發系統的 UI 變動感應，但不會讓頁面「跳一下」
        const event = new Event('change', { bubbles: true });
        select.dispatchEvent(event);
      }
    };

    socket.on('vibrate-command', handleVibrate);
    return () => socket.off('vibrate-command', handleVibrate);
  }, [socket]);

  const sendControlData = useCallback((alpha, beta) => {
    if (!socket || !socket.connected) return;
    socket.emit('gyro-update', {
      alpha: alpha,
      beta: beta,
      timestamp: Date.now(),
    });
  }, [socket]);

  // --- 核心修正：Gyroscope processing ---
  const handleOrientation = useCallback((event) => {
    // 💡 first step: update the numbers on the screen, whether calibrated or not
    const rAlpha = event.alpha ?? 0;
    const rBeta = event.beta ?? 0;
    
    // if the numbers are jumping here, it means the hardware permission is not a problem
    setRawAngles({ alpha: rAlpha.toFixed(2), beta: rBeta.toFixed(2) });

    if (!isCalibrated) return;

    let calibratedAlpha = rAlpha - offsetAlpha;
    let calibratedBeta = rBeta - offsetBeta;

    if (calibratedAlpha > 180) calibratedAlpha -= 360;
    if (calibratedAlpha < -180) calibratedAlpha += 360;

    if (Math.abs(calibratedAlpha) < DEAD_ZONE) calibratedAlpha = 0;
    if (Math.abs(calibratedBeta) < DEAD_ZONE) calibratedBeta = 0;

    const constrainedAlpha = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, calibratedAlpha));
    const constrainedBeta = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, calibratedBeta));

    sendControlData(constrainedAlpha, constrainedBeta);
  }, [isCalibrated, offsetAlpha, offsetBeta, sendControlData]);

  // keep the handler reference latest
  useEffect(() => {
    handlerRef.current = handleOrientation;
  }, [handleOrientation]);

  // --- core correction: more efficient listening binding ---
  const setupCalibrationListeners = useCallback(() => {
    // remove the old, ensure clean
    window.removeEventListener('deviceorientation', (e) => handlerRef.current(e), true);
    
    const tempListener = (event) => {
      console.log("detected initial data, calibrating...");
      setOffsetAlpha(event.alpha ?? 0); 
      setOffsetBeta(event.beta ?? 0);
      setIsCalibrated(true);
      setStatus('Status: Calibrated - Streaming');
      
      window.removeEventListener('deviceorientation', tempListener, true);
      // 💡 use true capture mode, to improve the stability of iOS listening
      window.addEventListener('deviceorientation', (e) => handlerRef.current(e), true);
    };

    window.addEventListener('deviceorientation', tempListener, true);
  }, [setStatus]);

  const requestPermission = async () => {
    console.log("trying to request permission...");
    setStatus('Status: requesting sensor permission...');

    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const state = await DeviceOrientationEvent.requestPermission();
        if (state === 'granted') {
          setupCalibrationListeners();
        } else {
          alert('rejected, please open the website permission in Safari settings and reload the page');
        }
      } catch (err) {
        alert('error: ' + err.message);
      }
    } else {
      setupCalibrationListeners();
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', (e) => handlerRef.current?.(e), true);
    };
  }, []);

  return (
    <div className="controller-container">
      {/* 隱形震動觸發器：絕對定位在畫面外，不影響 UI */}
      <select 
        ref={hapticTriggerRef} 
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', top: -100 }}
      >
        <option value="1">A</option>
        <option value="2">B</option>
      </select>
    <div className="p-4 flex flex-col items-center space-y-6">
      <Button variant="back" onClick={goBack}>← Back</Button>
      <h2 className="text-xl font-bold">📱 Mobile Controller</h2>
      <Button 
        variant={isCalibrated ? 'success' : 'primary'}
        onClick={requestPermission}
      >
        {isCalibrated ? 'Recalibrate' : 'Click to start Calibration'}
      </Button>

      {/* 💡 make the background color brighter, to make it easier to observe the numbers */}
      <div className="bg-gray-100 border-2 border-gray-300 text-gray-800 p-6 rounded-2xl w-64 font-mono shadow-inner">
        <p className="text-sm text-gray-500 mb-1">Raw Sensor Data:</p>
        <p className="text-lg">X: <span className="font-bold text-indigo-600">{rawAngles.alpha}°</span></p>
        <p className="text-lg">Y: <span className="font-bold text-indigo-600">{rawAngles.beta}°</span></p>
      </div>
      <p className="text-[10px] text-gray-400">Please check that the address is HTTPS to enable the sensor</p>
    </div>
    </div>
  );
};

export default ControllerView;