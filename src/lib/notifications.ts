/**
 * Notification Stubs for Expo Go Compatibility
 * 
 * expo-notifications doesn't work in Expo Go for SDK 53+.
 * These are stub implementations that work silently.
 * 
 * In production builds, these would be replaced with real implementations.
 * For now, notifications are disabled in Expo Go.
 */

import { Subscription } from '../types/subscription';

/**
 * Request notification permissions
 */
export async function requestPermissions(): Promise<boolean> {
    console.log('Notifications: Not available in Expo Go');
    return false;
}

/**
 * Check if notifications are enabled
 */
export async function areNotificationsEnabled(): Promise<boolean> {
    return false;
}

/**
 * Schedule a renewal reminder (stub)
 */
export async function scheduleRenewalReminder(
    subscription: Subscription,
    daysBefore: number = 1
): Promise<string | null> {
    console.log(`[Stub] Would schedule reminder for ${subscription.name} ${daysBefore} days before`);
    return null;
}

/**
 * Schedule multiple reminders (stub)
 */
export async function scheduleAllRemindersForSubscription(
    subscription: Subscription,
    reminderDays: number[] = [7, 1]
): Promise<string[]> {
    console.log(`[Stub] Would schedule reminders for ${subscription.name}`);
    return [];
}

/**
 * Cancel a reminder (stub)
 */
export async function cancelReminder(identifier: string): Promise<void> {
    // Stub
}

/**
 * Cancel all reminders for a subscription (stub)
 */
export async function cancelAllRemindersForSubscription(subscriptionId: string): Promise<void> {
    // Stub
}

/**
 * Cancel all reminders (stub)
 */
export async function cancelAllReminders(): Promise<void> {
    // Stub
}

/**
 * Get scheduled reminders (stub)
 */
export async function getScheduledReminders(): Promise<any[]> {
    return [];
}

/**
 * Add notification response listener (stub)
 */
export function addNotificationResponseListener(
    callback: (response: any) => void
): { remove: () => void } {
    return { remove: () => { } };
}

/**
 * Add notification received listener (stub)
 */
export function addNotificationReceivedListener(
    callback: (notification: any) => void
): { remove: () => void } {
    return { remove: () => { } };
}

/**
 * Send test notification (stub)
 */
export async function sendTestNotification(): Promise<boolean> {
    console.log('Notifications not available in Expo Go');
    return false;
}

/**
 * Schedule test notification (stub)
 */
export async function scheduleTestNotification(seconds: number = 5): Promise<string | null> {
    console.log('Notifications not available in Expo Go - use a development build');
    return null;
}

/**
 * Check if notifications are supported
 */
export function isNotificationSupported(): boolean {
    // Always false in Expo Go after SDK 53
    return false;
}
