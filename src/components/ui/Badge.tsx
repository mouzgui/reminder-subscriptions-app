import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default' | 'brand' | 'primary';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
    variant?: BadgeVariant;
    size?: BadgeSize;
    children: React.ReactNode;
    style?: ViewStyle;
}

export function Badge({ variant = 'default', size = 'md', children, style }: BadgeProps) {
    const { theme, isDark } = useTheme();

    const getVariantStyles = () => {
        // Use more vibrant, modern colors with better opacity
        const opacity = isDark ? '30' : '18';

        switch (variant) {
            case 'success':
                return {
                    backgroundColor: `${theme.status.success}${opacity}`,
                    textColor: theme.status.success,
                    borderColor: `${theme.status.success}40`,
                };
            case 'warning':
                return {
                    backgroundColor: `${theme.status.warning}${opacity}`,
                    textColor: theme.status.warning,
                    borderColor: `${theme.status.warning}40`,
                };
            case 'danger':
                return {
                    backgroundColor: `${theme.status.danger}${opacity}`,
                    textColor: theme.status.danger,
                    borderColor: `${theme.status.danger}40`,
                };
            case 'info':
                return {
                    backgroundColor: `${theme.status.info}${opacity}`,
                    textColor: theme.status.info,
                    borderColor: `${theme.status.info}40`,
                };
            case 'brand':
                return {
                    backgroundColor: `${theme.interactive.primary}${opacity}`,
                    textColor: theme.text.brand,
                    borderColor: `${theme.interactive.primary}40`,
                };
            case 'primary':
                return {
                    backgroundColor: theme.interactive.primary,
                    textColor: '#FFFFFF',
                    borderColor: theme.interactive.primary,
                };
            default:
                return {
                    backgroundColor: theme.bg.tertiary,
                    textColor: theme.text.secondary,
                    borderColor: theme.border.default,
                };
        }
    };

    const sizeStyles = {
        sm: { paddingHorizontal: 8, paddingVertical: 3, fontSize: 10, borderRadius: 6 },
        md: { paddingHorizontal: 12, paddingVertical: 5, fontSize: 12, borderRadius: 8 },
        lg: { paddingHorizontal: 16, paddingVertical: 7, fontSize: 14, borderRadius: 10 },
    };

    const variantStyles = getVariantStyles();
    const currentSize = sizeStyles[size];

    return (
        <View
            style={[{
                backgroundColor: variantStyles.backgroundColor,
                paddingHorizontal: currentSize.paddingHorizontal,
                paddingVertical: currentSize.paddingVertical,
                borderRadius: currentSize.borderRadius,
                borderWidth: 1,
                borderColor: variantStyles.borderColor,
                alignSelf: 'flex-start',
            }, style]}
        >
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
        </View>
    );
}
