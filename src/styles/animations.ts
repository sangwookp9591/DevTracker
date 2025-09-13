export const animations = {
  // Apple standard timing functions
  timing: {
    // iOS standard curves
    easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
    easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
    easeIn: 'cubic-bezier(0.4, 0.0, 1.0, 1.0)',

    // iOS spring animations
    spring: {
      damping: 0.8,
      stiffness: 100,
      mass: 1,
    },
  },

  // Duration following Apple guidelines
  duration: {
    instant: 0,
    fast: 200, // Quick interactions
    normal: 300, // Default
    slow: 500, // Page transitions
    slower: 700, // Complex animations
  },

  // Common animations
  fadeIn: {
    opacity: 1,
    duration: 300,
  },

  slideUp: {
    transform: [{ translateY: 0 }],
    duration: 400,
  },

  scaleIn: {
    transform: [{ scale: 1 }],
    duration: 200,
  },
};
