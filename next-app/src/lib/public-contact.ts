const legacyEmail = 'hafizz.dil@gmail.com';
const renderLineEmail = 'inforenderline@gmail.com';

// The old CMS record still contains a personal address. Keep future CMS edits configurable.
export function publicContactEmail(value: unknown): string {
    const email = typeof value === 'string' ? value.trim() : '';
    return email && email.toLowerCase() !== legacyEmail ? email : renderLineEmail;
}

export function publicWhatsAppNumber(value: unknown): string {
    const raw = typeof value === 'string' ? value.trim() : '';
    const digits = raw.replace(/\D/g, '');
    return /^[+\d\s().-]+$/.test(raw) && digits.length >= 8 && digits.length <= 15 ? digits : '923114544040';
}

export function publicPhoneDisplay(value: unknown, number: string): string {
    const raw = typeof value === 'string' ? value.trim() : '';
    const length = raw.replace(/\D/g, '').length;
    return /^[+\d\s().-]+$/.test(raw) && length >= 8 && length <= 15 ? raw : number === '923114544040' ? '+92 311 4544040' : `+${number}`;
}
