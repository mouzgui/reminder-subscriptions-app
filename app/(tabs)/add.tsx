import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme';
import { Button, Card, Input } from '../../src/components/ui';
import { CURRENCIES, CurrencyCode } from '../../src/utils/currency';
import { useSettingsStore } from '../../src/store/settingsStore';
import { useSubscriptionStore } from '../../src/store/subscriptionStore';
import { useUserStore } from '../../src/store/userStore';
import { hasReachedSubscriptionLimit } from '../../src/constants/tiers';
import { SubscriptionCategory } from '../../src/types/subscription';
import { router } from 'expo-router';

const CATEGORIES = [
    { id: 'streaming', emoji: '📺', label: 'Streaming' },
    { id: 'productivity', emoji: '⚡', label: 'Productivity' },
    { id: 'cloud', emoji: '☁️', label: 'Cloud' },
    { id: 'design', emoji: '🎨', label: 'Design' },
    { id: 'development', emoji: '💻', label: 'Development' },
    { id: 'finance', emoji: '💰', label: 'Finance' },
    { id: 'other', emoji: '📦', label: 'Other' },
];

export default function AddSubscriptionScreen() {
    const { theme, isDark } = useTheme();
    const { t } = useTranslation();
    const { currency: defaultCurrency, isPro } = useSettingsStore();
    const isAuthenticated = useUserStore(state => state.isAuthenticated);

    // Get subscription store actions
    const subscriptions = useSubscriptionStore(state => state.subscriptions);
    const addLocalSubscription = useSubscriptionStore(state => state.addLocalSubscription);
    const addSubscription = useSubscriptionStore(state => state.addSubscription);
    const isLoading = useSubscriptionStore(state => state.isLoading);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState<CurrencyCode>(defaultCurrency);
    const [category, setCategory] = useState('');
    const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

    // Check if user can add more subscriptions
    const currentCount = subscriptions.length;
    const isLimited = hasReachedSubscriptionLimit(currentCount, isPro);

    const handleSubmit = async () => {
        if (!name.trim()) {
            Alert.alert(t('errors.required'), t('subscription.add.namePlaceholder'));
            return;
        }
        if (!price || parseFloat(price) <= 0) {
            Alert.alert(t('errors.required'), t('subscription.add.pricePlaceholder'));
            return;
        }

        // Calculate renewal date (30 days from now)
        const renewalDate = new Date();
        renewalDate.setDate(renewalDate.getDate() + 30);

        const subscriptionData = {
            name: name.trim(),
            price: parseFloat(price),
            currency,
            renewal_date: renewalDate.toISOString().split('T')[0],
            category: (category || 'other') as SubscriptionCategory,
        };

        try {
            // Use Supabase if authenticated, otherwise local storage
            if (isAuthenticated) {
                const result = await addSubscription(subscriptionData);
                if (!result) {
                    // Get the error from store
                    const storeError = useSubscriptionStore.getState().error;
                    Alert.alert(
                        t('common.error'),
                        storeError || 'Failed to add subscription. Please check your database setup.'
                    );
                    return;
                }
            } else {
                addLocalSubscription(subscriptionData);
            }

            // Show success and navigate back
            Alert.alert(
                t('common.success'),
                `Added ${name} - ${CURRENCIES[currency].symbol}${price}/mo`,
                [{ text: t('common.ok'), onPress: () => router.replace('/') }]
            );
        } catch (error: any) {
            Alert.alert(t('common.error'), error.message || 'An unexpected error occurred');
        }
    };

    if (isLimited) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg.primary }}>
                <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
                    <Card variant="glass" style={{ alignItems: 'center', padding: 40 }}>
                        <View style={{
                            width: 80,
                            height: 80,
                            borderRadius: 24,
                            backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 20,
                        }}>
                            <Text style={{ fontSize: 36 }}>🔒</Text>
                        </View>
                        <Text style={{
                            fontSize: 22,
                            fontWeight: '700',
                            color: theme.text.primary,
                            marginBottom: 8,
                            textAlign: 'center',
                            letterSpacing: -0.3,
                        }}>
                            {t('paywall.title')}
                        </Text>
                        <Text style={{
                            fontSize: 15,
                            color: theme.text.secondary,
                            textAlign: 'center',
                            marginBottom: 28,
                            lineHeight: 22,
                        }}>
                            {t('paywall.message')}
                        </Text>
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onPress={() => router.push('/paywall' as any)}
                        >
                            {t('paywall.upgrade')}
                        </Button>
                    </Card>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg.primary }}>
            <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 24 }}>
                {/* Header */}
                <View style={{ marginBottom: 28 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.text.tertiary,
                        marginBottom: 4,
                        textTransform: 'uppercase',
                        letterSpacing: 1.2,
                    }}>
                        {t('tabs.add')}
                    </Text>
                    <Text style={{
                        fontSize: 32,
                        fontWeight: '800',
                        color: theme.text.primary,
                        letterSpacing: -0.5,
                    }}>
                        ➕ {t('subscription.add.title')}
                    </Text>
                </View>

                {/* Form Card */}
                <Card variant="elevated" style={{ marginBottom: 20 }}>
                    <Input
                        label={t('subscription.add.namePlaceholder')}
                        placeholder="Netflix, Spotify, Figma..."
                        value={name}
                        onChangeText={setName}
                    />

                    {/* Price + Currency Row */}
                    <View style={{ flexDirection: 'row', gap: 14, marginTop: 8 }}>
                        <View style={{ flex: 2 }}>
                            <Input
                                label={t('subscription.add.pricePlaceholder')}
                                placeholder="9.99"
                                keyboardType="decimal-pad"
                                value={price}
                                onChangeText={setPrice}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: theme.text.secondary,
                                marginBottom: 8,
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                            }}>
                                Currency
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: theme.bg.card,
                                    borderWidth: 1,
                                    borderColor: theme.border.default,
                                    borderRadius: 14,
                                    paddingVertical: 14,
                                    paddingHorizontal: 14,
                                    justifyContent: 'center',
                                }}
                            >
                                <Text style={{ fontSize: 16, color: theme.text.primary, fontWeight: '600' }}>
                                    {CURRENCIES[currency].flag} {currency}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Currency Picker */}
                    {showCurrencyPicker && (
                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                            {Object.entries(CURRENCIES).map(([code, curr]) => (
                                <TouchableOpacity
                                    key={code}
                                    onPress={() => {
                                        setCurrency(code as CurrencyCode);
                                        setShowCurrencyPicker(false);
                                    }}
                                    style={{
                                        flex: 1,
                                        backgroundColor: currency === code
                                            ? theme.interactive.primary
                                            : isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.06)',
                                        padding: 14,
                                        borderRadius: 14,
                                        alignItems: 'center',
                                        borderWidth: currency === code ? 0 : 1,
                                        borderColor: theme.border.subtle,
                                    }}
                                >
                                    <Text style={{ fontSize: 22, marginBottom: 4 }}>{curr.flag}</Text>
                                    <Text style={{
                                        fontSize: 12,
                                        fontWeight: '700',
                                        color: currency === code ? '#ffffff' : theme.text.brand,
                                        letterSpacing: 0.3,
                                    }}>
                                        {code}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </Card>

                {/* Category Selection */}
                <Card variant="elevated" style={{ marginBottom: 28 }}>
                    <Text style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: theme.text.secondary,
                        marginBottom: 14,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                    }}>
                        {t('subscription.add.category')}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => setCategory(cat.id)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: category === cat.id
                                        ? theme.interactive.primary
                                        : isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.06)',
                                    paddingVertical: 10,
                                    paddingHorizontal: 14,
                                    borderRadius: 14,
                                    gap: 8,
                                    borderWidth: category === cat.id ? 0 : 1,
                                    borderColor: theme.border.subtle,
                                }}
                            >
                                <Text style={{ fontSize: 16 }}>{cat.emoji}</Text>
                                <Text style={{
                                    fontSize: 14,
                                    color: category === cat.id ? '#ffffff' : theme.text.brand,
                                    fontWeight: '600',
                                    letterSpacing: 0.2,
                                }}>
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Card>

                {/* Submit Button */}
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onPress={handleSubmit}
                    isLoading={isLoading}
                >
                    {t('common.add')} {name || 'Subscription'}
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}
