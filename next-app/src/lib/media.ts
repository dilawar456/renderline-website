export function optimizeCloudinaryUrl(url:string,width=800):string {
 if(!url)return url;
 try {
  const parsed=new URL(url);
  if(parsed.hostname!=='res.cloudinary.com'||!parsed.pathname.includes('/image/upload/'))return url;
  const tail=parsed.pathname.split('/upload/')[1];
  if(/^(?:[a-z]{1,3}_[^/]+,?)+\//.test(tail))return url;
  return url.replace('/upload/',`/upload/q_auto,f_auto,w_${width},c_limit/`);
 }catch{return url;}
}
