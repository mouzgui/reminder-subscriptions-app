import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { useUserStore } from '../../src/store/userStore';

export default function SignInScreen() {
    const { t } = useTranslation();
    const { theme, isDark } = useTheme();
    const { login, isLoading } = useUserStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

    const validateForm = () => {
        const errors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            errors.email = t('errors.required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = t('errors.invalidEmail');
        }

        if (!password) {
            errors.password = t('errors.required');
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSignIn = async () => {
        setError('');

        if (!validateForm()) return;

        const result = await login(email, password);

        if (result.success) {
            router.replace('/(tabs)');
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
                        {t('auth.signIn.title')}
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: theme.text.secondary,
                            textAlign: 'center',
                        }}
                    >
                        {t('auth.signIn.subtitle')}
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
                        label={t('auth.signIn.email')}
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
                            label={t('auth.signIn.password')}
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoComplete="password"
                            error={fieldErrors.password}
                        />
                    </View>

                    <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 4 }}>
                        <Text style={{ color: theme.text.brand, fontSize: 14, fontWeight: '600' }}>
                            {t('auth.signIn.forgotPassword')}
                        </Text>
                    </TouchableOpacity>
                </Card>

                {/* Sign In Button */}
                <Button
                    onPress={handleSignIn}
                    isLoading={isLoading}
                    fullWidth
                    size="lg"
                >
                    {t('auth.signIn.button')}
                </Button>

                {/* Sign Up Link */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 28,
                    }}
                >
                    <Text style={{ color: theme.text.secondary, fontSize: 15 }}>
                        {t('auth.signIn.noAccount')}{' '}
                    </Text>
                    <Link href={'/(auth)/sign-up' as any} asChild>
                        <TouchableOpacity>
                            <Text
                                style={{
                                    color: theme.text.brand,
                                    fontSize: 15,
                                    fontWeight: '700',
                                }}
                            >
                                {t('auth.signIn.signUp')}
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
