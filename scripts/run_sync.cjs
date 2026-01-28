
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kyutidymyosvzjbdkdjj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dXRpZHlteW9zdnpqYmRrZGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjY4OTIsImV4cCI6MjA4NDg0Mjg5Mn0.LOiyN3fbseQVDyvQEq3XQQMWWOfk-M170y0-Fii94_I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runSync() {
    console.log('Attempting to sync profiles...');
    const { error } = await supabase.rpc('sync_missing_profiles');

    if (error) {
        console.error('Sync Error:', error.message);
        return;
    }

    console.log('Sync successful. Re-checking counts...');
    const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

    console.log(`TOTAL_STUDENTS_AFTER_SYNC: ${count}`);
}

runSync();
