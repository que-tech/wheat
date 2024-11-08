import { useEffect, useRef } from 'react'

interface TelegramLoginButtonProps {
  botName: string
  onAuth: (user: any) => void
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
      if (buttonEl) {
        buttonEl.removeChild(script)
      }
      delete window.TelegramLoginCallback
    }
  }, [botName, onAuth, buttonSize, cornerRadius, requestAccess])

  return <div ref={buttonRef}></div>
}
