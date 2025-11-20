'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Sparkles, Play, Pause, Download } from 'lucide-react'

export default function PodcastCreatorClient() {
    const [topic, setTopic] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<{ script: string; audio: string } | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Clean up audio on unmount or new result
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [result])

    const handleGenerate = async () => {
        if (!topic.trim()) return
        setIsLoading(true)
        setResult(null)
        setIsPlaying(false)

        try {
            // Use environment variable or fallback to EC2 IP
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://100.30.3.16'

            // Call the backend API
            const response = await fetch(`${apiUrl}/api/podcast-creator`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic }),
            })

            if (!response.ok) {
                throw new Error('Failed to generate podcast')
            }

            const data = await response.json()
            console.log("Received audio data length:", data.audio_data.length)
            setResult({
                script: data.script_text,
                audio: `data:audio/wav;base64,${data.audio_data}`
            })

        } catch (err) {
            console.error(err)
            // You might want to show an error toast here
        } finally {
            setIsLoading(false)
        }
    }

    const toggleAudio = () => {
        if (!result?.audio) return

        if (!audioRef.current) {
            // Initialize audio if not exists
            audioRef.current = new Audio(result.audio)
            audioRef.current.onended = () => setIsPlaying(false)
            audioRef.current.onpause = () => setIsPlaying(false)
            audioRef.current.onplay = () => setIsPlaying(true)
        }

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play().catch(e => console.error("Playback error:", e))
        }
    }

    return (
        <div className="max-w-3xl mx-auto w-full">
            <Card className="w-full shadow-xl border-0 ring-1 ring-gray-200">
                <CardContent className="p-8">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                                What's the topic of your podcast?
                            </label>
                            <Textarea
                                id="topic"
                                placeholder="e.g. The history of coffee, Quantum Physics, Euro 2024..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="min-h-[100px] text-lg resize-none"
                            />
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={isLoading || !topic.trim()}
                            className="w-full h-12 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Producing Podcast...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Create Podcast
                                </>
                            )}
                        </Button>

                        {result && (
                            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        Script Preview
                                    </h3>
                                    <div className="prose max-w-none mb-6 max-h-96 overflow-y-auto p-4 bg-white rounded-lg border border-gray-200 whitespace-pre-wrap font-mono text-sm">
                                        {result.script}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button
                                            onClick={toggleAudio}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            {isPlaying ? (
                                                <><Pause className="mr-2 h-4 w-4" /> Pause Podcast</>
                                            ) : (
                                                <><Play className="mr-2 h-4 w-4" /> Play Podcast</>
                                            )}
                                        </Button>

                                        <a
                                            href={result.audio}
                                            download="podcast-episode.mp3"
                                            className="flex-none"
                                        >
                                            <Button variant="ghost" size="icon">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
