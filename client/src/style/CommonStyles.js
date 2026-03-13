// src/Style/CommonStyles.js
import { theme } from './theme.js';

// ========== DebugConsole 樣式 ==========
export const debugPanelStyle = {
  position: 'absolute',
  top: '80px',
  left: '20px',
  width: theme.layout.debugPanelWidth,
  padding: theme.layout.debugPanelPadding,
  backgroundColor: theme.glass.debugBg,
  borderRadius: theme.layout.borderRadiusLarge,
  border: `1px solid ${theme.glass.debugBorder}`,
  boxShadow: theme.glass.debugShadow,
  zIndex: 1000,
  fontFamily: theme.typography.fontFamily,
  filter: 'url(#gooey-filter)',
};

export const sectionStyle = {
  marginBottom: theme.spacing.sectionMargin,
  paddingBottom: theme.spacing.sectionPadding,
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
};

export const fpsRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: theme.typography.fontSize.medium,
};

export const dotStyle = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  transition: 'background-color 0.3s ease',
};

export const subTextStyle = {
  fontSize: theme.typography.fontSize.sub,
  color: theme.colors.textSub,
  marginLeft: '18px',
  marginTop: '4px',
};

export const controlGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
};

export const labelRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: theme.typography.fontSize.base,
  color: theme.colors.textLight,
  marginBottom: theme.spacing.labelMargin,
};

export const valueStyle = {
  color: theme.colors.primary,
  fontWeight: '700',
  fontFamily: theme.typography.fontMono,
};

export const sliderStyle = {
  width: '100%',
  cursor: 'pointer',
  accentColor: theme.colors.primary,
  height: '4px',
};

export const footerStyle = {
  fontSize: theme.typography.fontSize.small,
  color: theme.colors.textFooter,
  textAlign: 'center',
  letterSpacing: '1px',
  marginTop: '4px',
  fontWeight: '500',
};

// ========== DisplayView 樣式 ==========
export const containerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: theme.colors.background,
  zIndex: 10,
  overflow: 'hidden'
};

export const backButtonStyle = {
  position: 'absolute',
  top: '16px',
  left: '16px',
  zIndex: 20,
};

export const gridStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundImage: `linear-gradient(${theme.colors.grid} 1px, transparent 1px), linear-gradient(90deg, ${theme.colors.grid} 1px, transparent 1px)`,
  backgroundSize: '40px 40px',
  opacity: 0.8
};

export const dotBaseStyle = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: '24px',
  height: '24px',
  marginLeft: '-12px',
  marginTop: '-12px',
  backgroundColor: theme.colors.dot,
  borderRadius: '50%',
  zIndex: 5,
  willChange: 'transform'
};

export const standbyTextStyle = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  color: '#444',
  fontSize: theme.typography.fontSize.medium,
  letterSpacing: '2px',
  fontFamily: theme.typography.fontMono
};

// ========== 通用樣式 ==========
export const glassPanelStyle = {
  backgroundColor: theme.glass.white,
  backdropFilter: `blur(${theme.glass.blur}) saturate(${theme.glass.saturate})`,
  WebkitBackdropFilter: `blur(${theme.glass.blur}) saturate(${theme.glass.saturate})`,
  border: theme.glass.border,
  boxShadow: theme.glass.shadow,
  borderRadius: theme.layout.borderRadius,
  zIndex: 1000,
};

export const centerFlex = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};