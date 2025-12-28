import * as Sharing from 'expo-sharing';
import { Subscription } from '../types/subscription';
import { Platform } from 'react-native';

/**
 * Convert subscriptions to CSV format
 */
export function subscriptionsToCSV(subscriptions: Subscription[]): string {
    const headers = [
        'Name',
        'Price',
        'Currency',
        'Renewal Date',
        'Category',
        'Status',
        'Notes',
    ];

    const rows = subscriptions.map(sub => [
        `"${sub.name}"`,
        sub.price.toString(),
        sub.currency,
        sub.renewal_date,
        sub.category || '',
        sub.is_active ? 'Active' : 'Inactive',
        `"${sub.notes || ''}"`,
    ]);

    return [
        headers.join(','),
        ...rows.map(row => row.join(',')),
    ].join('\n');
}

/**
 * Export subscriptions to CSV file and share
 */
export async function exportSubscriptionsToCSV(
    subscriptions: Subscription[]
): Promise<boolean> {
    try {
        const csv = subscriptionsToCSV(subscriptions);
        const fileName = `zombie-subscriptions-${new Date().toISOString().split('T')[0]}.csv`;

        if (Platform.OS === 'web') {
            // Web: Download directly
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
            return true;
        }

        // Native: Use expo-sharing with data URI
        const isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) {
            console.log('Sharing is not available on this device');
            return false;
        }

        // Create a data URI for the CSV
        const base64 = btoa(unescape(encodeURIComponent(csv)));
        const dataUri = `data:text/csv;base64,${base64}`;

        await Sharing.shareAsync(dataUri, {
            mimeType: 'text/csv',
            dialogTitle: 'Export Subscriptions',
            UTI: 'public.comma-separated-values-text',
        });

        return true;
    } catch (error) {
        console.error('Export failed:', error);
        return false;
    }
}
