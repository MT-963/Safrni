// Customer Types
export interface Customer {
  customerId: number
  fullName: string
  nationality?: string
  phone?: string
  email?: string
}

export interface CreateCustomer {
  fullName: string
  nationality?: string
  phone?: string
  email?: string
}

// Hotel Types
export interface Hotel {
  hotelId: number
  name: string
  country?: string
  city?: string
  starRating?: number
}

export interface CreateHotel {
  name: string
  country?: string
  city?: string
  starRating?: number
}

// Booking Types
export interface Booking {
  bookingId: number
  sellerId?: number
  supplierId?: number
  brokerId?: number
  customerId?: number
  hotelId?: number
  bookingCode?: string
  hotelConfirmationCode?: string
  peopleCount?: number
  checkIn?: string
  checkOut?: string
  statusId?: number
  totalPrice?: number
  notes?: string
  createdAt?: string
  createdBy?: string
  updatedAt?: string
  updatedBy?: string
  customerName?: string
  hotelName?: string
  sellerName?: string
  supplierName?: string
  brokerName?: string
  statusName?: string
}

export interface BookingDetail extends Booking {
  customer?: Customer
  hotel?: Hotel
  rooms?: BookingRoom[]
  payments?: Payment[]
  commissions?: Commission[]
  extras?: Extra[]
}

export interface CreateBooking {
  sellerId?: number
  supplierId?: number
  brokerId?: number
  customerId?: number
  hotelId?: number
  bookingCode?: string
  hotelConfirmationCode?: string
  peopleCount?: number
  checkIn?: string
  checkOut?: string
  statusId?: number
  totalPrice?: number
  notes?: string
  createdBy?: string
}

// Payment Types
export interface Payment {
  paymentId: number
  bookingId?: number
  amount?: number
  currencyId?: number
  paymentType?: string
  paymentMethodId?: number
  paymentDate?: string
  notes?: string
  currencyCode?: string
  paymentMethodName?: string
}

export interface CreatePayment {
  bookingId?: number
  amount?: number
  currencyId?: number
  paymentType?: string
  paymentMethodId?: number
  paymentDate?: string
  notes?: string
}

// Lookup Types
export interface BookingStatus {
  statusId: number
  nameEn?: string
  nameAr?: string
}

export interface Currency {
  currencyId: number
  code?: string
  symbol?: string
  rateToEur?: number
}

export interface RoomType {
  roomTypeId: number
  name?: string
}

export interface ViewType {
  viewTypeId: number
  name?: string
}

export interface MealPlan {
  mealPlanId: number
  code?: string
  description?: string
}

export interface PaymentMethod {
  paymentMethodId: number
  name?: string
}

export interface Seller {
  sellerId: number
  name: string
  email?: string
  isActive?: boolean
  createdAt?: string
}

export interface Broker {
  brokerId: number
  name: string
  contactEmail?: string
  phone?: string
  country?: string
  city?: string
  createdAt?: string
}

export interface PaymentCategory {
  categoryId: number
  name: string
}

export interface Supplier {
  supplierId: number
  name: string
  country?: string
  city?: string
  phone?: string
  contactEmail?: string
}

export interface BookingRoom {
  roomId: number
  bookingId?: number
  roomTypeId?: number
  viewTypeId?: number
  mealPlanId?: number
  roomCount?: number
  pricePerNight?: number
  currencyId?: number
  roomTypeName?: string
  viewTypeName?: string
  mealPlanCode?: string
  currencyCode?: string
}

export interface Commission {
  commissionId: number
  bookingId?: number
  source?: string
  percent?: number
  amount?: number
  currencyId?: number
  currencyCode?: string
}

export interface Extra {
  extraId: number
  bookingId?: number
  description?: string
  price?: number
  currencyId?: number
  isGift?: boolean
  currencyCode?: string
}

// Dashboard Stats
export interface DashboardStats {
  totalCustomers: number
  totalBookings: number
  totalRevenue: number
  pendingBookings: number
}

