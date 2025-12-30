import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SvgUri } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";

import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../src/theme";
import { Button, Card, Input, ConfirmModal, DatePicker, SafeSvgUri } from "../../src/components/ui";
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
} from "../../src/components/icons";
import {
  POPULAR_SUBSCRIPTIONS,
  findPopularSubscription,
  PopularSubscription,
} from "../../src/constants/popularSubscriptions";

export default function AddSubscriptionScreen() {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successName, setSuccessName] = useState("");

  // Auto-suggest state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<PopularSubscription | null>(null);

  const CATEGORIES = [
    { id: "streaming", label: t("subscription.categories.streaming") },
    { id: "productivity", label: t("subscription.categories.productivity") },
    { id: "cloud", label: t("subscription.categories.cloud") },
    { id: "design", label: t("subscription.categories.design") },
    { id: "development", label: t("subscription.categories.development") },
    { id: "finance", label: t("subscription.categories.finance") },
    { id: "music", label: t("subscription.categories.music") || "Music" },
    { id: "gaming", label: t("subscription.categories.gaming") || "Gaming" },
    { id: "fitness", label: t("subscription.categories.fitness") || "Fitness" },
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

  // Default to 30 days from now
  const getDefaultDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split("T")[0];
  };
  const [renewalDate, setRenewalDate] = useState(getDefaultDate());

  // Suggestions based on name input
  const suggestions = useMemo(() => {
    if (name.length < 2) return [];
    return findPopularSubscription(name);
  }, [name]);

  // Handle selecting a suggestion
  const handleSelectSuggestion = (sub: PopularSubscription) => {
    setName(sub.name);
    setPrice(sub.defaultPrice.toString());
    setCategory(sub.category);
    setSelectedSuggestion(sub);
    setShowSuggestions(false);
  };

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

    const subscriptionData = {
      name: name.trim(),
      price: parseFloat(price),
      currency,
      renewal_date: renewalDate,
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
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 16 }} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.duration(500)}>
          {/* Header */}
          <View style={{ marginBottom: 20 }}>
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

          {/* Quick Add - Popular Subscriptions */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: "600", color: theme.text.tertiary, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Popular
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
              {POPULAR_SUBSCRIPTIONS.slice(0, 8).map((sub) => (
                <TouchableOpacity
                  key={sub.id}
                  onPress={() => handleSelectSuggestion(sub)}
                  style={{
                    alignItems: "center",
                    marginHorizontal: 6,
                    padding: 10,
                    borderRadius: 14,
                    backgroundColor: selectedSuggestion?.id === sub.id
                      ? theme.interactive.primary
                      : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                    borderWidth: 1,
                    borderColor: selectedSuggestion?.id === sub.id
                      ? theme.interactive.primary
                      : "transparent",
                    width: 72,
                  }}
                >
                  <SafeSvgUri
                    uri={sub.logoUrl}
                    width={28}
                    height={28}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 10,
                      fontWeight: "600",
                      color: selectedSuggestion?.id === sub.id ? "#fff" : theme.text.secondary,
                      textAlign: "center",
                    }}
                  >
                    {sub.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <Card variant="glass" style={{ marginBottom: 20 }}>
            {/* Name Input with Suggestions */}
            <View style={{ position: "relative", zIndex: 10 }}>
              <Input
                label={t("subscription.add.namePlaceholder")}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setShowSuggestions(text.length >= 2);
                  setSelectedSuggestion(null);
                }}
                placeholder={t("subscription.add.nameExample")}
                onFocus={() => setShowSuggestions(name.length >= 2)}
              />

              {/* Auto-suggest Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <Animated.View
                  entering={FadeIn.duration(200)}
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: theme.bg.card,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.border.default,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5,
                    overflow: "hidden",
                  }}
                >
                  {suggestions.map((sub, index) => (
                    <TouchableOpacity
                      key={sub.id}
                      onPress={() => handleSelectSuggestion(sub)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 12,
                        borderBottomWidth: index < suggestions.length - 1 ? 1 : 0,
                        borderBottomColor: theme.border.default,
                      }}
                    >
                      <SafeSvgUri
                        uri={sub.logoUrl}
                        width={22}
                        height={22}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: "600", color: theme.text.primary }}>
                          {sub.name}
                        </Text>
                        <Text style={{ fontSize: 12, color: theme.text.tertiary }}>
                          ${sub.defaultPrice}/mo • {sub.category}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              )}
            </View>

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

            <DatePicker
              label={t("subscription.detail.renewalDate")}
              value={renewalDate}
              onChange={setRenewalDate}
              minimumDate={new Date()}
            />

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
                  const IconComponent = CATEGORY_ICONS[cat.id] || CATEGORY_ICONS.other;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setCategory(cat.id)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 10,
                        backgroundColor:
                          category === cat.id
                            ? theme.interactive.primary
                            : isDark
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.03)",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                        borderWidth: 1,
                        borderColor:
                          category === cat.id
                            ? theme.interactive.primary
                            : "transparent",
                      }}
                    >
                      <IconComponent
                        size={14}
                        color={
                          category === cat.id
                            ? "#FFFFFF"
                            : theme.text.secondary
                        }
                        strokeWidth={2}
                      />
                      <Text
                        style={{
                          fontSize: 11,
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
