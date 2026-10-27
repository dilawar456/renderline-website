import type { ImageLoaderProps } from "next/image";
export function cloudinaryLoader({src,width,quality}:ImageLoaderProps) {
  const url = new URL(src);
  const [prefix,tail] = url.pathname.split('/image/upload/');
  if (!tail) return src;
  const segments=tail.split('/');
  const transformed=/^(?:[a-z]{1,3}_[^/]+,?)+$/.test(segments[0]);
  const transform=transformed ? segments.shift()! : 'f_auto,q_auto,c_limit';
  const withoutWidth=transform.split(',').filter(t=>!/^w_/.test(t)&&!/^q_/.test(t));
  url.pathname=prefix+'/image/upload/'+[...withoutWidth,`w_${width}`,quality?`q_${quality}`:'q_auto'].join(',')+'/'+segments.join('/');
  return url.toString();
}
