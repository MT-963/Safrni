'use client'

import { useState, useRef, useEffect } from 'react'
import { useTheme, themes, ThemeType } from '@/contexts/ThemeContext'
import { Palette } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentTheme = themes.find(t => t.id === theme)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
          bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] text-[var(--text-secondary)]
          border border-[var(--border-primary)]"
        title="تغيير الثيم"
      >
        <Palette className="h-4 w-4" />
        <span className="text-sm">{currentTheme?.icon}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 rounded-lg shadow-lg z-50
          bg-[var(--bg-card)] border border-[var(--border-primary)]
          animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            <p className="text-xs font-semibold text-[var(--text-muted)] px-2 py-1 mb-1">
              اختر الثيم
            </p>
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all
                  ${theme === t.id 
                    ? 'bg-[var(--accent-primary)] text-[var(--text-inverse)]' 
                    : 'hover:bg-[var(--bg-hover)] text-[var(--text-primary)]'
                  }`}
              >
                <span className="text-lg">{t.icon}</span>
                <span className="font-medium">{t.name}</span>
                {theme === t.id && (
                  <span className="mr-auto text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function ThemeToggleCompact() {
  const { theme, setTheme, themes: themeList } = useTheme()
  
  const cycleTheme = () => {
    const currentIndex = themeList.findIndex(t => t.id === theme)
    const nextIndex = (currentIndex + 1) % themeList.length
    setTheme(themeList[nextIndex].id as ThemeType)
  }

  const currentTheme = themeList.find(t => t.id === theme)

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
        bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] text-[var(--text-secondary)]
        border border-[var(--border-primary)] hover:scale-105"
      title={`الثيم الحالي: ${currentTheme?.name}`}
    >
      <span className="text-xl">{currentTheme?.icon}</span>
    </button>
  )
}



