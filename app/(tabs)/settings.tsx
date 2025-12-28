import React from 'react';
import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useTheme, ThemeMode } from '../../src/theme';
import { Card, Button } from '../../src/components/ui';
import { useSettingsStore } from '../../src/store/settingsStore';
import { useUserStore } from '../../src/store/userStore';
import { useSubscriptionStore } from '../../src/store/subscriptionStore';
import { LANGUAGES, LanguageCode } from '../../src/lib/i18n';
import { CURRENCIES, CurrencyCode } from '../../src/utils/currency';
import { PRO_TIER, FREE_TIER } from '../../src/constants/tiers';
import { exportSubscriptionsToCSV } from '../../src/utils/export';

function SettingRow({
    label,
    value,
    onPress,
    rightElement,
}: {
    label: string;
    value?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
}) {
    const { theme, isDark } = useTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={0.7}
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: theme.border.default,
            }}
        >
            <Text style={{ fontSize: 16, color: theme.text.primary, fontWeight: '500' }}>{label}</Text>
            {rightElement || (
                <Text style={{ fontSize: 15, color: theme.text.tertiary, fontWeight: '500' }}>
                    {value} →
                </Text>
            )}
        </TouchableOpacity>
    );
}

function SectionTitle({ title }: { title: string }) {
    const { theme } = useTheme();
    return (
        <Text style={{
            fontSize: 13,
            fontWeight: '600',
            color: theme.text.tertiary,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginBottom: 8,
            marginTop: 16,
        }}>
            {title}
        </Text>
    );
}

export default function SettingsScreen() {
    const { theme, mode, setMode, isDark, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const { user, isAuthenticated, logout, isLoading: authLoading } = useUserStore();
    const {
        language,
        setLanguage,
        currency,
        setCurrency,
        pushNotifications,
        setPushNotifications,
        isPro,
    } = useSettingsStore();

    const [showLanguagePicker, setShowLanguagePicker] = React.useState(false);
    const [showCurrencyPicker, setShowCurrencyPicker] = React.useState(false);
    const [showThemePicker, setShowThemePicker] = React.useState(false);

    const handleLanguageChange = (lang: LanguageCode) => {
        setLanguage(lang);
        setShowLanguagePicker(false);
    };

    const handleCurrencyChange = (curr: CurrencyCode) => {
        setCurrency(curr);
        setShowCurrencyPicker(false);
    };

    const handleThemeChange = (newMode: ThemeMode) => {
        setMode(newMode);
        setShowThemePicker(false);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg.primary }}>
            <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 24 }}>
                {/* Header */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.text.tertiary,
                        marginBottom: 4,
                        textTransform: 'uppercase',
                        letterSpacing: 1.2,
                    }}>
                        {t('tabs.settings')}
                    </Text>
                    <Text style={{
                        fontSize: 32,
                        fontWeight: '800',
                        color: theme.text.primary,
                        letterSpacing: -0.5,
                    }}>
                        ⚙️ {t('settings.title')}
                    </Text>
                </View>

                {/* Pro Upgrade Banner */}
                {!isPro && (
                    <View style={{
                        marginBottom: 8,
                        borderRadius: 20,
                        overflow: 'hidden',
                        backgroundColor: theme.interactive.primary,
                        shadowColor: theme.interactive.primary,
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.3,
                        shadowRadius: 16,
                        elevation: 8,
                    }}>
                        {/* Decorative circle */}
                        <View style={{
                            position: 'absolute',
                            top: -30,
                            right: -30,
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                        }} />

                        <View style={{ padding: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                                <View style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 14,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 12,
                                }}>
                                    <Text style={{ fontSize: 22 }}>👑</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#ffffff', letterSpacing: -0.3 }}>
                                        {t('settings.pro.title')}
                                    </Text>
                                    <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                                        {t('settings.pro.subtitle')}
                                    </Text>
                                </View>
                            </View>
                            <Button
                                variant="secondary"
                                onPress={() => router.push('/paywall' as any)}
                            >
                                {t('settings.pro.upgrade')}
                            </Button>
                        </View>
                    </View>
                )}

                {/* Appearance */}
                <SectionTitle title={t('settings.appearance.title')} />
                <Card padding="none">
                    <View style={{ paddingHorizontal: 16 }}>
                        <SettingRow
                            label={t('settings.appearance.theme')}
                            value={mode === 'system' ? t('settings.appearance.system') : isDark ? t('settings.appearance.dark') : t('settings.appearance.light')}
                            onPress={() => setShowThemePicker(!showThemePicker)}
                        />
                    </View>

                    {showThemePicker && (
                        <View style={{ flexDirection: 'row', padding: 16, gap: 8 }}>
                            {(['light', 'dark', 'system'] as ThemeMode[]).map((m) => (
                                <TouchableOpacity
                                    key={m}
                                    onPress={() => handleThemeChange(m)}
                                    style={{
                                        flex: 1,
                                        backgroundColor: mode === m ? theme.interactive.primary : theme.bg.tertiary,
                                        padding: 12,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ fontSize: 20, marginBottom: 4 }}>
                                        {m === 'light' ? '☀️' : m === 'dark' ? '🌙' : '📱'}
                                    </Text>
                                    <Text style={{
                                        fontSize: 12,
                                        fontWeight: '600',
                                        color: mode === m ? '#ffffff' : theme.text.secondary,
                                    }}>
                                        {t(`settings.appearance.${m}`)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </Card>

                {/* Language */}
                <SectionTitle title={t('settings.language.title')} />
                <Card padding="none">
                    <View style={{ paddingHorizontal: 16 }}>
                        <SettingRow
                            label={t('settings.language.select')}
                            value={LANGUAGES[language as LanguageCode]?.nativeName || language}
                            onPress={() => setShowLanguagePicker(!showLanguagePicker)}
                        />
                    </View>

                    {showLanguagePicker && (
                        <View style={{ padding: 16 }}>
                            {(Object.keys(LANGUAGES) as LanguageCode[]).map((lang) => (
                                <TouchableOpacity
                                    key={lang}
                                    onPress={() => handleLanguageChange(lang)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        backgroundColor: language === lang ? theme.interactive.primary : theme.bg.tertiary,
                                        padding: 14,
                                        borderRadius: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 16,
                                        color: language === lang ? '#ffffff' : theme.text.primary,
                                        fontWeight: '500',
                                    }}>
                                        {LANGUAGES[lang].nativeName}
                                    </Text>
                                    <Text style={{
                                        fontSize: 14,
                                        color: language === lang ? 'rgba(255,255,255,0.8)' : theme.text.tertiary,
                                    }}>
                                        {LANGUAGES[lang].name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </Card>

                {/* Currency */}
                <SectionTitle title={t('settings.currency.title')} />
                <Card padding="none">
                    <View style={{ paddingHorizontal: 16 }}>
                        <SettingRow
                            label={t('settings.currency.select')}
                            value={`${CURRENCIES[currency].flag} ${currency}`}
                            onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
                        />
                    </View>

                    {showCurrencyPicker && (
                        <View style={{ flexDirection: 'row', padding: 16, gap: 8 }}>
                            {(Object.keys(CURRENCIES) as CurrencyCode[]).map((curr) => (
                                <TouchableOpacity
                                    key={curr}
                                    onPress={() => handleCurrencyChange(curr)}
                                    style={{
                                        flex: 1,
                                        backgroundColor: currency === curr ? theme.interactive.primary : theme.bg.tertiary,
                                        padding: 12,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ fontSize: 24, marginBottom: 4 }}>{CURRENCIES[curr].flag}</Text>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: currency === curr ? '#ffffff' : theme.text.primary,
                                    }}>
                                        {curr}
                                    </Text>
                                    <Text style={{
                                        fontSize: 12,
                                        color: currency === curr ? 'rgba(255,255,255,0.8)' : theme.text.tertiary,
                                    }}>
                                        {CURRENCIES[curr].symbol}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </Card>

                {/* Notifications */}
                <SectionTitle title={t('settings.notifications.title')} />
                <Card padding="none">
                    <View style={{ paddingHorizontal: 16 }}>
                        <SettingRow
                            label={t('settings.notifications.push')}
                            rightElement={
                                <Switch
                                    value={pushNotifications}
                                    onValueChange={setPushNotifications}
                                    trackColor={{ true: theme.interactive.primary }}
                                />
                            }
                        />
                    </View>
                </Card>

                {/* Data */}
                <SectionTitle title="Data" />
                <Card padding="none">
                    <View style={{ paddingHorizontal: 16 }}>
                        <SettingRow
                            label="Export Subscriptions"
                            value={isPro ? 'CSV' : '🔒 Pro'}
                            onPress={() => {
                                if (!isPro) {
                                    router.push('/paywall' as any);
                                    return;
                                }
                                const subscriptions = useSubscriptionStore.getState().subscriptions;
                                if (subscriptions.length === 0) {
                                    Alert.alert('No Data', 'Add some subscriptions first to export.');
                                    return;
                                }
                                exportSubscriptionsToCSV(subscriptions).then(success => {
                                    if (!success) {
                                        Alert.alert('Export Failed', 'Could not export subscriptions.');
                                    }
                                });
                            }}
                        />
                    </View>
                </Card>

                {/* Account */}
                <SectionTitle title={t('settings.account.title')} />
                <Card padding="none">
                    <View style={{ paddingHorizontal: 16 }}>
                        {isAuthenticated && user ? (
                            <>
                                <SettingRow
                                    label="Email"
                                    value={user.email}
                                />
                                <View style={{ paddingVertical: 12 }}>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onPress={() => {
                                            Alert.alert(
                                                t('settings.account.signOut'),
                                                'Are you sure you want to sign out?',
                                                [
                                                    { text: t('common.cancel'), style: 'cancel' },
                                                    {
                                                        text: t('settings.account.signOut'),
                                                        style: 'destructive',
                                                        onPress: async () => {
                                                            await logout();
                                                            router.replace('/(auth)/sign-in' as any);
                                                        },
                                                    },
                                                ]
                                            );
                                        }}
                                        isLoading={authLoading}
                                    >
                                        {t('settings.account.signOut')}
                                    </Button>
                                </View>
                            </>
                        ) : (
                            <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                                <Text style={{
                                    fontSize: 14,
                                    color: theme.text.secondary,
                                    marginBottom: 12,
                                    textAlign: 'center',
                                }}>
                                    Sign in to sync your data across devices
                                </Text>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onPress={() => router.push('/(auth)/sign-in' as any)}
                                >
                                    Sign In
                                </Button>
                            </View>
                        )}
                    </View>
                </Card>

                {/* About */}
                <SectionTitle title={t('settings.about.title')} />
                <Card padding="none">
                    <View style={{ paddingHorizontal: 16 }}>
                        <SettingRow
                            label={t('settings.about.version')}
                            value="1.0.0"
                        />
                    </View>
                </Card>

                {/* Footer */}
                <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                    <Text style={{ fontSize: 14, color: theme.text.tertiary }}>
                        🧟 Zombie Subscriptions
                    </Text>
                    <Text style={{ fontSize: 12, color: theme.text.tertiary, marginTop: 4 }}>
                        Made with ❤️ for freelancers
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
