'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Pencil, Trash2, X, DollarSign, Calendar } from 'lucide-react'
import { paymentsApi, bookingsApi, lookupApi } from '@/services/api'
import type { Payment, CreatePayment, Booking, Currency, PaymentMethod } from '@/types'
import { SearchableSelect } from '@/components/ui/searchable-select'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [formData, setFormData] = useState<CreatePayment>({
    bookingId: undefined,
    amount: 0,
    currencyId: 1,
    paymentType: 'Deposit',
    paymentMethodId: undefined,
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  // Lookup data
  const [bookings, setBookings] = useState<{ value: string; label: string }[]>([])
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])

  const paymentTypes = [
    { value: 'Deposit', label: 'عربون' },
    { value: 'Remaining', label: 'المتبقي' },
    { value: 'TransferCost', label: 'تكلفة التحويل' },
    { value: 'Commission', label: 'عمولة' }
  ]

  useEffect(() => {
    fetchPayments()
    loadLookupData()
  }, [])

  const loadLookupData = async () => {
    try {
      const [bookingsRes, currenciesRes, methodsRes] = await Promise.all([
        bookingsApi.getAll(),
        lookupApi.getCurrencies(),
        lookupApi.getPaymentMethods()
      ])

      setBookings(bookingsRes.data.map((b: Booking) => ({
        value: b.bookingId.toString(),
        label: `#${b.bookingId} - ${b.bookingCode || 'بدون كود'} - ${b.customerName || 'عميل غير محدد'}`
      })))

      setCurrencies(currenciesRes.data)
      setPaymentMethods(methodsRes.data)
    } catch (error) {
      console.error('فشل في تحميل البيانات:', error)
    }
  }

  useEffect(() => {
    if (searchTerm) {
      const filtered = payments.filter(
        (payment) =>
          payment.paymentId.toString().includes(searchTerm) ||
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

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.bookingId || !formData.amount) {
      alert('الرجاء ملء جميع الحقول الإجبارية')
      return
    }
    
    setSubmitting(true)
    try {
      await paymentsApi.create(formData)
      await fetchPayments()
      setShowAddModal(false)
      resetForm()
      alert('تم إضافة الدفعة بنجاح!')
    } catch (error) {
      console.error('فشل في إضافة الدفعة:', error)
      alert('فشل في إضافة الدفعة')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPayment) return
    
    if (!formData.amount) {
      alert('الرجاء ملء جميع الحقول الإجبارية')
      return
    }
    
    setSubmitting(true)
    try {
      await paymentsApi.update(editingPayment.paymentId, formData)
      await fetchPayments()
      setShowEditModal(false)
      setEditingPayment(null)
      resetForm()
      alert('تم تحديث الدفعة بنجاح!')
    } catch (error) {
      console.error('فشل في تحديث الدفعة:', error)
      alert('فشل في تحديث الدفعة')
    } finally {
      setSubmitting(false)
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

  const openAddModal = () => {
    resetForm()
    setShowAddModal(true)
  }

  const openEditModal = (payment: Payment) => {
    setEditingPayment(payment)
    setFormData({
      bookingId: payment.bookingId,
      amount: payment.amount || 0,
      currencyId: payment.currencyId || 1,
      paymentType: payment.paymentType || 'Deposit',
      paymentMethodId: payment.paymentMethodId,
      paymentDate: payment.paymentDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      notes: payment.notes || ''
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      bookingId: undefined,
      amount: 0,
      currencyId: 1,
      paymentType: 'Deposit',
      paymentMethodId: undefined,
      paymentDate: new Date().toISOString().split('T')[0],
      notes: ''
    })
  }

  const getPaymentTypeBadge = (type?: string) => {
    const colors: { [key: string]: string } = {
      'Deposit': 'bg-blue-100 text-blue-800',
      'Remaining': 'bg-green-100 text-green-800',
      'TransferCost': 'bg-yellow-100 text-yellow-800',
      'Commission': 'bg-purple-100 text-purple-800'
    }
    
    const labels: { [key: string]: string } = {
      'Deposit': 'عربون',
      'Remaining': 'المتبقي',
      'TransferCost': 'تكلفة التحويل',
      'Commission': 'عمولة'
    }
    
    const color = colors[type || ''] || 'bg-gray-100 text-gray-800'
    const label = labels[type || ''] || type || 'غير محدد'
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'غير محدد'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-SA')
    } catch {
      return dateString
    }
  }

  const calculateTotal = () => {
    return filteredPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
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
          <p className="text-gray-600 mt-1">إدارة وتتبع جميع المدفوعات المالية</p>
        </div>
        <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 ml-2" />
          إضافة دفعة
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              إجمالي المدفوعات
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${calculateTotal().toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              عدد المدفوعات
            </CardTitle>
            <Calendar className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredPayments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              متوسط الدفعة
            </CardTitle>
            <DollarSign className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${filteredPayments.length > 0 ? (calculateTotal() / filteredPayments.length).toFixed(2) : '0.00'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-700" />
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
                <tr className="border-b border-gray-600">
                  <th className="text-right py-3 px-4 font-medium text-gray-700">رقم الدفعة</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">رقم الحجز</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">النوع</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">المبلغ</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">العملة</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">طريقة الدفع</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">التاريخ</th>
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
                      <td className="py-3 px-4 font-medium">#{payment.bookingId}</td>
                      <td className="py-3 px-4">{getPaymentTypeBadge(payment.paymentType)}</td>
                      <td className="py-3 px-4 font-bold text-green-600">
                        ${payment.amount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{payment.currencyCode || 'USD'}</td>
                      <td className="py-3 px-4 text-gray-600">{payment.paymentMethodName || 'غير محدد'}</td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(payment.paymentDate)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-start gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditModal(payment)}
                            className="hover:bg-blue-50"
                            title="تعديل"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(payment.paymentId)}
                            className="hover:bg-red-50"
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
            <div className="font-bold text-lg text-green-600">
              الإجمالي: ${calculateTotal().toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">إضافة دفعة جديدة</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-700 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحجز <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={bookings}
                  value={formData.bookingId?.toString() || ''}
                  onChange={(value) => setFormData({ ...formData, bookingId: parseInt(value) })}
                  placeholder="اختر الحجز..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المبلغ <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العملة
                  </label>
                  <select
                    value={formData.currencyId}
                    onChange={(e) => setFormData({ ...formData, currencyId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.currencyId} value={currency.currencyId}>
                        {currency.code} - {currency.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع الدفعة
                  </label>
                  <select
                    value={formData.paymentType}
                    onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {paymentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    طريقة الدفع
                  </label>
                  <select
                    value={formData.paymentMethodId || ''}
                    onChange={(e) => setFormData({ ...formData, paymentMethodId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" className="text-gray-500">اختر طريقة الدفع</option>
                    {paymentMethods.map((method) => (
                      <option key={method.paymentMethodId} value={method.paymentMethodId}>
                        {method.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ الدفع
                </label>
                <Input
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="أدخل أي ملاحظات..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'جاري الإضافة...' : 'إضافة الدفعة'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  disabled={submitting}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {showEditModal && editingPayment && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">تعديل الدفعة</h2>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingPayment(null)
                }}
                className="text-gray-700 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحجز <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={bookings}
                  value={formData.bookingId?.toString() || ''}
                  onChange={(value) => setFormData({ ...formData, bookingId: parseInt(value) })}
                  placeholder="اختر الحجز..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المبلغ <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العملة
                  </label>
                  <select
                    value={formData.currencyId}
                    onChange={(e) => setFormData({ ...formData, currencyId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.currencyId} value={currency.currencyId}>
                        {currency.code} - {currency.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع الدفعة
                  </label>
                  <select
                    value={formData.paymentType}
                    onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {paymentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    طريقة الدفع
                  </label>
                  <select
                    value={formData.paymentMethodId || ''}
                    onChange={(e) => setFormData({ ...formData, paymentMethodId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر طريقة الدفع</option>
                    {paymentMethods.map((method) => (
                      <option key={method.paymentMethodId} value={method.paymentMethodId}>
                        {method.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ الدفع
                </label>
                <Input
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="أدخل أي ملاحظات..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'جاري التحديث...' : 'تحديث الدفعة'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingPayment(null)
                  }}
                  disabled={submitting}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

