import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yszjjnuvujnplboapsyq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzempqbnV2dWpucGxib2Fwc3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDE0MDAsImV4cCI6MjA2MzY3NzQwMH0.pY9wiHsbvww7XIxmopYesn2zQG7TB-m0q1ZcB_AfzPw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
