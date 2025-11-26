'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Hotel, Calendar, DollarSign } from 'lucide-react'
import { customersApi, bookingsApi, hotelsApi, paymentsApi } from '@/services/api'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalBookings: 0,
    totalHotels: 0,
    totalPayments: 0,
  })
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

        setStats({
          totalCustomers: customers.data.length,
          totalBookings: bookings.data.length,
          totalHotels: hotels.data.length,
          totalPayments: payments.data.length,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const cards = [
    {
      title: 'إجمالي العملاء',
      value: stats.totalCustomers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'إجمالي الفنادق',
      value: stats.totalHotels,
      icon: Hotel,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'إجمالي الحجوزات',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'إجمالي المدفوعات',
      value: stats.totalPayments,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-600 mt-2">مرحباً بك في نظام إدارة الفنادق - صفرني</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>النشاطات الأخيرة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">ستظهر هنا الحجوزات وأنشطة العملاء الأخيرة...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/dashboard/customers"
              className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">إضافة عميل جديد</div>
              <div className="text-sm text-gray-600">إنشاء ملف تعريف عميل جديد</div>
            </a>
            <a
              href="/dashboard/bookings"
              className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">إنشاء حجز</div>
              <div className="text-sm text-gray-600">إجراء حجز فندقي جديد</div>
            </a>
            <a
              href="/dashboard/hotels"
              className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">إدارة الفنادق</div>
              <div className="text-sm text-gray-600">عرض وتعديل معلومات الفنادق</div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

