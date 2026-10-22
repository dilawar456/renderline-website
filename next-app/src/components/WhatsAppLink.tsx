'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { recordWhatsAppContact, type WhatsAppContactSource } from '@/lib/contact-tracking';
import { publicWhatsAppNumber } from '@/lib/public-contact';

type Props = Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'onClick'> & {
  number?: string;
  source: Exclude<WhatsAppContactSource, 'contact_form'>;
};

export default function WhatsAppLink({ number, source, children, ...props }: Props) {
  return <a
    {...props}
    href={`https://wa.me/${publicWhatsAppNumber(number)}`}
    target={props.target || '_blank'}
    rel={props.rel || 'noopener noreferrer'}
    onClick={() => recordWhatsAppContact(source)}
  >{children}</a>;
}
