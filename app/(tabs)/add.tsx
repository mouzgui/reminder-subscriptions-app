import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../src/theme";
import { Button, Card, Input, ConfirmModal } from "../../src/components/ui";
import { CURRENCIES, CurrencyCode } from "../../src/utils/currency";
import { useSettingsStore } from "../../src/store/settingsStore";
import { useSubscriptionStore } from "../../src/store/subscriptionStore";
import { useUserStore } from "../../src/store/userStore";
import { hasReachedSubscriptionLimit } from "../../src/constants/tiers";
import { SubscriptionCategory } from "../../src/types/subscription";
import { router } from "expo-router";
import {
  CATEGORY_ICONS,
  Crown,
  Sparkles,
} from "../../src/components/icons";
import { Sparkles as SparklesIcon } from "lucide-react-native";

export default function AddSubscriptionScreen() {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successName, setSuccessName] = useState("");

  const CATEGORIES = [
    { id: "streaming", label: t("subscription.categories.streaming") },
    { id: "productivity", label: t("subscription.categories.productivity") },
    { id: "cloud", label: t("subscription.categories.cloud") },
    { id: "design", label: t("subscription.categories.design") },
    { id: "development", label: t("subscription.categories.development") },
    { id: "finance", label: t("subscription.categories.finance") },
    { id: "other", label: t("subscription.categories.other") },
  ];

  const { currency: defaultCurrency, isPro } = useSettingsStore();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  // Get subscription store actions
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const addLocalSubscription = useSubscriptionStore(
    (state) => state.addLocalSubscription
  );
  const addSubscription = useSubscriptionStore(
    (state) => state.addSubscription
  );
  const isLoading = useSubscriptionStore((state) => state.isLoading);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>(defaultCurrency);
  const [category, setCategory] = useState("");
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  // Check if user can add more subscriptions
  const currentCount = subscriptions.length;
  const isLimited = hasReachedSubscriptionLimit(currentCount, isPro);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrorMessage(t("subscription.add.namePlaceholder"));
      setShowErrorModal(true);
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setErrorMessage(t("subscription.add.pricePlaceholder"));
      setShowErrorModal(true);
      return;
    }

    // Calculate renewal date (30 days from now)
    const renewalDate = new Date();
    renewalDate.setDate(renewalDate.getDate() + 30);

    const subscriptionData = {
      name: name.trim(),
      price: parseFloat(price),
      currency,
      renewal_date: renewalDate.toISOString().split("T")[0],
      category: (category || "other") as SubscriptionCategory,
    };

    try {
      // Use Supabase if authenticated, otherwise local storage
      if (isAuthenticated) {
        const result = await addSubscription(subscriptionData);
        if (!result) {
          const storeError = useSubscriptionStore.getState().error;
          setErrorMessage(storeError || t("subscription.add.error"));
          setShowErrorModal(true);
          return;
        }
      } else {
        addLocalSubscription(subscriptionData);
      }

      // Show success modal
      setSuccessName(name);
      setShowSuccessModal(true);
    } catch (error: any) {
      setErrorMessage(error.message || t("errors.generic"));
      setShowErrorModal(true);
    }
  };

  if (isLimited) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg.primary }} edges={["top"]}>
        <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
          <Card variant="glass" style={{ alignItems: "center", padding: 36 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: isDark
                  ? "rgba(139, 92, 246, 0.15)"
                  : "rgba(139, 92, 246, 0.08)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <Crown size={32} color={theme.text.brand} strokeWidth={2} />
            </View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: theme.text.primary,
                marginBottom: 8,
                textAlign: "center",
                letterSpacing: -0.3,
              }}
            >
              {t("paywall.title")}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: theme.text.secondary,
                textAlign: "center",
                marginBottom: 24,
                lineHeight: 20,
              }}
            >
              {t("paywall.message")}
            </Text>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => router.push("/paywall" as any)}
            >
              {t("paywall.upgrade")}
            </Button>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg.primary }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 16 }}>
        <Animated.View entering={FadeInDown.duration(500)}>
          {/* Header */}
          <View style={{ marginBottom: 24 }}>
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
              {t("tabs.add")}
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "800",
                color: theme.text.primary,
                letterSpacing: -0.5,
              }}
            >
              {t("subscription.add.title")}
            </Text>
          </View>

          <Card variant="glass" style={{ marginBottom: 20 }}>
            <Input
              label={t("subscription.add.namePlaceholder")}
              value={name}
              onChangeText={setName}
              placeholder={t("subscription.add.nameExample")}
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Input
                  label={t("subscription.add.pricePlaceholder")}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                  placeholder={t("subscription.add.priceExample")}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label={t("subscription.add.currencyLabel")}
                  value={currency}
                  editable={false}
                  onChangeText={(text) => setCurrency(text as CurrencyCode)}
                />
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: theme.text.secondary,
                  marginBottom: 10,
                }}
              >
                {t("subscription.add.category")}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {CATEGORIES.map((cat) => {
                  const IconComponent = CATEGORY_ICONS[cat.id];
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setCategory(cat.id)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor:
                          category === cat.id
                            ? theme.interactive.primary
                            : isDark
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.03)",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        borderWidth: 1,
                        borderColor:
                          category === cat.id
                            ? theme.interactive.primary
                            : "transparent",
                      }}
                    >
                      <IconComponent
                        size={16}
                        color={
                          category === cat.id
                            ? "#FFFFFF"
                            : theme.text.secondary
                        }
                        strokeWidth={2}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color:
                            category === cat.id
                              ? "#FFFFFF"
                              : theme.text.secondary,
                        }}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </Card>

          <Button
            variant="primary"
            size="lg"
            onPress={handleSubmit}
            isLoading={isLoading}
            fullWidth
          >
            {t("common.add")} Subscription
          </Button>
        </Animated.View>
      </ScrollView>

      {/* Success Modal */}
      <ConfirmModal
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.replace("/");
        }}
        title={t("common.success")}
        message={t("subscription.add.success", {
          name: successName,
          price: `${CURRENCIES[currency].symbol}${price}`,
        })}
        confirmText={t("common.ok")}
        variant="success"
        showCancel={false}
        onConfirm={() => router.replace("/")}
      />

      {/* Error Modal */}
      <ConfirmModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={t("errors.required")}
        message={errorMessage}
        confirmText={t("common.ok")}
        variant="warning"
        showCancel={false}
        onConfirm={() => setShowErrorModal(false)}
      />
    </SafeAreaView>
  );
}
