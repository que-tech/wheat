import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, set } from 'firebase/database'
import { useAuth } from '../contexts/AuthContext'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

interface UserData {
  balance?: number
  miningState?: 'idle' | 'mining' | 'claim'
  miningEndTime?: number | null
  lastUpdated?: number
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [balance, setBalance] = useState(0)
  const [miningState, setMiningState] = useState<'idle' | 'mining' | 'claim'>('idle')
  const [timeLeft, setTimeLeft] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    const userRef = ref(database, `users/${user.id}`)
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val() as UserData
      if (data) {
        setBalance(data.balance || 0)
        setMiningState(data.miningState || 'idle')
        setTimeLeft(data.miningEndTime ? Math.max(0, data.miningEndTime - Date.now()) : 0)
      }
    })

    return () => unsubscribe()
  }, [user, router])

  useEffect(() => {
    if (timeLeft > 0 && miningState === 'mining') {
      const timer = setTimeout(() => {
        setTimeLeft(prevTime => Math.max(0, prevTime - 1000))
      }, 1000)

      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && miningState === 'mining') {
      setMiningState('claim')
      updateUserData({ miningState: 'claim' })
    }
  }, [timeLeft, miningState])

  const startMining = () => {
    const endTime = Date.now() + 3 * 60 * 60 * 1000 // 3 hours
    updateUserData({
      miningState: 'mining',
      miningEndTime: endTime
    })
    setMiningState('mining')
    setTimeLeft(3 * 60 * 60 * 1000)
  }

  const claimTokens = () => {
    updateUserData({
      balance: balance + 1500,
      miningState: 'idle',
      miningEndTime: null
    })
    setMiningState('idle')
    setTimeLeft(0)
  }

  const updateUserData = (data: Partial<UserData>) => {
    if (user) {
      set(ref(database, `users/${user.id}`), {
        ...data,
        lastUpdated: Date.now()
      })
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Wheat-sol Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <img src={user.photo_url} alt={user.first_name} className="w-12 h-12 rounded-full mr-4" />
            <h1 className="text-2xl font-bold">{user.first_name} {user.last_name}</h1>
          </div>
          <div className="text-xl font-semibold">Balance: ₿ {balance.toFixed(2)}</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Mining</h2>
          {miningState === 'idle' && (
            <button
              onClick={startMining}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Start Mining
            </button>
          )}
          {miningState === 'mining' && (
            <div>
              <p>Mining in progress...</p>
              <p>Time left: {Math.floor(timeLeft / 3600000)}h {Math.floor((timeLeft % 3600000) / 60000)}m {Math.floor((timeLeft % 60000) / 1000)}s</p>
            </div>
          )}
          {miningState === 'claim' && (
            <button
              onClick={claimTokens}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Claim 1,500 tokens
            </button>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Frens</h2>
          <p>Coming soon...</p>
        </div>

        <button
          onClick={logout}
          className="mt-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
        <ul className="flex justify-around">
          <li className="text-blue-500">Home</li>
          <li>Earn</li>
          <li>Frens</li>
          <li>Wallet</li>
        </ul>
      </nav>
    </div>
  )
                          }
