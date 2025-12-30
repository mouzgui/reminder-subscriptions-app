import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, Layout, FadeIn } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../src/theme";
import { Card, Badge, Button, ConfirmModal } from "../../src/components/ui";
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

  const statusConfig = {
    active: {
      variant: "success" as const,
      text: t("subscription.status.active"),
      color: theme.status.success,
      bgColor: isDark ? "rgba(34, 197, 94, 0.15)" : "rgba(34, 197, 94, 0.08)",
    },
    expiringSoon: {
      variant: "warning" as const,
      text: t("subscription.status.expiringSoon"),
      color: theme.status.warning,
      bgColor: isDark ? "rgba(245, 158, 11, 0.15)" : "rgba(245, 158, 11, 0.08)",
    },
    expired: {
      variant: "danger" as const,
      text: t("subscription.status.expired"),
      color: theme.status.danger,
      bgColor: isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.08)",
    },
    today: {
      variant: "danger" as const,
      text: t("subscription.detail.renewsToday"),
      color: theme.status.danger,
      bgColor: isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.08)",
    },
  };

  const config = statusConfig[status];

  return (
    <>
      <Animated.View
        entering={FadeInDown.delay(300 + index * 80).springify()}
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
              marginBottom: 12,
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
              {/* Category Icon */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: isDark
                    ? "rgba(139, 92, 246, 0.12)"
                    : "rgba(139, 92, 246, 0.06)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <CategoryIcon
                  size={24}
                  color={theme.text.brand}
                  strokeWidth={2}
                />
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
                        fontSize: 16,
                        fontWeight: "700",
                        color: theme.text.primary,
                        marginBottom: 2,
                      }}
                    >
                      {subscription.name}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text
                        style={{
                          fontSize: 12,
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
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "800",
                        color: theme.text.brand,
                        marginBottom: 4,
                      }}
                    >
                      {formatCurrency(subscription.price, subscription.currency)}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Badge
                        variant={config.variant}
                        size="sm"
                        style={{ opacity: 0.9 }}
                      >
                        {config.text}
                      </Badge>
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={(e) => {
                          e.stopPropagation();
                          setShowDeleteModal(true);
                        }}
                        style={{
                          padding: 8,
                          marginLeft: 8,
                          borderRadius: 10,
                          backgroundColor: isDark
                            ? "rgba(239, 68, 68, 0.12)"
                            : "rgba(239, 68, 68, 0.06)",
                        }}
                      >
                        <Trash2
                          size={16}
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
        onConfirm={onDelete}
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
  const deleteSubscription = useSubscriptionStore(
    (state) => state.deleteSubscription
  );

  const handleDeleteSubscription = async (sub: Subscription) => {
    try {
      await deleteSubscription(sub.id);
    } catch (error: any) {
      console.error("Delete error:", error);
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
            marginBottom: 24,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <View>
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
              {t("tabs.dashboard")}
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "800",
                color: theme.text.primary,
                letterSpacing: -0.5,
              }}
            >
              {t("dashboard.title")}
            </Text>
          </View>
          <Badge variant="primary" size="md" style={{ marginBottom: 6 }}>
            {activeSubscriptions.length}{" "}
            {t("dashboard.burnRate.activeSubscriptions")}
          </Badge>
        </View>

        {/* Burn Rate Section */}
        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <Card
            variant="glass"
            style={{
              marginBottom: 20,
              padding: 20,
              backgroundColor: isDark
                ? "rgba(139, 92, 246, 0.12)"
                : "rgba(139, 92, 246, 0.06)",
              borderWidth: 1,
              borderColor: isDark
                ? "rgba(139, 92, 246, 0.25)"
                : "rgba(139, 92, 246, 0.12)",
              shadowColor: theme.interactive.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
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
                    fontSize: 12,
                    fontWeight: "600",
                    color: theme.text.tertiary,
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {t("dashboard.burnRate.title")}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                  <Text
                    style={{
                      fontSize: 32,
                      fontWeight: "800",
                      color: theme.text.brand,
                      letterSpacing: -1,
                    }}
                  >
                    {formatCurrency(totalBurnRate, currency)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
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
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: isDark
                    ? "rgba(139, 92, 246, 0.18)"
                    : "rgba(139, 92, 246, 0.1)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingDown
                  size={26}
                  color={theme.text.brand}
                  strokeWidth={2}
                />
              </View>
            </View>

            <View
              style={{
                marginTop: 16,
                paddingTop: 14,
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
                    fontSize: 11,
                    color: theme.text.tertiary,
                    marginBottom: 2,
                  }}
                >
                  {t("dashboard.burnRate.yearlyForecast")}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
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
                    fontSize: 11,
                    color: theme.text.tertiary,
                    marginBottom: 2,
                  }}
                >
                  {t("dashboard.burnRate.activeSubscriptions")}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
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
            <View style={{ marginBottom: 14 }}>
              <Text
                style={{
                  fontSize: 12,
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
              <Plus size={32} color={theme.text.brand} strokeWidth={2} />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: theme.text.primary,
                marginBottom: 8,
                letterSpacing: -0.3,
              }}
            >
              {t("dashboard.empty.title")}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: theme.text.secondary,
                textAlign: "center",
                marginBottom: 20,
                lineHeight: 20,
              }}
            >
              {t("dashboard.empty.subtitle")}
            </Text>
            <Button
              variant="primary"
              size="lg"
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
