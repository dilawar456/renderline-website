'use client';
import { usePathname } from 'next/navigation';
export default function SiteFrame({children}:{children:React.ReactNode}) {
 const path=usePathname();
 return path.startsWith('/portal') ? null : <>{children}</>;
}
