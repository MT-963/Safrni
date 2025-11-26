import axios from 'axios'
import type {
  Customer,
  CreateCustomer,
  Hotel,
  CreateHotel,
  Booking,
  BookingDetail,
  CreateBooking,
  Payment,
  CreatePayment,
  BookingStatus,
  Currency,
  RoomType,
  ViewType,
  MealPlan,
  PaymentMethod,
  Seller,
  Broker,
  Supplier,
  PaymentCategory
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5185/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Customers API
export const customersApi = {
  getAll: () => api.get<Customer[]>('/customers'),
  getById: (id: number) => api.get<Customer>(`/customers/${id}`),
  search: (name: string) => api.get<Customer[]>(`/customers/search/${name}`),
  create: (data: CreateCustomer) => api.post<Customer>('/customers', data),
  update: (id: number, data: CreateCustomer) => api.put(`/customers/${id}`, data),
  delete: (id: number) => api.delete(`/customers/${id}`),
}

// Hotels API
export const hotelsApi = {
  getAll: () => api.get<Hotel[]>('/hotels'),
  getById: (id: number) => api.get<Hotel>(`/hotels/${id}`),
  search: (name: string) => api.get<Hotel[]>(`/hotels/search/${name}`),
  getByCountry: (country: string) => api.get<Hotel[]>(`/hotels/country/${country}`),
  getByCity: (city: string) => api.get<Hotel[]>(`/hotels/city/${city}`),
  create: (data: CreateHotel) => api.post<Hotel>('/hotels', data),
  update: (id: number, data: CreateHotel) => api.put(`/hotels/${id}`, data),
  delete: (id: number) => api.delete(`/hotels/${id}`),
}

// Bookings API
export const bookingsApi = {
  getAll: () => api.get<Booking[]>('/bookings'),
  getById: (id: number) => api.get<BookingDetail>(`/bookings/${id}`),
  getByCustomer: (customerId: number) => api.get<Booking[]>(`/bookings/customer/${customerId}`),
  getByHotel: (hotelId: number) => api.get<Booking[]>(`/bookings/hotel/${hotelId}`),
  getByStatus: (statusId: number) => api.get<Booking[]>(`/bookings/status/${statusId}`),
  create: (data: CreateBooking) => api.post<Booking>('/bookings', data),
  update: (id: number, data: CreateBooking) => api.put(`/bookings/${id}`, data),
  delete: (id: number) => api.delete(`/bookings/${id}`),
}

// Payments API
export const paymentsApi = {
  getAll: () => api.get<Payment[]>('/payments'),
  getById: (id: number) => api.get<Payment>(`/payments/${id}`),
  getByBooking: (bookingId: number) => api.get<Payment[]>(`/payments/booking/${bookingId}`),
  getTotalByBooking: (bookingId: number) => api.get<{ bookingId: number; total: number }>(`/payments/booking/${bookingId}/total`),
  create: (data: CreatePayment) => api.post<Payment>('/payments', data),
  update: (id: number, data: CreatePayment) => api.put(`/payments/${id}`, data),
  delete: (id: number) => api.delete(`/payments/${id}`),
}

// Lookup APIs
export const lookupApi = {
  getBookingStatuses: () => api.get<BookingStatus[]>('/lookup/booking-statuses'),
  getCurrencies: () => api.get<Currency[]>('/lookup/currencies'),
  getRoomTypes: () => api.get<RoomType[]>('/lookup/room-types'),
  getViewTypes: () => api.get<ViewType[]>('/lookup/view-types'),
  getMealPlans: () => api.get<MealPlan[]>('/lookup/meal-plans'),
  getPaymentMethods: () => api.get<PaymentMethod[]>('/lookup/payment-methods'),
  getSellers: () => api.get<Seller[]>('/lookup/sellers'),
  getBrokers: () => api.get<Broker[]>('/lookup/brokers'),
  getSuppliers: () => api.get<Supplier[]>('/lookup/suppliers'),
}

// Dashboard APIs
export const dashboardApi = {
  getTotalCustomers: () => api.get<number>('/dashboard/total-customers'),
  getTotalHotels: () => api.get<number>('/dashboard/total-hotels'),
  getTotalBookings: () => api.get<number>('/dashboard/total-bookings'),
  getTotalPayments: () => api.get<number>('/dashboard/total-payments'),
}

export default api

