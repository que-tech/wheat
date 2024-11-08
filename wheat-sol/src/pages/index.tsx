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
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleTelegramResponse = async (response: any) => {
    try {
      const verifiedData = await verifyTelegramData(response)
      if (verifiedData) {
        localStorage.setItem('authToken', verifiedData.token)
        setUser(verifiedData.user)
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Authentication failed:', error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-900 text-white">
      <Head>
        <title>Wheat-sol</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold mb-8">
          Welcome to Wheat-sol
        </h1>

        {!user && (
          <TelegramLoginButton
            botName={process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || ''}
            onAuth={handleTelegramResponse}
            buttonSize="large"
            cornerRadius={20}
            requestAccess="write"
          />
        )}
      </main>
    </div>
  )
}
