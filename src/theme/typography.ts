// Typography Configuration
export const typography = {
    // Font Families
    fontFamily: {
        sans: 'Inter',
        mono: 'JetBrains Mono',
    },

    // Font Sizes (in pixels)
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
    },

    // Font Weights
    fontWeight: {
        normal: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },

    // Line Heights (multipliers)
    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },

    // Letter Spacing
    letterSpacing: {
        tight: -0.5,
        normal: 0,
        wide: 0.5,
    },
} as const;

// Predefined Text Style Classes (NativeWind)
export const textStyles = {
    // Headings
    h1: 'text-4xl font-bold text-text-primary',
    h2: 'text-3xl font-bold text-text-primary',
    h3: 'text-2xl font-semibold text-text-primary',
    h4: 'text-xl font-semibold text-text-primary',
    h5: 'text-lg font-medium text-text-primary',

    // Body
    body: 'text-base text-text-secondary',
    bodyLarge: 'text-lg text-text-secondary',
    bodySmall: 'text-sm text-text-secondary',

    // Specialty
    caption: 'text-xs text-text-tertiary',
    label: 'text-sm font-medium text-text-secondary',
    price: 'font-mono text-xl font-bold text-text-primary',
    priceLarge: 'font-mono text-3xl font-bold text-text-primary',

    // Interactive
    link: 'text-base font-medium text-text-brand',
    button: 'text-base font-semibold',
} as const;

export type Typography = typeof typography;
export type TextStyles = typeof textStyles;
