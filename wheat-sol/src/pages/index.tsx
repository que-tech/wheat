'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { TelegramLoginButton } from '../components/TelegramLoginButton'
import { verifyTelegramData } from '../lib/auth'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { user, setUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user exists and redirect
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleTelegramResponse = async (response: any) => {
    try {
      console.log('Telegram response:', response) // Debug log
      const verifiedData = await verifyTelegramData(response)
      console.log('Verified data:', verifiedData) // Debug log
      
      if (verifiedData && verifiedData.token) {
        // Store token first
        localStorage.setItem('authToken', verifiedData.token)
        
        // Then update user state
        setUser(verifiedData.user)
        
        // Wait a bit before redirecting to ensure state is updated
        setTimeout(() => {
          router.push('/dashboard')
        }, 100)
      }
    } catch (error) {
      console.error('Authentication failed:', error)
    }
  }

  // Prevent flash of login button if user is already authenticated
  if (user) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-900 text-white">
      <Head>
        <title>Wheat-sol</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold mb-8">
          Welcome to Wheat-sol
        </h1>

        <div className="w-full max-w-md">
          <TelegramLoginButton
            botName={process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || ''}
            onAuth={handleTelegramResponse}
            buttonSize="large"
            cornerRadius={20}
            requestAccess="write"
          />
        </div>
      </main>
    </div>
  )
}
