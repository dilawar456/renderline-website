'use strict';
const fs=require('node:fs'),path=require('node:path');
const {spawn}=require('node:child_process');
const {setTimeout:delay}=require('node:timers/promises');
const websiteDirectory=path.resolve(__dirname,'..');
require('dotenv').config({path:path.join(websiteDirectory,'.env.local'),quiet:true});
const portalDirectory=path.resolve(websiteDirectory,process.env.RENDERLINE_PORTAL_DIRECTORY || '../studio-portal');
const websiteUrl='http://127.0.0.1:3100/',portalUrl='http://127.0.0.1:4173/';
const websiteHealthUrl=new URL('/api/health',websiteUrl);
const logDirectory=path.join(websiteDirectory,'.renderline-local');
async function ready(url,kind){
  try{const response=await fetch(url,{signal:AbortSignal.timeout(3000),redirect:'error'});if(!response.ok)return false;const status=await response.json();return kind==='portal'?typeof status.enabled==='boolean':status.app==='renderline-website'&&status.status==='ok';}catch{return false;}
}
function background(args,directory,label,extra={}){
  fs.mkdirSync(logDirectory,{recursive:true});const log=fs.openSync(path.join(logDirectory,label+'.log'),'a');
  try{const child=spawn(process.execPath,args,{cwd:directory,detached:true,windowsHide:true,stdio:['ignore',log,log],env:{...process.env,...extra}});child.on('error',error=>console.error(`${label}: ${error.message}`));child.unref();}finally{fs.closeSync(log);}
}
async function waitReady(url,kind,seconds){
  const deadline=Date.now()+seconds*1000;while(Date.now()<deadline){if(await ready(url,kind))return;await delay(500);}throw Error(`${kind} did not start. Check ${path.join(logDirectory,kind+'.log')}. An existing app may be using its port.`);
}
async function main(){
  const next=path.join(websiteDirectory,'node_modules','next','dist','bin','next');
  if(!fs.existsSync(next))throw Error('Website dependencies are missing. Run npm install inside next-app first.');
  if(!fs.existsSync(path.join(portalDirectory,'server.js')))throw Error(`Portal folder was not found: ${portalDirectory}. Set RENDERLINE_PORTAL_DIRECTORY in next-app/.env.local.`);
  if(!await ready(new URL('/api/auth/status',portalUrl),'portal')){console.log('Starting your Renderline studio portal…');background([path.join(portalDirectory,'server.js')],portalDirectory,'portal',{RENDERLINE_WEBSITE_URL:websiteUrl,RENDERLINE_HOST:'127.0.0.1',RENDERLINE_PORT:'4173',RENDERLINE_WEBHOOK_PORT:'4174'});await waitReady(new URL('/api/auth/status',portalUrl),'portal',15);}
  if(!await ready(websiteHealthUrl,'website')){console.log('Starting your RenderLine website…');background([next,'dev','--hostname','127.0.0.1','--port','3100'],websiteDirectory,'website');await waitReady(websiteHealthUrl,'website',90);}
  console.log(`Website: ${websiteUrl}\nPortal entry: ${websiteUrl}portal`);
  if(!process.argv.includes('--no-open')){const browser=spawn('powershell.exe',['-NoProfile','-Command',`Start-Process -FilePath '${websiteUrl}'`],{windowsHide:true,stdio:'ignore'});browser.on('error',()=>console.log('Open the website address above in your browser.'));browser.unref();}
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
