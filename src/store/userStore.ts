import { create } from 'zustand';
import { supabase, signIn, signUp, signOut, getCurrentSession } from '../lib/supabase';
import { User, AuthState } from '../types/user';

interface UserState extends AuthState {
    // Actions
    initialize: () => Promise<void>;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()((set, get) => ({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,

    initialize: async () => {
        set({ isLoading: true });
        try {
            const session = await getCurrentSession();

            if (session?.user) {
                set({
                    user: {
                        id: session.user.id,
                        email: session.user.email || '',
                        created_at: session.user.created_at,
                    },
                    session,
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else {
                set({ isLoading: false });
            }

            // Listen for auth changes
            supabase.auth.onAuthStateChange((event, session) => {
                if (session?.user) {
                    set({
                        user: {
                            id: session.user.id,
                            email: session.user.email || '',
                            created_at: session.user.created_at,
                        },
                        session,
                        isAuthenticated: true,
                    });
                } else {
                    set({
                        user: null,
                        session: null,
                        isAuthenticated: false,
                    });
                }
            });
        } catch (error) {
            console.error('Failed to initialize auth:', error);
            set({ isLoading: false });
        }
    },

    login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
            const { session, user } = await signIn(email, password);

            if (user) {
                set({
                    user: {
                        id: user.id,
                        email: user.email || '',
                        created_at: user.created_at,
                    },
                    session,
                    isAuthenticated: true,
                    isLoading: false,
                });
                return { success: true };
            }

            set({ isLoading: false });
            return { success: false, error: 'Login failed' };
        } catch (error: any) {
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    register: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
            const { session, user } = await signUp(email, password);

            if (user) {
                set({
                    user: {
                        id: user.id,
                        email: user.email || '',
                        created_at: user.created_at,
                    },
                    session,
                    isAuthenticated: !!session, // May need email confirmation
                    isLoading: false,
                });
                return { success: true };
            }

            set({ isLoading: false });
            return { success: false, error: 'Registration failed' };
        } catch (error: any) {
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await signOut();
            set({
                user: null,
                session: null,
                isAuthenticated: false,
                isLoading: false,
            });
        } catch (error) {
            console.error('Logout error:', error);
            set({ isLoading: false });
        }
    },

    setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
    },
}));
