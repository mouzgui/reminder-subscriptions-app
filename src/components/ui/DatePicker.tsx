import React, { useState, memo, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Dimensions,
} from "react-native";
import { useTheme } from "../../theme";
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from "../icons";

interface DatePickerProps {
    label?: string;
    value: string; // ISO date string YYYY-MM-DD
    onChange: (date: string) => void;
    minimumDate?: Date;
    maximumDate?: Date;
    error?: string;
    hint?: string;
}

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const DatePicker = memo(
    ({
        label,
        value,
        onChange,
        minimumDate,
        maximumDate,
        error,
        hint,
    }: DatePickerProps) => {
        const { theme, isDark } = useTheme();
        const [showPicker, setShowPicker] = useState(false);
        const [isFocused, setIsFocused] = useState(false);

        // Temporary selection - only applies when user presses Done
        const [tempValue, setTempValue] = useState(value);

        // Parse the value string to a Date object
        const dateValue = useMemo(() => {
            return value ? new Date(value + "T00:00:00") : new Date();
        }, [value]);

        // Parse temp value for display in picker
        const tempDateValue = useMemo(() => {
            return tempValue ? new Date(tempValue + "T00:00:00") : new Date();
        }, [tempValue]);

        // Current month being viewed in the picker
        const [viewMonth, setViewMonth] = useState(dateValue.getMonth());
        const [viewYear, setViewYear] = useState(dateValue.getFullYear());

        // Format date for display
        const formatDisplayDate = (date: Date) => {
            const options: Intl.DateTimeFormatOptions = {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            };
            return date.toLocaleDateString("en-US", options);
        };

        // Calculate days until this date
        const getDaysUntil = (dateStr: string) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const targetDate = new Date(dateStr + "T00:00:00");
            const diffTime = targetDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        };

        const daysUntil = value ? getDaysUntil(value) : 0;
        const tempDaysUntil = tempValue ? getDaysUntil(tempValue) : 0;

        // Generate calendar days for current view
        const calendarDays = useMemo(() => {
            const firstDay = new Date(viewYear, viewMonth, 1);
            const lastDay = new Date(viewYear, viewMonth + 1, 0);
            const startPadding = firstDay.getDay();
            const totalDays = lastDay.getDate();

            const days: { date: Date | null; isCurrentMonth: boolean }[] = [];

            // Add padding for days before month starts
            for (let i = 0; i < startPadding; i++) {
                const prevDate = new Date(viewYear, viewMonth, -startPadding + i + 1);
                days.push({ date: prevDate, isCurrentMonth: false });
            }

            // Add days of current month
            for (let i = 1; i <= totalDays; i++) {
                days.push({ date: new Date(viewYear, viewMonth, i), isCurrentMonth: true });
            }

            // Add trailing days to complete the grid
            const remaining = 42 - days.length;
            for (let i = 1; i <= remaining; i++) {
                const nextDate = new Date(viewYear, viewMonth + 1, i);
                days.push({ date: nextDate, isCurrentMonth: false });
            }

            return days;
        }, [viewMonth, viewYear]);

        // Select date temporarily (don't close modal)
        const handleSelectDate = (date: Date) => {
            const isoDate = date.toISOString().split("T")[0];
            setTempValue(isoDate);
        };

        // Confirm selection and close
        const handleConfirm = () => {
            onChange(tempValue);
            setShowPicker(false);
            setIsFocused(false);
        };

        // Cancel and close without saving
        const handleCancel = () => {
            setTempValue(value); // Reset to original value
            setShowPicker(false);
            setIsFocused(false);
        };

        const openPicker = () => {
            setTempValue(value);
            setViewMonth(dateValue.getMonth());
            setViewYear(dateValue.getFullYear());
            setShowPicker(true);
            setIsFocused(true);
        };

        const goToPrevMonth = () => {
            if (viewMonth === 0) {
                setViewMonth(11);
                setViewYear(viewYear - 1);
            } else {
                setViewMonth(viewMonth - 1);
            }
        };

        const goToNextMonth = () => {
            if (viewMonth === 11) {
                setViewMonth(0);
                setViewYear(viewYear + 1);
            } else {
                setViewMonth(viewMonth + 1);
            }
        };

        const isDateDisabled = (date: Date) => {
            if (minimumDate) {
                const minDate = new Date(minimumDate);
                minDate.setHours(0, 0, 0, 0);
                if (date < minDate) return true;
            }
            if (maximumDate) {
                const maxDate = new Date(maximumDate);
                maxDate.setHours(23, 59, 59, 999);
                if (date > maxDate) return true;
            }
            return false;
        };

        const isDateSelected = (date: Date) => {
            return date.toISOString().split("T")[0] === tempValue;
        };

        const isToday = (date: Date) => {
            const today = new Date();
            return (
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
            );
        };

        const borderColor = error
            ? theme.status.danger
            : isFocused
                ? theme.interactive.primary
                : theme.border.default;

        const backgroundColor = isFocused
            ? isDark
                ? "rgba(139, 92, 246, 0.08)"
                : "rgba(139, 92, 246, 0.03)"
            : theme.bg.card;

        return (
            <View style={{ marginBottom: 16 }}>
                {label && (
                    <Text
                        style={{
                            fontSize: 13,
                            fontWeight: "600",
                            color: isFocused ? theme.text.brand : theme.text.secondary,
                            marginBottom: 8,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                        }}
                    >
                        {label}
                    </Text>
                )}

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={openPicker}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor,
                        borderWidth: 1.5,
                        borderColor,
                        borderRadius: 14,
                        paddingHorizontal: 14,
                        paddingVertical: 14,
                    }}
                >
                    {/* Calendar Icon */}
                    <View
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            backgroundColor: isDark
                                ? "rgba(139, 92, 246, 0.15)"
                                : "rgba(139, 92, 246, 0.08)",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 12,
                        }}
                    >
                        <Calendar size={18} color={theme.text.brand} strokeWidth={2} />
                    </View>

                    {/* Date Display */}
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: theme.text.primary,
                                marginBottom: 2,
                            }}
                        >
                            {value ? formatDisplayDate(dateValue) : "Select a date"}
                        </Text>
                        {value && (
                            <Text
                                style={{
                                    fontSize: 12,
                                    fontWeight: "500",
                                    color:
                                        daysUntil < 0
                                            ? theme.status.danger
                                            : daysUntil <= 7
                                                ? theme.status.warning
                                                : theme.text.tertiary,
                                }}
                            >
                                {daysUntil === 0
                                    ? "Today"
                                    : daysUntil === 1
                                        ? "Tomorrow"
                                        : daysUntil < 0
                                            ? `${Math.abs(daysUntil)} days ago`
                                            : `In ${daysUntil} days`}
                            </Text>
                        )}
                    </View>

                    {/* Chevron */}
                    <ChevronDown size={18} color={theme.text.tertiary} strokeWidth={2} />
                </TouchableOpacity>

                {/* Error/Hint */}
                {error && (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 6,
                        }}
                    >
                        <Text style={{ fontSize: 12, marginRight: 4 }}>⚠️</Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: theme.status.danger,
                                fontWeight: "500",
                            }}
                        >
                            {error}
                        </Text>
                    </View>
                )}
                {hint && !error && (
                    <Text
                        style={{
                            fontSize: 12,
                            color: theme.text.tertiary,
                            marginTop: 6,
                        }}
                    >
                        {hint}
                    </Text>
                )}

                {/* Calendar Modal */}
                <Modal
                    transparent
                    animationType="slide"
                    visible={showPicker}
                    onRequestClose={handleCancel}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            justifyContent: "flex-end",
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={handleCancel}
                            style={{ flex: 1 }}
                        />

                        <View
                            style={{
                                backgroundColor: theme.bg.primary,
                                borderTopLeftRadius: 24,
                                borderTopRightRadius: 24,
                                paddingBottom: 34,
                            }}
                        >
                            {/* Handle */}
                            <View
                                style={{
                                    alignItems: "center",
                                    paddingTop: 12,
                                    paddingBottom: 8,
                                }}
                            >
                                <View
                                    style={{
                                        width: 36,
                                        height: 4,
                                        borderRadius: 2,
                                        backgroundColor: isDark
                                            ? "rgba(255,255,255,0.2)"
                                            : "rgba(0,0,0,0.15)",
                                    }}
                                />
                            </View>

                            {/* Header with Cancel and Done */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    paddingHorizontal: 20,
                                    paddingVertical: 12,
                                    borderBottomWidth: 1,
                                    borderBottomColor: theme.border.default,
                                }}
                            >
                                <TouchableOpacity onPress={handleCancel}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "500",
                                            color: theme.text.secondary,
                                        }}
                                    >
                                        Cancel
                                    </Text>
                                </TouchableOpacity>

                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: "700",
                                        color: theme.text.primary,
                                    }}
                                >
                                    Select Date
                                </Text>

                                <TouchableOpacity onPress={handleConfirm}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "600",
                                            color: theme.interactive.primary,
                                        }}
                                    >
                                        Done
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Selected Date Preview */}
                            <View
                                style={{
                                    alignItems: "center",
                                    paddingVertical: 14,
                                    backgroundColor: isDark
                                        ? "rgba(139, 92, 246, 0.08)"
                                        : "rgba(139, 92, 246, 0.04)",
                                    marginHorizontal: 16,
                                    marginTop: 12,
                                    borderRadius: 12,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: "700",
                                        color: theme.text.brand,
                                    }}
                                >
                                    {tempValue ? formatDisplayDate(tempDateValue) : "No date selected"}
                                </Text>
                                {tempValue && (
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            fontWeight: "500",
                                            color: theme.text.tertiary,
                                            marginTop: 2,
                                        }}
                                    >
                                        {tempDaysUntil === 0
                                            ? "Today"
                                            : tempDaysUntil === 1
                                                ? "Tomorrow"
                                                : tempDaysUntil < 0
                                                    ? `${Math.abs(tempDaysUntil)} days ago`
                                                    : `${tempDaysUntil} days from now`}
                                    </Text>
                                )}
                            </View>

                            {/* Month/Year Navigation */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    paddingHorizontal: 20,
                                    paddingVertical: 14,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={goToPrevMonth}
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 10,
                                        backgroundColor: isDark
                                            ? "rgba(255,255,255,0.08)"
                                            : "rgba(0,0,0,0.05)",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <ChevronLeft
                                        size={18}
                                        color={theme.text.primary}
                                        strokeWidth={2}
                                    />
                                </TouchableOpacity>

                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "700",
                                        color: theme.text.primary,
                                    }}
                                >
                                    {MONTHS[viewMonth]} {viewYear}
                                </Text>

                                <TouchableOpacity
                                    onPress={goToNextMonth}
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 10,
                                        backgroundColor: isDark
                                            ? "rgba(255,255,255,0.08)"
                                            : "rgba(0,0,0,0.05)",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <ChevronRight
                                        size={18}
                                        color={theme.text.primary}
                                        strokeWidth={2}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Weekday Headers */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    paddingHorizontal: 16,
                                    marginBottom: 6,
                                }}
                            >
                                {WEEKDAYS.map((day) => (
                                    <View
                                        key={day}
                                        style={{
                                            flex: 1,
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontWeight: "600",
                                                color: theme.text.tertiary,
                                            }}
                                        >
                                            {day}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            {/* Calendar Grid */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    paddingHorizontal: 12,
                                    paddingBottom: 8,
                                }}
                            >
                                {calendarDays.map((item, index) => {
                                    if (!item.date) return null;

                                    const disabled = isDateDisabled(item.date);
                                    const selected = isDateSelected(item.date);
                                    const today = isToday(item.date);
                                    const daySize = (SCREEN_WIDTH - 48) / 7;

                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            disabled={disabled || !item.isCurrentMonth}
                                            onPress={() => handleSelectDate(item.date!)}
                                            style={{
                                                width: daySize,
                                                height: daySize,
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: daySize - 10,
                                                    height: daySize - 10,
                                                    borderRadius: (daySize - 10) / 2,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: selected
                                                        ? theme.interactive.primary
                                                        : today
                                                            ? isDark
                                                                ? "rgba(139, 92, 246, 0.2)"
                                                                : "rgba(139, 92, 246, 0.1)"
                                                            : "transparent",
                                                    borderWidth: today && !selected ? 1.5 : 0,
                                                    borderColor: theme.interactive.primary,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 15,
                                                        fontWeight: selected || today ? "700" : "500",
                                                        color: selected
                                                            ? "#FFFFFF"
                                                            : disabled || !item.isCurrentMonth
                                                                ? theme.text.tertiary
                                                                : theme.text.primary,
                                                        opacity: !item.isCurrentMonth ? 0.3 : disabled ? 0.4 : 1,
                                                    }}
                                                >
                                                    {item.date.getDate()}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* Quick Select Buttons */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    paddingHorizontal: 16,
                                    gap: 8,
                                    paddingTop: 8,
                                }}
                            >
                                {[
                                    { label: "Today", days: 0 },
                                    { label: "+7d", days: 7 },
                                    { label: "+30d", days: 30 },
                                    { label: "+90d", days: 90 },
                                ].map((item) => {
                                    const targetDate = new Date();
                                    targetDate.setDate(targetDate.getDate() + item.days);
                                    const disabled = isDateDisabled(targetDate);
                                    const isoDate = targetDate.toISOString().split("T")[0];
                                    const isActive = tempValue === isoDate;

                                    return (
                                        <TouchableOpacity
                                            key={item.label}
                                            disabled={disabled}
                                            onPress={() => setTempValue(isoDate)}
                                            style={{
                                                flex: 1,
                                                paddingVertical: 10,
                                                borderRadius: 10,
                                                backgroundColor: isActive
                                                    ? theme.interactive.primary
                                                    : isDark
                                                        ? "rgba(255,255,255,0.06)"
                                                        : "rgba(0,0,0,0.04)",
                                                alignItems: "center",
                                                opacity: disabled ? 0.4 : 1,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: "600",
                                                    color: isActive ? "#FFFFFF" : theme.text.secondary,
                                                }}
                                            >
                                                {item.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
);
