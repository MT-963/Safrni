'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Pencil, Trash2, X, Calendar, User, Hotel as HotelIcon, DollarSign, Eye } from 'lucide-react'
import { bookingsApi, customersApi, hotelsApi, lookupApi, paymentsApi } from '@/services/api'
import type { Booking, CreateBooking, CreateBookingRoom, Customer, Hotel, BookingStatus, Seller, Broker, Supplier, Payment, RoomType, ViewType, MealPlan, Currency } from '@/types'
import { SearchableSelect } from '@/components/ui/searchable-select'
import Link from 'next/link'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPaymentsModal, setShowPaymentsModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [selectedBookingPayments, setSelectedBookingPayments] = useState<Payment[]>([])
  const [formData, setFormData] = useState<CreateBooking>({
    sellerId: undefined,
    supplierId: undefined,
    brokerId: undefined,
    customerId: undefined,
    hotelId: undefined,
    bookingCode: '',
    hotelConfirmationCode: '',
    peopleCount: 1,
    checkIn: '',
    checkOut: '',
    statusId: 1,
    totalPrice: 0,
    notes: '',
    rooms: [],
    supplierCommissionPercent: 10,
    brokerCommissionPercent: 10,
  })
  const [submitting, setSubmitting] = useState(false)

  // Lookup data
  const [customers, setCustomers] = useState<{ value: string; label: string }[]>([])
  const [hotels, setHotels] = useState<{ value: string; label: string }[]>([])
  const [sellers, setSellers] = useState<{ value: string; label: string }[]>([])
  const [brokers, setBrokers] = useState<{ value: string; label: string }[]>([])
  const [suppliers, setSuppliers] = useState<{ value: string; label: string }[]>([])
  const [statuses, setStatuses] = useState<BookingStatus[]>([])
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [viewTypes, setViewTypes] = useState<ViewType[]>([])
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [currencies, setCurrencies] = useState<Currency[]>([])

  useEffect(() => {
    fetchBookings()
    loadLookupData()
  }, [])

  // Recalculate total price whenever rooms or dates change
  useEffect(() => {
    const total = calculateRoomsTotal(formData.rooms || [], formData.checkIn, formData.checkOut)
    const rounded = Number(total.toFixed(2))
    if (rounded !== formData.totalPrice) {
      setFormData((prev) => ({ ...prev, totalPrice: rounded }))
    }
  }, [formData.rooms, formData.checkIn, formData.checkOut, formData.totalPrice])

  const calculateNights = (checkIn?: string, checkOut?: string) => {
    if (!checkIn || !checkOut) return 1
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diff = end.getTime() - start.getTime()
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return nights > 0 ? nights : 1
  }

  const calculateRoomsTotal = (rooms: CreateBookingRoom[], checkIn?: string, checkOut?: string) => {
    const nights = calculateNights(checkIn, checkOut)
    return rooms.reduce((sum, room) => {
      const price = room.pricePerNight || 0
      const count = room.roomCount || 1
      return sum + price * count * nights
    }, 0)
  }

  const loadLookupData = async () => {
    try {
      const [customersRes, hotelsRes, statusesRes, sellersRes, brokersRes, suppliersRes, roomTypesRes, viewTypesRes, mealPlansRes, currenciesRes] = await Promise.all([
        customersApi.getAll(),
        hotelsApi.getAll(),
        lookupApi.getBookingStatuses(),
        lookupApi.getSellers(),
        lookupApi.getBrokers(),
        lookupApi.getSuppliers(),
        lookupApi.getRoomTypes(),
        lookupApi.getViewTypes(),
        lookupApi.getMealPlans(),
        lookupApi.getCurrencies()
      ])

      setCustomers(customersRes.data.map((c: Customer) => ({
        value: c.customerId.toString(),
        label: c.fullName
      })))

      setHotels(hotelsRes.data.map((h: Hotel) => ({
        value: h.hotelId.toString(),
        label: h.name
      })))

      setSellers(sellersRes.data.map((s: Seller) => ({
        value: s.sellerId.toString(),
        label: s.name
      })))

      setBrokers(brokersRes.data.map((b: Broker) => ({
        value: b.brokerId.toString(),
        label: b.name
      })))

      setSuppliers(suppliersRes.data.map((s: Supplier) => ({
        value: s.supplierId.toString(),
        label: s.name
      })))

      setStatuses(statusesRes.data)
      setRoomTypes(roomTypesRes.data)
      setViewTypes(viewTypesRes.data)
      setMealPlans(mealPlansRes.data)
      setCurrencies(currenciesRes.data)
    } catch (error) {
      console.error('فشل في تحميل البيانات:', error)
    }
  }

  useEffect(() => {
    if (searchTerm) {
      const filtered = bookings.filter(
        (booking) =>
          booking.bookingCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.hotelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.hotelConfirmationCode?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const showBookingPayments = async (booking: Booking) => {
    try {
      const response = await paymentsApi.getByBooking(booking.bookingId)
      setSelectedBookingPayments(response.data)
      setEditingBooking(booking)
      setShowPaymentsModal(true)
    } catch (error) {
      console.error('فشل في جلب المدفوعات:', error)
      alert('فشل في جلب المدفوعات')
    }
  }

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customerId || !formData.hotelId || !formData.checkIn || !formData.checkOut) {
      alert('الرجاء ملء جميع الحقول الإجبارية')
      return
    }

    if (!formData.rooms || formData.rooms.length === 0) {
      alert('يجب إضافة غرفة واحدة على الأقل لاحتساب سعر الحجز')
      return
    }

    setSubmitting(true)
    try {
      await bookingsApi.create(formData)
      await fetchBookings()
      setShowAddModal(false)
      resetForm()
    } catch (error: any) {
      console.error('فشل في إضافة الحجز:', error)
      alert(error.response?.data?.message || 'فشل في إضافة الحجز')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingBooking) return

    if (!formData.rooms || formData.rooms.length === 0) {
      alert('يجب إضافة غرفة واحدة على الأقل لاحتساب سعر الحجز')
      return
    }

    setSubmitting(true)
    try {
      await bookingsApi.update(editingBooking.bookingId, formData)
      await fetchBookings()
      setShowEditModal(false)
      setEditingBooking(null)
      resetForm()
    } catch (error: any) {
      console.error('فشل في تحديث الحجز:', error)
      alert(error.response?.data?.message || 'فشل في تحديث الحجز')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteBooking = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الحجز؟')) return

    try {
      await bookingsApi.delete(id)
      await fetchBookings()
    } catch (error: any) {
      console.error('فشل في حذف الحجز:', error)
      alert(error.response?.data?.message || 'فشل في حذف الحجز')
    }
  }

  const addRoomRow = () => {
    setFormData((prev) => ({
      ...prev,
      rooms: [...(prev.rooms || []), { roomCount: 1, pricePerNight: 0 }],
    }))
  }

  const updateRoomField = (index: number, field: keyof CreateBookingRoom, value: any) => {
    setFormData((prev) => {
      const rooms = [...(prev.rooms || [])]
      rooms[index] = { ...rooms[index], [field]: value }
      return { ...prev, rooms }
    })
  }

  const removeRoomRow = (index: number) => {
    setFormData((prev) => {
      const rooms = [...(prev.rooms || [])]
      rooms.splice(index, 1)
      return { ...prev, rooms }
    })
  }

  const openEditModal = (booking: Booking) => {
    const loadDetail = async () => {
      try {
        const detail = await bookingsApi.getById(booking.bookingId)
        const data = detail.data
        setEditingBooking(booking)
        setFormData({
          sellerId: data.sellerId,
          supplierId: data.supplierId,
          brokerId: data.brokerId,
          customerId: data.customerId,
          hotelId: data.hotelId,
          bookingCode: data.bookingCode || '',
          hotelConfirmationCode: data.hotelConfirmationCode || '',
          peopleCount: data.peopleCount || 1,
          checkIn: data.checkIn || '',
          checkOut: data.checkOut || '',
          statusId: data.statusId || 1,
          totalPrice: data.totalPrice || 0,
          notes: data.notes || '',
          rooms: (data.rooms || []).map((r) => ({
            roomTypeId: r.roomTypeId,
            viewTypeId: r.viewTypeId,
            mealPlanId: r.mealPlanId,
            roomCount: r.roomCount,
            pricePerNight: r.pricePerNight,
            currencyId: r.currencyId,
          })),
          supplierCommissionPercent: data.commissions?.find((c) => c.source === 'Supplier')?.percent ?? 10,
          brokerCommissionPercent: data.commissions?.find((c) => c.source === 'Broker')?.percent ?? 10,
        })
        setShowEditModal(true)
      } catch (error) {
        console.error('فشل في جلب تفاصيل الحجز', error)
        alert('فشل في جلب تفاصيل الحجز')
      }
    }

    loadDetail()
  }

  const resetForm = () => {
    setFormData({
      sellerId: undefined,
      supplierId: undefined,
      brokerId: undefined,
      customerId: undefined,
      hotelId: undefined,
      bookingCode: '',
      hotelConfirmationCode: '',
      peopleCount: 1,
      checkIn: '',
      checkOut: '',
      statusId: 1,
      totalPrice: 0,
      notes: '',
      rooms: [],
      supplierCommissionPercent: 10,
      brokerCommissionPercent: 10,
    })
  }

  const getTotalPaid = (payments: Payment[]) => {
    return payments.reduce((sum, p) => sum + (p.amountBase ?? p.amount ?? 0), 0)
  }

  const getRemainingAmount = (booking: Booking, paid: number) => {
    return (booking.totalPrice || 0) - paid
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الحجوزات</h1>
          <p className="text-gray-600 mt-1">إدارة حجوزات الفنادق</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setShowAddModal(true)
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة حجز جديد
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 h-5 w-5" />
            <Input
              type="text"
              placeholder="البحث عن حجز..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-600">الحجوزات ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3 text-gray-600">كود الحجز</th>
                  <th className="text-right p-3 text-gray-600">العميل</th>
                  <th className="text-right p-3 text-gray-600">الفندق</th>
                  <th className="text-right p-3 text-gray-600">الوصول</th>
                  <th className="text-right p-3 text-gray-600">المغادرة</th>
                  <th className="text-right p-3 text-gray-600">السعر (EUR)</th>
                  <th className="text-right p-3 text-gray-600">المدفوع (EUR)</th>
                  <th className="text-right p-3 text-gray-600">المتبقي (EUR)</th>
                  <th className="text-right p-3 text-gray-600">الحالة</th>
                  <th className="text-right p-3 text-gray-600">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => {
                  const totalPriceBase = booking.totalPriceBase ?? booking.totalPrice ?? 0
                  const totalPaidBase = booking.totalPaidBase ?? 0
                  const remainingBase = booking.remainingBase ?? (totalPriceBase - totalPaidBase)
                  return (
                    <tr key={booking.bookingId} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-500">{booking.bookingCode || '-'}</td>
                      <td className="p-3 text-gray-500">{booking.customerName || '-'}</td>
                      <td className="p-3 text-gray-500">{booking.hotelName || '-'}</td>
                      <td className="p-3 text-gray-500">{booking.checkIn || '-'}</td>
                      <td className="p-3 text-gray-500">{booking.checkOut || '-'}</td>
                      <td className="p-3 font-medium text-gray-500">€{totalPriceBase.toFixed(2)}</td>
                      <td className="p-3 text-green-600 ">
                        <button onClick={() => showBookingPayments(booking)} className="hover:underline">
                          €{totalPaidBase.toFixed(2)}
                        </button>
                      </td>
                      <td className="p-3 text-orange-600">€{remainingBase.toFixed(2)}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {booking.statusName || 'غير محدد'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => openEditModal(booking)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 border-blue-600 hover:border-blue-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => showBookingPayments(booking)}
                            variant="outline"
                            size="sm"
                            className="text-green-600"
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteBooking(booking.bookingId)}
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">إضافة حجز جديد</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-700 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddBooking} className="p-6 space-y-6">
              {/* معلومات أساسية */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">معلومات أساسية</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العميل <span className="text-red-500">*</span>
                    </label>
                    <SearchableSelect
                      options={customers}
                      value={formData.customerId?.toString() || ''}
                      onChange={(value) => setFormData({ ...formData, customerId: parseInt(value) })}
                      placeholder="اختر العميل..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الفندق <span className="text-red-500">*</span>
                    </label>
                    <SearchableSelect
                      options={hotels}
                      value={formData.hotelId?.toString() || ''}
                      onChange={(value) => setFormData({ ...formData, hotelId: parseInt(value) })}
                      placeholder="اختر الفندق..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البائع (Seller)
                    </label>
                    <SearchableSelect
                      options={sellers}
                      value={formData.sellerId?.toString() || ''}
                      onChange={(value) => setFormData({ ...formData, sellerId: parseInt(value) })}
                      placeholder="اختر البائع..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوسيط (Broker)
                    </label>
                    <SearchableSelect
                      options={brokers}
                      value={formData.brokerId?.toString() || ''}
                      onChange={(value) => setFormData({ ...formData, brokerId: parseInt(value) })}
                      placeholder="اختر الوسيط..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المورد (Supplier)
                    </label>
                    <SearchableSelect
                      options={suppliers}
                      value={formData.supplierId?.toString() || ''}
                      onChange={(value) => setFormData({ ...formData, supplierId: parseInt(value) })}
                      placeholder="اختر المورد..."
                    />
                  </div>
                </div>
              </div>

              {/* أكواد الحجز */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">أكواد الحجز</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      كود الحجز
                    </label>
                    <Input
                      value={formData.bookingCode}
                      onChange={(e) => setFormData({ ...formData, bookingCode: e.target.value })}
                      placeholder="أدخل كود الحجز"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      كود تأكيد الفندق
                    </label>
                    <Input
                      value={formData.hotelConfirmationCode}
                      onChange={(e) => setFormData({ ...formData, hotelConfirmationCode: e.target.value })}
                      placeholder="أدخل كود التأكيد"
                    />
                  </div>
                </div>
              </div>

              {/* التواريخ والتفاصيل */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">التواريخ والتفاصيل</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ الوصول <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ المغادرة <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عدد الأشخاص
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.peopleCount}
                      onChange={(e) => setFormData({ ...formData, peopleCount: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* تفاصيل الغرف */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">تفاصيل الغرف</h3>
                  <Button type="button" variant="outline" onClick={addRoomRow} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    إضافة غرفة
                  </Button>
                </div>

                {(formData.rooms || []).length === 0 && (
                  <p className="text-sm text-gray-600">لم تتم إضافة غرف بعد.</p>
                )}

                <div className="space-y-3">
                  {(formData.rooms || []).map((room, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">غرفة #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeRoomRow(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">نوع الغرفة</label>
                          <select
                            value={room.roomTypeId || ''}
                            onChange={(e) => updateRoomField(index, 'roomTypeId', e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none"
                          >
                            <option value="">اختر نوع الغرفة</option>
                            {roomTypes.map((rt) => (
                              <option key={rt.roomTypeId} value={rt.roomTypeId}>
                                {rt.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">الإطلالة</label>
                          <select
                            value={room.viewTypeId || ''}
                            onChange={(e) => updateRoomField(index, 'viewTypeId', e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none"
                          >
                            <option value="">اختر الإطلالة</option>
                            {viewTypes.map((vt) => (
                              <option key={vt.viewTypeId} value={vt.viewTypeId}>
                                {vt.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">الخطة الغذائية</label>
                          <select
                            value={room.mealPlanId || ''}
                            onChange={(e) => updateRoomField(index, 'mealPlanId', e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none"
                          >
                            <option value="">اختر الخطة</option>
                            {mealPlans.map((mp) => (
                              <option key={mp.mealPlanId} value={mp.mealPlanId}>
                                {mp.code} {mp.description ? `- ${mp.description}` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">عدد الغرف</label>
                          <Input
                            type="number"
                            min={1}
                            value={room.roomCount ?? 1}
                            onChange={(e) => updateRoomField(index, 'roomCount', parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">سعر الليلة</label>
                          <Input
                            type="number"
                            step="0.01"
                            min={0}
                            value={room.pricePerNight ?? 0}
                            onChange={(e) => updateRoomField(index, 'pricePerNight', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">العملة</label>
                          <select
                            value={room.currencyId || ''}
                            onChange={(e) => updateRoomField(index, 'currencyId', e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none"
                          >
                            <option value="">اختر العملة</option>
                            {currencies.map((c) => (
                              <option key={c.currencyId} value={c.currencyId}>
                                {c.code} {c.symbol ? `(${c.symbol})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end">
                          <div className="text-sm text-gray-700">
                            المجموع الفرعي: {(room.pricePerNight || 0) * (room.roomCount || 1) * calculateNights(formData.checkIn, formData.checkOut)} 
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* السعر والحالة */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">السعر والحالة</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الحالة
                    </label>
                    <select
                      value={formData.statusId}
                      onChange={(e) => setFormData({ ...formData, statusId: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statuses.map((status) => (
                        <option key={status.statusId} value={status.statusId}>
                          {status.nameAr || status.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      السعر الإجمالي (يُحسب آلياً من الغرف)
                    </label>
                    <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 font-semibold text-gray-900">
                      ${formData.totalPrice?.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* نسب العمولات */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">نسب العمولات</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نسبة عمولة المورد (%)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.supplierCommissionPercent ?? 10}
                      onChange={(e) => setFormData({ ...formData, supplierCommissionPercent: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نسبة عمولة الوسيط (%)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.brokerCommissionPercent ?? 10}
                      onChange={(e) => setFormData({ ...formData, brokerCommissionPercent: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* ملاحظات */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="أدخل أي ملاحظات إضافية..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? 'جاري الحفظ...' : 'حفظ الحجز'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                  disabled={submitting}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Booking Modal - Similar to Add but with different title and handler */}
      {showEditModal && editingBooking && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">تعديل الحجز</h2>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingBooking(null)
                }}
                className="text-gray-700 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditBooking} className="p-6 space-y-6">
              {/* Same form structure as Add Modal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">معلومات أساسية</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العميل <span className="text-red-500">*</span>
                    </label>
                    <SearchableSelect
                      options={customers}
                      value={formData.customerId?.toString() || ''}
                      onChange={(value) => setFormData({ ...formData, customerId: parseInt(value) })}
                      placeholder="اختر العميل..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الفندق <span className="text-red-500">*</span>
                    </label>
                    <SearchableSelect
                      options={hotels}
                      value={formData.hotelId?.toString() || ''}
                      onChange={(value) => setFormData({ ...formData, hotelId: parseInt(value) })}
                      placeholder="اختر الفندق..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البائع (Seller)
                    </label>
                    <SearchableSelect
                      options={sellers}
                      value={formData.sellerId?.toString() || ''}
                      onChange={(value) => setFormData({ ...formData, sellerId: parseInt(value) })}
                      placeholder="اختر البائع..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوسيط (Broker)
                    </label>
                    <SearchableSelect
                      options={brokers}
                      value={formData.brokerId?.toString() || ''}
                      onChange={(value) => setFormData({ ...formData, brokerId: parseInt(value) })}
                      placeholder="اختر الوسيط..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المورد (Supplier)
                    </label>
                    <SearchableSelect
                      options={suppliers}
                      value={formData.supplierId?.toString() || ''}
                      onChange={(value) => setFormData({ ...formData, supplierId: parseInt(value) })}
                      placeholder="اختر المورد..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">أكواد الحجز</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      كود الحجز
                    </label>
                    <Input
                      value={formData.bookingCode}
                      onChange={(e) => setFormData({ ...formData, bookingCode: e.target.value })}
                      placeholder="أدخل كود الحجز"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      كود تأكيد الفندق
                    </label>
                    <Input
                      value={formData.hotelConfirmationCode}
                      onChange={(e) => setFormData({ ...formData, hotelConfirmationCode: e.target.value })}
                      placeholder="أدخل كود التأكيد"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">التواريخ والتفاصيل</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ الوصول <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ المغادرة <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عدد الأشخاص
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.peopleCount}
                      onChange={(e) => setFormData({ ...formData, peopleCount: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* تفاصيل الغرف */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">تفاصيل الغرف</h3>
                  <Button type="button" variant="outline" onClick={addRoomRow} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    إضافة غرفة
                  </Button>
                </div>

                {(formData.rooms || []).length === 0 && (
                  <p className="text-sm text-gray-600">لم تتم إضافة غرف بعد.</p>
                )}

                <div className="space-y-3">
                  {(formData.rooms || []).map((room, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">غرفة #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeRoomRow(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">نوع الغرفة</label>
                          <select
                            value={room.roomTypeId || ''}
                            onChange={(e) => updateRoomField(index, 'roomTypeId', e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none"
                          >
                            <option value="">اختر نوع الغرفة</option>
                            {roomTypes.map((rt) => (
                              <option key={rt.roomTypeId} value={rt.roomTypeId}>
                                {rt.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">الإطلالة</label>
                          <select
                            value={room.viewTypeId || ''}
                            onChange={(e) => updateRoomField(index, 'viewTypeId', e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none"
                          >
                            <option value="">اختر الإطلالة</option>
                            {viewTypes.map((vt) => (
                              <option key={vt.viewTypeId} value={vt.viewTypeId}>
                                {vt.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">الخطة الغذائية</label>
                          <select
                            value={room.mealPlanId || ''}
                            onChange={(e) => updateRoomField(index, 'mealPlanId', e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none"
                          >
                            <option value="">اختر الخطة</option>
                            {mealPlans.map((mp) => (
                              <option key={mp.mealPlanId} value={mp.mealPlanId}>
                                {mp.code} {mp.description ? `- ${mp.description}` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">عدد الغرف</label>
                          <Input
                            type="number"
                            min={1}
                            value={room.roomCount ?? 1}
                            onChange={(e) => updateRoomField(index, 'roomCount', parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">سعر الليلة</label>
                          <Input
                            type="number"
                            step="0.01"
                            min={0}
                            value={room.pricePerNight ?? 0}
                            onChange={(e) => updateRoomField(index, 'pricePerNight', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">العملة</label>
                          <select
                            value={room.currencyId || ''}
                            onChange={(e) => updateRoomField(index, 'currencyId', e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none"
                          >
                            <option value="">اختر العملة</option>
                            {currencies.map((c) => (
                              <option key={c.currencyId} value={c.currencyId}>
                                {c.code} {c.symbol ? `(${c.symbol})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end">
                          <div className="text-sm text-gray-700">
                            المجموع الفرعي: {(room.pricePerNight || 0) * (room.roomCount || 1) * calculateNights(formData.checkIn, formData.checkOut)} 
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">السعر والحالة</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الحالة
                    </label>
                    <select
                      value={formData.statusId}
                      onChange={(e) => setFormData({ ...formData, statusId: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statuses.map((status) => (
                        <option key={status.statusId} value={status.statusId}>
                          {status.nameAr || status.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      السعر الإجمالي (يُحسب آلياً من الغرف)
                    </label>
                    <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 font-semibold text-gray-900">
                      ${formData.totalPrice?.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">نسب العمولات</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نسبة عمولة المورد (%)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.supplierCommissionPercent ?? 10}
                      onChange={(e) => setFormData({ ...formData, supplierCommissionPercent: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نسبة عمولة الوسيط (%)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.brokerCommissionPercent ?? 10}
                      onChange={(e) => setFormData({ ...formData, brokerCommissionPercent: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="أدخل أي ملاحظات إضافية..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingBooking(null)
                  }}
                  className="flex-1"
                  disabled={submitting}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payments Modal */}
      {showPaymentsModal && editingBooking && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">
                مدفوعات الحجز: {editingBooking.bookingCode || `#${editingBooking.bookingId}`}
              </h2>
              <button
                onClick={() => {
                  setShowPaymentsModal(false)
                  setEditingBooking(null)
                  setSelectedBookingPayments([])
                }}
                className="text-gray-700 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-600">السعر الإجمالي</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(editingBooking.totalPrice || 0).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-600">المدفوع</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${getTotalPaid(selectedBookingPayments).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-600">المتبقي</p>
                    <p className="text-2xl font-bold text-orange-600">
                      ${getRemainingAmount(editingBooking, getTotalPaid(selectedBookingPayments)).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Payments List */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">المدفوعات</h3>
                  <Link href="/dashboard/payments">
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة دفعة
                    </Button>
                  </Link>
                </div>

                {selectedBookingPayments.length > 0 ? (
                  <div className="space-y-3">
                    {selectedBookingPayments.map((payment) => (
                      <div key={payment.paymentId} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">
                              ${(payment.amount || 0).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('ar-EG') : '-'}
                            </p>
                            {payment.notes && (
                              <p className="text-sm text-gray-500 mt-2">{payment.notes}</p>
                            )}
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {payment.paymentType || 'نوع غير محدد'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-700" />
                    <p>لا توجد مدفوعات لهذا الحجز</p>
                    <Link href="/dashboard/payments">
                      <Button variant="outline" size="sm" className="mt-4">
                        إضافة أول دفعة
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

