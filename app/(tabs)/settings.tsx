import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useTheme, ThemeMode } from "../../src/theme";
import { Card, Button, ConfirmModal } from "../../src/components/ui";
import { useSettingsStore } from "../../src/store/settingsStore";
import { useUserStore } from "../../src/store/userStore";
import { useSubscriptionStore } from "../../src/store/subscriptionStore";
import { LANGUAGES, LanguageCode } from "../../src/lib/i18n";
import { CURRENCIES, CurrencyCode } from "../../src/utils/currency";
import { PRO_TIER, FREE_TIER } from "../../src/constants/tiers";
import { exportSubscriptionsToCSV } from "../../src/utils/export";
import {
  Crown,
  Sun,
  Moon,
  Smartphone,
  ChevronRight,
  Settings as SettingsIcon,
} from "../../src/components/icons";

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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.default,
      }}
    >
      <Text
        style={{ fontSize: 15, color: theme.text.primary, fontWeight: "500" }}
      >
        {label}
      </Text>
      {rightElement || (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text
            style={{
              fontSize: 14,
              color: theme.text.tertiary,
              fontWeight: "500",
            }}
          >
            {value}
          </Text>
          <ChevronRight size={16} color={theme.text.tertiary} strokeWidth={2} />
        </View>
      )}
    </TouchableOpacity>
  );
}

function SectionTitle({ title }: { title: string }) {
  const { theme } = useTheme();
  return (
    <Text
      style={{
        fontSize: 12,
        fontWeight: "600",
        color: theme.text.tertiary,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 8,
        marginTop: 14,
      }}
    >
      {title}
    </Text>
  );
}

export default function SettingsScreen() {
  const { theme, mode, setMode, isDark, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  // Modal states
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  // Optimized Selectors
  const user = useUserStore((s) => s.user);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const logout = useUserStore((s) => s.logout);
  const authLoading = useUserStore((s) => s.isLoading);

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

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/sign-in" as any);
  };

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Smartphone,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg.primary }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 16 }}>
        {/* Header */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: theme.text.tertiary,
              marginBottom: 4,
              textTransform: "uppercase",
              letterSpacing: 1.2,
            }}
          >
            {t("tabs.settings")}
          </Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: theme.text.primary,
              letterSpacing: -0.5,
            }}
          >
            {t("settings.title")}
          </Text>
        </View>

        {/* Pro Upgrade Banner */}
        {!isPro && (
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={{
              marginBottom: 8,
              borderRadius: 18,
              overflow: "hidden",
              backgroundColor: theme.interactive.primary,
              shadowColor: theme.interactive.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 14,
              elevation: 8,
            }}
          >
            {/* Decorative circle */}
            <View
              style={{
                position: "absolute",
                top: -30,
                right: -30,
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            />

            <View style={{ padding: 18 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Crown size={20} color="#FFFFFF" strokeWidth={2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#ffffff",
                      letterSpacing: -0.3,
                    }}
                  >
                    {t("settings.pro.title")}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}
                  >
                    {t("settings.pro.subtitle")}
                  </Text>
                </View>
              </View>
              <Button
                variant="secondary"
                onPress={() => router.push("/paywall" as any)}
              >
                {t("settings.pro.upgrade")}
              </Button>
            </View>
          </Animated.View>
        )}

        {/* Appearance */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <SectionTitle title={t("settings.appearance.title")} />
          <Card padding="none">
            <View style={{ paddingHorizontal: 14 }}>
              <SettingRow
                label={t("settings.appearance.theme")}
                value={
                  mode === "system"
                    ? t("settings.appearance.system")
                    : isDark
                      ? t("settings.appearance.dark")
                      : t("settings.appearance.light")
                }
                onPress={() => setShowThemePicker(!showThemePicker)}
              />
            </View>

            {showThemePicker && (
              <View style={{ flexDirection: "row", padding: 14, gap: 8 }}>
                {(["light", "dark", "system"] as ThemeMode[]).map((m) => {
                  const IconComponent = themeIcons[m];
                  return (
                    <TouchableOpacity
                      key={m}
                      onPress={() => handleThemeChange(m)}
                      style={{
                        flex: 1,
                        backgroundColor:
                          mode === m
                            ? theme.interactive.primary
                            : theme.bg.tertiary,
                        padding: 12,
                        borderRadius: 10,
                        alignItems: "center",
                      }}
                    >
                      <IconComponent
                        size={20}
                        color={mode === m ? "#FFFFFF" : theme.text.secondary}
                        strokeWidth={2}
                        style={{ marginBottom: 4 }}
                      />
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "600",
                          color: mode === m ? "#ffffff" : theme.text.secondary,
                        }}
                      >
                        {t(`settings.appearance.${m}`)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </Card>
        </Animated.View>

        {/* Language */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <SectionTitle title={t("settings.language.title")} />
          <Card padding="none">
            <View style={{ paddingHorizontal: 14 }}>
              <SettingRow
                label={t("settings.language.select")}
                value={
                  LANGUAGES[language as LanguageCode]?.nativeName || language
                }
                onPress={() => setShowLanguagePicker(!showLanguagePicker)}
              />
            </View>

            {showLanguagePicker && (
              <View style={{ padding: 14 }}>
                {(Object.keys(LANGUAGES) as LanguageCode[]).map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    onPress={() => handleLanguageChange(lang)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor:
                        language === lang
                          ? theme.interactive.primary
                          : theme.bg.tertiary,
                      padding: 12,
                      borderRadius: 10,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color:
                          language === lang ? "#ffffff" : theme.text.primary,
                        fontWeight: "500",
                      }}
                    >
                      {LANGUAGES[lang].nativeName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color:
                          language === lang
                            ? "rgba(255,255,255,0.8)"
                            : theme.text.tertiary,
                      }}
                    >
                      {LANGUAGES[lang].name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Card>
        </Animated.View>

        {/* Currency */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <SectionTitle title={t("settings.currency.title")} />
          <Card padding="none">
            <View style={{ paddingHorizontal: 14 }}>
              <SettingRow
                label={t("settings.currency.select")}
                value={`${CURRENCIES[currency].flag} ${currency}`}
                onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
              />
            </View>

            {showCurrencyPicker && (
              <View style={{ flexDirection: "row", padding: 14, gap: 8 }}>
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((curr) => (
                  <TouchableOpacity
                    key={curr}
                    onPress={() => handleCurrencyChange(curr)}
                    style={{
                      flex: 1,
                      backgroundColor:
                        currency === curr
                          ? theme.interactive.primary
                          : theme.bg.tertiary,
                      padding: 10,
                      borderRadius: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 20, marginBottom: 4 }}>
                      {CURRENCIES[curr].flag}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color:
                          currency === curr ? "#ffffff" : theme.text.primary,
                      }}
                    >
                      {curr}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color:
                          currency === curr
                            ? "rgba(255,255,255,0.8)"
                            : theme.text.tertiary,
                      }}
                    >
                      {CURRENCIES[curr].symbol}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Card>
        </Animated.View>

        {/* Notifications */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <SectionTitle title={t("settings.notifications.title")} />
          <Card padding="none">
            <View style={{ paddingHorizontal: 14 }}>
              <SettingRow
                label={t("settings.notifications.push")}
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
        </Animated.View>

        {/* Data */}
        <Animated.View entering={FadeInDown.delay(600).springify()}>
          <SectionTitle title={t("settings.data.title")} />
          <Card padding="none">
            <View style={{ paddingHorizontal: 14 }}>
              <SettingRow
                label={t("settings.pro.export")}
                value={isPro ? "CSV" : "Pro"}
                onPress={() => {
                  if (!isPro) {
                    router.push("/paywall" as any);
                    return;
                  }
                  const subscriptions =
                    useSubscriptionStore.getState().subscriptions;
                  if (subscriptions.length === 0) {
                    return;
                  }
                  exportSubscriptionsToCSV(subscriptions);
                }}
              />
            </View>
          </Card>
        </Animated.View>

        {/* Account */}
        <Animated.View entering={FadeInDown.delay(700).springify()}>
          <SectionTitle title={t("settings.account.title")} />
          <Card padding="none">
            <View style={{ paddingHorizontal: 14 }}>
              {isAuthenticated && user ? (
                <>
                  <SettingRow
                    label={t("settings.account.emailLabel")}
                    value={user.email}
                  />
                  <View style={{ paddingVertical: 12 }}>
                    <Button
                      variant="danger"
                      size="sm"
                      onPress={() => setShowLogoutModal(true)}
                      isLoading={authLoading}
                    >
                      {t("settings.account.signOut")}
                    </Button>
                  </View>
                </>
              ) : (
                <View style={{ paddingVertical: 14, alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: theme.text.secondary,
                      marginBottom: 12,
                      textAlign: "center",
                    }}
                  >
                    {t("settings.account.syncMessage")}
                  </Text>
                  <Button
                    variant="primary"
                    size="sm"
                    onPress={() => router.push("/(auth)/sign-in" as any)}
                  >
                    {t("auth.signIn.button")}
                  </Button>
                </View>
              )}
            </View>
          </Card>
        </Animated.View>

        {/* About */}
        <SectionTitle title={t("settings.about.title")} />
        <Card padding="none">
          <View style={{ paddingHorizontal: 14 }}>
            <SettingRow label={t("settings.about.version")} value="1.0.0" />
          </View>
        </Card>

        {/* Footer */}
        <View style={{ alignItems: "center", paddingVertical: 28 }}>
          <Text style={{ fontSize: 13, color: theme.text.tertiary }}>
            {t("settings.footer.tagline")}
          </Text>
          <Text
            style={{ fontSize: 11, color: theme.text.tertiary, marginTop: 4 }}
          >
            {t("settings.footer.madeBy")}
          </Text>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title={t("settings.account.signOut")}
        message={t("settings.account.signOutConfirm")}
        confirmText={t("settings.account.signOut")}
        cancelText={t("common.cancel")}
        variant="danger"
      />
    </SafeAreaView>
  );
}
