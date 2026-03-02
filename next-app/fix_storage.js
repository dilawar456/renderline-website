
require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// We will use the 'contact_phone_display' column as a fallback storage mechanism for portfolio_order
// since the user never migrated the DB schema for portfolio_order to exist.
supabase.from('site_content').update({
    contact_phone_display: JSON.stringify({'all':[166,160]})
}).eq('id', 1).then(r=>console.log(r));

