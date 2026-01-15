# تحديثات الفرونت اند v2

## 📝 التغييرات المطبقة

### 1. تحديث Types

تم تحديث الأنواع (Types) في `types/index.ts`:

#### Seller Type
```typescript
- role: string // 'Admin' أو 'Employee'  
- isActive: number // تم تغييره من boolean
```

#### Booking Type
```typescript
- createdBy: number // تم تغييره من string  
- updatedBy: number // تم تغييره من string
```

#### Payment Type
```typescript
+ rateUsed?: number // سعر الصرف المستخدم
+ createdBy?: number
+ updatedBy?: number
+ createdAt?: string
+ updatedAt?: string
```

### 2. أنواع جديدة (New Types)

#### BookingStatusHistory
تتبع تاريخ تغيير حالات الحجوزات:
```typescript
interface BookingStatusHistory {
  historyId: number
  bookingId: number
  oldStatusId?: number
  newStatusId: number
  changedAt?: string
  changedBy?: number
  reason?: string
}
```

#### BookingInternalNote
ملاحظات داخلية للموظفين:
```typescript
interface BookingInternalNote {
  noteId: number
  bookingId: number
  sellerId: number
  noteText: string
  isAdminOnly: number
  createdAt?: string
}
```

#### BookingDocument
مستندات الحجوزات:
```typescript
interface BookingDocument {
  documentId: number
  bookingId: number
  fileUrl: string
  fileType?: string
  uploadedBy: number
  uploadedAt?: string
}
```

#### LoginRequest & LoginResponse
للمصادقة:
```typescript
interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  sellerId: number
  name: string
  email: string
  role: string
  token: string
}
```

## 🔄 التحديثات المطلوبة في الكود

### 1. تحديث Components

أي component يستخدم:
- `booking.createdBy` أو `booking.updatedBy` - الآن رقم وليس نص
- `seller.isActive` - الآن رقم (0 أو 1) وليس boolean

### 2. إضافة API Endpoints (اختياري)

في `services/api.ts` يمكنك إضافة:

```typescript
// Auth API
export const authApi = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
  changePassword: (oldPassword: string, newPassword: string) => 
    api.put('/auth/change-password', { oldPassword, newPassword }),
}

// Status History API
export const statusHistoryApi = {
  getByBooking: (bookingId: number) => 
    api.get<BookingStatusHistory[]>(`/bookings/${bookingId}/status-history`),
  create: (data: CreateBookingStatusHistory) => 
    api.post<BookingStatusHistory>('/status-history', data),
}

// Internal Notes API
export const internalNotesApi = {
  getByBooking: (bookingId: number) => 
    api.get<BookingInternalNote[]>(`/bookings/${bookingId}/notes`),
  create: (data: CreateBookingInternalNote) => 
    api.post<BookingInternalNote>('/internal-notes', data),
  update: (id: number, noteText: string) => 
    api.put(`/internal-notes/${id}`, { noteText }),
  delete: (id: number) => 
    api.delete(`/internal-notes/${id}`),
}

// Documents API
export const documentsApi = {
  getByBooking: (bookingId: number) => 
    api.get<BookingDocument[]>(`/bookings/${bookingId}/documents`),
  upload: (data: CreateBookingDocument) => 
    api.post<BookingDocument>('/documents', data),
  delete: (id: number) => 
    api.delete(`/documents/${id}`),
}
```

### 3. صفحات جديدة مقترحة

#### صفحة تسجيل الدخول
`app/login/page.tsx`
- تسجيل دخول بـ Email + Password
- حفظ Token في localStorage
- Redirect حسب الدور (Admin/Employee)

#### صفحة إدارة الموظفين
`app/dashboard/sellers/page.tsx`
- عرض قائمة الموظفين
- إضافة موظف جديد
- تعديل الدور والصلاحيات
- تفعيل/تعطيل حساب

#### صفحة تفاصيل الحجز المحسّنة
`app/dashboard/bookings/[id]/page.tsx`
- عرض تاريخ تغيير الحالات
- إضافة ملاحظات داخلية
- رفع مستندات
- عرض المستندات المرفقة

## 🔐 نظام المصادقة المقترح

### Context للمستخدم الحالي
```typescript
// app/contexts/AuthContext.tsx
interface AuthContextType {
  user: LoginResponse | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
  isEmployee: boolean
}
```

### Middleware للحماية
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
```

## ⚠️ ملاحظات مهمة

1. **CreatedBy/UpdatedBy**: الآن أرقام (IDs) وليست نصوص
2. **isActive**: في Seller الآن رقم (0 أو 1) وليس boolean
3. **RateUsed**: في Payment اختياري، يُستخدم لحفظ سعر الصرف
4. **Role**: في Seller إما 'Admin' أو 'Employee'

## 🧪 اختبار

```bash
# تأكد من عدم وجود أخطاء TypeScript
npm run build

# شغّل الفرونت اند
npm run dev
```

## 📚 الخطوات التالية

1. ✅ تطبيق تعديلات قاعدة البيانات
2. ✅ تحديث الباكند (Models, DTOs, DbContext)
3. ✅ تحديث Types في الفرونت اند
4. ⏳ إضافة صفحة تسجيل الدخول
5. ⏳ إضافة صفحة إدارة الموظفين
6. ⏳ تحديث صفحة تفاصيل الحجز
7. ⏳ إضافة Middleware للحماية
8. ⏳ إضافة AuthContext

## 🆘 مشاكل متوقعة

### خطأ: Type mismatch for createdBy/updatedBy
```typescript
// قبل
booking.createdBy = 'admin@example.com'

// بعد
booking.createdBy = currentUser.sellerId
```

### خطأ: seller.isActive is not boolean
```typescript
// قبل
if (seller.isActive) { ... }

// بعد
if (seller.isActive === 1) { ... }
// أو
if (!!seller.isActive) { ... }
```

