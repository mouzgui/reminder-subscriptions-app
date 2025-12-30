import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SvgUri } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../src/theme";
import { Button, Card, Input, Badge, ConfirmModal, DatePicker } from "../../../src/components/ui";
import {
  CurrencyCode,
  formatCurrency,
} from "../../../src/utils/currency";
import { useSubscriptionStore } from "../../../src/store/subscriptionStore";
import { useUserStore } from "../../../src/store/userStore";
import { SubscriptionCategory } from "../../../src/types/subscription";
import { daysUntil } from "../../../src/utils/date";
import {
  CATEGORY_ICONS,
  Trash2,
  Calendar,
  Package,
  FileText,
  ArrowLeft,
  Edit3,
} from "../../../src/components/icons";
import { getSubscriptionLogo } from "../../../src/constants/popularSubscriptions";

function DetailRow({
  label,
  value,
  icon: IconComponent,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  const { theme, isDark } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 4,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: isDark
              ? "rgba(139, 92, 246, 0.12)"
              : "rgba(139, 92, 246, 0.06)",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <IconComponent size={18} color={theme.text.brand} strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 11,
              color: theme.text.tertiary,
              marginBottom: 1,
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              fontSize: 14,
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

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);

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

  // Get real logo
  const logoUrl = subscription ? getSubscriptionLogo(subscription.name) : null;
  const CategoryIcon = CATEGORY_ICONS[subscription?.category || "other"];

  useEffect(() => {
    if (subscription) {
      setName(subscription.name);
      setPrice(subscription.price.toString());
      setCurrency(subscription.currency as CurrencyCode);
      setCategory(subscription.category || "other");
      setRenewalDate(subscription.renewal_date);
      setNotes(subscription.notes || "");
    } else if (!isDeleting) {
      setShowNotFoundModal(true);
    }
  }, [subscription, isDeleting]);

  const handleDelete = async () => {
    if (!subscription) return;
    try {
      setIsDeleting(true);
      if (subscription.id.startsWith("local-") || subscription.id.startsWith("demo-")) {
        deleteLocalSubscription(subscription.id);
      } else {
        await deleteSubscription(subscription.id);
      }
      router.back();
    } catch (error: any) {
      setIsDeleting(false);
      console.log("Delete handled:", error.message);
      router.back();
    }
  };

  const handleSave = async () => {
    if (!subscription) return;
    if (!name.trim() || !price || parseFloat(price) <= 0) return;

    const updates = {
      id: subscription.id,
      name: name.trim(),
      price: parseFloat(price),
      currency,
      renewal_date: renewalDate,
      category: (category || "other") as SubscriptionCategory,
      notes: notes.trim() || undefined,
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
      setShowSuccessModal(true);
    } catch (error: any) {
      console.log("Update error:", error.message);
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
        edges={["top"]}
      >
        <ActivityIndicator size="large" color={theme.interactive.primary} />
      </SafeAreaView>
    );
  }

  const daysLeft = daysUntil(subscription.renewal_date);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg.primary }} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 80 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: theme.bg.secondary,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.04)",
              }}
            >
              <ArrowLeft size={18} color={theme.text.primary} strokeWidth={2} />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: theme.text.primary,
              }}
            >
              {isEditing ? t("common.edit") : t("subscription.detail.title")}
            </Text>
            <TouchableOpacity
              onPress={() => setShowDeleteModal(true)}
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: isDark
                  ? "rgba(239, 68, 68, 0.12)"
                  : "rgba(239, 68, 68, 0.06)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Trash2 size={16} color={theme.status.danger} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          {isEditing ? (
            <Animated.View entering={FadeInDown.springify()}>
              <Card variant="glass" style={{ marginBottom: 16 }}>
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
                <DatePicker
                  label={t("subscription.detail.renewalDate")}
                  value={renewalDate}
                  onChange={setRenewalDate}
                  minimumDate={new Date()}
                />
                <Input
                  label={t("subscription.detail.notes")}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={2}
                />
              </Card>

              <View style={{ flexDirection: "row", gap: 10 }}>
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
            <Animated.View entering={FadeInDown.delay(80).springify()}>
              {/* Hero Info */}
              <Card
                variant="glass"
                style={{
                  alignItems: "center",
                  paddingVertical: 24,
                  marginBottom: 16,
                  backgroundColor: isDark
                    ? "rgba(139, 92, 246, 0.1)"
                    : "rgba(139, 92, 246, 0.04)",
                  borderWidth: 1,
                  borderColor: isDark
                    ? "rgba(139, 92, 246, 0.18)"
                    : "rgba(139, 92, 246, 0.08)",
                }}
              >
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
                    marginBottom: 12,
                  }}
                >
                  {logoUrl ? (
                    <SvgUri
                      uri={logoUrl}
                      width={32}
                      height={32}
                    />
                  ) : (
                    <CategoryIcon size={32} color={theme.text.brand} strokeWidth={2} />
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "800",
                    color: theme.text.primary,
                    marginBottom: 4,
                  }}
                >
                  {subscription.name}
                </Text>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "800",
                    color: theme.text.brand,
                    marginBottom: 8,
                  }}
                >
                  {formatCurrency(subscription.price, subscription.currency)}
                  <Text style={{ fontSize: 14, fontWeight: "600", color: theme.text.tertiary }}>/mo</Text>
                </Text>
                <Badge
                  variant={
                    daysLeft < 0 ? "danger" : daysLeft <= 3 ? "danger" : daysLeft <= 7 ? "warning" : "success"
                  }
                  size="sm"
                >
                  {daysLeft === 0
                    ? t("subscription.detail.renewsToday")
                    : daysLeft === 1
                      ? t("subscription.detail.renewsTomorrow")
                      : daysLeft < 0
                        ? t("subscription.detail.expired", { days: Math.abs(daysLeft) })
                        : t("subscription.detail.renewsIn", { days: daysLeft })}
                </Badge>
              </Card>

              {/* Details List */}
              <Card
                variant="elevated"
                style={{
                  marginBottom: 16,
                  backgroundColor: theme.bg.secondary,
                  padding: 10,
                }}
              >
                <DetailRow
                  label={t("subscription.detail.renewalDate")}
                  value={subscription.renewal_date}
                  icon={Calendar}
                />
                <View
                  style={{
                    height: 1,
                    backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                    marginHorizontal: 8,
                  }}
                />
                <DetailRow
                  label={t("subscription.add.category")}
                  value={t(`subscription.categories.${subscription.category || "other"}`) as string}
                  icon={Package}
                />
                {subscription.notes && (
                  <>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                        marginHorizontal: 8,
                      }}
                    />
                    <DetailRow
                      label={t("subscription.detail.notes")}
                      value={subscription.notes}
                      icon={FileText}
                    />
                  </>
                )}
              </Card>

              <Button
                variant="primary"
                size="md"
                fullWidth
                onPress={() => setIsEditing(true)}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Edit3 size={16} color="#fff" strokeWidth={2} />
                  <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>{t("common.edit")}</Text>
                </View>
              </Button>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Delete Modal */}
      <ConfirmModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={t("common.delete")}
        message={t("subscription.detail.deleteConfirm", { name: subscription.name })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        variant="danger"
      />

      {/* Success Modal */}
      <ConfirmModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={t("common.success")}
        message={t("subscription.detail.updateSuccess")}
        confirmText={t("common.ok")}
        variant="success"
        showCancel={false}
        onConfirm={() => setShowSuccessModal(false)}
      />

      {/* Not Found Modal */}
      <ConfirmModal
        visible={showNotFoundModal}
        onClose={() => {
          setShowNotFoundModal(false);
          router.back();
        }}
        title={t("common.error")}
        message={t("subscription.detail.notFound")}
        confirmText={t("common.ok")}
        variant="warning"
        showCancel={false}
        onConfirm={() => router.back()}
      />
    </SafeAreaView>
  );
}
