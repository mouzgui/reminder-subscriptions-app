import React, { useState } from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import { useTheme } from '../../theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function Input({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    style,
    ...props
}: InputProps) {
    const { theme, isDark } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const borderColor = error
        ? theme.status.danger
        : isFocused
            ? theme.border.focus
            : theme.border.default;

    const backgroundColor = isFocused
        ? isDark ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.03)'
        : theme.bg.card;

    return (
        <View style={{ marginBottom: 16 }}>
            {label && (
                <Text
                    style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: isFocused ? theme.text.brand : theme.text.secondary,
                        marginBottom: 8,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                    }}
                >
                    {label}
                </Text>
            )}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor,
                    borderWidth: isFocused ? 2 : 1,
                    borderColor,
                    borderRadius: 14,
                    paddingHorizontal: 14,
                    shadowColor: isFocused ? theme.border.focus : 'transparent',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: isFocused ? 0.2 : 0,
                    shadowRadius: 8,
                }}
            >
                {leftIcon && <View style={{ marginRight: 10 }}>{leftIcon}</View>}
                <TextInput
                    style={[
                        {
                            flex: 1,
                            paddingVertical: 14,
                            fontSize: 16,
                            color: theme.text.primary,
                            fontWeight: '500',
                        },
                        style,
                    ]}
                    placeholderTextColor={theme.text.tertiary}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    selectionColor={theme.interactive.primary}
                    {...props}
                />
                {rightIcon && <View style={{ marginLeft: 10 }}>{rightIcon}</View>}
            </View>
            {error && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                    <Text style={{ fontSize: 12, marginRight: 4 }}>⚠️</Text>
                    <Text
                        style={{
                            fontSize: 13,
                            color: theme.status.danger,
                            fontWeight: '500',
                        }}
                    >
                        {error}
                    </Text>
                </View>
            )}
            {hint && !error && (
                <Text
                    style={{
                        fontSize: 12,
                        color: theme.text.tertiary,
                        marginTop: 6,
                    }}
                >
                    {hint}
                </Text>
            )}
        </View>
    );
}
