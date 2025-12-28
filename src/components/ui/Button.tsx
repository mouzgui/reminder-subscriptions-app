import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
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

    // Size styles
    const sizeStyles = {
        sm: { paddingVertical: 8, paddingHorizontal: 12, fontSize: 14 },
        md: { paddingVertical: 12, paddingHorizontal: 16, fontSize: 16 },
        lg: { paddingVertical: 16, paddingHorizontal: 24, fontSize: 18 },
    };

    // Variant styles
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: theme.interactive.primary,
                    textColor: '#ffffff',
                };
            case 'secondary':
                return {
                    backgroundColor: theme.interactive.secondary,
                    textColor: theme.text.primary,
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
            style={[
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    paddingVertical: currentSize.paddingVertical,
                    paddingHorizontal: currentSize.paddingHorizontal,
                    backgroundColor: variantStyles.backgroundColor,
                    borderWidth: variantStyles.borderWidth || 0,
                    borderColor: variantStyles.borderColor,
                    opacity: disabled || isLoading ? 0.5 : 1,
                    width: fullWidth ? '100%' : undefined,
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
                            fontWeight: '600',
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
