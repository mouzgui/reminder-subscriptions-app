// Supported Currencies
export const CURRENCIES = {
    USD: {
        code: 'USD',
        symbol: '$',
        name: 'US Dollar',
        position: 'before' as const,
        locale: 'en-US',
        flag: '🇺🇸',
    },
    EUR: {
        code: 'EUR',
        symbol: '€',
        name: 'Euro',
        position: 'after' as const,
        locale: 'fr-FR',
        flag: '🇪🇺',
    },
    MAD: {
        code: 'MAD',
        symbol: 'DH',
        name: 'Moroccan Dirham',
        position: 'after' as const,
        locale: 'ar-MA',
        flag: '🇲🇦',
    },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;
export type Currency = typeof CURRENCIES[CurrencyCode];

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currencyCode - The currency code (USD, EUR, MAD)
 * @param options - Optional formatting options
 */
export function formatCurrency(
    amount: number,
    currencyCode: CurrencyCode = 'USD',
    options?: {
        showSymbol?: boolean;
        decimals?: number;
    }
): string {
    const { showSymbol = true, decimals = 2 } = options || {};
    const currency = CURRENCIES[currencyCode];

    const formatted = amount.toFixed(decimals);

    if (!showSymbol) {
        return formatted;
    }

    if (currency.position === 'before') {
        return `${currency.symbol}${formatted}`;
    } else {
        return `${formatted} ${currency.symbol}`;
    }
}

/**
 * Parse a currency string back to a number
 * @param value - The string value to parse
 */
export function parseCurrencyValue(value: string): number {
    // Remove all non-numeric characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
}

/**
 * Get currency by code
 */
export function getCurrency(code: CurrencyCode): Currency {
    return CURRENCIES[code];
}

/**
 * Get all currencies as array
 */
export function getAllCurrencies(): Currency[] {
    return Object.values(CURRENCIES);
}
