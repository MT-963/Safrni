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

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

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

// Sellers API
export const sellersApi = {
  getAll: () => api.get<Seller[]>('/sellers'),
  getById: (id: number) => api.get<Seller>(`/sellers/${id}`),
  create: (data: { name: string; email: string; role?: string; isActive?: number }) => api.post<Seller>('/sellers', data),
  update: (id: number, data: { name: string; email?: string; role?: string; isActive?: number }) => api.put(`/sellers/${id}`, data),
  delete: (id: number) => api.delete(`/sellers/${id}`),
}

// Brokers API
export const brokersApi = {
  getAll: () => api.get<Broker[]>('/brokers'),
  getById: (id: number) => api.get<Broker>(`/brokers/${id}`),
  create: (data: { name: string; contactEmail?: string; phone?: string; country?: string; city?: string }) => api.post<Broker>('/brokers', data),
  update: (id: number, data: { name: string; contactEmail?: string; phone?: string; country?: string; city?: string }) => api.put(`/brokers/${id}`, data),
  delete: (id: number) => api.delete(`/brokers/${id}`),
}

// Suppliers API
export const suppliersApi = {
  getAll: () => api.get<Supplier[]>('/suppliers'),
  getById: (id: number) => api.get<Supplier>(`/suppliers/${id}`),
  create: (data: { name: string; contactEmail?: string; phone?: string; country?: string; city?: string }) => api.post<Supplier>('/suppliers', data),
  update: (id: number, data: { name: string; contactEmail?: string; phone?: string; country?: string; city?: string }) => api.put(`/suppliers/${id}`, data),
  delete: (id: number) => api.delete(`/suppliers/${id}`),
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

// Statistics APIs (Admin only)
export const statisticsApi = {
  getOverview: () => api.get('/statistics/overview'),
  getSellersPerformance: () => api.get('/statistics/sellers-performance'),
  getBrokersPerformance: () => api.get('/statistics/brokers-performance'),
  getSuppliersPerformance: () => api.get('/statistics/suppliers-performance'),
  getCustomersStatistics: () => api.get('/statistics/customers-statistics'),
  getHotelsStatistics: () => api.get('/statistics/hotels-statistics'),
}

// Payment Categories API (Admin only)
export const paymentCategoriesApi = {
  getAll: () => api.get<PaymentCategory[]>('/paymentcategories'),
  getById: (id: number) => api.get<PaymentCategory>(`/paymentcategories/${id}`),
  create: (data: { name: string }) => api.post<PaymentCategory>('/paymentcategories', data),
  update: (id: number, data: { name: string }) => api.put(`/paymentcategories/${id}`, data),
  delete: (id: number) => api.delete(`/paymentcategories/${id}`),
}

// Auth APIs
export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string; role?: string }) => api.post('/auth/register', data),
  changePassword: (oldPassword: string, newPassword: string) => api.post('/auth/change-password', { oldPassword, newPassword }),
  getProfile: () => api.get('/auth/profile'),
  setupAdmin: (data: { name: string; email: string; password: string }) => api.post('/auth/setup-admin', data),
  resetPassword: (sellerId: number, newPassword: string) => api.post(`/auth/reset-password/${sellerId}`, { newPassword }),
}

// Set auth token in headers
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export default api

