// Color Palette - consistent across themes
export const palette = {
    // Brand Colors
    brand: {
        50: '#eef9ff',
        100: '#d9f1ff',
        200: '#bce8ff',
        300: '#8edaff',
        400: '#58c4ff',
        500: '#32a6ff',
        600: '#1a88f5',
        700: '#136fe1',
        800: '#1659b6',
        900: '#184b8f',
    },

    // Semantic Colors (light/dark variants)
    success: {
        light: '#22c55e',
        dark: '#4ade80',
    },
    warning: {
        light: '#f59e0b',
        dark: '#fbbf24',
    },
    danger: {
        light: '#ef4444',
        dark: '#f87171',
    },
    info: {
        light: '#3b82f6',
        dark: '#60a5fa',
    },

    // Neutral Grays
    gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
        950: '#030712',
    },

    // Pure colors
    white: '#ffffff',
    black: '#000000',
} as const;

export type ColorPalette = typeof palette;
