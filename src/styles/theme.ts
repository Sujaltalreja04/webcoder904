export const theme = {
  colors: {
    primaryBlack: '#0a0a0a',
    charcoalGrey: '#1a1a1a',
    steelSilver: '#c0c0c0',
    darkGrey: '#2a2a2a',
    lightGrey: '#404040',
    accentGlow: '#808080',
  },
  gradients: {
    metallic: 'linear-gradient(135deg, #404040 0%, #808080 50%, #a0a0a0 100%)',
    metallicAlt: 'linear-gradient(90deg, #606060 0%, #909090 50%, #b0b0b0 100%)',
    dark: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
  },
  glassmorphism: {
    background: 'rgba(26, 26, 26, 0.7)',
    border: 'rgba(192, 192, 192, 0.2)',
    backdropBlur: 'blur(10px)',
  },
  shadows: {
    glow: '0 0 20px rgba(192, 192, 192, 0.3)',
    glowStrong: '0 0 30px rgba(192, 192, 192, 0.5)',
    depth: '0 10px 40px rgba(0, 0, 0, 0.5)',
  },
  animations: {
    spring: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
    smooth: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

export type Theme = typeof theme;
