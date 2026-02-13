import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const authActions = {
    signUp: async (email, password, displayName) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: displayName,
                },
            },
        });
        return { data, error };
    },

    signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    resetPassword: async (email) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        return { data, error };
    },

    updatePassword: async (newPassword) => {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });
        return { data, error };
    }
};

export const dataActions = {
    // Profiles
    fetchProfile: async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        return { data, error };
    },

    updateProfile: async (userId, updates) => {
        const { data, error } = await supabase
            .from('profiles')
            .update({ ...updates, updated_at: new Date() })
            .eq('id', userId);
        return { data, error };
    },

    // Watchlist & History
    fetchUserData: async (userId) => {
        const { data, error } = await supabase
            .from('user_data')
            .select('watchlist, history')
            .eq('id', userId)
            .single();
        return { data, error };
    },

    updateUserData: async (userId, updates) => {
        const { data, error } = await supabase
            .from('user_data')
            .update({ ...updates, updated_at: new Date() })
            .eq('id', userId);
        return { data, error };
    }
};
