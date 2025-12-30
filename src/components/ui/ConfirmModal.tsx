import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutDown,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { AlertTriangle, CheckCircle, Trash2, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export type ConfirmModalVariant = 'danger' | 'success' | 'warning';

interface ConfirmModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmModalVariant;
    showCancel?: boolean;
}

const variantConfig = {
    danger: {
        icon: Trash2,
        iconColor: '#EF4444',
        iconBg: 'rgba(239, 68, 68, 0.15)',
        buttonBg: '#EF4444',
    },
    success: {
        icon: CheckCircle,
        iconColor: '#22C55E',
        iconBg: 'rgba(34, 197, 94, 0.15)',
        buttonBg: '#22C55E',
    },
    warning: {
        icon: AlertTriangle,
        iconColor: '#F59E0B',
        iconBg: 'rgba(245, 158, 11, 0.15)',
        buttonBg: '#F59E0B',
    },
};

export function ConfirmModal({
    visible,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    showCancel = true,
}: ConfirmModalProps) {
    const { theme, isDark } = useTheme();
    const config = variantConfig[variant];
    const IconComponent = config.icon;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(150)}
                    style={[
                        styles.overlay,
                        { backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' },
                    ]}
                >
                    <TouchableWithoutFeedback>
                        <Animated.View
                            entering={SlideInDown.springify().damping(20)}
                            exiting={SlideOutDown.duration(200)}
                            style={[
                                styles.modalContainer,
                                {
                                    backgroundColor: theme.bg.card,
                                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                },
                            ]}
                        >
                            {/* Close button */}
                            <TouchableOpacity
                                style={[styles.closeButton, { backgroundColor: theme.bg.tertiary }]}
                                onPress={onClose}
                                activeOpacity={0.7}
                            >
                                <X size={18} color={theme.text.tertiary} />
                            </TouchableOpacity>

                            {/* Icon */}
                            <View style={[styles.iconContainer, { backgroundColor: config.iconBg }]}>
                                <IconComponent size={32} color={config.iconColor} strokeWidth={2} />
                            </View>

                            {/* Content */}
                            <Text style={[styles.title, { color: theme.text.primary }]}>{title}</Text>
                            <Text style={[styles.message, { color: theme.text.secondary }]}>{message}</Text>

                            {/* Actions */}
                            <View style={styles.actions}>
                                {showCancel && (
                                    <TouchableOpacity
                                        style={[styles.button, styles.cancelButton, { backgroundColor: theme.bg.tertiary }]}
                                        onPress={onClose}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[styles.buttonText, { color: theme.text.secondary }]}>
                                            {cancelText}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                {onConfirm && (
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            styles.confirmButton,
                                            { backgroundColor: config.buttonBg },
                                            !showCancel && { flex: 1 },
                                        ]}
                                        onPress={() => {
                                            onConfirm();
                                            onClose();
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>{confirmText}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContainer: {
        width: width - 56,
        maxWidth: 320,
        borderRadius: 20,
        padding: 20,
        paddingTop: 28,
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: -0.3,
        marginBottom: 6,
        textAlign: 'center',
    },
    message: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {},
    confirmButton: {},
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
