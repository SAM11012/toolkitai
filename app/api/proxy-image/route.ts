import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    try {
        // 1. Authenticate user
        const supabase = await createClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized. Please sign in.' },
                { status: 401 }
            )
        }

        // 2. Get URL parameter
        const { searchParams } = new URL(request.url)
        const url = searchParams.get('url')

        if (!url) {
            return NextResponse.json(
                { error: 'URL parameter is required' },
                { status: 400 }
            )
        }

        // 3. Forward to Python FastAPI backend
        const PYTHON_API_URL = process.env.PYTHON_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

        const response = await fetch(`${PYTHON_API_URL}/api/proxy-image?url=${encodeURIComponent(url)}`, {
            method: 'GET',
            headers: {
                'X-User-ID': user.id,
                ...(process.env.INTERNAL_API_KEY && { 'X-API-Key': process.env.INTERNAL_API_KEY }),
            },
        })

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to proxy image' },
                { status: response.status }
            )
        }

        // Return the image blob directly
        const blob = await response.blob()
        const contentType = response.headers.get('Content-Type') || 'image/jpeg'

        return new NextResponse(blob, {
            status: 200,
            headers: {
                'Content-Type': contentType,
            },
        })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

