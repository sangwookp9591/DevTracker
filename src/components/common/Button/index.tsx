import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/styles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: any = [styles.button, styles[`button_${size}`]];

    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryButton);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryButton);
        break;
      case 'outline':
        baseStyle.push(styles.outlineButton);
        break;
      case 'text':
        baseStyle.push(styles.textButton);
        break;
    }

    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    }

    return StyleSheet.flatten([baseStyle, style]) as ViewStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: any = [styles.buttonText, styles[`buttonText_${size}`]];

    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryButtonText);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryButtonText);
        break;
      case 'outline':
        baseStyle.push(styles.outlineButtonText);
        break;
      case 'text':
        baseStyle.push(styles.textButtonText);
        break;
    }

    if (disabled || loading) {
      baseStyle.push(styles.disabledButtonText);
    }

    return StyleSheet.flatten([baseStyle, textStyle]);
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.textInverse : colors.primary}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  // Sizes
  button_sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 32,
  },
  button_md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  button_lg: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 52,
  },

  // Variants
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  textButton: {
    backgroundColor: 'transparent',
  },

  disabledButton: {
    backgroundColor: colors.backgroundTertiary,
    borderColor: colors.border,
  },

  // Text Styles
  buttonText: {
    ...typography.button,
    textAlign: 'center',
  },
  buttonText_sm: {
    fontSize: typography.fontSize.sm,
  },
  buttonText_md: {
    fontSize: typography.fontSize.base,
  },
  buttonText_lg: {
    fontSize: typography.fontSize.lg,
  },

  primaryButtonText: {
    color: colors.textInverse,
  },
  secondaryButtonText: {
    color: colors.textInverse,
  },
  outlineButtonText: {
    color: colors.primary,
  },
  textButtonText: {
    color: colors.primary,
  },
  disabledButtonText: {
    color: colors.textLight,
  },
});

export default Button;
