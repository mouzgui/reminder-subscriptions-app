import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
    variant?: BadgeVariant;
    size?: BadgeSize;
    children: React.ReactNode;
}

export function Badge({ variant = 'default', size = 'md', children }: BadgeProps) {
    const { theme } = useTheme();

    const getVariantStyles = () => {
        switch (variant) {
            case 'success':
                return {
                    backgroundColor: theme.status.success + '20',
                    textColor: theme.status.success,
                };
            case 'warning':
                return {
                    backgroundColor: theme.status.warning + '20',
                    textColor: theme.status.warning,
                };
            case 'danger':
                return {
                    backgroundColor: theme.status.danger + '20',
                    textColor: theme.status.danger,
                };
            case 'info':
                return {
                    backgroundColor: theme.status.info + '20',
                    textColor: theme.status.info,
                };
            default:
                return {
                    backgroundColor: theme.bg.tertiary,
                    textColor: theme.text.secondary,
                };
        }
    };

    const sizeStyles = {
        sm: { paddingHorizontal: 8, paddingVertical: 2, fontSize: 10 },
        md: { paddingHorizontal: 10, paddingVertical: 4, fontSize: 12 },
    };

    const variantStyles = getVariantStyles();
    const currentSize = sizeStyles[size];

    return (
        <View
            style={{
                backgroundColor: variantStyles.backgroundColor,
                paddingHorizontal: currentSize.paddingHorizontal,
                paddingVertical: currentSize.paddingVertical,
                borderRadius: 9999,
                alignSelf: 'flex-start',
            }}
        >
            <Text
                style={{
                    color: variantStyles.textColor,
                    fontSize: currentSize.fontSize,
                    fontWeight: '600',
                }}
            >
                {children}
            </Text>
        </View>
    );
}
