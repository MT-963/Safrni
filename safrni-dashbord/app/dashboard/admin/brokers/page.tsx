'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Edit, Trash2, Building2, Shield, X } from 'lucide-react'
import { brokersApi } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import type { Broker } from '@/types'

export default function BrokersManagementPage() {
  const { isAdmin } = useAuth()
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    contactEmail: '',
    phone: '',
    country: '',
    city: ''
  })

  useEffect(() => {
    fetchBrokers()
  }, [])

  const fetchBrokers = async () => {
    try {
      const response = await brokersApi.getAll()
      setBrokers(response.data)
    } catch (error) {
      console.error('Error fetching brokers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBroker = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await brokersApi.create(formData)
      await fetchBrokers()
      setShowAddModal(false)
      setFormData({ name: '', contactEmail: '', phone: '', country: '', city: '' })
      alert('تم إضافة الوسيط بنجاح!')
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل إضافة الوسيط')
    }
  }

  const handleUpdateBroker = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBroker) return

    try {
      await brokersApi.update(selectedBroker.brokerId, formData)
      await fetchBrokers()
      setShowEditModal(false)
      setSelectedBroker(null)
      alert('تم تحديث الوسيط بنجاح!')
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل تحديث الوسيط')
    }
  }

  const handleDeleteBroker = async (brokerId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الوسيط؟')) return

    try {
      await brokersApi.delete(brokerId)
      await fetchBrokers()
      alert('تم حذف الوسيط بنجاح!')
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل حذف الوسيط')
    }
  }

  const openEditModal = (broker: Broker) => {
    setSelectedBroker(broker)
    setFormData({
      name: broker.name,
      contactEmail: broker.contactEmail || '',
      phone: broker.phone || '',
      country: broker.country || '',
      city: broker.city || ''
    })
    setShowEditModal(true)
  }

  const filteredBrokers = brokers.filter(broker =>
    broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    broker.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    broker.country?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900">إدارة الوسطاء (Brokers)</h1>
          <p className="text-gray-600 mt-1">إدارة الوسطاء الذين يقومون بحجز الفنادق</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 ml-2" />
          إضافة وسيط جديد
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 h-5 w-5" />
            <Input
              type="text"
              placeholder="البحث عن وسيط..."
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
                <p className="text-sm text-gray-600">إجمالي الوسطاء</p>
                <p className="text-3xl font-bold text-gray-900">{brokers.length}</p>
              </div>
              <Building2 className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brokers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-600">الوسطاء ({filteredBrokers.length})</CardTitle>
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
                {filteredBrokers.map((broker) => (
                  <tr key={broker.brokerId} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-gray-600">{broker.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">
                      {broker.contactEmail || <span className="text-gray-400">غير محدد</span>}
                    </td>
                    <td className="p-3 text-gray-600">
                      {broker.phone || <span className="text-gray-400">غير محدد</span>}
                    </td>
                    <td className="p-3 text-gray-600">
                      {broker.country || <span className="text-gray-400">غير محدد</span>}
                    </td>
                    <td className="p-3 text-gray-600">
                      {broker.city || <span className="text-gray-400">غير محدد</span>}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openEditModal(broker)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteBroker(broker.brokerId)}
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-600">إضافة وسيط جديد</CardTitle>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-700 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBroker} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">اسم الوسيط *</label>
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
                  <label className="block text-sm font-medium mb-2 text-gray-600">الهاتف</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="text-gray-500"
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
      {showEditModal && selectedBroker && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-600">تعديل وسيط</CardTitle>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-700 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateBroker} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-500">اسم الوسيط *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="text-gray-500"
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
                  <label className="block text-sm font-medium mb-2 text-gray-500">الهاتف</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="text-gray-500"
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

