import { readJsonObject } from '@/lib/http-security';
import { createClient } from '@supabase/supabase-js';
import { studioSession, apiError } from '@/lib/studio-server';
export async function POST(request:Request) {
 try {
  const {db} = await studioSession(request,true);
  if(!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('503:Account creation needs SUPABASE_SERVICE_ROLE_KEY configured on the server.');
  const {name,email,password,role} = await readJsonObject(request, 16384);
  if(typeof name!=='string' || !name.trim() || name.length>120 || typeof email!=='string' || email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password!=='string' || password.length<12 || password.length>256 || typeof role!=='string' || !['team','client'].includes(role)) throw new Error('400:Enter a name, valid email and at least 12-character temporary password.');
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data,error} = await admin.auth.admin.createUser({email,password,email_confirm:true});
  if(error || !data.user) throw new Error('400:Account could not be created. Check the email and password, or use the existing account.');
  const {error:profileError} = await db.from('studio_profiles').insert({id:data.user.id,name:name.trim(),email:email.toLowerCase(),role});
  if(profileError) { await admin.auth.admin.deleteUser(data.user.id); throw new Error('503:Account profile could not be saved. Please retry.'); }
  return Response.json({ok:true});
 } catch(error) {return apiError(error);}
}
