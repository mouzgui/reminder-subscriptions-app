import { Tabs } from 'expo-router';
import { useTheme } from '../../src/theme';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Home, Plus, Settings } from 'lucide-react-native';

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
                    height: 65,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 2,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t('tabs.dashboard'),
                    tabBarIcon: ({ focused, color }) => (
                        <View style={{
                            padding: 6,
                            borderRadius: 12,
                            backgroundColor: focused
                                ? isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)'
                                : 'transparent',
                        }}>
                            <Home
                                size={22}
                                color={color}
                                strokeWidth={focused ? 2.5 : 2}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: t('tabs.add'),
                    tabBarIcon: ({ focused, color }) => (
                        <View style={{
                            padding: 6,
                            borderRadius: 12,
                            backgroundColor: focused
                                ? isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)'
                                : 'transparent',
                        }}>
                            <Plus
                                size={22}
                                color={color}
                                strokeWidth={focused ? 2.5 : 2}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: t('tabs.settings'),
                    tabBarIcon: ({ focused, color }) => (
                        <View style={{
                            padding: 6,
                            borderRadius: 12,
                            backgroundColor: focused
                                ? isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)'
                                : 'transparent',
                        }}>
                            <Settings
                                size={22}
                                color={color}
                                strokeWidth={focused ? 2.5 : 2}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="subscription/[id]"
                options={{
                    href: null, // Hide from tab bar
                }}
            />
        </Tabs>
    );
}
