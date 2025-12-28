import { palette } from './colors';

// Theme interface - shared between light and dark
export interface Theme {
    bg: {
        primary: string;
        secondary: string;
        tertiary: string;
        inverse: string;
        card: string;
        cardHover: string;
    };
    text: {
        primary: string;
        secondary: string;
        tertiary: string;
        inverse: string;
        brand: string;
        accent: string;
    };
    border: {
        default: string;
        strong: string;
        focus: string;
        subtle: string;
    };
    interactive: {
        primary: string;
        primaryHover: string;
        primaryPressed: string;
        secondary: string;
        secondaryHover: string;
        accent: string;
        accentHover: string;
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
    gradient: {
        primary: string[];
        accent: string[];
        card: string[];
    };
}

// Light Theme Tokens - Premium Violet
export const lightTheme: Theme = {
    bg: {
        primary: '#fafafa',
        secondary: palette.white,
        tertiary: '#f4f4f5',
        inverse: palette.gray[900],
        card: 'rgba(255, 255, 255, 0.8)',
        cardHover: 'rgba(255, 255, 255, 0.95)',
    },
    text: {
        primary: palette.gray[900],
        secondary: palette.gray[600],
        tertiary: palette.gray[400],
        inverse: palette.white,
        brand: palette.brand[600],
        accent: palette.accent[500],
    },
    border: {
        default: 'rgba(0, 0, 0, 0.08)',
        strong: palette.gray[300],
        focus: palette.brand[500],
        subtle: 'rgba(139, 92, 246, 0.2)',
    },
    interactive: {
        primary: palette.brand[500],
        primaryHover: palette.brand[600],
        primaryPressed: palette.brand[700],
        secondary: palette.gray[100],
        secondaryHover: palette.gray[200],
        accent: palette.accent[500],
        accentHover: palette.accent[600],
    },
    status: {
        success: palette.success.light,
        warning: palette.warning.light,
        danger: palette.danger.light,
        info: palette.info.light,
    },
    subscription: {
        active: '#10b981',
        expiringSoon: '#f59e0b',
        expired: '#f43f5e',
        paused: palette.gray[400],
    },
    gradient: {
        primary: ['#8b5cf6', '#a855f7'],
        accent: ['#f43f5e', '#fb7185'],
        card: ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)'],
    },
};

// Dark Theme Tokens - Premium Deep Purple
export const darkTheme: Theme = {
    bg: {
        primary: '#0c0a14',
        secondary: '#13111c',
        tertiary: '#1a1726',
        inverse: palette.gray[100],
        card: 'rgba(26, 23, 38, 0.8)',
        cardHover: 'rgba(26, 23, 38, 0.95)',
    },
    text: {
        primary: '#fafafa',
        secondary: '#a1a1aa',
        tertiary: '#52525b',
        inverse: palette.gray[900],
        brand: palette.brand[400],
        accent: palette.accent[400],
    },
    border: {
        default: 'rgba(255, 255, 255, 0.08)',
        strong: 'rgba(255, 255, 255, 0.15)',
        focus: palette.brand[400],
        subtle: 'rgba(139, 92, 246, 0.3)',
    },
    interactive: {
        primary: palette.brand[500],
        primaryHover: palette.brand[400],
        primaryPressed: palette.brand[600],
        secondary: '#1a1726',
        secondaryHover: '#252236',
        accent: palette.accent[500],
        accentHover: palette.accent[400],
    },
    status: {
        success: palette.success.dark,
        warning: palette.warning.dark,
        danger: palette.danger.dark,
        info: palette.info.dark,
    },
    subscription: {
        active: '#34d399',
        expiringSoon: '#fbbf24',
        expired: '#fb7185',
        paused: palette.gray[500],
    },
    gradient: {
        primary: ['#8b5cf6', '#a855f7'],
        accent: ['#f43f5e', '#fb7185'],
        card: ['rgba(26,23,38,0.9)', 'rgba(26,23,38,0.7)'],
    },
};
