'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, RefreshCw, User, Download, Scissors } from 'lucide-react'

export default function HairstyleGridClient() {
    const [userFile, setUserFile] = useState<File | null>(null)
    const [userPreview, setUserPreview] = useState<string | null>(null)
    const [generatedImage, setGeneratedImage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingStep, setLoadingStep] = useState('')
    const [error, setError] = useState<string | null>(null)

    const validateImageFile = (file: File): string | null => {
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
        if (!validTypes.includes(file.type)) {
            return 'Please upload a valid image file (PNG, JPG, JPEG, or WebP).'
        }
        if (file.size > 50 * 1024 * 1024) {
            return 'File size exceeds 50MB limit. Please upload a smaller image.'
        }
        return null
    }

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const error = validateImageFile(file)
            if (error) {
                setError(error)
                return
            }
            setUserFile(file)
            setUserPreview(URL.createObjectURL(file))
            setGeneratedImage(null)
            setError(null)
        }
    }

    const handleReset = () => {
        setUserFile(null)
        setUserPreview(null)
        setGeneratedImage(null)
        setError(null)
    }

    const handleGenerateGrid = async () => {
        if (!userFile) return

        setIsLoading(true)
        setError(null)
        setLoadingStep('Analyzing your photo...')

        try {
            const formData = new FormData()
            formData.append('source_image', userFile)

            // Update status after 5 seconds
            const timeout1 = setTimeout(() => {
                setLoadingStep('Generating hairstyle variations...')
            }, 5000)

            // Update status after 12 seconds
            const timeout2 = setTimeout(() => {
                setLoadingStep('Creating 3x3 grid...')
            }, 12000)

            // Call Next.js API route (which handles auth and forwards to backend)
            const response = await fetch('/api/hairstyle-grid', {
                method: 'POST',
                body: formData,
            })

            clearTimeout(timeout1)
            clearTimeout(timeout2)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.detail || errorData.error || 'Failed to generate image')
            }

            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            setGeneratedImage(url)
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Failed to process image. Please try again.')
        } finally {
            setIsLoading(false)
            setLoadingStep('')
        }
    }

    return (
        <div className="w-full space-y-8">
            <div className="grid grid-cols-1 gap-8">
                {/* User Photo Upload */}
                <div className="space-y-4">
                    <Card className="overflow-hidden border-2 border-dashed border-gray-200 hover:border-indigo-500/50 transition-all">
                        <CardContent className="p-0 h-[400px] relative bg-gray-50 flex items-center justify-center">
                            {!userPreview ? (
                                <div className="text-center p-8">
                                    <div className="relative group cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleUserChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <User className="w-10 h-10 text-indigo-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Upload Your Photo</h3>
                                        <p className="text-sm text-gray-500 mt-2">Your portrait or selfie</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full h-full">
                                    <img
                                        src={userPreview}
                                        alt="Your Photo"
                                        className="w-full h-full object-contain"
                                    />
                                    <button
                                        onClick={() => {
                                            setUserFile(null)
                                            setUserPreview(null)
                                            setGeneratedImage(null)
                                        }}
                                        className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors z-10"
                                    >
                                        <RefreshCw className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
                <Button
                    size="lg"
                    onClick={handleGenerateGrid}
                    disabled={!userFile || isLoading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 h-12 text-lg shadow-lg hover:shadow-xl transition-all"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {loadingStep || 'Generating Hairstyle Grid...'}
                        </>
                    ) : (
                        <>
                            <Scissors className="mr-2 h-5 w-5" />
                            Generate Hairstyle Grid
                        </>
                    )}
                </Button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-200">
                    {error}
                </div>
            )}

            {/* Result Area */}
            {generatedImage && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-px bg-gray-200 flex-1" />
                        <span className="text-gray-400 font-medium uppercase text-sm tracking-wider">Your Hairstyle Grid</span>
                        <div className="h-px bg-gray-200 flex-1" />
                    </div>

                    <Card className="overflow-hidden shadow-2xl border-0 ring-1 ring-gray-200">
                        <CardContent className="p-0 bg-gray-900 min-h-[500px] relative flex items-center justify-center group">
                            <img
                                src={generatedImage}
                                alt="Hairstyle Grid Result"
                                className="max-h-[80vh] w-auto object-contain"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                                <a
                                    href={generatedImage}
                                    download="hairstyle-grid-result.png"
                                    className="inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Image
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

