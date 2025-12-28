import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
    fullWidth?: boolean;
}

export function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    fullWidth = false,
    disabled,
    style,
    ...props
}: ButtonProps) {
    const { theme, isDark } = useTheme();

    // Size styles - more spacious
    const sizeStyles = {
        sm: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 14, borderRadius: 12 },
        md: { paddingVertical: 14, paddingHorizontal: 20, fontSize: 16, borderRadius: 14 },
        lg: { paddingVertical: 18, paddingHorizontal: 28, fontSize: 18, borderRadius: 16 },
    };

    // Variant styles with premium shadows
    const getVariantStyles = () => {
        const primaryShadow = {
            shadowColor: theme.interactive.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
        };

        const accentShadow = {
            shadowColor: theme.interactive.accent,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
        };

        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: theme.interactive.primary,
                    textColor: '#ffffff',
                    ...primaryShadow,
                };
            case 'accent':
                return {
                    backgroundColor: theme.interactive.accent,
                    textColor: '#ffffff',
                    ...accentShadow,
                };
            case 'secondary':
                return {
                    backgroundColor: theme.interactive.secondary,
                    textColor: theme.text.primary,
                    borderWidth: 1,
                    borderColor: theme.border.default,
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    textColor: theme.interactive.primary,
                    borderWidth: 2,
                    borderColor: theme.interactive.primary,
                };
            case 'danger':
                return {
                    backgroundColor: theme.status.danger,
                    textColor: '#ffffff',
                    shadowColor: theme.status.danger,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    elevation: 4,
                };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                    textColor: theme.text.secondary,
                };
            default:
                return {
                    backgroundColor: theme.interactive.primary,
                    textColor: '#ffffff',
                };
        }
    };

    const variantStyles = getVariantStyles();
    const currentSize = sizeStyles[size];

    return (
        <TouchableOpacity
            disabled={disabled || isLoading}
            activeOpacity={0.8}
            style={[
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: currentSize.borderRadius,
                    paddingVertical: currentSize.paddingVertical,
                    paddingHorizontal: currentSize.paddingHorizontal,
                    backgroundColor: variantStyles.backgroundColor,
                    borderWidth: variantStyles.borderWidth || 0,
                    borderColor: variantStyles.borderColor,
                    opacity: disabled || isLoading ? 0.5 : 1,
                    width: fullWidth ? '100%' : undefined,
                    ...('shadowColor' in variantStyles && {
                        shadowColor: variantStyles.shadowColor,
                        shadowOffset: variantStyles.shadowOffset,
                        shadowOpacity: variantStyles.shadowOpacity,
                        shadowRadius: variantStyles.shadowRadius,
                        elevation: variantStyles.elevation,
                    }),
                },
                style,
            ]}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color={variantStyles.textColor} size="small" />
            ) : (
                <>
                    {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
                    <Text
                        style={{
                            color: variantStyles.textColor,
                            fontSize: currentSize.fontSize,
                            fontWeight: '700',
                            letterSpacing: 0.3,
                        }}
                    >
                        {children}
                    </Text>
                    {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
                </>
            )}
        </TouchableOpacity>
    );
}
