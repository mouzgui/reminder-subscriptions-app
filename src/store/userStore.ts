import { create } from "zustand";
import {
  supabase,
  signIn,
  signUp,
  signOut,
  getCurrentSession,
} from "../lib/supabase";
import { User, AuthState } from "../types/user";

// Track if auth listener is already set up
let authListenerSetUp = false;

interface UserState extends AuthState {
  // Actions
  initialize: () => Promise<void>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  isInitialized: false,

  initialize: async () => {
    // Prevent multiple initializations
    if (get().isInitialized) return;

    try {
      const session = await getCurrentSession();

      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email || "",
            created_at: session.user.created_at,
          },
          session,
          isAuthenticated: true,
          isInitialized: true,
        });
      } else {
        set({ isInitialized: true, isAuthenticated: false });
      }

      // Only set up auth listener once
      if (!authListenerSetUp) {
        authListenerSetUp = true;
        supabase.auth.onAuthStateChange((event, session) => {
          console.log("Auth state changed:", event);
          const currentUser = get().user;
          const newUser = session?.user;

          // Only update if user status actually changed to prevent re-render loops
          if (!newUser && currentUser) {
            set({
              user: null,
              session: null,
              isAuthenticated: false,
            });
          } else if (
            newUser &&
            (!currentUser || currentUser.id !== newUser.id)
          ) {
            set({
              user: {
                id: newUser.id,
                email: newUser.email || "",
                created_at: newUser.created_at,
              },
              session,
              isAuthenticated: true,
            });
          }
        });
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      set({ isInitialized: true, isAuthenticated: false });
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
            email: user.email || "",
            created_at: user.created_at,
          },
          session,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      }

      set({ isLoading: false });
      return { success: false, error: "Login failed" };
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
            email: user.email || "",
            created_at: user.created_at,
          },
          session,
          isAuthenticated: !!session, // May need email confirmation
          isLoading: false,
        });
        return { success: true };
      }

      set({ isLoading: false });
      return { success: false, error: "Registration failed" };
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
      console.error("Logout error:", error);
      // Force clear state anyway if signOut fails
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },
}));
