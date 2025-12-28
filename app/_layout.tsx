import { Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '../src/theme';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { loadSavedLanguage } from '../src/lib/i18n';
import '../src/lib/i18n';

function RootLayoutNav() {
    const { isDark } = useTheme();

    useEffect(() => {
        loadSavedLanguage();
    }, []);

    return (
        <>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <ThemeProvider>
            <RootLayoutNav />
        </ThemeProvider>
    );
}
