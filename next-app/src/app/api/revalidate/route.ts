import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Secret token to prevent unauthorized revalidation
const SECRET = process.env.REVALIDATE_SECRET || 'renderline_revalidate_2024';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { secret, paths } = body;

        if (secret !== SECRET) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Revalidate specified paths or all main paths
        const toRevalidate: string[] = paths || ['/', '/portfolio', '/about', '/services', '/contact'];

        for (const path of toRevalidate) {
            revalidatePath(path);
        }

        return NextResponse.json({
            revalidated: true,
            paths: toRevalidate,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        return NextResponse.json({ error: 'Revalidation failed', details: String(err) }, { status: 500 });
    }
}

// Also allow GET with secret in query param (easier to call from admin)
export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');

    if (secret !== SECRET) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath('/about');
    revalidatePath('/services');

    return NextResponse.json({
        revalidated: true,
        timestamp: new Date().toISOString(),
    });
}
