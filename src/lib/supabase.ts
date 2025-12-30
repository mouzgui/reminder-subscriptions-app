import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase Configuration
// Replace these with your actual Supabase credentials
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Auth helpers
export async function signUp(email: string, password: string) {
    // Note: For mobile apps, email confirmation redirects can be problematic.
    // Option 1: Disable email confirmation in Supabase Dashboard → Authentication → Settings → Email Auth
    // Option 2: Use the redirect URL and handle it in your app
    // Option 3: Keep email confirmation but tell users to sign in after confirming
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
}

export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
}

// Database Types (to be generated with Supabase CLI)
export type Database = {
    public: {
        Tables: {
            subscriptions: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    price: number;
                    currency: string;
                    renewal_date: string;
                    category: string | null;
                    notes: string | null;
                    is_active: boolean;
                    reminder_days: number[];
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
            };
            user_settings: {
                Row: {
                    user_id: string;
                    language: string;
                    currency: string;
                    theme: string;
                    push_notifications: boolean;
                    email_notifications: boolean;
                    is_pro: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['user_settings']['Row'], 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['user_settings']['Insert']>;
            };
        };
    };
};
