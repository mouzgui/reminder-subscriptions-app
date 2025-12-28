import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subscription, CreateSubscriptionInput, UpdateSubscriptionInput } from '../types/subscription';
import { supabase } from '../lib/supabase';
import { CurrencyCode } from '../utils/currency';
import { scheduleAllRemindersForSubscription, cancelAllRemindersForSubscription } from '../lib/notifications';

interface SubscriptionState {
    subscriptions: Subscription[];
    isLoading: boolean;
    error: string | null;
    isInitialized: boolean;
    isSynced: boolean;

    // Actions (Supabase)
    fetchSubscriptions: () => Promise<void>;
    addSubscription: (input: CreateSubscriptionInput) => Promise<Subscription | null>;
    updateSubscription: (input: UpdateSubscriptionInput) => Promise<void>;
    deleteSubscription: (id: string) => Promise<void>;

    // Local-only actions (offline-first)
    addLocalSubscription: (input: CreateSubscriptionInput) => Subscription;
    deleteLocalSubscription: (id: string) => void;
    updateLocalSubscription: (input: UpdateSubscriptionInput) => void;
    initWithDemoData: () => void;
    clearAll: () => void;

    // Sync actions
    migrateLocalToCloud: (userId: string) => Promise<void>;
    syncWithCloud: () => Promise<void>;

    // Computed helpers
    getSubscriptionById: (id: string) => Subscription | undefined;
    getActiveSubscriptions: () => Subscription[];
    getExpiringSoonSubscriptions: (days?: number) => Subscription[];
    calculateBurnRate: (currency: CurrencyCode) => number;
}

export const useSubscriptionStore = create<SubscriptionState>()(
    persist(
        (set, get) => ({
            subscriptions: [],
            isLoading: false,
            error: null,
            isInitialized: false,
            isSynced: false,

            fetchSubscriptions: async () => {
                set({ isLoading: true, error: null });
                try {
                    const { data, error } = await supabase
                        .from('subscriptions')
                        .select('*')
                        .order('renewal_date', { ascending: true });

                    if (error) throw error;
                    set({ subscriptions: data || [], isLoading: false });
                } catch (error: any) {
                    set({ error: error.message, isLoading: false });
                }
            },

            addSubscription: async (input: CreateSubscriptionInput) => {
                set({ isLoading: true, error: null });
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error('Not authenticated');

                    const { data, error } = await supabase
                        .from('subscriptions')
                        .insert({
                            ...input,
                            user_id: user.id,
                            is_active: true,
                            reminder_days: [7, 1],
                        })
                        .select()
                        .single();

                    if (error) throw error;

                    set(state => ({
                        subscriptions: [...state.subscriptions, data],
                        isLoading: false,
                    }));

                    // Schedule renewal reminders
                    scheduleAllRemindersForSubscription(data);

                    return data;
                } catch (error: any) {
                    set({ error: error.message, isLoading: false });
                    return null;
                }
            },

            updateSubscription: async (input: UpdateSubscriptionInput) => {
                set({ isLoading: true, error: null });
                try {
                    const { id, ...updates } = input;
                    const { error } = await supabase
                        .from('subscriptions')
                        .update({ ...updates, updated_at: new Date().toISOString() })
                        .eq('id', id);

                    if (error) throw error;

                    set(state => ({
                        subscriptions: state.subscriptions.map(sub =>
                            sub.id === id ? { ...sub, ...updates } : sub
                        ),
                        isLoading: false,
                    }));
                } catch (error: any) {
                    set({ error: error.message, isLoading: false });
                }
            },

            deleteSubscription: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    const { error } = await supabase
                        .from('subscriptions')
                        .delete()
                        .eq('id', id);

                    if (error) throw error;

                    // Cancel scheduled reminders
                    cancelAllRemindersForSubscription(id);

                    set(state => ({
                        subscriptions: state.subscriptions.filter(sub => sub.id !== id),
                        isLoading: false,
                    }));
                } catch (error: any) {
                    set({ error: error.message, isLoading: false });
                }
            },

            // Local-only actions (offline-first)
            addLocalSubscription: (input: CreateSubscriptionInput) => {
                const now = new Date().toISOString();
                const newSubscription: Subscription = {
                    id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    user_id: 'local-user',
                    ...input,
                    is_active: true,
                    reminder_days: [7, 1],
                    created_at: now,
                    updated_at: now,
                };

                set(state => ({
                    subscriptions: [...state.subscriptions, newSubscription],
                }));

                // Schedule renewal reminders
                scheduleAllRemindersForSubscription(newSubscription);

                return newSubscription;
            },

            deleteLocalSubscription: (id: string) => {
                // Cancel scheduled reminders
                cancelAllRemindersForSubscription(id);

                set(state => ({
                    subscriptions: state.subscriptions.filter(sub => sub.id !== id),
                }));
            },

            updateLocalSubscription: (input: UpdateSubscriptionInput) => {
                const { id, ...updates } = input;
                set(state => ({
                    subscriptions: state.subscriptions.map(sub =>
                        sub.id === id
                            ? { ...sub, ...updates, updated_at: new Date().toISOString() }
                            : sub
                    ),
                }));
            },

            initWithDemoData: () => {
                const { subscriptions, isInitialized } = get();

                // Only initialize once and if there's no data
                if (isInitialized || subscriptions.length > 0) return;

                const now = new Date();
                const demoSubscriptions: Subscription[] = [
                    {
                        id: 'demo-1',
                        user_id: 'local-user',
                        name: 'Netflix',
                        price: 15.99,
                        currency: 'USD',
                        renewal_date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8).toISOString().split('T')[0],
                        category: 'streaming',
                        is_active: true,
                        reminder_days: [7, 1],
                        created_at: now.toISOString(),
                        updated_at: now.toISOString(),
                    },
                    {
                        id: 'demo-2',
                        user_id: 'local-user',
                        name: 'Spotify',
                        price: 9.99,
                        currency: 'USD',
                        renewal_date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3).toISOString().split('T')[0],
                        category: 'streaming',
                        is_active: true,
                        reminder_days: [7, 1],
                        created_at: now.toISOString(),
                        updated_at: now.toISOString(),
                    },
                    {
                        id: 'demo-3',
                        user_id: 'local-user',
                        name: 'Figma',
                        price: 12.00,
                        currency: 'USD',
                        renewal_date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 18).toISOString().split('T')[0],
                        category: 'design',
                        is_active: true,
                        reminder_days: [7, 1],
                        created_at: now.toISOString(),
                        updated_at: now.toISOString(),
                    },
                ];

                set({ subscriptions: demoSubscriptions, isInitialized: true });
            },

            clearAll: () => {
                set({ subscriptions: [], isInitialized: false, isSynced: false });
            },

            // Sync actions
            migrateLocalToCloud: async (userId: string) => {
                const { subscriptions, isSynced } = get();

                // Skip if already synced or no local subscriptions
                if (isSynced) return;

                const localSubscriptions = subscriptions.filter(
                    sub => sub.id.startsWith('local-') || sub.id.startsWith('demo-')
                );

                if (localSubscriptions.length === 0) {
                    set({ isSynced: true });
                    return;
                }

                set({ isLoading: true, error: null });

                try {
                    // Upload each local subscription to Supabase
                    const uploadPromises = localSubscriptions.map(sub => {
                        const { id, user_id, created_at, updated_at, ...subData } = sub;
                        return supabase
                            .from('subscriptions')
                            .insert({
                                ...subData,
                                user_id: userId,
                            })
                            .select()
                            .single();
                    });

                    const results = await Promise.all(uploadPromises);

                    // Replace local subscriptions with server versions
                    const newSubscriptions = results
                        .filter(r => r.data)
                        .map(r => r.data as Subscription);

                    set({
                        subscriptions: newSubscriptions,
                        isLoading: false,
                        isSynced: true,
                    });
                } catch (error: any) {
                    set({ error: error.message, isLoading: false });
                }
            },

            syncWithCloud: async () => {
                set({ isLoading: true, error: null });

                try {
                    const { data: { user } } = await supabase.auth.getUser();

                    if (!user) {
                        // Not authenticated, keep local data
                        set({ isLoading: false });
                        return;
                    }

                    const { subscriptions: localSubs, isSynced } = get();

                    // If not synced yet, migrate local data first
                    if (!isSynced && localSubs.length > 0) {
                        await get().migrateLocalToCloud(user.id);
                        return;
                    }

                    // Fetch from server
                    const { data, error } = await supabase
                        .from('subscriptions')
                        .select('*')
                        .order('renewal_date', { ascending: true });

                    if (error) throw error;

                    set({
                        subscriptions: data || [],
                        isLoading: false,
                        isSynced: true,
                    });
                } catch (error: any) {
                    set({ error: error.message, isLoading: false });
                }
            },

            getSubscriptionById: (id: string) => {
                return get().subscriptions.find(sub => sub.id === id);
            },

            getActiveSubscriptions: () => {
                return get().subscriptions.filter(sub => sub.is_active);
            },

            getExpiringSoonSubscriptions: (days: number = 7) => {
                const now = new Date();
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + days);

                return get().subscriptions.filter(sub => {
                    const renewalDate = new Date(sub.renewal_date);
                    return sub.is_active && renewalDate >= now && renewalDate <= futureDate;
                });
            },

            calculateBurnRate: (currency: CurrencyCode) => {
                return get()
                    .subscriptions
                    .filter(sub => sub.is_active && sub.currency === currency)
                    .reduce((total, sub) => total + sub.price, 0);
            },
        }),
        {
            name: 'subscriptions-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                subscriptions: state.subscriptions,
                isInitialized: state.isInitialized,
                isSynced: state.isSynced,
            }),
        }
    )
);
