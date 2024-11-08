'use client'

import { useEffect, useRef } from 'react'

// Define the Telegram user type
interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

// Extend the Window interface to include our callback
declare global {
  interface Window {
    TelegramLoginCallback: (user: TelegramUser) => void
  }
}

interface TelegramLoginButtonProps {
  botName: string
  onAuth: (user: TelegramUser) => void
  buttonSize?: 'large' | 'medium' | 'small'
  cornerRadius?: number
  requestAccess?: string
}

export const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({
  botName,
  onAuth,
  buttonSize = 'large',
  cornerRadius = 20,
  requestAccess = 'write'
}) => {
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', botName)
    script.setAttribute('data-size', buttonSize)
    script.setAttribute('data-radius', cornerRadius.toString())
    script.setAttribute('data-request-access', requestAccess)
    script.setAttribute('data-userpic', 'false')
    script.setAttribute('data-onauth', 'TelegramLoginCallback(user)')
    script.async = true

    const buttonEl = buttonRef.current
    if (buttonEl) {
      buttonEl.appendChild(script)
    }

    window.TelegramLoginCallback = (user) => {
      onAuth(user)
    }

    return () => {
      if (buttonEl && script.parentNode === buttonEl) {
        buttonEl.removeChild(script)
      }
      delete window.TelegramLoginCallback
    }
  }, [botName, onAuth, buttonSize, cornerRadius, requestAccess])

  return <div ref={buttonRef}></div>
}
