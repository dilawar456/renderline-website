import "server-only";
import { createClient } from '@supabase/supabase-js';
import type { Profile } from './studio';
import { safeApiError } from './http-security';
export async function studioSession(request: Request, ownerOnly = false) {
 const token = request.headers.get('authorization')?.match(/^Bearer ([^\s]+)$/i)?.[1];
 if (!token || token.length > 8192) throw new Error('401:Please sign in.');
 const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  global: {headers: {Authorization:`Bearer ${token}`}}, auth:{persistSession:false,autoRefreshToken:false}
 });
 const {data:{user},error} = await db.auth.getUser(token);
 if (error && (!error.status || error.status >= 500)) throw new Error('503:Sign-in verification is temporarily unavailable. Please retry.');
 if(error || !user) throw new Error('401:Your session expired. Please sign in again.');
 const {data:profile,error:profileError} = await db.from('studio_profiles').select('*').eq('id',user.id).single();
 if(profileError && profileError.code !== 'PGRST116') throw new Error('503:Workspace access could not be verified. Please retry.');
 if(!profile || (ownerOnly && profile.role!=='owner')) throw new Error('403:Owner access required.');
 return {db,user,profile:profile as Profile};
}
export const apiError = safeApiError;
