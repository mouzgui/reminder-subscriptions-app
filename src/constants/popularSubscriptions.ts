/**
 * Popular Subscription Services Database
 * Contains real subscription services with logos, default prices, and categories
 */

export interface PopularSubscription {
    id: string;
    name: string;
    logoUrl: string;
    defaultPrice: number;
    category: string;
    color: string; // Brand color for fallback/accent
}

// Using free logo APIs and CDNs for real brand logos
export const POPULAR_SUBSCRIPTIONS: PopularSubscription[] = [
    // Streaming
    {
        id: 'netflix',
        name: 'Netflix',
        logoUrl: 'https://cdn.simpleicons.org/netflix/E50914',
        defaultPrice: 15.99,
        category: 'streaming',
        color: '#E50914',
    },
    {
        id: 'spotify',
        name: 'Spotify',
        logoUrl: 'https://cdn.simpleicons.org/spotify/1DB954',
        defaultPrice: 9.99,
        category: 'music',
        color: '#1DB954',
    },
    {
        id: 'prime-video',
        name: 'Prime Video',
        logoUrl: 'https://cdn.simpleicons.org/amazonprime/00A8E1',
        defaultPrice: 8.99,
        category: 'streaming',
        color: '#00A8E1',
    },
    {
        id: 'hbo-max',
        name: 'HBO Max',
        logoUrl: 'https://cdn.simpleicons.org/hbo/000000',
        defaultPrice: 15.99,
        category: 'streaming',
        color: '#5822B4',
    },
    {
        id: 'crunchyroll',
        name: 'Crunchyroll',
        logoUrl: 'https://cdn.simpleicons.org/crunchyroll/F47521',
        defaultPrice: 7.99,
        category: 'streaming',
        color: '#F47521',
    },
    {
        id: 'apple-tv',
        name: 'Apple TV+',
        logoUrl: 'https://cdn.simpleicons.org/appletv/000000',
        defaultPrice: 6.99,
        category: 'streaming',
        color: '#000000',
    },
    {
        id: 'youtube-premium',
        name: 'YouTube Premium',
        logoUrl: 'https://cdn.simpleicons.org/youtube/FF0000',
        defaultPrice: 11.99,
        category: 'streaming',
        color: '#FF0000',
    },
    {
        id: 'twitch',
        name: 'Twitch',
        logoUrl: 'https://cdn.simpleicons.org/twitch/9146FF',
        defaultPrice: 8.99,
        category: 'streaming',
        color: '#9146FF',
    },
    // Productivity
    {
        id: 'notion',
        name: 'Notion',
        logoUrl: 'https://cdn.simpleicons.org/notion/000000',
        defaultPrice: 8.00,
        category: 'productivity',
        color: '#000000',
    },
    {
        id: 'slack',
        name: 'Slack',
        logoUrl: 'https://cdn.simpleicons.org/slack/4A154B',
        defaultPrice: 7.25,
        category: 'productivity',
        color: '#4A154B',
    },
    {
        id: 'microsoft-365',
        name: 'Microsoft 365',
        logoUrl: 'https://cdn.simpleicons.org/microsoft/00A4EF',
        defaultPrice: 9.99,
        category: 'productivity',
        color: '#00A4EF',
    },
    {
        id: 'dropbox',
        name: 'Dropbox',
        logoUrl: 'https://cdn.simpleicons.org/dropbox/0061FF',
        defaultPrice: 11.99,
        category: 'cloud',
        color: '#0061FF',
    },
    {
        id: 'google-one',
        name: 'Google One',
        logoUrl: 'https://cdn.simpleicons.org/google/4285F4',
        defaultPrice: 2.99,
        category: 'cloud',
        color: '#4285F4',
    },
    {
        id: 'icloud',
        name: 'iCloud+',
        logoUrl: 'https://cdn.simpleicons.org/icloud/3693F3',
        defaultPrice: 2.99,
        category: 'cloud',
        color: '#3693F3',
    },
    // Design
    {
        id: 'figma',
        name: 'Figma',
        logoUrl: 'https://cdn.simpleicons.org/figma/F24E1E',
        defaultPrice: 12.00,
        category: 'design',
        color: '#F24E1E',
    },
    {
        id: 'adobe-cc',
        name: 'Adobe Creative Cloud',
        logoUrl: 'https://cdn.simpleicons.org/adobe/FF0000',
        defaultPrice: 54.99,
        category: 'design',
        color: '#FF0000',
    },
    {
        id: 'canva',
        name: 'Canva Pro',
        logoUrl: 'https://cdn.simpleicons.org/canva/00C4CC',
        defaultPrice: 12.99,
        category: 'design',
        color: '#00C4CC',
    },
    // Development
    {
        id: 'github',
        name: 'GitHub Pro',
        logoUrl: 'https://cdn.simpleicons.org/github/181717',
        defaultPrice: 4.00,
        category: 'development',
        color: '#181717',
    },
    {
        id: 'jetbrains',
        name: 'JetBrains',
        logoUrl: 'https://cdn.simpleicons.org/jetbrains/000000',
        defaultPrice: 24.90,
        category: 'development',
        color: '#000000',
    },
    // Fitness
    {
        id: 'peloton',
        name: 'Peloton',
        logoUrl: 'https://cdn.simpleicons.org/peloton/000000',
        defaultPrice: 12.99,
        category: 'fitness',
        color: '#000000',
    },
    {
        id: 'strava',
        name: 'Strava',
        logoUrl: 'https://cdn.simpleicons.org/strava/FC4C02',
        defaultPrice: 5.00,
        category: 'fitness',
        color: '#FC4C02',
    },
    // Gaming
    {
        id: 'xbox-game-pass',
        name: 'Xbox Game Pass',
        logoUrl: 'https://cdn.simpleicons.org/xbox/107C10',
        defaultPrice: 14.99,
        category: 'gaming',
        color: '#107C10',
    },
    {
        id: 'playstation-plus',
        name: 'PlayStation Plus',
        logoUrl: 'https://cdn.simpleicons.org/playstation/003791',
        defaultPrice: 9.99,
        category: 'gaming',
        color: '#003791',
    },
    {
        id: 'nintendo-online',
        name: 'Nintendo Online',
        logoUrl: 'https://cdn.simpleicons.org/nintendoswitch/E60012',
        defaultPrice: 3.99,
        category: 'gaming',
        color: '#E60012',
    },
    // News
    {
        id: 'nytimes',
        name: 'NY Times',
        logoUrl: 'https://cdn.simpleicons.org/nytimes/000000',
        defaultPrice: 4.25,
        category: 'news',
        color: '#000000',
    },
    {
        id: 'medium',
        name: 'Medium',
        logoUrl: 'https://cdn.simpleicons.org/medium/000000',
        defaultPrice: 5.00,
        category: 'news',
        color: '#000000',
    },
];

// Helper to find a subscription by name (case-insensitive partial match)
export function findPopularSubscription(query: string): PopularSubscription[] {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return [];

    return POPULAR_SUBSCRIPTIONS.filter(sub =>
        sub.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 5); // Max 5 suggestions
}

// Helper to get subscription by ID
export function getPopularSubscriptionById(id: string): PopularSubscription | undefined {
    return POPULAR_SUBSCRIPTIONS.find(sub => sub.id === id);
}

// Helper to get logo URL for a subscription name
export function getSubscriptionLogo(name: string): string | null {
    const sub = POPULAR_SUBSCRIPTIONS.find(
        s => s.name.toLowerCase() === name.toLowerCase()
    );
    return sub?.logoUrl || null;
}
