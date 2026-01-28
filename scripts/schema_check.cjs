
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kyutidymyosvzjbdkdjj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dXRpZHlteW9zdnpqYmRrZGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjY4OTIsImV4cCI6MjA4NDg0Mjg5Mn0.LOiyN3fbseQVDyvQEq3XQQMWWOfk-M170y0-Fii94_I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
    console.log('Checking information_schema.tables...');
    // We try to query a system table that is usually readable
    const { data, error } = await supabase.from('profiles').select('id').limit(1);

    if (error) {
        console.log('Error querying profiles:', error.message);
        if (error.message.includes('relation "profiles" does not exist')) {
            console.log('CRITICAL: The profiles table IS NOT in the database.');
        }
    } else {
        console.log('Success: Profiles table EXISTS.');
    }

    // Check if we can at least list objects in public
    const { data: schemas, error: sError } = await supabase.rpc('sync_missing_profiles');
    if (sError) {
        console.log('Sync RPC Error:', sError.message);
    } else {
        console.log('Sync RPC Success!');
    }
}

checkSchema();
