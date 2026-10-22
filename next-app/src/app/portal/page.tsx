import type { Metadata } from 'next';
import Portal from './Portal';
export const metadata: Metadata={title:'Client portal',robots:{index:false,follow:false}};
export default function Page(){return <Portal/>;}
