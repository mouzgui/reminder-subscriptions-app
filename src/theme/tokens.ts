import { palette } from './colors';

// Theme interface - shared between light and dark
export interface Theme {
    bg: {
        primary: string;
        secondary: string;
        tertiary: string;
        inverse: string;
    };
    text: {
        primary: string;
        secondary: string;
        tertiary: string;
        inverse: string;
        brand: string;
    };
    border: {
        default: string;
        strong: string;
        focus: string;
    };
    interactive: {
        primary: string;
        primaryHover: string;
        primaryPressed: string;
        secondary: string;
        secondaryHover: string;
    };
    status: {
        success: string;
        warning: string;
        danger: string;
        info: string;
    };
    subscription: {
        active: string;
        expiringSoon: string;
        expired: string;
        paused: string;
    };
}

// Light Theme Tokens
export const lightTheme: Theme = {
    bg: {
        primary: palette.gray[50],
        secondary: palette.white,
        tertiary: palette.gray[100],
        inverse: palette.gray[900],
    },
    text: {
        primary: palette.gray[900],
        secondary: palette.gray[600],
        tertiary: palette.gray[400],
        inverse: palette.white,
        brand: palette.brand[600],
    },
    border: {
        default: palette.gray[200],
        strong: palette.gray[300],
        focus: palette.brand[500],
    },
    interactive: {
        primary: palette.brand[500],
        primaryHover: palette.brand[600],
        primaryPressed: palette.brand[700],
        secondary: palette.gray[100],
        secondaryHover: palette.gray[200],
    },
    status: {
        success: palette.success.light,
        warning: palette.warning.light,
        danger: palette.danger.light,
        info: palette.info.light,
    },
    subscription: {
        active: '#22c55e',
        expiringSoon: '#f59e0b',
        expired: '#ef4444',
        paused: palette.gray[400],
    },
};

// Dark Theme Tokens
export const darkTheme: Theme = {
    bg: {
        primary: palette.gray[950],
        secondary: palette.gray[900],
        tertiary: palette.gray[800],
        inverse: palette.gray[100],
    },
    text: {
        primary: palette.gray[50],
        secondary: palette.gray[300],
        tertiary: palette.gray[500],
        inverse: palette.gray[900],
        brand: palette.brand[400],
    },
    border: {
        default: palette.gray[800],
        strong: palette.gray[700],
        focus: palette.brand[400],
    },
    interactive: {
        primary: palette.brand[500],
        primaryHover: palette.brand[400],
        primaryPressed: palette.brand[600],
        secondary: palette.gray[800],
        secondaryHover: palette.gray[700],
    },
    status: {
        success: palette.success.dark,
        warning: palette.warning.dark,
        danger: palette.danger.dark,
        info: palette.info.dark,
    },
    subscription: {
        active: '#4ade80',
        expiringSoon: '#fbbf24',
        expired: '#f87171',
        paused: palette.gray[500],
    },
};

