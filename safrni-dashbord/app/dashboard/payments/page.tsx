'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Pencil, Trash2, DollarSign } from 'lucide-react'
import { paymentsApi } from '@/services/api'
import type { Payment } from '@/types'
import { formatDate, formatCurrency } from '@/lib/utils'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPayments()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = payments.filter(
        (payment) =>
          payment.paymentType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPayments(filtered)
    } else {
      setFilteredPayments(payments)
    }
  }, [searchTerm, payments])

  const fetchPayments = async () => {
    try {
      const response = await paymentsApi.getAll()
      setPayments(response.data)
      setFilteredPayments(response.data)
    } catch (error) {
      console.error('فشل في جلب المدفوعات:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الدفعة؟')) {
      try {
        await paymentsApi.delete(id)
        fetchPayments()
      } catch (error) {
        console.error('فشل في حذف الدفعة:', error)
        alert('فشل في حذف الدفعة')
      }
    }
  }

  const getPaymentTypeBadge = (type?: string) => {
    const typeTranslations: Record<string, string> = {
      'Deposit': 'عربون',
      'Remaining': 'المتبقي',
      'TransferCost': 'تكلفة التحويل',
      'Commission': 'عمولة',
    }

    const typeColors: Record<string, string> = {
      'Deposit': 'bg-blue-100 text-blue-800',
      'Remaining': 'bg-green-100 text-green-800',
      'TransferCost': 'bg-yellow-100 text-yellow-800',
      'Commission': 'bg-purple-100 text-purple-800',
    }

    const translatedType = typeTranslations[type || ''] || type || 'غير محدد'
    const color = typeColors[type || ''] || 'bg-gray-100 text-gray-800'

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {translatedType}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل المدفوعات...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة المدفوعات</h1>
          <p className="text-gray-600 mt-1">تتبع جميع المعاملات المالية</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 ml-2" />
          إضافة دفعة
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن دفعة..."
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
                  <th className="text-right py-3 px-4 font-medium text-gray-700">رقم الحجز</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">المبلغ</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">النوع</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">طريقة الدفع</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">التاريخ</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">ملاحظات</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      لا توجد مدفوعات
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.paymentId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{payment.paymentId}</td>
                      <td className="py-3 px-4 font-medium">{payment.bookingId || 'غير محدد'}</td>
                      <td className="py-3 px-4 font-semibold text-green-600">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          {formatCurrency(payment.amount, payment.currencyCode)}
                        </div>
                      </td>
                      <td className="py-3 px-4">{getPaymentTypeBadge(payment.paymentType)}</td>
                      <td className="py-3 px-4 text-gray-600">{payment.paymentMethodName || 'غير محدد'}</td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(payment.paymentDate)}</td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                        {payment.notes || 'بدون ملاحظات'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-start gap-2">
                          <Button variant="ghost" size="sm" title="تعديل">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(payment.paymentId)}
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
              عرض {filteredPayments.length} من {payments.length} دفعة
            </div>
            <div className="font-semibold text-lg text-green-600">
              الإجمالي: {formatCurrency(
                payments.reduce((sum, p) => sum + (p.amount || 0), 0),
                'USD'
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
