import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: 'sb-access-token',
        storage: {
            getItem: (key) => {
                if (typeof window === 'undefined') {
                    return null;
                }
                return document.cookie.split('; ').reduce<string | null>((acc, cookie) => {
                    const [name, value] = cookie.split('=');
                    return name === key ? decodeURIComponent(value) : acc;
                }, null);
            },
            setItem: (key, value) => {
                if (typeof window !== 'undefined') {
                    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; secure; samesite=lax`;
                }
            },
            removeItem: (key) => {
                if (typeof window !== 'undefined') {
                    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
                }
            },
        },
    },
});