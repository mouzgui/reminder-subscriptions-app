import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subscription, CreateSubscriptionInput, UpdateSubscriptionInput } from '../types/subscription';
import { supabase } from '../lib/supabase';
import { CurrencyCode } from '../utils/currency';

interface SubscriptionState {
    subscriptions: Subscription[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchSubscriptions: () => Promise<void>;
    addSubscription: (input: CreateSubscriptionInput) => Promise<Subscription | null>;
    updateSubscription: (input: UpdateSubscriptionInput) => Promise<void>;
    deleteSubscription: (id: string) => Promise<void>;

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

                    set(state => ({
                        subscriptions: state.subscriptions.filter(sub => sub.id !== id),
                        isLoading: false,
                    }));
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
            partialize: (state) => ({ subscriptions: state.subscriptions }),
        }
    )
);
