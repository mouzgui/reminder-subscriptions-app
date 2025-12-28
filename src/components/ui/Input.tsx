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
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const borderColor = error
        ? theme.status.danger
        : isFocused
            ? theme.border.focus
            : theme.border.default;

    return (
        <View style={{ marginBottom: 16 }}>
            {label && (
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: theme.text.secondary,
                        marginBottom: 6,
                    }}
                >
                    {label}
                </Text>
            )}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: theme.bg.secondary,
                    borderWidth: 1.5,
                    borderColor,
                    borderRadius: 10,
                    paddingHorizontal: 12,
                }}
            >
                {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
                <TextInput
                    style={[
                        {
                            flex: 1,
                            paddingVertical: 12,
                            fontSize: 16,
                            color: theme.text.primary,
                        },
                        style,
                    ]}
                    placeholderTextColor={theme.text.tertiary}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
            </View>
            {error && (
                <Text
                    style={{
                        fontSize: 12,
                        color: theme.status.danger,
                        marginTop: 4,
                    }}
                >
                    {error}
                </Text>
            )}
            {hint && !error && (
                <Text
                    style={{
                        fontSize: 12,
                        color: theme.text.tertiary,
                        marginTop: 4,
                    }}
                >
                    {hint}
                </Text>
            )}
        </View>
    );
}
