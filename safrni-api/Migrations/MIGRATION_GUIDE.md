# دليل تطبيق تحديثات قاعدة البيانات v2

## 📋 الخطوات المطلوبة

### 1️⃣ تطبيق تعديلات قاعدة البيانات

قم بتنفيذ ملف SQL:

```bash
mysql -u root -p safrni < Migrations/database_updates_v2.sql
```

أو افتح MySQL Workbench ونفذ محتوى الملف `database_updates_v2.sql`

### 2️⃣ إنشاء مستخدم أدمن أول

بعد تطبيق التعديلات، يجب إنشاء مستخدم أدمن:

```sql
-- إنشاء أول أدمن (استخدم كلمة سر قوية)
INSERT INTO sellers (Name, Email, PasswordHash, Role, IsActive)
VALUES ('Admin', 'admin@safrni.com', '', 'Admin', 1);

-- بعدها يمكن تسجيل الدخول من الواجهة وتغيير كلمة السر
```

**ملاحظة:** يجب تنفيذ hash لكلمة السر باستخدام BCrypt قبل الإدراج، أو استخدام واجهة التسجيل.

### 3️⃣ تشغيل الباكند

```bash
cd safrni-api
dotnet build
dotnet run
```

### 4️⃣ اختبار التحديثات

تأكد من أن:
- ✅ الجداول الجديدة تم إنشاؤها
- ✅ الأعمدة الجديدة موجودة
- ✅ Foreign Keys تم إضافتها بشكل صحيح
- ✅ API يعمل بدون أخطاء

## 📝 التعديلات المطبقة

### 1. جدول `sellers`
- إضافة `PasswordHash` - كلمة السر مشفرة
- إضافة `Role` - Admin أو Employee
- جعل `Email` فريد (UNIQUE)

### 2. جدول `bookingstatus_history`
- تتبع جميع تغييرات حالة الحجوزات
- من قام بالتغيير ومتى
- السبب (اختياري)

### 3. جدول `booking_internal_notes`
- ملاحظات داخلية للموظفين
- ملاحظات خاصة بالأدمن فقط
- مرتبطة بالحجوزات

### 4. جدول `booking_documents`
- رفع مستندات للحجوزات
- تتبع من رفع المستند ومتى
- دعم أنواع ملفات مختلفة

### 5. جدول `payments`
- إضافة `RateUsed` - سعر الصرف المستخدم
- إضافة `CreatedBy` و `UpdatedBy`
- إضافة `CreatedAt` و `UpdatedAt`

### 6. جدول `extras`
- إضافة `CreatedBy` و `UpdatedBy`
- إضافة `CreatedAt` و `UpdatedAt`

### 7. جدول `bookings`
- تحويل `CreatedBy` و `UpdatedBy` من VARCHAR إلى INT
- ربطهم بجدول `sellers`

## 🔐 نظام المصادقة

الآن `sellers` هو جدول المستخدمين:
- **Admin** - صلاحيات كاملة
- **Employee** - صلاحيات محدودة

يمكن إضافة endpoints للمصادقة:
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/register` - تسجيل موظف جديد (Admin فقط)
- `PUT /api/auth/change-password` - تغيير كلمة السر

## ⚠️ ملاحظات مهمة

1. **Backup قاعدة البيانات** قبل تطبيق التعديلات
2. **Foreign Keys** - إذا كانت هناك بيانات قديمة في `bookings` مع `CreatedBy` أو `UpdatedBy` كنص، يجب تنظيفها أولاً
3. **PasswordHash** - يجب استخدام BCrypt لتشفير كلمات السر
4. **Email Unique** - تأكد من عدم وجود emails مكررة في جدول sellers

## 🧪 اختبار

```bash
# اختبر الاتصال بقاعدة البيانات
mysql -u root -p safrni -e "SHOW TABLES;"

# تأكد من الجداول الجديدة
mysql -u root -p safrni -e "DESCRIBE bookingstatus_history;"
mysql -u root -p safrni -e "DESCRIBE booking_internal_notes;"
mysql -u root -p safrni -e "DESCRIBE booking_documents;"

# تأكد من الأعمدة الجديدة
mysql -u root -p safrni -e "DESCRIBE sellers;"
mysql -u root -p safrni -e "DESCRIBE payments;"
mysql -u root -p safrni -e "DESCRIBE extras;"
```

## 🆘 استكشاف الأخطاء

### خطأ: Duplicate entry for key 'unique_email'
```sql
-- ابحث عن الـ emails المكررة
SELECT Email, COUNT(*) FROM sellers GROUP BY Email HAVING COUNT(*) > 1;

-- احذف المكررات أو عدلها
```

### خطأ: Cannot add foreign key constraint
```sql
-- تحقق من وجود قيم CreatedBy/UpdatedBy غير موجودة في sellers
SELECT DISTINCT CreatedBy FROM bookings WHERE CreatedBy IS NOT NULL AND CreatedBy NOT IN (SELECT SellerID FROM sellers);
```

### خطأ: Data truncated for column 'Role'
```sql
-- تأكد من أن القيم هي فقط 'Admin' أو 'Employee'
UPDATE sellers SET Role = 'Employee' WHERE Role NOT IN ('Admin', 'Employee');
```

