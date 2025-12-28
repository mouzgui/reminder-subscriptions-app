# 🧟 Zombie Subscriptions - Project Rules & Conventions

> "The Global Painkiller for Zombie Subscriptions"

A lean, high-utility mobile application designed to help freelancers and solo founders worldwide stop losing money to forgotten tool renewals.

---

## 🎯 Project Vision

**Target Audience:** Freelancers and Solo Founders worldwide
**Core Problem:** Forgotten subscription renewals draining money
**Key Differentiator:** Multi-language support with RTL, localized currencies, and automated reminders

---

## 🛠 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React Native (Expo) | Single codebase for Android/iOS |
| Styling | NativeWind (TailwindCSS) | Professional SaaS aesthetic |
| Backend/Auth | Supabase | Secure data storage & user management |
| Automation | Supabase Edge Functions | Daily reminder "Brain" |
| Notifications | Expo Push API | Reliable, free push alerts |
| Languages | i18next + react-i18next | Industry-standard translations |
| Architecture | RevenueCat (Mock) | Pro-level subscription logic |

---

## 📁 Project Structure

See the actual `src/` folder for the implemented structure including:
- `src/theme/` - Design tokens, ThemeProvider
- `src/components/ui/` - Button, Card, Input, Badge
- `src/locales/` - EN, FR, AR translations
- `src/store/` - Zustand stores
- `src/lib/` - Supabase, i18n config
- `src/utils/` - Currency, date utilities
- `src/types/` - TypeScript definitions
- `src/constants/` - Tier configuration

---

## 📝 Coding Conventions

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files/Folders | kebab-case | `subscription-card.tsx` |
| Components | PascalCase | `SubscriptionCard` |
| Functions | camelCase | `formatCurrency()` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_FREE_SUBSCRIPTIONS` |

### RTL Support

```tsx
// ✅ Use start/end instead of left/right
<View className="ps-4 pe-2">

// ❌ Don't use left/right
<View className="pl-4 pr-2">
```

---

## 🌍 Internationalization

| Language | Code | Direction | Currency |
|----------|------|-----------|----------|
| English | `en` | LTR | USD ($) |
| French | `fr` | LTR | EUR (€) |
| Arabic | `ar` | RTL | MAD (DH) |

---

## 💰 Monetization

| Feature | Free Tier | Pro Tier |
|---------|-----------|----------|
| Subscriptions | 3 max | Unlimited |
| Reminders | ❌ | ✅ |
| Languages | EN only | EN/FR/AR |
| Export | ❌ | CSV ✅ |

---

## 📱 Design Tokens

See `src/theme/` for complete implementation:
- `colors.ts` - Color palette
- `tokens.ts` - Light/dark theme tokens
- `typography.ts` - Text styles
- `spacing.ts` - Spacing, shadows, border radius
- `ThemeProvider.tsx` - Theme context with persistence
