# دليل إعداد نظام التسجيل والمصادقة - Safrni

## ✅ تم التنفيذ بنجاح

تم إضافة نظام تسجيل دخول وخروج كامل مع JWT Authentication للـ sellers (الموظفين والأدمن).

---

## 🔐 الميزات المضافة

### في الباكند (Backend)

1. **JWT Authentication**
   - تم إضافة `Microsoft.AspNetCore.Authentication.JwtBearer` package
   - تم تكوين JWT في `Program.cs` و `appsettings.json`
   
2. **BCrypt Password Hashing**
   - تم إضافة `BCrypt.Net-Next` package
   - كلمات السر يتم تشفيرها باستخدام BCrypt
   
3. **AuthController** (`/api/auth`)
   - `POST /api/auth/login` - تسجيل الدخول
   - `POST /api/auth/register` - تسجيل موظف جديد (للأدمن فقط)
   - `POST /api/auth/change-password` - تغيير كلمة السر
   - `GET /api/auth/profile` - الحصول على معلومات المستخدم
   - `POST /api/auth/setup-admin` - إنشاء أول أدمن (يعمل فقط إذا لم يكن هناك أدمن)

4. **AuthService**
   - `GenerateJwtToken()` - توليد JWT token
   - `HashPassword()` - تشفير كلمة السر
   - `VerifyPassword()` - التحقق من كلمة السر

5. **Authorization على جميع Controllers**
   - `[Authorize]` - للموظفين والأدمن
   - `[Authorize(Roles = "Admin")]` - للأدمن فقط (Sellers, PaymentCategories)

6. **Tracking المستخدم الحالي**
   - تم تحديث `BookingsController` و `PaymentsController`
   - يتم تعيين `CreatedBy` و `UpdatedBy` تلقائياً من المستخدم المسجل دخوله

### في الفرونت اند (Frontend)

1. **AuthContext** (`contexts/AuthContext.tsx`)
   - إدارة حالة المستخدم
   - `login()` - تسجيل الدخول
   - `logout()` - تسجيل الخروج
   - `isAdmin` - التحقق من دور الأدمن
   - `isEmployee` - التحقق من دور الموظف

2. **صفحة تسجيل الدخول** (`app/login/page.tsx`)
   - واجهة جميلة وعصرية
   - رسائل خطأ واضحة
   - Loading state

3. **ProtectedRoute Component**
   - حماية صفحات Dashboard
   - إعادة توجيه تلقائية لصفحة Login

4. **Sidebar محدثة**
   - عرض معلومات المستخدم الحالي
   - Badge للدور (أدمن / موظف)
   - زر تسجيل الخروج

5. **API Integration**
   - `setAuthToken()` - إضافة JWT token للـ headers
   - جميع الـ API calls تستخدم الـ token

---

## 📝 كيفية الاستخدام

### 1. إنشاء أول أدمن

#### الطريقة الأولى: عبر API مباشرة
```powershell
$body = @{ 
    name = "Admin User"; 
    email = "admin@safrni.com"; 
    password = "Admin@123" 
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5185/api/auth/setup-admin" `
    -Method Post -Body $body -ContentType "application/json"
```

#### الطريقة الثانية: باستخدام السكريبت
```powershell
cd safrni-api
.\setup_admin.ps1
```

### 2. تسجيل الدخول

#### من الواجهة:
1. افتح المتصفح على: `http://localhost:3000/login`
2. أدخل البريد الإلكتروني: `admin@safrni.com`
3. أدخل كلمة السر: `Admin@123`
4. اضغط "تسجيل الدخول"

#### عبر API:
```powershell
$body = @{ 
    email = "admin@safrni.com"; 
    password = "Admin@123" 
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5185/api/auth/login" `
    -Method Post -Body $body -ContentType "application/json"

# احفظ الـ token
$token = $response.token
```

### 3. استخدام الـ Token في API Calls

```powershell
$headers = @{ Authorization = "Bearer $token" }

# مثال: جلب الحجوزات
Invoke-RestMethod -Uri "http://localhost:5185/api/bookings" `
    -Method Get -Headers $headers
```

### 4. إنشاء موظفين جدد (للأدمن فقط)

```powershell
$headers = @{ Authorization = "Bearer $token" }
$body = @{
    name = "موظف اختبار"
    email = "employee@safrni.com"
    password = "Employee@123"
    role = "Employee"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5185/api/auth/register" `
    -Method Post -Body $body -Headers $headers -ContentType "application/json"
```

---

## 🔑 الأدوار (Roles)

### Admin (أدمن)
- **الصلاحيات الكاملة**
- إنشاء وإدارة الموظفين
- إدارة فئات الدفع (Payment Categories)
- الوصول إلى جميع الـ APIs

### Employee (موظف)
- إدارة العملاء
- إدارة الحجوزات
- إدارة المدفوعات
- إدارة الفنادق
- **لا يمكن** إنشاء موظفين جدد
- **لا يمكن** إدارة فئات الدفع

---

## 🛡️ الأمان

1. **كلمات السر مشفرة** باستخدام BCrypt
2. **JWT Tokens** مع expiration (24 ساعة)
3. **Authorization** على جميع الـ endpoints الحساسة
4. **Role-based access control** للأدمن والموظف
5. **HTTPS support** في الإنتاج

---

## 🧪 اختبار النظام

### اختبار تسجيل الدخول
```powershell
$body = @{ 
    email = "admin@safrni.com"; 
    password = "Admin@123" 
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5185/api/auth/login" `
    -Method Post -Body $body -ContentType "application/json"
```

### اختبار Protected Endpoint
```powershell
# بدون token - يجب أن يفشل
Invoke-RestMethod -Uri "http://localhost:5185/api/bookings" -Method Get

# مع token - يجب أن ينجح
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:5185/api/bookings" `
    -Method Get -Headers $headers
```

### اختبار Role-based Access
```powershell
# موظف يحاول الوصول لـ endpoint خاص بالأدمن - يجب أن يفشل
$employeeToken = "..." # token موظف
$headers = @{ Authorization = "Bearer $employeeToken" }

Invoke-RestMethod -Uri "http://localhost:5185/api/sellers" `
    -Method Get -Headers $headers
```

---

## 📊 التحديثات على قاعدة البيانات

تم استخدام حقول `PasswordHash`, `Role`, `IsActive` من جدول `sellers`:

```sql
-- الحقول المستخدمة:
PasswordHash VARCHAR(255)  -- كلمة السر المشفرة
Role VARCHAR(50)           -- الدور (Admin / Employee)
IsActive TINYINT           -- الحالة (1 = نشط, 0 = غير نشط)
```

---

## 🔄 التتبع التلقائي للمستخدمين

عند إنشاء أو تحديث:
- **Bookings**: يتم تسجيل `CreatedBy` و `UpdatedBy`
- **Payments**: يتم تسجيل `CreatedBy` و `UpdatedBy`

الـ ID يتم جلبه تلقائياً من JWT token للمستخدم المسجل دخوله.

---

## 🎨 الواجهات

### صفحة تسجيل الدخول
- تصميم عصري وجميل
- رسائل خطأ واضحة باللغة العربية
- Loading state أثناء تسجيل الدخول

### Dashboard
- معلومات المستخدم في Sidebar
- Badge للدور (أدمن / موظف)
- زر تسجيل خروج واضح

---

## 🚀 الخطوات التالية (اختياري)

1. **إضافة صفحة لإدارة المستخدمين** (للأدمن)
2. **إضافة صفحة تغيير كلمة السر** في الواجهة
3. **إضافة Forgot Password** functionality
4. **تحسين الأمان** بإضافة:
   - Rate limiting
   - Account lockout بعد محاولات فاشلة
   - Two-factor authentication (اختياري)

---

## 📞 معلومات الحساب الافتراضي

**البريد الإلكتروني**: `admin@safrni.com`  
**كلمة السر**: `Admin@123`  
**الدور**: Admin

---

## ✅ ملخص

تم إنشاء نظام authentication كامل مع:
- ✅ تسجيل دخول وخروج
- ✅ JWT tokens
- ✅ BCrypt password hashing
- ✅ Role-based authorization
- ✅ Protected routes
- ✅ User tracking (CreatedBy/UpdatedBy)
- ✅ واجهة جميلة لتسجيل الدخول

النظام جاهز للاستخدام! 🎉

