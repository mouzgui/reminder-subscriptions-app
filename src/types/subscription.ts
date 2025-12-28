import { CurrencyCode } from '../utils/currency';

// Subscription Types
export interface Subscription {
    id: string;
    user_id: string;
    name: string;
    price: number;
    currency: CurrencyCode;
    renewal_date: string; // ISO date string
    category?: SubscriptionCategory;
    notes?: string;
    is_active: boolean;
    reminder_days: number[];
    created_at: string;
    updated_at: string;
}

export type SubscriptionCategory =
    | 'streaming'
    | 'productivity'
    | 'cloud'
    | 'design'
    | 'development'
    | 'marketing'
    | 'finance'
    | 'other';

export interface CreateSubscriptionInput {
    name: string;
    price: number;
    currency: CurrencyCode;
    renewal_date: string;
    category?: SubscriptionCategory;
    notes?: string;
}

export interface UpdateSubscriptionInput {
    id: string;
    name?: string;
    price?: number;
    currency?: CurrencyCode;
    renewal_date?: string;
    category?: SubscriptionCategory;
    notes?: string;
    is_active?: boolean;
}

// Subscription Status
export type SubscriptionStatus = 'active' | 'expiringSoon' | 'expired' | 'paused';

// For computing burn rate
export interface BurnRateData {
    total: number;
    currency: CurrencyCode;
    subscriptionCount: number;
}
