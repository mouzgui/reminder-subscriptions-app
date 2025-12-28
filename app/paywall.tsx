import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../src/theme';
import { Button, Card } from '../src/components/ui';
import { useSettingsStore } from '../src/store/settingsStore';
import { PRO_PRICE, FREE_TIER, PRO_TIER } from '../src/constants/tiers';

const FEATURES = [
    { key: 'subscriptions', free: '3 max', pro: 'Unlimited', icon: '📋' },
    { key: 'reminders', free: '❌', pro: '✅', icon: '🔔' },
    { key: 'languages', free: 'English only', pro: 'EN, FR, AR', icon: '🌍' },
    { key: 'currencies', free: 'USD only', pro: 'USD, EUR, MAD', icon: '💱' },
    { key: 'export', free: '❌', pro: 'CSV Export', icon: '📤' },
];

export default function PaywallScreen() {
    const { theme, isDark } = useTheme();
    const { t } = useTranslation();
    const { isPro, setIsPro } = useSettingsStore();
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
    const [isLoading, setIsLoading] = useState(false);

    const price = billingPeriod === 'monthly'
        ? PRO_PRICE.monthly
        : PRO_PRICE.yearly;

    const savingsPercent = Math.round((1 - PRO_PRICE.yearly / (PRO_PRICE.monthly * 12)) * 100);

    const handlePurchase = async () => {
        setIsLoading(true);

        // Mock purchase - in real app, integrate RevenueCat here
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsPro(true);
        setIsLoading(false);

        Alert.alert(
            '🎉 Welcome to Pro!',
            'All Pro features are now unlocked.',
            [{ text: 'Awesome!', onPress: () => router.back() }]
        );
    };

    const handleRestore = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);

        Alert.alert(
            'No Purchase Found',
            'We couldn\'t find a previous purchase. Please try again or contact support.'
        );
    };

    // Already Pro - show thank you screen
    if (isPro) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg.primary }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
                    <View style={{
                        width: 100,
                        height: 100,
                        borderRadius: 30,
                        backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 24,
                    }}>
                        <Text style={{ fontSize: 50 }}>👑</Text>
                    </View>
                    <Text style={{
                        fontSize: 30,
                        fontWeight: '800',
                        color: theme.text.primary,
                        marginBottom: 8,
                        letterSpacing: -0.5,
                    }}>
                        You're Pro!
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        color: theme.text.secondary,
                        textAlign: 'center',
                        marginBottom: 32,
                        lineHeight: 24,
                    }}>
                        Thank you for supporting Zombie Subscriptions. Enjoy all Pro features!
                    </Text>
                    <Button variant="primary" size="lg" onPress={() => router.back()}>
                        Back to App
                    </Button>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg.primary }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Gradient Header */}
                <View style={{
                    backgroundColor: theme.interactive.primary,
                    paddingTop: 40,
                    paddingBottom: 50,
                    paddingHorizontal: 24,
                    borderBottomLeftRadius: 40,
                    borderBottomRightRadius: 40,
                    marginBottom: -30,
                    shadowColor: theme.interactive.primary,
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    elevation: 12,
                }}>
                    {/* Decorative circles */}
                    <View style={{
                        position: 'absolute',
                        top: -40,
                        right: -40,
                        width: 150,
                        height: 150,
                        borderRadius: 75,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                    }} />
                    <View style={{
                        position: 'absolute',
                        bottom: 20,
                        left: -20,
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: 'rgba(255,255,255,0.08)',
                    }} />

                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 50, marginBottom: 12 }}>👑</Text>
                        <Text style={{
                            fontSize: 28,
                            fontWeight: '800',
                            color: '#ffffff',
                            marginBottom: 6,
                            letterSpacing: -0.5,
                        }}>
                            {t('settings.pro.title')}
                        </Text>
                        <Text style={{
                            fontSize: 15,
                            color: 'rgba(255,255,255,0.8)',
                            textAlign: 'center'
                        }}>
                            {t('settings.pro.subtitle')}
                        </Text>
                    </View>
                </View>

                <View style={{ padding: 24 }}>
                    {/* Feature Comparison */}
                    <Card variant="elevated" style={{ marginBottom: 24, padding: 0, overflow: 'hidden' }}>
                        {/* Header Row */}
                        <View style={{
                            flexDirection: 'row',
                            backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.06)',
                            paddingVertical: 14,
                            paddingHorizontal: 16,
                        }}>
                            <Text style={{ flex: 2, fontSize: 13, fontWeight: '700', color: theme.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Feature
                            </Text>
                            <Text style={{ flex: 1, fontSize: 13, fontWeight: '700', color: theme.text.tertiary, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Free
                            </Text>
                            <Text style={{ flex: 1, fontSize: 13, fontWeight: '700', color: theme.text.brand, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Pro
                            </Text>
                        </View>

                        {/* Feature Rows */}
                        {FEATURES.map((feature, index) => (
                            <View
                                key={feature.key}
                                style={{
                                    flexDirection: 'row',
                                    paddingVertical: 16,
                                    paddingHorizontal: 16,
                                    borderTopWidth: 1,
                                    borderTopColor: theme.border.default,
                                    alignItems: 'center',
                                }}
                            >
                                <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 10,
                                        backgroundColor: isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.06)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 10,
                                    }}>
                                        <Text style={{ fontSize: 16 }}>{feature.icon}</Text>
                                    </View>
                                    <Text style={{ fontSize: 14, color: theme.text.primary, fontWeight: '500', textTransform: 'capitalize' }}>
                                        {feature.key}
                                    </Text>
                                </View>
                                <Text style={{ flex: 1, fontSize: 13, color: theme.text.tertiary, textAlign: 'center' }}>
                                    {feature.free}
                                </Text>
                                <Text style={{ flex: 1, fontSize: 13, color: theme.text.brand, textAlign: 'center', fontWeight: '600' }}>
                                    {feature.pro}
                                </Text>
                            </View>
                        ))}
                    </Card>

                    {/* Billing Toggle */}
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: theme.bg.card,
                        borderRadius: 16,
                        padding: 4,
                        marginBottom: 20,
                        borderWidth: 1,
                        borderColor: theme.border.default,
                    }}>
                        <TouchableOpacity
                            onPress={() => setBillingPeriod('monthly')}
                            style={{
                                flex: 1,
                                paddingVertical: 14,
                                borderRadius: 12,
                                backgroundColor: billingPeriod === 'monthly' ? theme.interactive.primary : 'transparent',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: billingPeriod === 'monthly' ? '#ffffff' : theme.text.tertiary,
                            }}>
                                Monthly
                            </Text>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '800',
                                color: billingPeriod === 'monthly' ? '#ffffff' : theme.text.primary,
                                marginTop: 4
                            }}>
                                ${PRO_PRICE.monthly}/mo
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setBillingPeriod('yearly')}
                            style={{
                                flex: 1,
                                paddingVertical: 14,
                                borderRadius: 12,
                                backgroundColor: billingPeriod === 'yearly' ? theme.interactive.primary : 'transparent',
                                alignItems: 'center',
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{
                                    fontSize: 13,
                                    fontWeight: '600',
                                    color: billingPeriod === 'yearly' ? '#ffffff' : theme.text.tertiary,
                                }}>
                                    Yearly
                                </Text>
                                <View style={{
                                    backgroundColor: billingPeriod === 'yearly' ? 'rgba(255,255,255,0.25)' : theme.status.success,
                                    paddingHorizontal: 6,
                                    paddingVertical: 3,
                                    borderRadius: 6,
                                    marginLeft: 6,
                                }}>
                                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>
                                        SAVE {savingsPercent}%
                                    </Text>
                                </View>
                            </View>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '800',
                                color: billingPeriod === 'yearly' ? '#ffffff' : theme.text.primary,
                                marginTop: 4
                            }}>
                                ${(PRO_PRICE.yearly / 12).toFixed(2)}/mo
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Price Display */}
                    <View style={{ alignItems: 'center', marginBottom: 24 }}>
                        <Text style={{ fontSize: 14, color: theme.text.tertiary }}>
                            {billingPeriod === 'yearly' ? `Billed annually at $${PRO_PRICE.yearly}` : 'Billed monthly'}
                        </Text>
                    </View>

                    {/* Purchase Button */}
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onPress={handlePurchase}
                        isLoading={isLoading}
                    >
                        {t('settings.pro.upgrade')} - ${price}
                    </Button>

                    {/* Restore Purchase */}
                    <TouchableOpacity
                        onPress={handleRestore}
                        style={{ alignItems: 'center', marginTop: 20 }}
                    >
                        <Text style={{ fontSize: 14, color: theme.text.brand, fontWeight: '600' }}>
                            Restore Purchase
                        </Text>
                    </TouchableOpacity>

                    {/* Close Button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            alignItems: 'center',
                            marginTop: 24,
                            paddingVertical: 12,
                            paddingHorizontal: 24,
                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                            borderRadius: 12,
                            alignSelf: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 14, color: theme.text.tertiary, fontWeight: '500' }}>
                            Maybe Later
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
