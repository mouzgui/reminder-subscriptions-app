import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../../theme';

interface CardProps extends ViewProps {
    variant?: 'default' | 'elevated' | 'outlined' | 'glass';
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
    const { theme, isDark } = useTheme();

    const paddingValues = {
        none: 0,
        sm: 12,
        md: 16,
        lg: 24,
    };

    const getVariantStyles = () => {
        const baseShadow = isDark
            ? {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 24,
                elevation: 8,
            }
            : {
                shadowColor: '#8b5cf6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 16,
                elevation: 4,
            };

        switch (variant) {
            case 'elevated':
                return {
                    backgroundColor: theme.bg.card,
                    borderWidth: 1,
                    borderColor: theme.border.default,
                    ...baseShadow,
                    shadowOpacity: isDark ? 0.5 : 0.12,
                };
            case 'glass':
                return {
                    backgroundColor: theme.bg.card,
                    borderWidth: 1,
                    borderColor: theme.border.subtle,
                    ...baseShadow,
                };
            case 'outlined':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderColor: theme.border.default,
                };
            default:
                return {
                    backgroundColor: theme.bg.card,
                    borderWidth: 1,
                    borderColor: theme.border.default,
                    ...baseShadow,
                };
        }
    };

    return (
        <View
            style={[
                {
                    borderRadius: 20,
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
