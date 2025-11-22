import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
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

        // 2. Get request data
        const body = await request.json()

        // Validate request
        if (!body.topic || typeof body.topic !== 'string' || !body.topic.trim()) {
            return NextResponse.json(
                { error: 'Topic is required' },
                { status: 400 }
            )
        }

        // 3. Forward to Python FastAPI backend
        const PYTHON_API_URL = process.env.PYTHON_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

        const response = await fetch(`${PYTHON_API_URL}/api/podcast-creator`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-ID': user.id,
                ...(process.env.INTERNAL_API_KEY && { 'X-API-Key': process.env.INTERNAL_API_KEY }),
            },
            body: JSON.stringify({
                topic: body.topic,
                language: body.language || 'en-US',
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            try {
                const errorData = JSON.parse(errorText)
                return NextResponse.json(
                    { error: errorData.detail || 'Failed to generate podcast' },
                    { status: response.status }
                )
            } catch {
                return NextResponse.json(
                    { error: 'Failed to generate podcast' },
                    { status: response.status }
                )
            }
        }

        // Return the JSON response
        const result = await response.json()
        return NextResponse.json(result)
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

