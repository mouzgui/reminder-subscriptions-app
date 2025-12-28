// Spacing Scale (4px base unit)
export const spacing = {
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
    28: 112,
    32: 128,
} as const;

// Semantic Spacing
export const semanticSpacing = {
    // Screen padding
    screenPaddingX: spacing[4],
    screenPaddingY: spacing[6],

    // Card padding
    cardPadding: spacing[4],
    cardPaddingLarge: spacing[6],

    // Gaps
    sectionGap: spacing[6],
    itemGap: spacing[3],
    inlineGap: spacing[2],

    // Input
    inputPaddingX: spacing[3],
    inputPaddingY: spacing[3],
} as const;

// Border Radius
export const borderRadius = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
} as const;

// Semantic Border Radius
export const semanticBorderRadius = {
    card: borderRadius.xl,
    button: borderRadius.lg,
    input: borderRadius.md,
    badge: borderRadius.full,
    modal: borderRadius['2xl'],
} as const;

// Shadows (React Native compatible)
export const shadows = {
    none: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 5,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.2,
        shadowRadius: 25,
        elevation: 8,
    },
} as const;

// Semantic Shadows
export const semanticShadows = {
    card: shadows.md,
    cardHover: shadows.lg,
    button: shadows.sm,
    modal: shadows.xl,
    input: shadows.none,
    inputFocus: shadows.sm,
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
