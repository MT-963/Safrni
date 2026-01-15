'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Edit, Trash2, Building2, Shield, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { suppliersApi } from '@/services/api'
import type { Supplier } from '@/types'

export default function SuppliersManagementPage() {
  const { isAdmin } = useAuth()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    contactEmail: '',
    phone: '',
    country: '',
    city: ''
  })

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const response = await suppliersApi.getAll()
      setSuppliers(response.data)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await suppliersApi.create(formData)
      await fetchSuppliers()
      setShowAddModal(false)
      setFormData({ name: '', contactEmail: '', phone: '', country: '', city: '' })
      alert('تم إضافة المورد بنجاح!')
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل إضافة المورد')
    }
  }

  const handleUpdateSupplier = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSupplier) return

    try {
      await suppliersApi.update(selectedSupplier.supplierId, formData)
      await fetchSuppliers()
      setShowEditModal(false)
      setSelectedSupplier(null)
      alert('تم تحديث المورد بنجاح!')
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل تحديث المورد')
    }
  }

  const handleDeleteSupplier = async (supplierId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المورد؟')) return

    try {
      await suppliersApi.delete(supplierId)
      await fetchSuppliers()
      alert('تم حذف المورد بنجاح!')
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل حذف المورد')
    }
  }

  const openEditModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setFormData({
      name: supplier.name,
      contactEmail: supplier.contactEmail || '',
      phone: supplier.phone || '',
      country: supplier.country || '',
      city: supplier.city || ''
    })
    setShowEditModal(true)
  }

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.country?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح</h2>
          <p className="text-gray-600">هذه الصفحة متاحة للأدمن فقط</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="flex justify-center items-center h-96">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الموردين (Suppliers)</h1>
          <p className="text-gray-600 mt-1">إدارة موردي الخدمات والمنتجات</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 ml-2" />
          إضافة مورد جديد
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 h-5 w-5" />
            <Input
              type="text"
              placeholder="البحث عن مورد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الموردين</p>
                <p className="text-3xl font-bold text-gray-900">{suppliers.length}</p>
              </div>
              <Building2 className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-600">الموردين ({filteredSuppliers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3 text-gray-600">الاسم</th>
                  <th className="text-right p-3 text-gray-600">البريد الإلكتروني</th>
                  <th className="text-right p-3 text-gray-600">الهاتف</th>
                  <th className="text-right p-3 text-gray-600">الدولة</th>
                  <th className="text-right p-3 text-gray-600">المدينة</th>
                  <th className="text-right p-3 text-gray-600">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.supplierId} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-gray-600">{supplier.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">
                      {supplier.contactEmail || <span className="text-gray-700">غير محدد</span>}
                    </td>
                    <td className="p-3 text-gray-600">
                      {supplier.phone || <span className="text-gray-700">غير محدد</span>}
                    </td>
                    <td className="p-3 text-gray-600">
                      {supplier.country || <span className="text-gray-700">غير محدد</span>}
                    </td>
                    <td className="p-3 text-gray-600">
                      {supplier.city || <span className="text-gray-700">غير محدد</span>}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openEditModal(supplier)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteSupplier(supplier.supplierId)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-gray-600">إضافة مورد جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSupplier} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">اسم المورد *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">الهاتف *</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="text-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">الدولة</label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">المدينة</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="text-gray-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">إضافة</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 text-gray-500"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedSupplier && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-gray-600">تعديل مورد</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateSupplier} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-500">اسم المورد *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-500">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-500">الهاتف *</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="text-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-500">الدولة</label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-500">المدينة</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="text-gray-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">حفظ</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

