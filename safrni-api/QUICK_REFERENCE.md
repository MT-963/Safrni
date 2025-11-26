# دليل مرجعي سريع - حقل PeopleCount

## 🎯 التغيير الرئيسي

✅ **PeopleCount** انتقل من جدول **Customers** → إلى جدول **Bookings**

## 📍 الموقع الجديد

### قاعدة البيانات
```
Bookings Table:
├── BookingID
├── BookingCode
├── HotelConfirmationCode
├── PeopleCount ← هنا الآن! 🎉
├── CheckIn
└── CheckOut
```

### API Models
```csharp
// ❌ Customer.cs - لم يعد موجود
public class Customer {
    public int CustomerId { get; set; }
    public string FullName { get; set; }
    // ❌ public int? PeopleCount { get; set; } // تم حذفه
}

// ✅ Booking.cs - موجود الآن
public class Booking {
    public int BookingId { get; set; }
    public string? BookingCode { get; set; }
    public int? PeopleCount { get; set; } // ✅ هنا!
    public DateOnly? CheckIn { get; set; }
}
```

### DTOs
```csharp
// ✅ BookingDto
public class BookingDto {
    public int? PeopleCount { get; set; } // ✅
}

// ✅ CreateBookingDto
public class CreateBookingDto {
    public int? PeopleCount { get; set; } // ✅
}
```

### Frontend Types
```typescript
// ✅ Booking Interface
export interface Booking {
  peopleCount?: number  // ✅ موجود
  checkIn?: string
  checkOut?: string
}

// ❌ Customer Interface
export interface Customer {
  fullName: string
  // ❌ peopleCount تم حذفه
}
```

## 🔍 كيفية الاستخدام

### إنشاء حجز جديد
```typescript
const booking = {
  customerId: 1,
  hotelId: 5,
  peopleCount: 4,  // ← أضف عدد الأشخاص هنا
  checkIn: "2025-02-01",
  checkOut: "2025-02-05"
}

await bookingsApi.create(booking)
```

### عرض في الواجهة
```typescript
// ✅ صفحة الحجوزات
<td>
  <span className="badge">
    {booking.peopleCount || 'غير محدد'}
  </span>
</td>

// ❌ صفحة العملاء - لم يعد موجود
```

## 📊 الفوائد

| قبل | بعد |
|-----|-----|
| عميل واحد = عدد أشخاص ثابت | كل حجز = عدد أشخاص مختلف |
| غير دقيق | دقيق ومرن |
| عميل بـ 4 أشخاص دائماً؟ | حجز بشخص واحد، حجز آخر بـ 4 |

## 🚀 الاختبار السريع

1. افتح API على http://localhost:5000
2. اختبر:
   ```bash
   GET /api/customers/1
   # لا يحتوي على peopleCount ✅
   
   GET /api/bookings/1
   # يحتوي على peopleCount ✅
   ```

3. افتح Dashboard على http://localhost:3000
4. تحقق:
   - صفحة العملاء: 6 أعمدة (بدون عدد الأشخاص) ✅
   - صفحة الحجوزات: 9 أعمدة (مع عدد الأشخاص) ✅

## ⚠️ ملاحظة مهمة

عند إنشاء أو تحديث **Booking**، تأكد من إضافة `peopleCount`:

```json
{
  "customerId": 1,
  "hotelId": 2,
  "peopleCount": 3,  // ← لا تنساه!
  "checkIn": "2025-03-01",
  "checkOut": "2025-03-05"
}
```

---

✅ **كل شيء يعمل بشكل صحيح الآن!**

