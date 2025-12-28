// Tier Configuration
export const FREE_TIER = {
    maxSubscriptions: 3,
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
 */
export function hasReachedSubscriptionLimit(
    currentCount: number,
    isPro: boolean
): boolean {
    if (isPro) return false;
    return currentCount >= FREE_TIER.maxSubscriptions;
}
