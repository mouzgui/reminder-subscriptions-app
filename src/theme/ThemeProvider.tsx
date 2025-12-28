import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme } from './tokens';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    mode: ThemeMode;
    isDark: boolean;
    setMode: (mode: ThemeMode) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@zombie_subs_theme';

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const systemColorScheme = useColorScheme();
    const [mode, setModeState] = useState<ThemeMode>('system');

    // Load saved theme preference (non-blocking)
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
                    setModeState(savedMode as ThemeMode);
                }
            } catch (error) {
                // AsyncStorage may not work on web, ignore errors
                console.log('Theme load skipped:', error);
            }
        };
        loadTheme();
    }, []);

    // Calculate if dark mode is active
    const isDark = mode === 'system'
        ? systemColorScheme === 'dark'
        : mode === 'dark';

    // Get the appropriate theme
    const theme = isDark ? darkTheme : lightTheme;

    // Set mode and persist
    const setMode = async (newMode: ThemeMode) => {
        setModeState(newMode);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
        } catch (error) {
            console.log('Theme save skipped:', error);
        }
    };

    // Toggle between light and dark
    const toggleTheme = () => {
        const newMode = isDark ? 'light' : 'dark';
        setMode(newMode);
    };

    // Always render children immediately - no waiting
    return (
        <ThemeContext.Provider value={{ theme, mode, isDark, setMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

// Export individual hooks for convenience
export function useIsDark() {
    const { isDark } = useTheme();
    return isDark;
}

export function useThemeColors() {
    const { theme } = useTheme();
    return theme;
}

