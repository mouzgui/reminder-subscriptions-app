# 🧟 Zombie Subscriptions

A beautiful, modern subscription tracker app built with React Native & Expo. Never forget a subscription renewal again!

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## 🎮 Live Demo

**[Try it on Appetize.io →](YOUR_APPETIZE_LINK_HERE)**

## ✨ Features

- 📱 **Beautiful UI** - Modern design with smooth animations
- 🌙 **Dark/Light Mode** - Automatic theme switching
- 🌍 **Multi-language** - English, French, Arabic support
- 🔔 **Renewal Reminders** - Never miss a payment
- 🔐 **Authentication** - Supabase auth with email/password
- 💰 **Subscription Limit** - Free tier with Pro upgrade option
- 📊 **Dashboard** - Track total spending and upcoming renewals
- 🎨 **Category Icons** - Organized by streaming, productivity, etc.

## 📸 Screenshots

| Dashboard | Add Subscription | Settings |
|-----------|------------------|----------|
| Dark mode home | Quick add form | Theme & language |

## 🚀 Tech Stack

- **Framework:** React Native + Expo SDK 54
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based)
- **State:** Zustand
- **Backend:** Supabase (Auth + Database)
- **Styling:** Custom theme system
- **i18n:** react-i18next
- **Icons:** Lucide React Native
- **Animations:** React Native Reanimated

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/reminder-subscriptions-app.git

# Install dependencies
npm install

# Start the development server
npx expo start
```

## 🔧 Environment Setup

Create a `.env` file in the root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📂 Project Structure

```
├── app/                  # Expo Router screens
│   ├── (auth)/          # Auth screens (sign-in, sign-up)
│   ├── (tabs)/          # Main app tabs
│   └── _layout.tsx      # Root layout
├── src/
│   ├── components/      # Reusable UI components
│   ├── constants/       # App constants & tiers
│   ├── lib/             # Utilities (supabase, i18n)
│   ├── locales/         # Translation files
│   ├── store/           # Zustand stores
│   ├── theme/           # Theme configuration
│   └── types/           # TypeScript types
└── assets/              # Images & fonts
```

## 📱 Download APK

**[Download Android APK →](https://expo.dev/accounts/coldsama/projects/zombie-subscriptions/builds/37c488ed-5c28-40a2-9ac7-2539af62793e)**

## 📄 License

MIT License - feel free to use this project for learning!

---

Made with ❤️ by [Your Name]
