import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string

// Define the TelegramData interface
interface TelegramData {
  [key: string]: string | number
  hash: string
  auth_date: number
  id: number
  first_name: string
  username?: string
  photo_url?: string
}

export async function verifyTelegramData(telegramData: TelegramData) {
  const { hash, ...data } = telegramData
  const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest()
  const dataCheckString = Object.keys(data)
    .sort()
    .map(k => `${k}=${data[k]}`)
    .join('\n')
  const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')
  
  if (hmac === hash) {
    // Data is authentic
    const token = generateToken(data)
    return { user: data, token }
  } else {
    throw new Error('Authentication failed')
  }
}

function generateToken(userData: Omit<TelegramData, 'hash'>) {
  return jwt.sign(userData, BOT_TOKEN, { expiresIn: '7d' })
}

export function verifyToken(token: string): TelegramData | null {
  try {
    return jwt.verify(token, BOT_TOKEN) as TelegramData
  } catch (error) {
    return null
  }
}
