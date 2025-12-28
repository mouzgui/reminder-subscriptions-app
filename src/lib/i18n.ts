import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import enCommon from '../locales/en/common.json';
import frCommon from '../locales/fr/common.json';
import arCommon from '../locales/ar/common.json';

const LANGUAGE_STORAGE_KEY = '@zombie_subs_language';

// Supported languages
export const LANGUAGES = {
    en: { name: 'English', nativeName: 'English', dir: 'ltr' },
    fr: { name: 'French', nativeName: 'Français', dir: 'ltr' },
    ar: { name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

// Resources object
const resources = {
    en: { common: enCommon },
    fr: { common: frCommon },
    ar: { common: arCommon },
};

// Initialize i18next
i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // Default language
        fallbackLng: 'en',
        defaultNS: 'common',
        ns: ['common'],
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

// Load saved language preference
export async function loadSavedLanguage() {
    try {
        const savedLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLang && Object.keys(LANGUAGES).includes(savedLang)) {
            await changeLanguage(savedLang as LanguageCode);
        }
    } catch (error) {
        console.warn('Failed to load language preference:', error);
    }
}

// Change language and handle RTL
export async function changeLanguage(langCode: LanguageCode) {
    const isRTL = LANGUAGES[langCode].dir === 'rtl';

    // Update i18n
    await i18n.changeLanguage(langCode);

    // Handle RTL (requires app restart on some platforms)
    if (I18nManager.isRTL !== isRTL) {
        I18nManager.allowRTL(isRTL);
        I18nManager.forceRTL(isRTL);
        // Note: On iOS/Android, RTL changes require app restart
    }

    // Save preference
    try {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);
    } catch (error) {
        console.warn('Failed to save language preference:', error);
    }
}

// Get current language info
export function getCurrentLanguage(): LanguageCode {
    return i18n.language as LanguageCode;
}

export function isRTL(): boolean {
    const currentLang = getCurrentLanguage();
    return LANGUAGES[currentLang]?.dir === 'rtl';
}

export default i18n;
