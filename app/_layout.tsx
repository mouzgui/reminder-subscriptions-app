import { Stack, useRouter, useSegments } from "expo-router";
import { ThemeProvider, useTheme } from "../src/theme";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { activateKeepAwakeAsync } from "expo-keep-awake";
import { loadSavedLanguage } from "../src/lib/i18n";
import { useUserStore } from "../src/store/userStore";
import "../src/lib/i18n";
import "../global.css";

function AuthBoundary({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isInitialized = useUserStore((state) => state.isInitialized);
  const initialize = useUserStore((state) => state.initialize);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    async function init() {
      try {
        // Satisfy keep-awake requirements in dev
        if (__DEV__) {
          try {
            const { activateKeepAwakeAsync } = require("expo-keep-awake");
            activateKeepAwakeAsync().catch(() => { });
          } catch (e) {
            // Ignore if module not found
          }
        }
        await loadSavedLanguage();
        await initialize();
      } catch (error) {
        console.error("Initialization failed:", error);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const currentSegment = segments[0];
    const inAuthGroup = currentSegment === "(auth)";

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    } else if (
      !isAuthenticated &&
      currentSegment !== "(auth)" &&
      currentSegment !== undefined
    ) {
      router.replace("/(auth)/sign-in");
    }
  }, [isAuthenticated, segments[0], isInitialized]);

  if (!isInitialized) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000", // Fallback color
        }}
      >
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return <>{children}</>;
}

function InitialLayout() {
  const { isDark, theme } = useTheme();

  return (
    <AuthBoundary>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="paywall"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
      </Stack>
    </AuthBoundary>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <InitialLayout />
    </ThemeProvider>
  );
}
