'use client';
import { useEffect,useState } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { validTracking,type Tracking as Settings } from '@/lib/studio';
import { isPrivateAnalyticsPage, reportWhatsAppContact, WHATSAPP_CONTACT_EVENT } from '@/lib/contact-tracking';
declare global {interface Window {dataLayer?:unknown[];gtag?:(...args:unknown[])=>void;fbq?:Pixel;_fbq?:Pixel;}}
type Pixel=((...args:unknown[])=>void)&{queue?:unknown[][];loaded?:boolean;version?:string;callMethod?:(...args:unknown[])=>void;push?:Pixel};
let installed=false;
function setup(settings:Settings){
 if(installed)return;installed=true;
 if(settings.google_tag||settings.google_ads){
  window.dataLayer=window.dataLayer||[];
  // gtag's queue requires an Arguments object, rather than a plain array.
  // eslint-disable-next-line prefer-rest-params
  window.gtag=function(){window.dataLayer!.push(arguments);};
  window.gtag('js',new Date());
  for(const id of new Set([settings.google_tag,settings.google_ads].filter(Boolean)))window.gtag('config',id,{send_page_view:false});
  const script=document.createElement('script');script.async=true;script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(settings.google_tag||settings.google_ads)}`;document.head.appendChild(script);
 }
 if(settings.meta_pixel){
  const pixel:Pixel=function(...args){if(pixel.callMethod)pixel.callMethod(...args);else pixel.queue!.push(args);};
  pixel.queue=[];pixel.loaded=true;pixel.version='2.0';pixel.push=pixel;window.fbq=window._fbq=pixel;
  // Use explicit events only, including on forms that contain private enquiry details.
  pixel('set','autoConfig',false,settings.meta_pixel);
  pixel('init',settings.meta_pixel);
  const script=document.createElement('script');script.async=true;script.src='https://connect.facebook.net/en_US/fbevents.js';document.head.appendChild(script);
 }
}
export default function Tracking(){
 const path=usePathname(),privatePage=isPrivateAnalyticsPage(path);
 const [settings,setSettings]=useState<Settings|null>(null),[consent,setConsent]=useState<string|null>('loading');
 useEffect(()=>{supabase.from('studio_tracking').select('*').eq('id',1).single().then(({data})=>{try{setConsent(localStorage.getItem('renderline-analytics'));}catch{setConsent(null);}if(data&&validTracking(data))setSettings(data);});},[]);
 useEffect(()=>{
  if(privatePage||consent!=='yes'||!settings?.enabled)return;
  setup(settings);
  window.gtag?.('event','page_view',{page_location:window.location.origin+path,page_title:document.title});window.fbq?.('track','PageView');
  const contact=(event:Event)=>{
   let currentConsent:string|null=null;try{currentConsent=localStorage.getItem('renderline-analytics');}catch{}
   reportWhatsAppContact(event,{enabled:settings.enabled,consent:currentConsent,pathname:window.location.pathname,meta:settings.meta_pixel?window.fbq:undefined,google:settings.google_tag.startsWith('G-')?window.gtag:undefined});
  };
  window.addEventListener(WHATSAPP_CONTACT_EVENT,contact);return()=>window.removeEventListener(WHATSAPP_CONTACT_EVENT,contact);
 },[path,privatePage,settings,consent]);
 if(privatePage||!settings?.enabled)return null;
 const choose=(value:string)=>{try{localStorage.setItem('renderline-analytics',value);}catch{}setConsent(value);};
 if(consent==='loading')return null;
 if(consent!==null)return <button className="analytics-preferences" onClick={()=>{if(consent==='yes'){choose('no');window.location.reload();}else{setConsent(null);}}} title="Change analytics preference">{consent==='yes'?'Disable analytics':'Analytics off · change'}</button>;
 return <div className="analytics-consent" role="region" aria-label="Analytics preference"><p>Allow analytics to help us measure website visits and enquiries using Meta and Google?</p><button onClick={()=>choose('yes')}>Allow analytics</button><button onClick={()=>choose('no')}>No thanks</button></div>;
}
