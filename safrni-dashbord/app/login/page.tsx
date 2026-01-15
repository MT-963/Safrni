'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme, themes } from '@/contexts/ThemeContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Mail, LogIn, AlertCircle, Palette } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const { theme, setTheme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  const currentTheme = themes.find(t => t.id === theme)

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Background decoration */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 20% 80%, var(--accent-primary) 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, var(--accent-secondary) 0%, transparent 50%)`
        }}
      />
      
      <div className="w-full max-w-md relative z-10">
        {/* Theme Toggle */}
        <div className="absolute top-0 left-0 -mt-16">
          <div className="flex items-center gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-200 border-2 ${
                  theme === t.id ? 'scale-110 shadow-lg' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: theme === t.id ? 'var(--accent-primary)' : 'var(--bg-card)',
                  borderColor: theme === t.id ? 'var(--accent-primary)' : 'var(--border-primary)',
                }}
                title={t.name}
              >
                {t.icon}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-bold mb-2"
            style={{ color: 'var(--accent-primary)' }}
          >
            سفرني
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>نظام إدارة الفنادق والحجوزات</p>
        </div>

        <Card className="shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle 
              className="text-2xl text-center"
              style={{ color: 'var(--text-primary)' }}
            >
              تسجيل الدخول
            </CardTitle>
            <p 
              className="text-sm text-center"
              style={{ color: 'var(--text-muted)' }}
            >
              أدخل بريدك الإلكتروني وكلمة المرور للدخول
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div 
                  className="flex items-center gap-2 p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--accent-danger-light)',
                    borderColor: 'var(--accent-danger)'
                  }}
                >
                  <AlertCircle className="h-4 w-4" style={{ color: 'var(--accent-danger)' }} />
                  <p className="text-sm" style={{ color: 'var(--accent-danger)' }}>{error}</p>
                </div>
              )}

              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    style={{ color: 'var(--text-muted)' }}
                  />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@safrni.com"
                    className="pr-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    style={{ color: 'var(--text-muted)' }}
                  />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div 
                      className="animate-spin rounded-full h-4 w-4 border-b-2"
                      style={{ borderColor: 'var(--text-inverse)' }}
                    />
                    جاري تسجيل الدخول...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="h-4 w-4" />
                    تسجيل الدخول
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              <p>للوصول الكامل، استخدم حساب أدمن</p>
              <p className="mt-1 text-xs">
                تواصل مع المسؤول للحصول على حساب
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p 
            className="text-sm flex items-center justify-center gap-2"
            style={{ color: 'var(--text-muted)' }}
          >
            <span>الثيم الحالي: {currentTheme?.icon} {currentTheme?.name}</span>
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            نظام Safrni &copy; 2025
          </p>
        </div>
      </div>
    </div>
  )
}
