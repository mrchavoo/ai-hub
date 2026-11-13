import { createClient } from '@supabase/supabase-js';

// Supabase panelinden alacağın bilgileri buraya yazacaksın
const SUPABASE_URL = 'https://vaguptcnmswwupussmrr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_VrNIj7RK3HJGZLymm02F0Q_HdmIZfBN';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);