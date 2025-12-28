// Premium Color Palette - Violet & Coral theme
export const palette = {
    // Brand Colors - Vibrant Violet
    brand: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',  // Primary
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
        950: '#2e1065',
    },

    // Accent Colors - Coral/Salmon
    accent: {
        50: '#fff1f2',
        100: '#ffe4e6',
        200: '#fecdd3',
        300: '#fda4af',
        400: '#fb7185',
        500: '#f43f5e',  // Primary accent
        600: '#e11d48',
        700: '#be123c',
        800: '#9f1239',
        900: '#881337',
    },

    // Success - Mint/Emerald
    success: {
        light: '#10b981',
        dark: '#34d399',
        50: '#ecfdf5',
        500: '#10b981',
    },

    // Warning - Amber
    warning: {
        light: '#f59e0b',
        dark: '#fbbf24',
        50: '#fffbeb',
        500: '#f59e0b',
    },

    // Danger - Rose
    danger: {
        light: '#f43f5e',
        dark: '#fb7185',
        50: '#fff1f2',
        500: '#f43f5e',
    },

    // Info - Sky
    info: {
        light: '#0ea5e9',
        dark: '#38bdf8',
        50: '#f0f9ff',
        500: '#0ea5e9',
    },

    // Neutral Grays - slightly warm
    gray: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
        950: '#09090b',
    },

    // Pure colors
    white: '#ffffff',
    black: '#000000',

    // Gradient stops
    gradients: {
        primary: ['#8b5cf6', '#a855f7', '#d946ef'],
        accent: ['#f43f5e', '#fb7185', '#fda4af'],
        success: ['#10b981', '#34d399'],
        sunset: ['#f43f5e', '#f59e0b'],
        ocean: ['#0ea5e9', '#8b5cf6'],
    },
} as const;

export type ColorPalette = typeof palette;
