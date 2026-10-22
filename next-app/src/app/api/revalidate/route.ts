import { revalidatePath } from 'next/cache';
import { studioSession,apiError } from '@/lib/studio-server';
export async function POST(request:Request) {
 try {
  await studioSession(request,true);
  for(const path of ['/','/portfolio','/about','/services','/contact']) revalidatePath(path);
  return Response.json({revalidated:true});
 } catch(error) {return apiError(error);}
}
