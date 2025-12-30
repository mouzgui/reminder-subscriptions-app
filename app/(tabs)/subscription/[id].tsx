import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../src/theme";
import { Button, Card, Input, Badge } from "../../../src/components/ui";
import {
  CURRENCIES,
  CurrencyCode,
  formatCurrency,
} from "../../../src/utils/currency";
import { useSubscriptionStore } from "../../../src/store/subscriptionStore";
import { useUserStore } from "../../../src/store/userStore";
import { SubscriptionCategory } from "../../../src/types/subscription";
import { daysUntil } from "../../../src/utils/date";

// Category icons mapping
const CATEGORY_ICONS: Record<string, string> = {
  streaming: "📺",
  productivity: "⚡",
  cloud: "☁️",
  design: "🎨",
  development: "💻",
  marketing: "📣",
  finance: "💰",
  gaming: "🎮",
  fitness: "💪",
  music: "🎵",
  news: "📰",
  other: "📦",
};

function DetailRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: string;
}) {
  const { theme, isDark } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: isDark
              ? "rgba(139, 92, 246, 0.15)"
              : "rgba(139, 92, 246, 0.08)",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          <Text style={{ fontSize: 20 }}>{icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 13,
              color: theme.text.tertiary,
              marginBottom: 2,
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: theme.text.primary,
              fontWeight: "600",
            }}
            numberOfLines={1}
          >
            {value}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  // Selectors
  const subscription = useSubscriptionStore((state) =>
    state.getSubscriptionById(id)
  );
  const updateSubscription = useSubscriptionStore(
    (state) => state.updateSubscription
  );
  const updateLocalSubscription = useSubscriptionStore(
    (state) => state.updateLocalSubscription
  );
  const deleteSubscription = useSubscriptionStore(
    (state) => state.deleteSubscription
  );
  const deleteLocalSubscription = useSubscriptionStore(
    (state) => state.deleteLocalSubscription
  );
  const isLoading = useSubscriptionStore((state) => state.isLoading);

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [category, setCategory] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (subscription) {
      setName(subscription.name);
      setPrice(subscription.price.toString());
      setCurrency(subscription.currency as CurrencyCode);
      setCategory(subscription.category || "other");
      setRenewalDate(subscription.renewal_date);
      setNotes(subscription.notes || "");
    } else if (!isDeleting) {
      // Only show error if we're not in the middle of deleting it
      Alert.alert(t("common.error"), t("subscription.detail.notFound"), [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }, [subscription, isDeleting]);

  const handleDelete = async () => {
    if (!subscription) return;

    Alert.alert(
      t("common.delete"),
      t("subscription.detail.deleteConfirm", { name: subscription.name }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteSubscription(subscription.id);
              router.back();
            } catch (error: any) {
              setIsDeleting(false);
              Alert.alert(t("common.error"), error.message);
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!subscription) return;
    if (!name.trim()) {
      Alert.alert(t("errors.required"), t("subscription.add.namePlaceholder"));
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      Alert.alert(t("errors.required"), t("subscription.add.pricePlaceholder"));
      return;
    }

    const updates = {
      id: subscription.id,
      name: name.trim(),
      price: parseFloat(price),
      currency,
      renewal_date: renewalDate,
      category: (category || "other") as SubscriptionCategory,
      notes: notes.trim() || null,
    };

    try {
      if (
        isAuthenticated &&
        !subscription.id.startsWith("local-") &&
        !subscription.id.startsWith("demo-")
      ) {
        await updateSubscription(updates);
      } else {
        updateLocalSubscription(updates);
      }
      setIsEditing(false);
      Alert.alert(t("common.success"), t("subscription.detail.updateSuccess"));
    } catch (error: any) {
      Alert.alert(t("common.error"), error.message);
    }
  };

  if (!subscription || isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.bg.primary,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={theme.interactive.primary} />
      </SafeAreaView>
    );
  }

  const daysLeft = daysUntil(subscription.renewal_date);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg.primary }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: theme.bg.secondary,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
              }}
            >
              <Text style={{ fontSize: 20, color: theme.text.primary }}>←</Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: theme.text.primary,
              }}
            >
              {isEditing ? t("common.edit") : t("subscription.detail.title")}
            </Text>
            <TouchableOpacity
              onPress={handleDelete}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark
                  ? "rgba(239, 68, 68, 0.15)"
                  : "rgba(239, 68, 68, 0.08)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 18 }}>🗑️</Text>
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          {isEditing ? (
            <Animated.View entering={FadeInDown.springify()}>
              <Card variant="glass" style={{ marginBottom: 20 }}>
                <Input
                  label={t("subscription.add.namePlaceholder")}
                  value={name}
                  onChangeText={setName}
                  placeholder={t("subscription.add.nameExample")}
                />
                <View style={{ flexDirection: "row", gap: 14 }}>
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
                <Input
                  label={t("subscription.detail.renewalDate")}
                  value={renewalDate}
                  onChangeText={setRenewalDate}
                  placeholder={t("subscription.detail.renewalDatePlaceholder")}
                />
                <Input
                  label={t("subscription.detail.notes")}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                />
              </Card>

              <View style={{ flexDirection: "row", gap: 12 }}>
                <Button
                  variant="outline"
                  style={{ flex: 1 }}
                  onPress={() => setIsEditing(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  variant="primary"
                  style={{ flex: 2 }}
                  onPress={handleSave}
                  isLoading={isLoading}
                >
                  {t("common.save")}
                </Button>
              </View>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInDown.delay(100).springify()}>
              {/* Hero Info */}
              <Card
                variant="glass"
                style={{
                  alignItems: "center",
                  paddingVertical: 32,
                  marginBottom: 24,
                  backgroundColor: isDark
                    ? "rgba(139, 92, 246, 0.12)"
                    : "rgba(139, 92, 246, 0.05)",
                  borderWidth: 1,
                  borderColor: isDark
                    ? "rgba(139, 92, 246, 0.2)"
                    : "rgba(139, 92, 246, 0.1)",
                }}
              >
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 28,
                    backgroundColor: isDark
                      ? "rgba(139, 92, 246, 0.2)"
                      : "rgba(139, 92, 246, 0.1)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Text style={{ fontSize: 40 }}>
                    {CATEGORY_ICONS[subscription.category || "other"]}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "800",
                    color: theme.text.primary,
                    marginBottom: 4,
                  }}
                >
                  {subscription.name}
                </Text>
                <Badge
                  variant={
                    daysLeft <= 3
                      ? "danger"
                      : daysLeft <= 7
                      ? "warning"
                      : "success"
                  }
                  size="md"
                >
                  {daysLeft === 0
                    ? t("subscription.detail.renewsToday")
                    : daysLeft === 1
                    ? t("subscription.detail.renewsTomorrow")
                    : daysLeft < 0
                    ? t("subscription.detail.expired", {
                        days: Math.abs(daysLeft),
                      })
                    : t("subscription.detail.renewsIn", { days: daysLeft })}
                </Badge>
              </Card>

              {/* Details List */}
              <Card
                variant="elevated"
                style={{
                  marginBottom: 24,
                  backgroundColor: theme.bg.secondary,
                  padding: 8,
                }}
              >
                <DetailRow
                  label={t("subscription.add.pricePlaceholder")}
                  value={formatCurrency(
                    subscription.price,
                    subscription.currency
                  )}
                  icon="💰"
                />
                <View
                  style={{
                    height: 1,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                    marginHorizontal: 12,
                  }}
                />
                <DetailRow
                  label={t("subscription.detail.renewalDate")}
                  value={subscription.renewal_date}
                  icon="📅"
                />
                <View
                  style={{
                    height: 1,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                    marginHorizontal: 12,
                  }}
                />
                <DetailRow
                  label={t("subscription.add.category")}
                  value={
                    t(
                      `subscription.categories.${
                        subscription.category || "other"
                      }`
                    ) as string
                  }
                  icon="🏷️"
                />
                {subscription.notes && (
                  <>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.03)",
                        marginHorizontal: 12,
                      }}
                    />
                    <DetailRow
                      label={t("subscription.detail.notes")}
                      value={subscription.notes}
                      icon="📝"
                    />
                  </>
                )}
              </Card>

              <View style={{ gap: 12 }}>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onPress={() => setIsEditing(true)}
                  leftIcon={<Text>✏️</Text>}
                >
                  {t("common.edit")}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onPress={() => router.back()}
                >
                  {t("common.cancel")}
                </Button>
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
