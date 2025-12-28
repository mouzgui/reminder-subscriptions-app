import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageCode, changeLanguage } from '../lib/i18n';
import { CurrencyCode } from '../utils/currency';
import { ThemeMode } from '../theme';

interface SettingsState {
    // Settings values
    language: LanguageCode;
    currency: CurrencyCode;
    theme: ThemeMode;
    pushNotifications: boolean;
    emailNotifications: boolean;
    isPro: boolean;

    // Actions
    setLanguage: (language: LanguageCode) => Promise<void>;
    setCurrency: (currency: CurrencyCode) => void;
    setTheme: (theme: ThemeMode) => void;
    setPushNotifications: (enabled: boolean) => void;
    setEmailNotifications: (enabled: boolean) => void;
    setIsPro: (isPro: boolean) => void;

    // Sync with backend
    syncFromBackend: (settings: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            // Default values
            language: 'en',
            currency: 'USD',
            theme: 'system',
            pushNotifications: true,
            emailNotifications: true,
            isPro: false,

            setLanguage: async (language: LanguageCode) => {
                await changeLanguage(language);
                set({ language });
            },

            setCurrency: (currency: CurrencyCode) => {
                set({ currency });
            },

            setTheme: (theme: ThemeMode) => {
                set({ theme });
            },

            setPushNotifications: (enabled: boolean) => {
                set({ pushNotifications: enabled });
            },

            setEmailNotifications: (enabled: boolean) => {
                set({ emailNotifications: enabled });
            },

            setIsPro: (isPro: boolean) => {
                set({ isPro });
            },

            syncFromBackend: (settings: Partial<SettingsState>) => {
                set(settings);
            },
        }),
        {
            name: 'settings-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// Selector hooks for convenience
export const useLanguage = () => useSettingsStore(state => state.language);
export const useCurrency = () => useSettingsStore(state => state.currency);
export const useIsPro = () => useSettingsStore(state => state.isPro);
