// src/styles/theme.js
export const theme = {
    colors: {
      primary: '#6366f1',    // 靛藍色 (Slider & 數值)
      success: '#4ade80',    // 綠色 (FPS 燈)
      error: '#ff4d4d',      // 紅色
      grid: '#e5e7eb',       // 網格線顏色
      textMain: '#333333',
      textSub: '#888888',
      textLight: '#666666',
      textFooter: '#bbbbbb',
      background: '#ffffff',
      dot: '#6366f1'         // 藍點顏色
    },
    glass: {
      // 💡 調整 A 值到 0.35，這才是「透」的黃金比例
      white: 'rgba(255, 255, 255, 0.35)', 
      blur: '20px',
      saturate: '150%',
      border: '1px solid rgba(255, 255, 255, 0.6)',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
      // DebugConsole 專用
      debugBg: 'rgba(255, 255, 255, 0.9)',
      debugBorder: 'rgba(255, 255, 255, 0.8)',
      debugShadow: `
        0 10px 40px rgba(0, 0, 0, 0.04),
        inset 0 0 20px rgba(255, 255, 255, 0.5)
      `
    },
    layout: {
      borderRadius: '24px',
      borderRadiusLarge: '30px',
      panelWidth: '260px',
      debugPanelWidth: '240px',
      debugPanelPadding: '20px'
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontMono: 'monospace',
      fontSize: {
        small: '9px',
        sub: '11px',
        base: '12px',
        medium: '14px'
      }
    },
    spacing: {
      sectionMargin: '20px',
      sectionPadding: '12px',
      controlMargin: '14px',
      labelMargin: '6px'
    }
  };