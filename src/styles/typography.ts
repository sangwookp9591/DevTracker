import { Platform } from 'react-native';

const fontFamily = {
  regular: Platform.select({
    ios: 'San Francisco',
    android: 'Roboto',
  }),
  medium: Platform.select({
    ios: 'San Francisco Medium',
    android: 'Roboto Medium',
  }),
  bold: Platform.select({
    ios: 'San Francisco Bold',
    android: 'Roboto Bold',
  }),
};

export const typography = {
  fontFamily,
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 42,
    '4xl': 48,
  },

  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  heading1: {
    fontSize: 30,
    lineHeight: 42,
    fontWeight: '700' as const,
    fontFamily: fontFamily.bold,
  },

  heading2: {
    fontSize: 24,
    lineHeight: 36,
    fontWeight: '600' as const,
    fontFamily: fontFamily.medium,
  },

  heading3: {
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '600' as const,
    fontFamily: fontFamily.medium,
  },

  heading4: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '500' as const,
    fontFamily: fontFamily.medium,
  },

  body1: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
    fontFamily: fontFamily.regular,
  },

  body2: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
    fontFamily: fontFamily.regular,
  },

  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    fontFamily: fontFamily.regular,
  },

  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
    fontFamily: fontFamily.medium,
  },
};
