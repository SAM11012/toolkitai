'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, User, Mail, Coins, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom' // <--- 1. Import this
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface UserModalProps {
    isOpen: boolean
    onClose: () => void
    user: SupabaseUser | null
}

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
    const router = useRouter()
    const supabase = createClient()
    const [mounted, setMounted] = useState(false) // <--- 2. Add mounted state

    // Existing state
    const [email, setEmail] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // 3. Handle hydration (ensure we only run portal on client)
    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    useEffect(() => {
        if (!isOpen) return
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    useEffect(() => {
        if (user) {
            setEmail(user.email || '')
            setDisplayName(
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.user_metadata?.username ||
                user.email?.split('@')[0] ||
                'User'
            )
        }
    }, [user, isOpen])

    const handleSignOut = async () => {
        setIsLoading(true)
        await supabase.auth.signOut()
        router.push('/')
    }

    // 4. Return null if not mounted or not open (optimization)
    if (!mounted || !isOpen) return null

    // 5. Wrap the entire return JSX in createPortal
    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed right-0 top-0 z-[9999] h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out transform translate-x-0`}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                <div className="flex h-full flex-col overflow-hidden">
                    {/* ... (Keep your Header Section exactly as is) ... */}
                    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/30">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                                    User Settings
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-6 py-6 space-y-6 overflow-y-auto">
                        {/* User Info Section */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <User className="w-4 h-4 text-indigo-600" />
                                    Name
                                </label>
                                <Input value={displayName} disabled className="bg-gray-50 cursor-not-allowed" />
                                <p className="text-xs text-gray-500">
                                    Name is managed by your Google account
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-indigo-600" />
                                    Email
                                </label>
                                <Input value={email} disabled className="bg-gray-50 cursor-not-allowed" />
                                <p className="text-xs text-gray-500">
                                    Email is managed by your Google account
                                </p>
                            </div>
                        </div>

                        {/* Billion Section */}
                        <div className="space-y-2 border-t pt-4">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Coins className="w-4 h-4 text-indigo-600" />
                                Billion
                            </label>
                            <Input
                                type="text"
                                value="Coming soon"
                                disabled
                                className="bg-gray-50 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500">This feature is currently disabled</p>
                        </div>

                        {/* Sign Out Button */}
                        <div className="border-t pt-4">
                            <Button
                                onClick={handleSignOut}
                                disabled={isLoading}
                                variant="destructive"
                                className="w-full"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Signing out...
                                    </>
                                ) : (
                                    <>
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body // Target container
    )
}