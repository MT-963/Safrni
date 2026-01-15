# UI Improvements - Darker Text

## ✅ Text Contrast Enhanced

### Problem:
Light gray text (gray-700, gray-500, gray-600) was too light and hard to read against white backgrounds.

### Solution:
Updated `globals.css` with darker color overrides for better readability.

---

## 🎨 Color Changes

### Before:
- `text-gray-700`: #cbd5e1 (very light)
- `text-gray-500`: #94a3b8 (light)
- `text-gray-600`: #64748b (medium light)

### After:
- `text-gray-700`: #707070 (darker)
- `text-gray-500`: #505050 (much darker)
- `text-gray-600`: #303030 (very dark)

### Border Colors:
- `border-gray-200`: #d0d0d0 (darker)
- `border-gray-300`: #b0b0b0 (darker)

---

## 📍 Files Modified

**File**: `safrni-dashbord/app/globals.css`

```css
/* Override light gray text to be darker for better contrast */
.text-gray-700 {
  color: #707070 !important;
}

.text-gray-500 {
  color: #505050 !important;
}

.text-gray-600 {
  color: #303030 !important;
}

/* Override border colors to be darker */
.border-gray-200 {
  border-color: #d0d0d0 !important;
}

.border-gray-300 {
  border-color: #b0b0b0 !important;
}
```

---

## ✅ Result

- **Better readability** across all pages
- **Higher contrast** for accessibility
- **Professional appearance** with darker text
- **Consistent** across the entire application

---

## 🎯 Affected Pages

All dashboard pages now have darker, more readable text:
- Hotels
- Customers
- Bookings
- Payments
- Sellers
- Brokers
- Admin pages



