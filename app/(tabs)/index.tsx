import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    RefreshControl,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme';
import { Card, Badge, Button } from '../../src/components/ui';
import { formatCurrency, CurrencyCode } from '../../src/utils/currency';
import { daysUntil, getRenewalStatus } from '../../src/utils/date';
import { useSettingsStore } from '../../src/store/settingsStore';
import { useSubscriptionStore } from '../../src/store/subscriptionStore';
import { useUserStore } from '../../src/store/userStore';
import { Subscription, SubscriptionCategory } from '../../src/types/subscription';
import { router } from 'expo-router';

// Category icons mapping
const CATEGORY_ICONS: Record<string, string> = {
    streaming: '📺',
    productivity: '⚡',
    cloud: '☁️',
    design: '🎨',
    development: '💻',
    marketing: '📣',
    finance: '💰',
    gaming: '🎮',
    fitness: '💪',
    music: '🎵',
    news: '📰',
    other: '📦',
};

function SubscriptionCard({ subscription, onDelete }: { subscription: Subscription; onDelete: () => void }) {
    const { theme, isDark } = useTheme();
    const { t } = useTranslation();

    const days = daysUntil(subscription.renewal_date);
    const status = getRenewalStatus(subscription.renewal_date);
    const categoryIcon = CATEGORY_ICONS[subscription.category || 'other'];

    const statusConfig = {
        active: { variant: 'success' as const, text: t('subscription.status.active') },
        expiringSoon: { variant: 'warning' as const, text: t('subscription.status.expiringSoon') },
        expired: { variant: 'danger' as const, text: t('subscription.status.expired') },
        today: { variant: 'danger' as const, text: t('subscription.detail.renewsToday') },
    };

    const config = statusConfig[status];

    const handleDelete = () => {
        Alert.alert(
            t('common.delete'),
            `Are you sure you want to delete ${subscription.name}?`,
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: onDelete,
                },
            ]
        );
    };

    return (
        <Card variant="elevated" style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* Category Icon */}
                <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                }}>
                    <Text style={{ fontSize: 22 }}>{categoryIcon}</Text>
                </View>

                {/* Content */}
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View style={{ flex: 1, marginRight: 12 }}>
                            <Text style={{
                                fontSize: 17,
                                fontWeight: '700',
                                color: theme.text.primary,
                                marginBottom: 4,
                                letterSpacing: 0.2,
                            }}>
                                {subscription.name}
                            </Text>
                            <Text style={{ fontSize: 13, color: theme.text.tertiary }}>
                                {days > 0
                                    ? t('subscription.detail.renewsIn', { days })
                                    : days === 0
                                        ? t('subscription.detail.renewsToday')
                                        : t('subscription.detail.expired', { days: Math.abs(days) })
                                }
                            </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{
                                fontSize: 19,
                                fontWeight: '800',
                                color: theme.text.brand,
                                marginBottom: 6,
                                letterSpacing: -0.5,
                            }}>
                                {formatCurrency(subscription.price, subscription.currency)}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Badge variant={config.variant} size="sm">{config.text}</Badge>
                                <TouchableOpacity
                                    onPress={handleDelete}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 8,
                                        backgroundColor: isDark ? 'rgba(244, 63, 94, 0.15)' : 'rgba(244, 63, 94, 0.08)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{ fontSize: 14 }}>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Card>
    );
}

export default function DashboardScreen() {
    const { theme, isDark } = useTheme();
    const { t } = useTranslation();
    const currency = useSettingsStore(state => state.currency);
    const [refreshing, setRefreshing] = useState(false);

    // Get user auth state
    const isAuthenticated = useUserStore(state => state.isAuthenticated);

    // Get data from subscription store
    const subscriptions = useSubscriptionStore(state => state.subscriptions);
    const initWithDemoData = useSubscriptionStore(state => state.initWithDemoData);
    const syncWithCloud = useSubscriptionStore(state => state.syncWithCloud);
    const getActiveSubscriptions = useSubscriptionStore(state => state.getActiveSubscriptions);
    const deleteLocalSubscription = useSubscriptionStore(state => state.deleteLocalSubscription);
    const deleteSubscription = useSubscriptionStore(state => state.deleteSubscription);

    const handleDeleteSubscription = (sub: Subscription) => {
        if (isAuthenticated && !sub.id.startsWith('local-') && !sub.id.startsWith('demo-')) {
            deleteSubscription(sub.id);
        } else {
            deleteLocalSubscription(sub.id);
        }
    };

    // Initialize with demo data on first launch OR sync with cloud if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            syncWithCloud();
        } else {
            initWithDemoData();
        }
    }, [isAuthenticated]);

    // Get active subscriptions
    const activeSubscriptions = getActiveSubscriptions();

    // Calculate total burn rate
    const totalBurnRate = activeSubscriptions.reduce((sum, sub) => sum + sub.price, 0);
    const yearlyBurnRate = totalBurnRate * 12;

    const onRefresh = async () => {
        setRefreshing(true);
        if (isAuthenticated) {
            await syncWithCloud();
        }
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg.primary }}>
            <ScrollView
                contentContainerStyle={{ padding: 20, paddingTop: 24 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.interactive.primary}
                    />
                }
            >
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
                        {t('tabs.dashboard')}
                    </Text>
                    <Text style={{
                        fontSize: 32,
                        fontWeight: '800',
                        color: theme.text.primary,
                        letterSpacing: -0.5,
                    }}>
                        🧟 {t('dashboard.title')}
                    </Text>
                </View>

                {/* Premium Hero Burn Rate Card */}
                <View style={{
                    marginBottom: 28,
                    borderRadius: 24,
                    overflow: 'hidden',
                    backgroundColor: theme.interactive.primary,
                    shadowColor: theme.interactive.primary,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.35,
                    shadowRadius: 24,
                    elevation: 10,
                }}>
                    {/* Gradient overlay effect */}
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 200,
                        height: 200,
                        borderRadius: 100,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: [{ translateX: 60 }, { translateY: -60 }],
                    }} />
                    <View style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                        backgroundColor: 'rgba(0,0,0,0.08)',
                        transform: [{ translateX: -40 }, { translateY: 40 }],
                    }} />

                    <View style={{ padding: 24 }}>
                        <Text style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: 'rgba(255,255,255,0.75)',
                            marginBottom: 8,
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                        }}>
                            {t('dashboard.burnRate.title')}
                        </Text>
                        <Text style={{
                            fontSize: 44,
                            fontWeight: '800',
                            color: '#ffffff',
                            letterSpacing: -1,
                            marginBottom: 4,
                        }}>
                            {formatCurrency(totalBurnRate, currency)}
                        </Text>
                        <Text style={{
                            fontSize: 13,
                            color: 'rgba(255,255,255,0.6)',
                            marginBottom: 16,
                        }}>
                            {t('dashboard.burnRate.subtitle')}
                        </Text>

                        {/* Yearly projection */}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            paddingHorizontal: 14,
                            paddingVertical: 10,
                            borderRadius: 12,
                            alignSelf: 'flex-start',
                        }}>
                            <Text style={{ fontSize: 14, marginRight: 6 }}>📅</Text>
                            <Text style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: '#ffffff'
                            }}>
                                {formatCurrency(yearlyBurnRate, currency)}/year
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Subscriptions List */}
                {activeSubscriptions.length > 0 && (
                    <>
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: theme.text.tertiary,
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                            }}>
                                {t('dashboard.active')} ({activeSubscriptions.length})
                            </Text>
                        </View>

                        {activeSubscriptions.map((sub) => (
                            <SubscriptionCard
                                key={sub.id}
                                subscription={sub}
                                onDelete={() => handleDeleteSubscription(sub)}
                            />
                        ))}
                    </>
                )}

                {/* Empty State */}
                {activeSubscriptions.length === 0 && (
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
                            <Text style={{ fontSize: 36 }}>📭</Text>
                        </View>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: '700',
                            color: theme.text.primary,
                            marginBottom: 8,
                            letterSpacing: -0.3,
                        }}>
                            {t('dashboard.empty.title')}
                        </Text>
                        <Text style={{
                            fontSize: 15,
                            color: theme.text.secondary,
                            textAlign: 'center',
                            marginBottom: 24,
                            lineHeight: 22,
                        }}>
                            {t('dashboard.empty.subtitle')}
                        </Text>
                        <Button
                            variant="primary"
                            size="lg"
                            onPress={() => router.push('/add')}
                        >
                            {t('common.add')} Subscription
                        </Button>
                    </Card>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
