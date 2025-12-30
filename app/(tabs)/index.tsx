import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Card, Badge, Button, ConfirmModal, SafeSvgUri } from "../../src/components/ui";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, Layout, FadeIn } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../src/theme";
import { formatCurrency, CurrencyCode } from "../../src/utils/currency";
import { daysUntil, getRenewalStatus } from "../../src/utils/date";
import { useSettingsStore } from "../../src/store/settingsStore";
import { useSubscriptionStore } from "../../src/store/subscriptionStore";
import { useUserStore } from "../../src/store/userStore";
import {
  Subscription,
  SubscriptionCategory,
} from "../../src/types/subscription";
import { router } from "expo-router";
import {
  CATEGORY_ICONS,
  Trash2,
  TrendingDown,
  Plus,
} from "../../src/components/icons";
import { getSubscriptionLogo } from "../../src/constants/popularSubscriptions";

function SubscriptionCard({
  subscription,
  onDelete,
  index,
}: {
  subscription: Subscription;
  onDelete: () => void;
  index: number;
}) {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const days = daysUntil(subscription.renewal_date);
  const status = getRenewalStatus(subscription.renewal_date);
  const CategoryIcon = CATEGORY_ICONS[subscription.category || "other"];

  // Get real logo if available
  const logoUrl = getSubscriptionLogo(subscription.name);

  const statusConfig = {
    active: {
      variant: "success" as const,
      text: t("subscription.status.active"),
      color: theme.status.success,
    },
    expiringSoon: {
      variant: "warning" as const,
      text: t("subscription.status.expiringSoon"),
      color: theme.status.warning,
    },
    expired: {
      variant: "danger" as const,
      text: t("subscription.status.expired"),
      color: theme.status.danger,
    },
    today: {
      variant: "danger" as const,
      text: t("subscription.detail.renewsToday"),
      color: theme.status.danger,
    },
  };

  const config = statusConfig[status];

  const handleDelete = () => {
    setShowDeleteModal(false);
    onDelete();
  };

  return (
    <>
      <Animated.View
        entering={FadeInDown.delay(200 + index * 60).springify()}
        layout={Layout.springify()}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            router.push(`/(tabs)/subscription/${subscription.id}` as any)
          }
        >
          <Card
            variant="elevated"
            style={{
              marginBottom: 10,
              overflow: "hidden",
              padding: 14,
              backgroundColor: theme.bg.secondary,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* Logo or Category Icon */}
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: isDark
                    ? "rgba(139, 92, 246, 0.12)"
                    : "rgba(139, 92, 246, 0.06)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                {logoUrl ? (
                  <SafeSvgUri
                    uri={logoUrl}
                    width={26}
                    height={26}
                    fallback={
                      <CategoryIcon
                        size={22}
                        color={theme.text.brand}
                        strokeWidth={2}
                      />
                    }
                  />
                ) : (
                  <CategoryIcon
                    size={22}
                    color={theme.text.brand}
                    strokeWidth={2}
                  />
                )}
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 15,
                        fontWeight: "700",
                        color: theme.text.primary,
                        marginBottom: 2,
                      }}
                    >
                      {subscription.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: config.color,
                        fontWeight: "600",
                      }}
                    >
                      {status === "expired"
                        ? t("subscription.detail.expired", {
                          days: Math.abs(days),
                        })
                        : days === 0
                          ? t("subscription.detail.renewsToday")
                          : days === 1
                            ? t("subscription.detail.renewsTomorrow")
                            : t("subscription.detail.renewsIn", { days })}
                    </Text>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "800",
                        color: theme.text.brand,
                        marginBottom: 3,
                      }}
                    >
                      {formatCurrency(subscription.price, subscription.currency)}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Badge variant={config.variant} size="sm">
                        {config.text}
                      </Badge>
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={(e) => {
                          e.stopPropagation();
                          setShowDeleteModal(true);
                        }}
                        style={{
                          padding: 6,
                          marginLeft: 6,
                          borderRadius: 8,
                          backgroundColor: isDark
                            ? "rgba(239, 68, 68, 0.1)"
                            : "rgba(239, 68, 68, 0.05)",
                        }}
                      >
                        <Trash2
                          size={14}
                          color={theme.status.danger}
                          strokeWidth={2}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      </Animated.View>

      <ConfirmModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={t("common.delete")}
        message={t("subscription.detail.deleteConfirm", {
          name: subscription.name,
        })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        variant="danger"
      />
    </>
  );
}

export default function DashboardScreen() {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const currency = useSettingsStore((state) => state.currency);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get user auth state
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  // Get data from subscription store
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const initWithDemoData = useSubscriptionStore(
    (state) => state.initWithDemoData
  );
  const syncWithCloud = useSubscriptionStore((state) => state.syncWithCloud);
  const getActiveSubscriptions = useSubscriptionStore(
    (state) => state.getActiveSubscriptions
  );
  const deleteLocalSubscription = useSubscriptionStore(
    (state) => state.deleteLocalSubscription
  );
  const deleteSubscription = useSubscriptionStore(
    (state) => state.deleteSubscription
  );

  const handleDeleteSubscription = async (sub: Subscription) => {
    try {
      // Check if it's a local/demo subscription
      if (sub.id.startsWith("local-") || sub.id.startsWith("demo-")) {
        deleteLocalSubscription(sub.id);
      } else if (isAuthenticated) {
        await deleteSubscription(sub.id);
      } else {
        // Not authenticated and not local - just remove from local state
        deleteLocalSubscription(sub.id);
      }
    } catch (error: any) {
      // Silently handle - the subscription was already removed optimistically
      console.log("Delete handled:", error.message);
    }
  };

  // Initialize with demo data on first launch OR sync with cloud if authenticated
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        if (isAuthenticated) {
          await syncWithCloud();
        } else {
          initWithDemoData();
        }
      } catch (error) {
        console.error("Dashboard sync failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [isAuthenticated]);

  // Get active subscriptions
  const activeSubscriptions = getActiveSubscriptions();

  // Calculate total burn rate
  const totalBurnRate = activeSubscriptions.reduce(
    (sum, sub) => sum + sub.price,
    0
  );
  const yearlyBurnRate = totalBurnRate * 12;

  const onRefresh = async () => {
    setRefreshing(true);
    if (isAuthenticated) {
      await syncWithCloud();
    }
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg.primary }} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.interactive.primary}
          />
        }
      >
        {/* Header */}
        <View
          style={{
            marginBottom: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: theme.text.tertiary,
                marginBottom: 4,
                textTransform: "uppercase",
                letterSpacing: 1.2,
              }}
            >
              {t("tabs.dashboard")}
            </Text>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "800",
                color: theme.text.primary,
                letterSpacing: -0.5,
              }}
            >
              {t("dashboard.title")}
            </Text>
          </View>
          <Badge variant="primary" size="sm" style={{ marginBottom: 6 }}>
            {activeSubscriptions.length} {t("dashboard.burnRate.activeSubscriptions")}
          </Badge>
        </View>

        {/* Burn Rate Section */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Card
            variant="glass"
            style={{
              marginBottom: 18,
              padding: 18,
              backgroundColor: isDark
                ? "rgba(139, 92, 246, 0.1)"
                : "rgba(139, 92, 246, 0.05)",
              borderWidth: 1,
              borderColor: isDark
                ? "rgba(139, 92, 246, 0.2)"
                : "rgba(139, 92, 246, 0.1)",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "600",
                    color: theme.text.tertiary,
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {t("dashboard.burnRate.title")}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "800",
                      color: theme.text.brand,
                      letterSpacing: -1,
                    }}
                  >
                    {formatCurrency(totalBurnRate, currency)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: theme.text.tertiary,
                      marginLeft: 4,
                    }}
                  >
                    /mo
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: isDark
                    ? "rgba(139, 92, 246, 0.15)"
                    : "rgba(139, 92, 246, 0.08)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingDown
                  size={24}
                  color={theme.text.brand}
                  strokeWidth={2}
                />
              </View>
            </View>

            <View
              style={{
                marginTop: 14,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 10,
                    color: theme.text.tertiary,
                    marginBottom: 2,
                  }}
                >
                  {t("dashboard.burnRate.yearlyForecast")}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: theme.text.secondary,
                  }}
                >
                  {formatCurrency(yearlyBurnRate, currency)}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontSize: 10,
                    color: theme.text.tertiary,
                    marginBottom: 2,
                  }}
                >
                  {t("dashboard.burnRate.activeSubscriptions")}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: theme.text.secondary,
                  }}
                >
                  {activeSubscriptions.length}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Subscriptions List */}
        {isLoading ? (
          <View
            style={{
              padding: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color={theme.interactive.primary} />
          </View>
        ) : activeSubscriptions.length > 0 ? (
          <>
            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: theme.text.tertiary,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {t("dashboard.active")} ({activeSubscriptions.length})
              </Text>
            </View>

            {activeSubscriptions.map((sub, index) => (
              <SubscriptionCard
                key={sub.id}
                subscription={sub}
                onDelete={() => handleDeleteSubscription(sub)}
                index={index}
              />
            ))}
          </>
        ) : (
          /* Empty State */
          <Card variant="glass" style={{ alignItems: "center", padding: 32 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                backgroundColor: isDark
                  ? "rgba(139, 92, 246, 0.15)"
                  : "rgba(139, 92, 246, 0.08)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Plus size={28} color={theme.text.brand} strokeWidth={2} />
            </View>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: theme.text.primary,
                marginBottom: 6,
                letterSpacing: -0.3,
              }}
            >
              {t("dashboard.empty.title")}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: theme.text.secondary,
                textAlign: "center",
                marginBottom: 18,
                lineHeight: 18,
              }}
            >
              {t("dashboard.empty.subtitle")}
            </Text>
            <Button
              variant="primary"
              size="md"
              onPress={() => router.push("/add")}
            >
              {t("subscription.add.title")}
            </Button>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
