import { createClient } from '@supabase/supabase-js';
import type { Profile } from './studio';
export async function studioSession(request: Request, ownerOnly = false) {
 const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
 if (!token) throw new Error('401:Please sign in.');
 const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  global: {headers: {Authorization:`Bearer ${token}`}}, auth:{persistSession:false,autoRefreshToken:false}
 });
 const {data:{user},error} = await db.auth.getUser(token);
 if(error || !user) throw new Error('401:Your session expired. Please sign in again.');
 const {data:profile} = await db.from('studio_profiles').select('*').eq('id',user.id).single();
 if(!profile || (ownerOnly && profile.role!=='owner')) throw new Error('403:Owner access required.');
 return {db,user,profile:profile as Profile};
}
export function apiError(error: unknown) {
 const message = error instanceof Error ? error.message : 'Request failed.';
 const match = message.match(/^(401|403|503):(.+)$/);
 return Response.json({error:match ? match[2] : message},{status:match ? Number(match[1]) : 400});
}
