import { LanguageCode } from '../lib/i18n';
import { CurrencyCode } from '../utils/currency';
import { ThemeMode } from '../theme';

// User Types
export interface User {
    id: string;
    email: string;
    created_at: string;
}

// User Settings
export interface UserSettings {
    user_id: string;
    language: LanguageCode;
    currency: CurrencyCode;
    theme: ThemeMode;
    push_notifications: boolean;
    email_notifications: boolean;
    is_pro: boolean;
    created_at: string;
    updated_at: string;
}

export interface UpdateUserSettingsInput {
    language?: LanguageCode;
    currency?: CurrencyCode;
    theme?: ThemeMode;
    push_notifications?: boolean;
    email_notifications?: boolean;
}

// Auth State
export interface AuthState {
    user: User | null;
    session: any | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}
