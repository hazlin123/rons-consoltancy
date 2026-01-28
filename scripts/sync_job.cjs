
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kyutidymyosvzjbdkdjj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dXRpZHlteW9zdnpqYmRrZGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjY4OTIsImV4cCI6MjA4NDg0Mjg5Mn0.LOiyN3fbseQVDyvQEq3XQQMWWOfk-M170y0-Fii94_I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function syncAndCheck() {
    console.log('Attempting to execute sync_missing_profiles RPC...');
    const { error } = await supabase.rpc('sync_missing_profiles');

    if (error) {
        if (error.message.includes('Could not find the function')) {
            console.log('RPC FAILED: The function "sync_missing_profiles" does not exist in the database yet. The user MUST run the SQL script.');
        } else {
            console.error('RPC Error:', error.message);
        }
        return;
    }

    console.log('RPC success. Searching for "Job" again...');
    const { data } = await supabase.from('profiles').select('*').ilike('name', '%Job%');

    if (data && data.length > 0) {
        console.log('SUCCESS: Job is now in the directory!', JSON.stringify(data[0], null, 2));
    } else {
        console.log('STILL NOT FOUND: Even after sync, Job is missing. He might not be in auth.users or his name is different.');
    }
}

syncAndCheck();
