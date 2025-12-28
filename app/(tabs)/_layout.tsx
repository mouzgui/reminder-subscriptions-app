import { Tabs } from 'expo-router';
import { useTheme } from '../../src/theme';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

// Simple icon components
function TabIcon({ name, focused, color }: { name: string; focused: boolean; color: string }) {
    const icons: Record<string, string> = {
        home: '🏠',
        add: '➕',
        settings: '⚙️',
    };

    return (
        <Text style={{ fontSize: focused ? 26 : 22 }}>
            {icons[name] || '📱'}
        </Text>
    );
}

export default function TabLayout() {
    const { theme, isDark } = useTheme();
    const { t } = useTranslation();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.interactive.primary,
                tabBarInactiveTintColor: theme.text.tertiary,
                tabBarStyle: {
                    backgroundColor: theme.bg.secondary,
                    borderTopColor: theme.border.default,
                    borderTopWidth: 1,
                    paddingTop: 8,
                    paddingBottom: 8,
                    height: 70,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: 4,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t('tabs.dashboard'),
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon name="home" focused={focused} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: t('tabs.add'),
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon name="add" focused={focused} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: t('tabs.settings'),
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon name="settings" focused={focused} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
