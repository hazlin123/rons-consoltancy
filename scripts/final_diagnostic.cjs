
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kyutidymyosvzjbdkdjj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dXRpZHlteW9zdnpqYmRrZGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjY4OTIsImV4cCI6MjA4NDg0Mjg5Mn0.LOiyN3fbseQVDyvQEq3XQQMWWOfk-M170y0-Fii94_I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function finalDiagnostic() {
    console.log('--- FINAL DIAGNOSTIC ---');

    // Try to use the RPC to count rows since the function definitely exists
    const { data: count, error: rpcError } = await supabase.rpc('sync_missing_profiles');
    if (rpcError) {
        console.log('RPC Error:', rpcError.message);
    } else {
        console.log('RPC sync_missing_profiles executed successfully.');
    }

    // Try to query the table again with a simpler select
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
        console.log('Direct profiles query error:', error.message);
    } else {
        console.log(`Success! Found ${data.length} profiles.`);
        console.log('Profile Emails:', data.map(p => p.email));
    }

    // Check journeys
    const { data: jData, error: jError } = await supabase.from('student_journeys').select('id');
    if (jError) console.log('Journeys error:', jError.message);
    else console.log(`Success! Found ${jData.length} journeys.`);

    console.log('--- END DIAGNOSTIC ---');
}

finalDiagnostic();
