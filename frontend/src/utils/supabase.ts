import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
        fetch: async (url, options = {}) => {
            const getCookie = (name: string) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop()?.split(';').shift();
                return null;
            };
            
            const token = getCookie('access_token');
            const headers = new Headers(options?.headers || {});
            
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            
            return fetch(url, { ...options, headers });
        }
    }
});

// To prevent breaking existing code that changed to getSupabaseClient
export const getSupabaseClient = () => supabase;
