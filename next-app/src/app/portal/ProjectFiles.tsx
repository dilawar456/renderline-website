'use client';
import {useCallback,useEffect,useState} from 'react';
import {supabase} from '@/lib/supabase';
type FileRow={id:string;name:string;path:string;size:number;visibility:string;uploader_id:string|null};
export default function ProjectFiles({projectId,owner}:{projectId:string;owner:boolean}){
 const [files,setFiles]=useState<FileRow[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 const refresh=useCallback(async()=>{
  const {data,error}=await supabase.from('studio_files').select('*').eq('project_id',projectId).order('created_at',{ascending:false});
  if(error)throw Error('Project files are temporarily unavailable. Please retry or contact the studio.');
  setFiles(data||[]);setLoading(false);
 },[projectId]);
 useEffect(()=>{
  let active=true;
  const update=()=>{if(document.visibilityState==='visible')void refresh().catch(e=>{if(active){setError(e.message);setLoading(false);}});};
  update();const timer=window.setInterval(update,15000);window.addEventListener('focus',update);
  return()=>{active=false;window.clearInterval(timer);window.removeEventListener('focus',update);};
 },[refresh]);
 async function upload(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy)return;
  const form=event.currentTarget,file=new FormData(form).get('file');
  if(!(file instanceof File)||!file.size){setError('Choose a non-empty file.');return;}
  if(file.size>20*1024*1024){setError('Use a file up to 20 MB. For a larger model, share a private HTTPS download link in the project conversation.');return;}
  // Active content is not a useful architectural reference and should not be offered as a deliverable.
  if(/\.(?:exe|com|bat|cmd|ps1|js|mjs|cjs|html?|svg)$/i.test(file.name)){setError('Upload a drawing, image, PDF, document or model file. Executable and web-page files are not supported.');return;}
  setBusy(true);setError('');
  try{
   const {data:{user},error:authError}=await supabase.auth.getUser();if(authError||!user)throw Error('Your session expired. Please sign in again.');
   const name=file.name.slice(0,240),path=`${projectId}/${user.id}/${crypto.randomUUID()}/${name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
   const uploaded=await supabase.storage.from('studio-files').upload(path,file,{upsert:false});if(uploaded.error)throw Error('The file could not be uploaded. Check your connection and try again.');
   const saved=await supabase.from('studio_files').insert({project_id:projectId,path,name,size:file.size,uploader_id:user.id,visibility:'internal'});
   if(saved.error){await supabase.storage.from('studio-files').remove([path]);throw Error('The file record could not be saved. Please retry.');}
   form.reset();await refresh();
  }catch(e){setError(e instanceof Error?e.message:'File could not be uploaded.');}finally{setBusy(false);}
 }
 async function download(file:FileRow){
  if(busy)return;setBusy(true);setError('');
  try{const {data,error}=await supabase.storage.from('studio-files').createSignedUrl(file.path,60,{download:file.name});if(error||!data?.signedUrl)throw Error('This file is no longer available or your access has changed. Refresh and try again.');const link=document.createElement('a');link.href=data.signedUrl;link.rel='noopener noreferrer';link.target='_blank';link.click();}
  catch(e){setError(e instanceof Error?e.message:'Download failed.');}finally{setBusy(false);}
 }
 async function visibility(file:FileRow){
  if(busy)return;setBusy(true);setError('');
  try{const result=await supabase.from('studio_files').update({visibility:file.visibility==='client'?'internal':'client'}).eq('id',file.id).select('id');if(result.error||!result.data?.length)throw Error('This file could not be updated. Refresh your workspace and try again.');await refresh();}
  catch(e){setError(e instanceof Error?e.message:'Update failed.');}finally{setBusy(false);}
 }
 return <section className="studio-card"><span className="studio-eyebrow">REFERENCES & DELIVERY</span><h2>Project files</h2><p>{owner?'Review incoming references and share finished deliverables with your client. Every upload creates a separate file version.':'Upload drawings, references or screenshots for your project. Your own uploads and the files shared with you appear here.'}</p>{error&&<p className="studio-error" role="alert">{error}</p>}<form onSubmit={upload}><label className="studio-field"><span>Upload a reference or deliverable · up to 20 MB</span><input name="file" type="file" required disabled={busy}/></label><button className="studio-primary" disabled={busy}>{busy?'Please wait…':'Upload to project'}</button></form>{loading?<p role="status">Loading files…</p>:files.map(file=><div className="studio-person" key={file.id}><div><b>{file.name}</b><small>{(file.size/1024/1024).toFixed(2)} MB · {file.visibility==='client'?'Shared deliverable':owner?'Team reference':'Reference upload'}</small></div><div className="studio-row"><button disabled={busy} onClick={()=>void download(file)}>Download</button>{owner&&<button disabled={busy} onClick={()=>void visibility(file)}>{file.visibility==='client'?'Withdraw from client':'Share with client'}</button>}</div></div>)}{!loading&&!files.length&&<p className="studio-small">No files yet. Upload the first reference to get started.</p>}</section>;
}
