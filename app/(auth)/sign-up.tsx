import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { useUserStore } from '../../src/store/userStore';

export default function SignUpScreen() {
    const { t } = useTranslation();
    const { theme, isDark } = useTheme();
    const { register, isLoading } = useUserStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

    const validateForm = () => {
        const errors: { email?: string; password?: string; confirmPassword?: string } = {};

        if (!email.trim()) {
            errors.email = t('errors.required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = t('errors.invalidEmail');
        }

        if (!password) {
            errors.password = t('errors.required');
        } else if (password.length < 8) {
            errors.password = t('errors.passwordMin');
        }

        if (!confirmPassword) {
            errors.confirmPassword = t('errors.required');
        } else if (password !== confirmPassword) {
            errors.confirmPassword = t('errors.passwordMatch');
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSignUp = async () => {
        setError('');

        if (!validateForm()) return;

        const result = await register(email, password);

        if (result.success) {
            Alert.alert(
                'Check Your Email',
                'We sent you a confirmation email. Please verify your email address to complete registration.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(auth)/sign-in' as any),
                    },
                ]
            );
        } else {
            setError(result.error || t('errors.generic'));
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: theme.bg.primary }}
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    padding: 24,
                }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={{ marginBottom: 36, alignItems: 'center' }}>
                    <View style={{
                        width: 80,
                        height: 80,
                        borderRadius: 24,
                        backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                    }}>
                        <Text style={{ fontSize: 40 }}>🧟</Text>
                    </View>
                    <Text
                        style={{
                            fontSize: 30,
                            fontWeight: '800',
                            color: theme.text.primary,
                            marginBottom: 8,
                            letterSpacing: -0.5,
                        }}
                    >
                        {t('auth.signUp.title')}
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: theme.text.secondary,
                            textAlign: 'center',
                        }}
                    >
                        {t('auth.signUp.subtitle')}
                    </Text>
                </View>

                {/* Error Alert */}
                {error ? (
                    <View
                        style={{
                            backgroundColor: `${theme.status.danger}15`,
                            borderWidth: 1,
                            borderColor: `${theme.status.danger}40`,
                            borderRadius: 14,
                            padding: 14,
                            marginBottom: 20,
                        }}
                    >
                        <Text style={{ color: theme.status.danger, textAlign: 'center', fontWeight: '500' }}>
                            {error}
                        </Text>
                    </View>
                ) : null}

                {/* Form Card */}
                <Card variant="elevated" style={{ marginBottom: 24 }}>
                    <Input
                        label={t('auth.signUp.email')}
                        placeholder="you@example.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        error={fieldErrors.email}
                    />

                    <View style={{ marginTop: 8 }}>
                        <Input
                            label={t('auth.signUp.password')}
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoComplete="new-password"
                            error={fieldErrors.password}
                        />
                    </View>

                    <View style={{ marginTop: 8 }}>
                        <Input
                            label={t('auth.signUp.confirmPassword')}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            autoComplete="new-password"
                            error={fieldErrors.confirmPassword}
                        />
                    </View>
                </Card>

                {/* Sign Up Button */}
                <Button
                    onPress={handleSignUp}
                    isLoading={isLoading}
                    fullWidth
                    size="lg"
                >
                    {t('auth.signUp.button')}
                </Button>

                {/* Sign In Link */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 28,
                    }}
                >
                    <Text style={{ color: theme.text.secondary, fontSize: 15 }}>
                        {t('auth.signUp.hasAccount')}{' '}
                    </Text>
                    <Link href={'/(auth)/sign-in' as any} asChild>
                        <TouchableOpacity>
                            <Text
                                style={{
                                    color: theme.text.brand,
                                    fontSize: 15,
                                    fontWeight: '700',
                                }}
                            >
                                {t('auth.signUp.signIn')}
                            </Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                {/* Skip to app (guest mode) */}
                <TouchableOpacity
                    onPress={() => router.replace('/(tabs)')}
                    style={{
                        marginTop: 40,
                        alignItems: 'center',
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        borderRadius: 12,
                        alignSelf: 'center',
                    }}
                >
                    <Text style={{ color: theme.text.tertiary, fontSize: 14, fontWeight: '500' }}>
                        Continue without account →
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
