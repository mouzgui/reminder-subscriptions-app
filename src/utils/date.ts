/**
 * Calculate days until a date
 */
export function daysUntil(date: Date | string): number {
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date | string): boolean {
    return daysUntil(date) < 0;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string): boolean {
    return daysUntil(date) === 0;
}

/**
 * Check if a date is within N days
 */
export function isWithinDays(date: Date | string, days: number): boolean {
    const daysLeft = daysUntil(date);
    return daysLeft >= 0 && daysLeft <= days;
}

/**
 * Format a date for display
 */
export function formatDate(
    date: Date | string,
    options?: Intl.DateTimeFormatOptions,
    locale: string = 'en-US'
): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    return d.toLocaleDateString(locale, options || defaultOptions);
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 */
export function toISODateString(date: Date): string {
    return date.toISOString().split('T')[0];
}

/**
 * Get renewal status based on days until renewal
 */
export function getRenewalStatus(renewalDate: Date | string):
    'active' | 'expiringSoon' | 'expired' | 'today' {
    const days = daysUntil(renewalDate);

    if (days < 0) return 'expired';
    if (days === 0) return 'today';
    if (days <= 7) return 'expiringSoon';
    return 'active';
}

/**
 * Add months to a date
 */
export function addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
