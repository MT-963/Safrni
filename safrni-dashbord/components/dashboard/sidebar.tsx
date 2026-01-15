'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Hotel,
  Calendar,
  CreditCard,
  LogOut,
  Shield,
  UserCircle,
  Building2,
  UsersRound,
  BarChart3,
  Tags
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { ThemeToggle } from '@/components/ThemeToggle'

const navigation = [
  { name: 'لوحة التحكم', href: '/dashboard', icon: LayoutDashboard },
  { name: 'العملاء', href: '/dashboard/customers', icon: Users },
  { name: 'الفنادق', href: '/dashboard/hotels', icon: Hotel },
  { name: 'الحجوزات', href: '/dashboard/bookings', icon: Calendar },
  { name: 'المدفوعات', href: '/dashboard/payments', icon: CreditCard },
]

const adminNavigation = [
  { name: 'إحصائيات تفصيلية', href: '/dashboard/admin/statistics', icon: BarChart3 },
  { name: 'المستخدمين', href: '/dashboard/admin/sellers', icon: UsersRound },
  { name: 'الوسطاء', href: '/dashboard/admin/brokers', icon: Building2 },
  { name: 'الموردين', href: '/dashboard/admin/suppliers', icon: Building2 },
  { name: 'فئات الدفعات', href: '/dashboard/admin/payment-categories', icon: Tags },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout, isAdmin } = useAuth()

  return (
    <div className="flex h-full w-64 flex-col" style={{ 
      backgroundColor: 'var(--sidebar-bg)',
      color: 'var(--sidebar-text)'
    }}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-center" style={{ 
        borderBottom: '1px solid var(--sidebar-border)' 
      }}>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>سفرني</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {/* Main Navigation */}
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200'
              )}
              style={{
                backgroundColor: isActive ? 'var(--sidebar-active)' : 'transparent',
                color: isActive ? 'var(--text-inverse)' : 'var(--sidebar-text-muted)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'
                  e.currentTarget.style.color = 'var(--sidebar-text)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--sidebar-text-muted)'
                }
              }}
            >
              <item.icon
                className="ml-3 h-5 w-5 flex-shrink-0"
                style={{ color: isActive ? 'var(--text-inverse)' : 'var(--sidebar-text-muted)' }}
              />
              {item.name}
            </Link>
          )
        })}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-2">
              <div className="px-3 flex items-center gap-2">
                <Shield className="h-4 w-4" style={{ color: 'var(--admin-accent)' }} />
                <p className="text-xs font-semibold uppercase tracking-wider" 
                   style={{ color: 'var(--sidebar-text-muted)' }}>
                  لوحة الأدمن
                </p>
              </div>
            </div>
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200'
                  )}
                  style={{
                    backgroundColor: isActive ? 'var(--admin-bg)' : 'transparent',
                    color: isActive ? 'var(--admin-accent)' : 'var(--sidebar-text-muted)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'
                      e.currentTarget.style.color = 'var(--sidebar-text)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--sidebar-text-muted)'
                    }
                  }}
                >
                  <item.icon
                    className="ml-3 h-5 w-5 flex-shrink-0"
                    style={{ color: isActive ? 'var(--admin-accent)' : 'var(--sidebar-text-muted)' }}
                  />
                  {item.name}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* Theme Toggle & User section */}
      <div style={{ borderTop: '1px solid var(--sidebar-border)' }} className="p-4">
        {/* Theme Toggle */}
        <div className="mb-4">
          <ThemeToggle />
        </div>
        
        {/* User Info */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            {isAdmin ? (
              <Shield className="h-4 w-4" style={{ color: 'var(--admin-accent)' }} />
            ) : (
              <UserCircle className="h-4 w-4" style={{ color: 'var(--accent-primary)' }} />
            )}
            <p className="text-sm font-medium" style={{ color: 'var(--sidebar-text)' }}>
              {user?.name}
            </p>
          </div>
          <p className="text-xs mb-1" style={{ color: 'var(--sidebar-text-muted)' }}>
            {user?.email}
          </p>
          <span 
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
            style={{
              backgroundColor: isAdmin ? 'var(--admin-bg)' : 'var(--accent-primary-light)',
              color: isAdmin ? 'var(--admin-accent)' : 'var(--accent-primary)'
            }}
          >
            {user?.role === 'Admin' ? 'أدمن' : 'موظف'}
          </span>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200"
          style={{ 
            color: 'var(--sidebar-text-muted)',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-danger-light)'
            e.currentTarget.style.color = 'var(--accent-danger)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--sidebar-text-muted)'
          }}
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  )
}
