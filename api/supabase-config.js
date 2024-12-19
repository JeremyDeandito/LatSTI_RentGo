import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fyxdwdblrxxiujsbrsiu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5eGR3ZGJscnh4aXVqc2Jyc2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NDkzMTYsImV4cCI6MjA1MDEyNTMxNn0.fr79pI5ugXNRk77OQNFDaubTc96I4T0sk2AC_34pYtg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Supabase initialized",supabase);