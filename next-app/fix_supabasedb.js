
require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
    let res = await supabase.from('site_content').select('*').limit(1);
    console.log('Fields:', Object.keys(res.data[0]));
}
check();

