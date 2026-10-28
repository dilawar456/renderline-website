import type { Metadata } from 'next';
import Portal from './Portal';
import { getPortfolioItems, optimizeCloudinaryUrl } from '@/lib/public-data';
export const metadata: Metadata={title:'Client portal',robots:{index:false,follow:false}};
export default async function Page(){const {data:items}=await getPortfolioItems().catch(()=>({data:[]}));const item=items?.find(i=>Number(i.id)===187);return <Portal artwork={item?optimizeCloudinaryUrl(item.image_url,1400):undefined}/>;}
