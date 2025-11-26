'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Pencil, Trash2, Eye, Calendar, Users } from 'lucide-react'
import { bookingsApi } from '@/services/api'
import type { Booking } from '@/types'
import { formatDate } from '@/lib/utils'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = bookings.filter(
        (booking) =>
          booking.bookingCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.hotelName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredBookings(filtered)
    } else {
      setFilteredBookings(bookings)
    }
  }, [searchTerm, bookings])

  const fetchBookings = async () => {
    try {
      const response = await bookingsApi.getAll()
      setBookings(response.data)
      setFilteredBookings(response.data)
    } catch (error) {
      console.error('فشل في جلب الحجوزات:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الحجز؟')) {
      try {
        await bookingsApi.delete(id)
        fetchBookings()
      } catch (error) {
        console.error('فشل في حذف الحجز:', error)
        alert('فشل في حذف الحجز')
      }
    }
  }

  const getStatusBadge = (status?: string) => {
    const statusTranslations: Record<string, string> = {
      'Confirmed': 'مؤكد',
      'Pending': 'معلق',
      'Cancelled': 'ملغي',
      'Completed': 'مكتمل',
    }

    const statusColors: Record<string, string> = {
      'Confirmed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Completed': 'bg-blue-100 text-blue-800',
    }

    const translatedStatus = statusTranslations[status || ''] || status || 'غير محدد'
    const color = statusColors[status || ''] || 'bg-gray-100 text-gray-800'

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {translatedStatus}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الحجوزات...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الحجوزات</h1>
          <p className="text-gray-600 mt-1">إدارة حجوزات الفنادق</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 ml-2" />
          حجز جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن حجز..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium text-gray-700">الرقم</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">رمز الحجز</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">العميل</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">الفندق</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">عدد الأشخاص</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">تاريخ الوصول</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">تاريخ المغادرة</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">الحالة</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-500">
                      لا توجد حجوزات
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.bookingId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{booking.bookingId}</td>
                      <td className="py-3 px-4 font-medium">{booking.bookingCode || 'غير محدد'}</td>
                      <td className="py-3 px-4 text-gray-600">{booking.customerName || 'غير محدد'}</td>
                      <td className="py-3 px-4 text-gray-600">{booking.hotelName || 'غير محدد'}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {booking.peopleCount || 'غير محدد'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(booking.checkIn)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(booking.checkOut)}
                        </div>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(booking.statusName)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-start gap-2">
                          <Button variant="ghost" size="sm" title="عرض التفاصيل">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="تعديل">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(booking.bookingId)}
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div>
              عرض {filteredBookings.length} من {bookings.length} حجز
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
