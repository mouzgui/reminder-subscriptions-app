import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../../theme';
import { shadows } from '../../theme/spacing';

interface CardProps extends ViewProps {
    variant?: 'default' | 'elevated' | 'outlined';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export function Card({
    variant = 'default',
    padding = 'md',
    children,
    style,
    ...props
}: CardProps) {
    const { theme } = useTheme();

    const paddingValues = {
        none: 0,
        sm: 12,
        md: 16,
        lg: 24,
    };

    const getVariantStyles = () => {
        switch (variant) {
            case 'elevated':
                return {
                    backgroundColor: theme.bg.secondary,
                    ...shadows.md,
                };
            case 'outlined':
                return {
                    backgroundColor: theme.bg.secondary,
                    borderWidth: 1,
                    borderColor: theme.border.default,
                };
            default:
                return {
                    backgroundColor: theme.bg.secondary,
                    ...shadows.sm,
                };
        }
    };

    return (
        <View
            style={[
                {
                    borderRadius: 16,
                    padding: paddingValues[padding],
                    ...getVariantStyles(),
                },
                style,
            ]}
            {...props}
        >
            {children}
        </View>
    );
}
