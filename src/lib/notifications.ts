import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Subscription } from '../types/subscription';

// Check if we're in Expo Go - notifications don't work there
const isExpoGo = Constants.appOwnership === 'expo';

// Stub notification handler for Expo Go compatibility
// Real notifications only work in development builds

/**
 * Request notification permissions
 * @returns Permission status
 */
export async function requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web' || isExpoGo) {
        return false;
    }

    // Would normally request permissions here
    console.log('Notifications disabled in Expo Go');
    return false;
}

/**
 * Check if notifications are enabled
 */
export async function areNotificationsEnabled(): Promise<boolean> {
    if (Platform.OS === 'web' || isExpoGo) {
        return false;
    }
    return false;
}

/**
 * Schedule a renewal reminder for a subscription
 */
export async function scheduleRenewalReminder(
    subscription: Subscription,
    daysBefore: number = 1
): Promise<string | null> {
    if (Platform.OS === 'web' || isExpoGo) {
        return null;
    }
    // Would schedule notification here
    return null;
}

/**
 * Schedule multiple reminders for a subscription (7 days, 1 day)
 */
export async function scheduleAllRemindersForSubscription(
    subscription: Subscription,
    reminderDays: number[] = [7, 1]
): Promise<string[]> {
    // Stub - notifications disabled in Expo Go
    return [];
}

/**
 * Cancel a scheduled notification
 */
export async function cancelReminder(identifier: string): Promise<void> {
    // Stub
}

/**
 * Cancel all scheduled notifications for a subscription
 */
export async function cancelAllRemindersForSubscription(subscriptionId: string): Promise<void> {
    // Stub
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllReminders(): Promise<void> {
    // Stub
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledReminders(): Promise<any[]> {
    return [];
}

/**
 * Add a listener for notification responses (when user taps notification)
 */
export function addNotificationResponseListener(
    callback: (response: any) => void
): { remove: () => void } {
    return { remove: () => { } };
}

/**
 * Add a listener for notifications received while app is foregrounded
 */
export function addNotificationReceivedListener(
    callback: (notification: any) => void
): { remove: () => void } {
    return { remove: () => { } };
}
