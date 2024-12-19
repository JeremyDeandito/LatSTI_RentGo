import { createClient } from '@supabase/supabase-js';
import { auth } from '../assets/chat/firebase-config.js'

const SUPABASE_URL = 'https://fyxdwdblrxxiujsbrsiu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5eGR3ZGJscnh4aXVqc2Jyc2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NDkzMTYsImV4cCI6MjA1MDEyNTMxNn0.fr79pI5ugXNRk77OQNFDaubTc96I4T0sk2AC_34pYtg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export async function getSupabaseHeaders() {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        return {
            Authorization: `Bearer ${token}`
        }
    }
    return {}
}

console.log("Supabase initialized",supabase);