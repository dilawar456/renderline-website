import {studioSession,apiError} from '@/lib/studio-server';
export async function POST(request:Request){
 try{await studioSession(request,true);return Response.json({accountCreation:Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),aiOrganization:Boolean(process.env.OPENAI_API_KEY)},{headers:{'Cache-Control':'no-store'}});}catch(error){return apiError(error);}
}
