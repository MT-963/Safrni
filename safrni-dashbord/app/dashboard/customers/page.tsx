'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Pencil, Trash2, Mail, Phone, X, Globe } from 'lucide-react'
import { customersApi } from '@/services/api'
import type { Customer, CreateCustomer } from '@/types'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Country } from 'country-state-city'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState<CreateCustomer>({
    fullName: '',
    nationality: '',
    phone: '',
    email: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [countries, setCountries] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    fetchCustomers()
    loadCountries()
  }, [])

  const loadCountries = () => {
    const allCountries = Country.getAllCountries()
    const countryOptions = allCountries.map(country => ({
      value: country.name,
      label: country.name
    }))
    countryOptions.sort((a, b) => a.label.localeCompare(b.label, 'ar'))
    setCountries(countryOptions)
  }

  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(
        (customer) =>
          customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone?.includes(searchTerm)
      )
      setFilteredCustomers(filtered)
    } else {
      setFilteredCustomers(customers)
    }
  }, [searchTerm, customers])

  const fetchCustomers = async () => {
    try {
      const response = await customersApi.getAll()
      setCustomers(response.data)
      setFilteredCustomers(response.data)
    } catch (error) {
      console.error('فشل في جلب العملاء:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName || !formData.nationality) {
      alert('الرجاء ملء جميع الحقول الإجبارية (الاسم، الجنسية)')
      return
    }
    
    setSubmitting(true)
    try {
      await customersApi.create(formData)
      await fetchCustomers()
      setShowAddModal(false)
      resetForm()
      alert('تم إضافة العميل بنجاح!')
    } catch (error) {
      console.error('فشل في إضافة العميل:', error)
      alert('فشل في إضافة العميل')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCustomer || !formData.fullName || !formData.nationality) {
      alert('الرجاء ملء جميع الحقول الإجبارية (الاسم، الجنسية)')
      return
    }
    
    setSubmitting(true)
    try {
      await customersApi.update(editingCustomer.customerId, formData)
      await fetchCustomers()
      setShowEditModal(false)
      setEditingCustomer(null)
      resetForm()
      alert('تم تحديث العميل بنجاح!')
    } catch (error) {
      console.error('فشل في تحديث العميل:', error)
      alert('فشل في تحديث العميل')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      try {
        await customersApi.delete(id)
        fetchCustomers()
      } catch (error) {
        console.error('فشل في حذف العميل:', error)
        alert('فشل في حذف العميل')
      }
    }
  }

  const openAddModal = () => {
    resetForm()
    setShowAddModal(true)
  }

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      fullName: customer.fullName,
      nationality: customer.nationality || '',
      phone: customer.phone || '',
      email: customer.email || ''
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      nationality: '',
      phone: '',
      email: ''
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل العملاء...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة العملاء</h1>
          <p className="text-gray-600 mt-1">إدارة قاعدة بيانات العملاء</p>
        </div>
        <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 ml-2" />
          إضافة عميل
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-700" />
              <Input
                placeholder="ابحث عن عميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-right py-3 px-4 font-medium text-gray-700">الرقم</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">الاسم الكامل</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">البريد الإلكتروني</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">الهاتف</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">الجنسية</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      لا يوجد عملاء
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.customerId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{customer.customerId}</td>
                      <td className="py-3 px-4 font-medium">{customer.fullName}</td>
                      <td className="py-3 px-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-700" />
                          {customer.email || 'غير محدد'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-700" />
                          {customer.phone || 'غير محدد'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{customer.nationality || 'غير محدد'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-start gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditModal(customer)}
                            className="hover:bg-blue-50"
                            title="تعديل"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(customer.customerId)}
                            className="hover:bg-red-50"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div>
              عرض {filteredCustomers.length} من {customers.length} عميل
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">إضافة عميل جديد</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-700 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="أدخل الاسم الكامل"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الهاتف
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+966501234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="inline h-4 w-4 ml-1" />
                  الجنسية <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={countries}
                  value={formData.nationality || ''}
                  onChange={(value) => setFormData({ ...formData, nationality: value })}
                  placeholder="اختر الجنسية..."
                />
                {!formData.nationality && (
                  <p className="text-xs text-red-500 mt-1">الجنسية إجبارية</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={submitting || !formData.fullName || !formData.nationality}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'جاري الإضافة...' : 'إضافة العميل'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  disabled={submitting}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && editingCustomer && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">تعديل العميل</h2>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingCustomer(null)
                }}
                className="text-gray-700 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditCustomer} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="أدخل الاسم الكامل"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الهاتف
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+966501234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="inline h-4 w-4 ml-1" />
                  الجنسية <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={countries}
                  value={formData.nationality || ''}
                  onChange={(value) => setFormData({ ...formData, nationality: value })}
                  placeholder="اختر الجنسية..."
                />
                {!formData.nationality && (
                  <p className="text-xs text-red-500 mt-1">الجنسية إجبارية</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={submitting || !formData.fullName || !formData.nationality}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'جاري التحديث...' : 'تحديث العميل'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingCustomer(null)
                  }}
                  disabled={submitting}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

