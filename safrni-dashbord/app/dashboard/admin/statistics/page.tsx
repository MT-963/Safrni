'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  Users, 
  Hotel, 
  Building2, 
  DollarSign, 
  Calendar,
  Shield,
  Crown,
  Award
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { statisticsApi } from '@/services/api'

export default function StatisticsPage() {
  const { isAdmin } = useAuth()
  const [loading, setLoading] = useState(true)
  const [sellersStats, setSellersStats] = useState<any[]>([])
  const [brokersStats, setBrokersStats] = useState<any[]>([])
  const [suppliersStats, setSuppliersStats] = useState<any[]>([])
  const [customersStats, setCustomersStats] = useState<any[]>([])
  const [hotelsStats, setHotelsStats] = useState<any[]>([])
  const [overview, setOverview] = useState<any>(null)

  useEffect(() => {
    if (isAdmin) {
      fetchStatistics()
    }
  }, [isAdmin])

  const fetchStatistics = async () => {
    try {
      const [sellers, brokers, suppliers, customers, hotels, overviewData] = await Promise.all([
        statisticsApi.getSellersPerformance(),
        statisticsApi.getBrokersPerformance(),
        statisticsApi.getSuppliersPerformance(),
        statisticsApi.getCustomersStatistics(),
        statisticsApi.getHotelsStatistics(),
        statisticsApi.getOverview()
      ])

      setSellersStats(sellers.data)
      setBrokersStats(brokers.data)
      setSuppliersStats(suppliers.data)
      setCustomersStats(customers.data.slice(0, 10))
      setHotelsStats(hotels.data.slice(0, 10))
      setOverview(overviewData.data)
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح</h2>
          <p className="text-gray-600">هذه الصفحة متاحة للأدمن فقط</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الإحصائيات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">إحصائيات تفصيلية</h1>
        <p className="text-gray-600 mt-1">تقارير شاملة عن الأداء والمبيعات</p>
      </div>

      {/* Overview Cards */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                  <p className="text-2xl font-bold text-green-600">${overview.totalRevenue?.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">المدفوع: ${overview.totalPaid?.toFixed(2)}</p>
                </div>
                <DollarSign className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الحجوزات</p>
                  <p className="text-2xl font-bold text-blue-600">{overview.totalBookings}</p>
                </div>
                <Calendar className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">المستخدمين النشطين</p>
                  <p className="text-2xl font-bold text-purple-600">{overview.activeSellers}</p>
                </div>
                <Users className="h-10 w-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">المتبقي</p>
                  <p className="text-2xl font-bold text-orange-600">${overview.totalPending?.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sellers Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            أداء البائعين (المستخدمين)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3">الترتيب</th>
                  <th className="text-right p-3">الاسم</th>
                  <th className="text-right p-3">الدور</th>
                  <th className="text-right p-3">عدد الحجوزات</th>
                  <th className="text-right p-3">الإيرادات</th>
                  <th className="text-right p-3">حجوزات أنشأها</th>
                  <th className="text-right p-3">حجوزات عدّلها</th>
                </tr>
              </thead>
              <tbody>
                {sellersStats.map((seller, index) => (
                  <tr key={seller.sellerId} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                        {index === 1 && <Award className="h-4 w-4 text-gray-700" />}
                        {index === 2 && <Award className="h-4 w-4 text-orange-700" />}
                        <span className="font-bold">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="p-3 font-medium">{seller.sellerName}</td>
                    <td className="p-3">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        seller.role === 'Admin' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {seller.role === 'Admin' ? 'أدمن' : 'موظف'}
                      </span>
                    </td>
                    <td className="p-3">{seller.totalBookings}</td>
                    <td className="p-3 font-bold text-green-600">${seller.totalRevenue?.toFixed(2)}</td>
                    <td className="p-3">{seller.createdBookings}</td>
                    <td className="p-3">{seller.updatedBookings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Brokers Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            أداء الوسطاء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3">الترتيب</th>
                  <th className="text-right p-3">الاسم</th>
                  <th className="text-right p-3">عدد الحجوزات</th>
                  <th className="text-right p-3">الإيرادات</th>
                  <th className="text-right p-3">العمولات</th>
                  <th className="text-right p-3">عدد العملاء</th>
                </tr>
              </thead>
              <tbody>
                {brokersStats.map((broker, index) => (
                  <tr key={broker.brokerId} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-bold">#{index + 1}</td>
                    <td className="p-3 font-medium">{broker.brokerName}</td>
                    <td className="p-3">{broker.totalBookings}</td>
                    <td className="p-3 font-bold text-green-600">${broker.totalRevenue?.toFixed(2)}</td>
                    <td className="p-3 font-bold text-purple-600">${broker.totalCommissions?.toFixed(2)}</td>
                    <td className="p-3">{broker.customersReferred}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-500" />
            أداء الموردين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3">الترتيب</th>
                  <th className="text-right p-3">الاسم</th>
                  <th className="text-right p-3">الدولة</th>
                  <th className="text-right p-3">المدينة</th>
                  <th className="text-right p-3">عدد الحجوزات</th>
                  <th className="text-right p-3">الإيرادات</th>
                  <th className="text-right p-3">عدد الفنادق</th>
                </tr>
              </thead>
              <tbody>
                {suppliersStats.map((supplier, index) => (
                  <tr key={supplier.supplierId} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-bold">#{index + 1}</td>
                    <td className="p-3 font-medium">{supplier.supplierName}</td>
                    <td className="p-3 text-gray-700">{supplier.country || '-'}</td>
                    <td className="p-3 text-gray-700">{supplier.city || '-'}</td>
                    <td className="p-3">{supplier.totalBookings}</td>
                    <td className="p-3 font-bold text-green-600">${supplier.totalRevenue?.toFixed(2)}</td>
                    <td className="p-3">{supplier.hotelsProvided}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-pink-500" />
            أفضل 10 عملاء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3">الترتيب</th>
                  <th className="text-right p-3">الاسم</th>
                  <th className="text-right p-3">الجنسية</th>
                  <th className="text-right p-3">عدد الحجوزات</th>
                  <th className="text-right p-3">إجمالي المبلغ</th>
                  <th className="text-right p-3">المدفوع</th>
                  <th className="text-right p-3">المتبقي</th>
                </tr>
              </thead>
              <tbody>
                {customersStats.map((customer, index) => (
                  <tr key={customer.customerId} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-bold">#{index + 1}</td>
                    <td className="p-3 font-medium">{customer.customerName}</td>
                    <td className="p-3 text-gray-700">{customer.nationality || '-'}</td>
                    <td className="p-3">{customer.totalBookings}</td>
                    <td className="p-3 font-bold text-blue-600">${customer.totalSpent?.toFixed(2)}</td>
                    <td className="p-3 text-green-600">${customer.totalPaid?.toFixed(2)}</td>
                    <td className="p-3 text-orange-600">${(customer.totalSpent - customer.totalPaid)?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top Hotels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hotel className="h-5 w-5 text-cyan-500" />
            أفضل 10 فنادق
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3">الترتيب</th>
                  <th className="text-right p-3">الفندق</th>
                  <th className="text-right p-3">الموقع</th>
                  <th className="text-right p-3">التصنيف</th>
                  <th className="text-right p-3">عدد الحجوزات</th>
                  <th className="text-right p-3">الإيرادات</th>
                  <th className="text-right p-3">عدد الغرف</th>
                </tr>
              </thead>
              <tbody>
                {hotelsStats.map((hotel, index) => (
                  <tr key={hotel.hotelId} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-bold">#{index + 1}</td>
                    <td className="p-3 font-medium">{hotel.hotelName}</td>
                    <td className="p-3 text-gray-700">{hotel.city}, {hotel.country}</td>
                    <td className="p-3">
                      <span className="text-yellow-500">{'⭐'.repeat(hotel.starRating || 0)}</span>
                    </td>
                    <td className="p-3">{hotel.totalBookings}</td>
                    <td className="p-3 font-bold text-green-600">${hotel.totalRevenue?.toFixed(2)}</td>
                    <td className="p-3">{hotel.totalRooms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

