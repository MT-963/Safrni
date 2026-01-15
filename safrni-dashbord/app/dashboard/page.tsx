'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Hotel, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react'
import { customersApi, bookingsApi, hotelsApi, paymentsApi } from '@/services/api'
import type { Booking, Payment } from '@/types'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalBookings: 0,
    totalHotels: 0,
    totalPayments: 0,
    totalRevenue: 0,
  })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [recentPayments, setRecentPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [customers, bookings, hotels, payments] = await Promise.all([
          customersApi.getAll(),
          bookingsApi.getAll(),
          hotelsApi.getAll(),
          paymentsApi.getAll(),
        ])

        const totalRevenue = payments.data.reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0)

        setStats({
          totalCustomers: customers.data.length,
          totalBookings: bookings.data.length,
          totalHotels: hotels.data.length,
          totalPayments: payments.data.length,
          totalRevenue,
        })

        // Get recent bookings (last 5)
        const sortedBookings = [...bookings.data].sort((a: Booking, b: Booking) => {
          const dateA = new Date(a.createdAt || 0).getTime()
          const dateB = new Date(b.createdAt || 0).getTime()
          return dateB - dateA
        })
        setRecentBookings(sortedBookings.slice(0, 5))

        // Get recent payments (last 5)
        const sortedPayments = [...payments.data].sort((a: Payment, b: Payment) => {
          const dateA = new Date(a.paymentDate || 0).getTime()
          const dateB = new Date(b.paymentDate || 0).getTime()
          return dateB - dateA
        })
        setRecentPayments(sortedPayments.slice(0, 5))
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'غير محدد'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-SA', { 
        year: 'numeric',
        month: 'short',
        day: 'numeric' 
      })
    } catch {
      return dateString
    }
  }

  const getStatusBadge = (statusName?: string) => {
    const statusConfig: { [key: string]: { bg: string; text: string } } = {
      'Confirmed': { bg: 'var(--accent-success-light)', text: 'var(--accent-success)' },
      'Pending': { bg: 'var(--accent-warning-light)', text: 'var(--accent-warning)' },
      'Cancelled': { bg: 'var(--accent-danger-light)', text: 'var(--accent-danger)' },
      'Completed': { bg: 'var(--accent-info-light)', text: 'var(--accent-info)' }
    }
    
    const config = statusConfig[statusName || ''] || { bg: 'var(--bg-tertiary)', text: 'var(--text-muted)' }
    
    return (
      <span 
        className="px-2 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: config.bg, color: config.text }}
      >
        {statusName || 'غير محدد'}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: 'var(--accent-primary)' }}
          />
          <p className="mt-4" style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>لوحة التحكم</h1>
        <p className="mt-2" style={{ color: 'var(--text-muted)' }}>مرحباً بك في نظام إدارة الفنادق - سفرني</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'إجمالي العملاء', value: stats.totalCustomers, icon: Users, link: '/dashboard/customers' },
          { title: 'إجمالي الفنادق', value: stats.totalHotels, icon: Hotel, link: '/dashboard/hotels' },
          { title: 'إجمالي الحجوزات', value: stats.totalBookings, icon: Calendar, link: '/dashboard/bookings' },
          { title: 'إجمالي المدفوعات', value: stats.totalPayments, icon: DollarSign, link: '/dashboard/payments' },
        ].map((card) => (
          <Link key={card.title} href={card.link}>
            <Card className="hover:shadow-lg transition-all cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {card.title}
                </CardTitle>
                <div 
                  className="p-2 rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--stat-bg)' }}
                >
                  <card.icon className="h-5 w-5" style={{ color: 'var(--accent-primary)' }} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" style={{ color: 'var(--number-neutral)' }}>
                  {card.value}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Revenue Card */}
      <div className="mt-6">
        <Card 
          className="overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, var(--accent-success) 0%, var(--accent-primary) 100%)',
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-white">
              إجمالي الإيرادات
            </CardTitle>
            <TrendingUp className="h-6 w-6 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-white/70 mt-2 text-sm">من {stats.totalPayments} دفعة</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle style={{ color: 'var(--text-primary)' }}>الحجوزات الأخيرة</CardTitle>
            <Link 
              href="/dashboard/bookings" 
              className="text-sm hover:underline"
              style={{ color: 'var(--accent-primary)' }}
            >
              عرض الكل
            </Link>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <p className="text-center py-4" style={{ color: 'var(--text-muted)' }}>لا توجد حجوزات حديثة</p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div 
                    key={booking.bookingId} 
                    className="flex items-center justify-between p-3 rounded-lg border transition-colors"
                    style={{ 
                      borderColor: 'var(--border-primary)',
                      backgroundColor: 'var(--bg-secondary)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                        {booking.customerName || 'عميل غير محدد'}
                      </div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {booking.hotelName || 'فندق غير محدد'}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3" style={{ color: 'var(--text-muted)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(booking.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(booking.statusName)}
                      <div className="text-sm font-bold mt-1" style={{ color: 'var(--number-positive)' }}>
                        ${booking.totalPrice?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle style={{ color: 'var(--text-primary)' }}>المدفوعات الأخيرة</CardTitle>
            <Link 
              href="/dashboard/payments" 
              className="text-sm hover:underline"
              style={{ color: 'var(--accent-primary)' }}
            >
              عرض الكل
            </Link>
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <p className="text-center py-4" style={{ color: 'var(--text-muted)' }}>لا توجد مدفوعات حديثة</p>
            ) : (
              <div className="space-y-3">
                {recentPayments.map((payment) => (
                  <div 
                    key={payment.paymentId} 
                    className="flex items-center justify-between p-3 rounded-lg border transition-colors"
                    style={{ 
                      borderColor: 'var(--border-primary)',
                      backgroundColor: 'var(--bg-secondary)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                        دفعة #{payment.paymentId}
                      </div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        حجز #{payment.bookingId}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3" style={{ color: 'var(--text-muted)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(payment.paymentDate)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{ color: 'var(--number-positive)' }}>
                        ${payment.amount?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        {payment.currencyCode || 'USD'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle style={{ color: 'var(--text-primary)' }}>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { href: '/dashboard/customers', icon: Users, title: 'إضافة عميل جديد', subtitle: 'إنشاء ملف تعريف عميل' },
                { href: '/dashboard/bookings', icon: Calendar, title: 'إنشاء حجز', subtitle: 'إجراء حجز فندقي جديد' },
                { href: '/dashboard/hotels', icon: Hotel, title: 'إدارة الفنادق', subtitle: 'عرض وتعديل الفنادق' },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="block p-4 rounded-lg border transition-all"
                  style={{ 
                    borderColor: 'var(--border-primary)',
                    backgroundColor: 'var(--bg-secondary)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)'
                    e.currentTarget.style.borderColor = 'var(--accent-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                    e.currentTarget.style.borderColor = 'var(--border-primary)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: 'var(--accent-primary-light)' }}
                    >
                      <action.icon className="h-5 w-5" style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{action.title}</div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{action.subtitle}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
