-- ====================================================
-- Safrni Database Updates v2
-- تعديلات شاملة على قاعدة البيانات
-- ====================================================

-- ====================================================
-- 1) تعديل جدول sellers ليصبح نظام مستخدمين
-- ====================================================

-- إضافة كلمة المرور والدور وحالة التفعيل
ALTER TABLE sellers
ADD COLUMN PasswordHash VARCHAR(255) AFTER Email;

ALTER TABLE sellers
ADD COLUMN Role ENUM('Admin','Employee') NOT NULL DEFAULT 'Employee' AFTER PasswordHash;

-- تعديل IsActive إذا لم يكن موجود أو تحسينه
ALTER TABLE sellers
MODIFY COLUMN IsActive TINYINT(1) NOT NULL DEFAULT 1;

-- جعل Email فريد
ALTER TABLE sellers
ADD UNIQUE KEY unique_email (Email);

-- ====================================================
-- 2) إضافة جدول تتبع حالة الحجز
-- ====================================================

CREATE TABLE IF NOT EXISTS bookingstatus_history (
    HistoryID INT AUTO_INCREMENT PRIMARY KEY,
    BookingID INT NOT NULL,
    OldStatusID INT NULL,
    NewStatusID INT NOT NULL,
    ChangedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    ChangedBy INT NULL,
    Reason VARCHAR(255) NULL,
    FOREIGN KEY (BookingID) REFERENCES bookings(BookingID) ON DELETE CASCADE,
    FOREIGN KEY (OldStatusID) REFERENCES bookingstatus(StatusID),
    FOREIGN KEY (NewStatusID) REFERENCES bookingstatus(StatusID),
    FOREIGN KEY (ChangedBy) REFERENCES sellers(SellerID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- 3) إضافة جدول الملاحظات الداخلية
-- ====================================================

CREATE TABLE IF NOT EXISTS booking_internal_notes (
    NoteID INT AUTO_INCREMENT PRIMARY KEY,
    BookingID INT NOT NULL,
    SellerID INT NOT NULL,
    NoteText TEXT NOT NULL,
    IsAdminOnly TINYINT(1) DEFAULT 1,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BookingID) REFERENCES bookings(BookingID) ON DELETE CASCADE,
    FOREIGN KEY (SellerID) REFERENCES sellers(SellerID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- 4) إضافة جدول المستندات
-- ====================================================

CREATE TABLE IF NOT EXISTS booking_documents (
    DocumentID INT AUTO_INCREMENT PRIMARY KEY,
    BookingID INT NOT NULL,
    FileUrl VARCHAR(255) NOT NULL,
    FileType VARCHAR(50) NULL,
    UploadedBy INT NOT NULL,
    UploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BookingID) REFERENCES bookings(BookingID) ON DELETE CASCADE,
    FOREIGN KEY (UploadedBy) REFERENCES sellers(SellerID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- 5) تحسين جدول الدفعات - إضافة سعر الصرف المستخدم
-- ====================================================

ALTER TABLE payments
ADD COLUMN RateUsed DECIMAL(10,4) NULL AFTER CurrencyID;

-- ====================================================
-- 6) إضافة CreatedBy / UpdatedBy في الجداول المهمة
-- ====================================================

-- في bookings: تحويل CreatedBy و UpdatedBy من VARCHAR إلى INT
ALTER TABLE bookings
MODIFY COLUMN CreatedBy INT NULL,
MODIFY COLUMN UpdatedBy INT NULL;

-- إضافة Foreign Keys لـ bookings
ALTER TABLE bookings
ADD CONSTRAINT fk_booking_created_by FOREIGN KEY (CreatedBy) REFERENCES sellers(SellerID),
ADD CONSTRAINT fk_booking_updated_by FOREIGN KEY (UpdatedBy) REFERENCES sellers(SellerID);

-- في payments
ALTER TABLE payments
ADD COLUMN CreatedBy INT NULL AFTER PaymentDate,
ADD COLUMN UpdatedBy INT NULL AFTER CreatedBy,
ADD COLUMN CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP AFTER UpdatedBy,
ADD COLUMN UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER CreatedAt;

ALTER TABLE payments
ADD CONSTRAINT fk_payment_created_by FOREIGN KEY (CreatedBy) REFERENCES sellers(SellerID),
ADD CONSTRAINT fk_payment_updated_by FOREIGN KEY (UpdatedBy) REFERENCES sellers(SellerID);

-- في extras
ALTER TABLE extras
ADD COLUMN CreatedBy INT NULL AFTER IsGift,
ADD COLUMN UpdatedBy INT NULL AFTER CreatedBy,
ADD COLUMN CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP AFTER UpdatedBy,
ADD COLUMN UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER CreatedAt;

ALTER TABLE extras
ADD CONSTRAINT fk_extra_created_by FOREIGN KEY (CreatedBy) REFERENCES sellers(SellerID),
ADD CONSTRAINT fk_extra_updated_by FOREIGN KEY (UpdatedBy) REFERENCES sellers(SellerID);

-- ====================================================
-- 7) توسيع أنواع مصدر العمولة لتشمل المورد والوسيط
-- ====================================================
ALTER TABLE commissions
MODIFY COLUMN Source ENUM('Hotel','Agent','Internal','Supplier','Broker');

-- ====================================================
-- 7) تنظيف العلاقات (إذا كانت موجودة بشكل خاطئ)
-- ====================================================

-- تأكيد وجود العلاقة الصحيحة بين bookings و sellers
-- (إذا كانت موجودة مسبقاً ستحصل على خطأ، تجاهله)
ALTER TABLE bookings
ADD CONSTRAINT fk_booking_seller FOREIGN KEY (SellerID) REFERENCES sellers(SellerID);

-- ====================================================
-- تم الانتهاء من التعديلات
-- ====================================================

