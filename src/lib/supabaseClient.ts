
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const logMessage = async (sessionId: string, role: 'user' | 'assistant', content: string) => {
    if (!supabase) return;

    try {
        await supabase.from('chat_messages').insert({
            session_id: sessionId,
            role,
            content
        });
    } catch (error) {
        console.error('Error logging message to Supabase:', error);
    }
};

export const initSession = async () => {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase.from('chat_sessions').insert({
            user_agent: navigator.userAgent,
            referer: document.referrer
        }).select().single();

        if (error) throw error;
        return data?.id;
    } catch (error) {
        console.error('Error creating chat session:', error);
        return null; // Fallback to local session handling if DB fails
    }
};
