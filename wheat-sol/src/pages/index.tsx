import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { TelegramLoginButton } from '../components/TelegramLoginButton'
import { verifyTelegramData, verifyToken } from '../lib/auth'

export default function Home() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      const userData = verifyToken(token)
      if (userData) {
        setUser(userData)
        router.push('/dashboard')
      } else {
        localStorage.removeItem('authToken')
      }
    }
  }, [router])

  const handleTelegramResponse = async (response) => {
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
            botName={process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME}
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
