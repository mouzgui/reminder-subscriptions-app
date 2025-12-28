import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { ThemeProvider, useTheme } from './src/theme';
import { Button, Card, Badge, Input } from './src/components/ui';
import './src/lib/i18n'; // Initialize i18n
import { useTranslation } from 'react-i18next';
import { loadSavedLanguage } from './src/lib/i18n';

function AppContent() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text.primary }]}>
            🧟 {t('app.name')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
            {t('app.tagline')}
          </Text>
        </View>

        {/* Theme Toggle */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            {t('settings.appearance.theme')}
          </Text>
          <View style={styles.buttonRow}>
            <Button variant="primary" onPress={toggleTheme}>
              {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </Button>
          </View>
        </Card>

        {/* UI Components Demo */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            UI Components
          </Text>

          {/* Buttons */}
          <View style={styles.componentGroup}>
            <Text style={[styles.label, { color: theme.text.secondary }]}>Buttons</Text>
            <View style={styles.buttonRow}>
              <Button variant="primary" size="sm">Primary</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
              <Button variant="outline" size="sm">Outline</Button>
            </View>
          </View>

          {/* Badges */}
          <View style={styles.componentGroup}>
            <Text style={[styles.label, { color: theme.text.secondary }]}>Badges</Text>
            <View style={styles.badgeRow}>
              <Badge variant="success">{t('subscription.status.active')}</Badge>
              <Badge variant="warning">{t('subscription.status.expiringSoon')}</Badge>
              <Badge variant="danger">{t('subscription.status.expired')}</Badge>
            </View>
          </View>

          {/* Input */}
          <View style={styles.componentGroup}>
            <Input
              label={t('subscription.add.namePlaceholder')}
              placeholder="Netflix, Spotify..."
            />
          </View>
        </Card>

        {/* Demo Subscription Card */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.subscriptionHeader}>
            <Text style={[styles.subscriptionName, { color: theme.text.primary }]}>
              Netflix
            </Text>
            <Badge variant="success">Active</Badge>
          </View>
          <Text style={[styles.price, { color: theme.text.brand }]}>
            $15.99/mo
          </Text>
          <Text style={[styles.renewalText, { color: theme.text.tertiary }]}>
            Renews in 12 days
          </Text>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.text.tertiary }]}>
            ✅ Project Setup Complete
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  componentGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subscriptionName: {
    fontSize: 18,
    fontWeight: '600',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  renewalText: {
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
  },
});
