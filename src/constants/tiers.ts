// Tier Configuration
// Note: maxSubscriptions is the limit - users can have UP TO (maxSubscriptions - 1) before being blocked
export const FREE_TIER = {
    maxSubscriptions: 4, // Allows 3 subscriptions, blocks on 4th
    reminders: false,
    languages: ['en'] as const,
    currencies: ['USD'] as const,
    export: false,
} as const;

export const PRO_TIER = {
    maxSubscriptions: Infinity,
    reminders: true,
    languages: ['en', 'fr', 'ar'] as const,
    currencies: ['USD', 'EUR', 'MAD'] as const,
    export: true,
} as const;

// Pro Pricing
export const PRO_PRICE = {
    monthly: 4.99,
    yearly: 49.99, // ~2 months free
    currency: 'USD',
} as const;

// Feature Flags
export type ProFeature =
    | 'unlimited_subscriptions'
    | 'reminders'
    | 'all_languages'
    | 'all_currencies'
    | 'csv_export';

/**
 * Check if a user can access a feature based on their tier
 */
export function canAccessFeature(feature: ProFeature, isPro: boolean): boolean {
    if (isPro) return true;

    switch (feature) {
        case 'unlimited_subscriptions':
        case 'reminders':
        case 'all_languages':
        case 'all_currencies':
        case 'csv_export':
            return false;
        default:
            return false;
    }
}

/**
 * Check if user has reached free tier subscription limit
 * Users can have UP TO maxSubscriptions (inclusive), blocked when trying to exceed
 */
export function hasReachedSubscriptionLimit(
    currentCount: number,
    isPro: boolean
): boolean {
    if (isPro) return false;
    // Allow exactly 3 subscriptions, block only when trying to add 4th+
    return currentCount >= FREE_TIER.maxSubscriptions;
}

