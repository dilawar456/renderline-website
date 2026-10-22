'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Message = { id:string; body:string; kind:string; file_id:string|null; created_at:string; author_id:string };
type Deliverable = { id:string; name:string; visibility:string };
export default function ProjectConversation({projectId,userId}:{projectId:string;userId:string}) {
 const [messages,setMessages]=useState<Message[]>([]),[files,setFiles]=useState<Deliverable[]>([]);
 const [body,setBody]=useState(''),[kind,setKind]=useState('comment'),[fileId,setFileId]=useState('');
 const [error,setError]=useState(''),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true);
 const mounted=useRef(true);
 const refresh=useCallback(async()=>{
  const [conversation,deliverables]=await Promise.all([
   supabase.from('studio_feedback').select('*').eq('project_id',projectId).order('created_at',{ascending:false}).limit(200),
   supabase.from('studio_files').select('id,name,visibility').eq('project_id',projectId).eq('visibility','client').order('created_at',{ascending:false}),
  ]);
  if(conversation.error||deliverables.error)throw Error('Project conversation is temporarily unavailable. Please retry or contact the studio.');
  if(mounted.current){setMessages((conversation.data||[]).reverse());setFiles(deliverables.data||[]);setLoading(false);}
 },[projectId]);
 useEffect(()=>{
  mounted.current=true;
  const update=()=>{if(document.visibilityState==='visible')void refresh().catch(e=>{if(mounted.current){setError(e.message);setLoading(false);}});};
  update();const timer=window.setInterval(update,15000);window.addEventListener('focus',update);
  return()=>{mounted.current=false;window.clearInterval(timer);window.removeEventListener('focus',update);};
 },[refresh]);
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy||!body.trim())return;
  setBusy(true);setError('');
  try{
   if(kind==='approval'&&!fileId)throw Error('Choose the exact deliverable you are approving.');
   const result=await supabase.from('studio_feedback').insert({project_id:projectId,body:body.trim(),kind,file_id:fileId||null,author_id:userId});
   if(result.error)throw Error(result.error.code==='23505'?'You have already approved this deliverable.':'Your message could not be saved. Please retry.');
   setBody('');setKind('comment');setFileId('');await refresh();
  }catch(e){setError(e instanceof Error?e.message:'Your message could not be saved.');}finally{setBusy(false);}
 }
 return <section className="studio-card"><span className="studio-eyebrow">CLIENT & STUDIO</span><h2>Project conversation</h2><p>Ask questions, request changes or approve a specific delivered file. Everyone with access to this project can read this conversation.</p>
  {error&&<p role="alert" className="studio-error">{error}</p>}
  <div className="studio-conversation" role="log" aria-label="Project messages" aria-live="polite">{loading?<p role="status">Loading conversation…</p>:messages.length?messages.map(message=><article key={message.id} className={`studio-message ${message.author_id===userId?'own':''}`}><header><b>{message.author_id===userId?'You':'Project participant'}</b><span className="studio-badge">{message.kind==='approval'?'Deliverable approved':message.kind==='revision'?'Change requested':'Message'}</span><time dateTime={message.created_at}>{new Date(message.created_at).toLocaleString('en-GB')}</time></header>{message.file_id&&<small>File: {files.find(file=>file.id===message.file_id)?.name||'Previously shared deliverable'}</small>}<p className="studio-prose">{message.body}</p></article>):<p className="studio-small">No messages yet. Your project questions and feedback belong here.</p>}</div>
  <form onSubmit={submit}><div className="studio-row"><label className="studio-field"><span>Message type</span><select value={kind} onChange={e=>setKind(e.target.value)} disabled={busy}><option value="comment">Question / message</option><option value="revision">Request a change</option><option value="approval">Approve a deliverable</option></select></label><label className="studio-field"><span>Related deliverable {kind==='approval'?'(required)':'(optional)'}</span><select value={fileId} onChange={e=>setFileId(e.target.value)} required={kind==='approval'} disabled={busy}><option value="">Choose a delivered file</option>{files.map(file=><option key={file.id} value={file.id}>{file.name}</option>)}</select></label></div><label className="studio-field"><span>{kind==='approval'?'Confirm what you approve':'Your message'}</span><textarea value={body} onChange={e=>setBody(e.target.value)} required maxLength={5000} rows={4} disabled={busy} placeholder={kind==='approval'?'I approve this exact deliverable.':'Write your question or change request…'}/></label><button className="studio-primary" disabled={busy||loading||!body.trim()}>{busy?'Saving…':kind==='approval'?'Confirm deliverable approval':'Send to project'}</button></form>
 </section>;
}
