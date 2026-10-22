export async function GET(){
 const config={url:process.env.NEXT_PUBLIC_SUPABASE_URL,anonKey:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY};
 return new Response(`window.RENDERLINE_CONFIG=${JSON.stringify(config).replace(/</g,'\\u003c')};`,{headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-store'}});
}
