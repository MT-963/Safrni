'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ThemeType = 'light' | 'dark' | 'ocean' | 'sunset' | 'emerald'

interface Theme {
  id: ThemeType
  name: string
  icon: string
}

export const themes: Theme[] = [
  { id: 'light', name: 'فاتح', icon: '☀️' },
  { id: 'dark', name: 'داكن', icon: '🌙' },
  { id: 'ocean', name: 'محيط', icon: '🌊' },
  { id: 'sunset', name: 'غروب', icon: '🌅' },
  { id: 'emerald', name: 'زمردي', icon: '💎' },
]

interface ThemeContextType {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
  themes: Theme[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('safrni-theme') as ThemeType
    if (savedTheme && themes.some(t => t.id === savedTheme)) {
      setThemeState(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }, [])

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme)
    localStorage.setItem('safrni-theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}



