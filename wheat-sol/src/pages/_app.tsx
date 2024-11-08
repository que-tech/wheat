import type { AppProps } from 'next/app'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AuthProvider } from '../contexts/AuthContext'
import '../styles/globals.css'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff00',
    },
    background: {
      default: '#000000',
      paper: '#121212',
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  )
}
