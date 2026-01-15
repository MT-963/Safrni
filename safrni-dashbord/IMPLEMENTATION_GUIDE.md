# دليل التطبيق - المهام المتبقية

## ✅ المهام المكتملة:
1. ✓ إصلاح خطأ 500 في صفحة الإحصائيات
2. ✓ تغميق جميع ألوان Tailwind (تم تحديث 51 ملف)

## 🔧 المهام المتبقية:

### 3. إضافة Sorting للجداول

أضف هذه الحالات (states) في أعلى كل صفحة تحتوي على جدول:

```typescript
const [sortField, setSortField] = useState<string>('createdAt')
const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
```

دالة الترتيب:

```typescript
const handleSort = (field: string) => {
  if (sortField === field) {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  } else {
    setSortField(field)
    setSortDirection('asc')
  }
}

useEffect(() => {
  let sorted = [...filteredData]
  sorted.sort((a, b) => {
    let aVal: any = a[sortField]
    let bVal: any = b[sortField]
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
    return 0
  })
  setSortedData(sorted)
}, [filteredData, sortField, sortDirection])
```

في رأس الجدول (thead):

```tsx
import { ArrowUpDown } from 'lucide-react'

<th className="text-right p-3 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('fieldName')}>
  <div className="flex items-center gap-2">
    اسم العمود <ArrowUpDown className="h-4 w-4" />
  </div>
</th>
```

### 4. إضافة جميع حقول الحجز

تأكد من أن نموذج الحجز يحتوي على جميع الحقول:

```typescript
const [formData, setFormData] = useState({
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
  notes: ''
})
```

### 5. نافذة تفاصيل الحجز مع المدفوعات

أضف هذه الحالات:

```typescript
const [showDetailsModal, setShowDetailsModal] = useState(false)
const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
const [bookingPayments, setBookingPayments] = useState<Payment[]>([])
```

دالة عرض التفاصيل:

```typescript
const showBookingDetails = async (booking: Booking) => {
  setSelectedBooking(booking)
  try {
    const paymentsRes = await paymentsApi.getByBookingId(booking.bookingId)
    setBookingPayments(paymentsRes.data)
  } catch (error) {
    console.error('Error fetching payments:', error)
    setBookingPayments([])
  }
  setShowDetailsModal(true)
}
```

النافذة المنبثقة (Modal):

```tsx
{showDetailsModal && selectedBooking && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>تفاصيل الحجز - {selectedBooking.bookingCode}</CardTitle>
          <Button onClick={() => setShowDetailsModal(false)} variant="outline" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* معلومات الحجز */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-700">العميل</p>
            <p className="font-medium">{selectedBooking.customer?.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-700">الفندق</p>
            <p className="font-medium">{selectedBooking.hotel?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-700">تاريخ الدخول</p>
            <p className="font-medium">{selectedBooking.checkIn}</p>
          </div>
          <div>
            <p className="text-sm text-gray-700">تاريخ الخروج</p>
            <p className="font-medium">{selectedBooking.checkOut}</p>
          </div>
        </div>

        {/* ملخص المدفوعات */}
        <div className="border-t pt-4">
          <h3 className="font-bold text-lg mb-4">ملخص المدفوعات</h3>
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span>إجمالي المبلغ:</span>
              <span className="font-bold text-lg">${selectedBooking.totalPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-700">
              <span>المدفوع:</span>
              <span className="font-bold">
                ${bookingPayments.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-orange-700 border-t pt-2">
              <span>المتبقي:</span>
              <span className="font-bold text-lg">
                ${(selectedBooking.totalPrice - bookingPayments.reduce((sum, p) => sum + (p.amount || 0), 0)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* قائمة المدفوعات */}
        <div className="border-t pt-4">
          <h3 className="font-bold text-lg mb-4">سجل المدفوعات ({bookingPayments.length})</h3>
          {bookingPayments.length > 0 ? (
            <div className="space-y-2">
              {bookingPayments.map((payment) => (
                <div key={payment.paymentId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">${payment.amount?.toFixed(2)}</p>
                    <p className="text-sm text-gray-700">{payment.paymentDate}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {payment.paymentType}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-700 py-4">لا توجد مدفوعات بعد</p>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
)}
```

اجعل الصف قابل للنقر:

```tsx
<tr 
  key={booking.bookingId} 
  className="border-b hover:bg-gray-50 cursor-pointer" 
  onClick={() => showBookingDetails(booking)}
>
```

### 6. نافذة تفاصيل العميل

أضف هذه الحالات في `customers/page.tsx`:

```typescript
const [showCustomerDetailsModal, setShowCustomerDetailsModal] = useState(false)
const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
const [customerBookings, setCustomerBookings] = useState<Booking[]>([])
const [customerPayments, setCustomerPayments] = useState<any[]>([])
```

دالة عرض تفاصيل العميل:

```typescript
const showCustomerDetails = async (customer: Customer) => {
  setSelectedCustomer(customer)
  try {
    // جلب حجوزات العميل
    const bookingsRes = await bookingsApi.getAll()
    const customerBooks = bookingsRes.data.filter((b: Booking) => b.customerId === customer.customerId)
    setCustomerBookings(customerBooks)
    
    // جلب مدفوعات العميل
    const paymentsRes = await paymentsApi.getAll()
    const customerPays = paymentsRes.data.filter((p: any) => 
      customerBooks.some(b => b.bookingId === p.bookingId)
    )
    setCustomerPayments(customerPays)
  } catch (error) {
    console.error('Error fetching customer details:', error)
  }
  setShowCustomerDetailsModal(true)
}
```

النافذة المنبثقة:

```tsx
{showCustomerDetailsModal && selectedCustomer && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>تفاصيل العميل - {selectedCustomer.fullName}</CardTitle>
          <Button onClick={() => setShowCustomerDetailsModal(false)} variant="outline" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* معلومات العميل */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-700">الاسم الكامل</p>
            <p className="font-medium">{selectedCustomer.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-700">الجنسية</p>
            <p className="font-medium">{selectedCustomer.nationality || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-700">البريد الإلكتروني</p>
            <p className="font-medium">{selectedCustomer.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-700">الهاتف</p>
            <p className="font-medium">{selectedCustomer.phone || '-'}</p>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-3 gap-4 border-t pt-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">عدد الحجوزات</p>
            <p className="text-2xl font-bold text-blue-900">{customerBookings.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700">إجمالي المدفوع</p>
            <p className="text-2xl font-bold text-green-900">
              ${customerPayments.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-orange-700">المتبقي</p>
            <p className="text-2xl font-bold text-orange-900">
              ${(customerBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0) - 
                  customerPayments.reduce((sum, p) => sum + (p.amount || 0), 0)).toFixed(2)}
            </p>
          </div>
        </div>

        {/* قائمة الحجوزات */}
        <div className="border-t pt-4">
          <h3 className="font-bold text-lg mb-4">الحجوزات ({customerBookings.length})</h3>
          {customerBookings.length > 0 ? (
            <div className="space-y-2">
              {customerBookings.map((booking) => (
                <div key={booking.bookingId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{booking.hotel?.name}</p>
                    <p className="text-sm text-gray-700">
                      {booking.checkIn} - {booking.checkOut}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-700">${booking.totalPrice?.toFixed(2)}</p>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {booking.status?.nameAr}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-700 py-4">لا توجد حجوزات</p>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
)}
```

اجعل الصف قابل للنقر:

```tsx
<tr 
  key={customer.customerId} 
  className="border-b hover:bg-gray-50 cursor-pointer" 
  onClick={() => showCustomerDetails(customer)}
>
```

## 📝 ملاحظات:
- تم تغميق جميع ألوان Tailwind في 51 ملف
- تم إصلاح خطأ الإحصائيات في البكند
- البكند والفرونتاند يعملان بنجاح

## 🔍 الملفات المطلوب تعديلها:
1. `app/dashboard/bookings/page.tsx` - إضافة sorting + نافذة تفاصيل
2. `app/dashboard/customers/page.tsx` - إضافة sorting + نافذة تفاصيل  
3. `app/dashboard/hotels/page.tsx` - إضافة sorting
4. `app/dashboard/payments/page.tsx` - إضافة sorting
5. `app/dashboard/admin/sellers/page.tsx` - إضافة sorting
6. `app/dashboard/admin/brokers/page.tsx` - إضافة sorting
7. `app/dashboard/admin/suppliers/page.tsx` - إضافة sorting

## 🚀 للتطبيق:
انسخ الكود من هذا الدليل وطبقه على كل ملف حسب الحاجة.



