import { Stack, Redirect } from 'expo-router';
import { ThemeProvider, useTheme } from '../src/theme';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { loadSavedLanguage } from '../src/lib/i18n';
import { useUserStore } from '../src/store/userStore';
import '../src/lib/i18n';

function InitialLayout() {
    const { isDark, theme } = useTheme();
    const { isAuthenticated, isLoading, initialize } = useUserStore();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        loadSavedLanguage();
        initialize().then(() => setReady(true));
    }, []);

    // Show loading while initializing
    if (isLoading || !ready) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.bg.primary,
                }}
            >
                <ActivityIndicator size="large" color={theme.interactive.primary} />
            </View>
        );
    }

    return (
        <>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                    redirect={isAuthenticated}
                />
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                    redirect={!isAuthenticated}
                />
                <Stack.Screen
                    name="paywall"
                    options={{
                        headerShown: false,
                        presentation: 'modal',
                    }}
                />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <ThemeProvider>
            <InitialLayout />
        </ThemeProvider>
    );
}
