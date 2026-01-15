'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Key,
  UserCheck,
  UserX,
  Shield,
  User
} from 'lucide-react'
import { sellersApi, authApi } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'

interface Seller {
  sellerId: number
  name: string
  email: string | null
  role: string
  isActive: number
  createdAt: string
}

export default function SellersManagementPage() {
  const { isAdmin } = useAuth()
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee'
  })
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    fetchSellers()
  }, [])

  const fetchSellers = async () => {
    try {
      const response = await sellersApi.getAll()
      setSellers(response.data)
    } catch (error) {
      console.error('Error fetching sellers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSeller = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await authApi.register(formData)
      await fetchSellers()
      setShowAddModal(false)
      setFormData({ name: '', email: '', password: '', role: 'Employee' })
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل إضافة المستخدم')
    }
  }

  const handleUpdateSeller = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSeller) return

    try {
      await sellersApi.update(selectedSeller.sellerId, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        isActive: selectedSeller.isActive
      })
      await fetchSellers()
      setShowEditModal(false)
      setSelectedSeller(null)
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل تحديث المستخدم')
    }
  }

  const handleToggleActive = async (seller: Seller) => {
    try {
      await sellersApi.update(seller.sellerId, {
        name: seller.name,
        email: seller.email || undefined,
        role: seller.role,
        isActive: seller.isActive === 1 ? 0 : 1
      })
      await fetchSellers()
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل تحديث حالة المستخدم')
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSeller) return

    try {
      await authApi.resetPassword(selectedSeller.sellerId, newPassword)
      setShowResetPasswordModal(false)
      setSelectedSeller(null)
      setNewPassword('')
      alert('تم إعادة تعيين كلمة السر بنجاح')
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل إعادة تعيين كلمة السر')
    }
  }

  const openEditModal = (seller: Seller) => {
    setSelectedSeller(seller)
    setFormData({
      name: seller.name,
      email: seller.email || '',
      password: '',
      role: seller.role
    })
    setShowEditModal(true)
  }

  const openResetPasswordModal = (seller: Seller) => {
    setSelectedSeller(seller)
    setNewPassword('')
    setShowResetPasswordModal(true)
  }

  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900">إدارة المستخدمين (Sellers)</h1>
          <p className="text-gray-600 mt-1">إدارة المستخدمين الذين يمكنهم الوصول إلى النظام</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 ml-2" />
          إضافة مستخدم جديد
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 h-5 w-5" />
            <Input
              type="text"
              placeholder="البحث عن مستخدم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sellers Table */}
      <Card>
        <CardHeader>
          <CardTitle>المستخدمين ({filteredSellers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3">الاسم</th>
                  <th className="text-right p-3">البريد الإلكتروني</th>
                  <th className="text-right p-3">الدور</th>
                  <th className="text-right p-3">الحالة</th>
                  <th className="text-right p-3">تاريخ الإنشاء</th>
                  <th className="text-right p-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredSellers.map((seller) => (
                  <tr key={seller.sellerId} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {seller.role === 'Admin' ? (
                          <Shield className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <User className="h-4 w-4 text-blue-500" />
                        )}
                        <span className="font-medium">{seller.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">
                      {seller.email || <span className="text-gray-700">غير محدد</span>}
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        seller.role === 'Admin' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {seller.role === 'Admin' ? 'أدمن' : 'موظف'}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleActive(seller)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          seller.isActive === 1
                            ? 'bg-green-100 text-green-800 hover:bg-green-600'
                            : 'bg-red-100 text-red-800 hover:bg-red-600'
                        }`}
                      >
                        {seller.isActive === 1 ? (
                          <>
                            <UserCheck className="h-3 w-3" />
                            نشط
                          </>
                        ) : (
                          <>
                            <UserX className="h-3 w-3" />
                            غير نشط
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-3 text-gray-600">
                      {new Date(seller.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openEditModal(seller)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => openResetPasswordModal(seller)}
                          variant="outline"
                          size="sm"
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <Key className="h-4 w-4" />
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
            <CardHeader>
              <CardTitle>إضافة مستخدم جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSeller} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الاسم</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">كلمة السر</label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الدور</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Employee">موظف</option>
                    <option value="Admin">أدمن</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">إضافة</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
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

      {/* Edit Modal */}
      {showEditModal && selectedSeller && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>تعديل مستخدم</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateSeller} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الاسم</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الدور</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Employee">موظف</option>
                    <option value="Admin">أدمن</option>
                  </select>
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

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedSeller && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>إعادة تعيين كلمة السر</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    إعادة تعيين كلمة السر للمستخدم: <strong>{selectedSeller.name}</strong>
                  </p>
                  <label className="block text-sm font-medium mb-2">كلمة السر الجديدة</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
                    إعادة تعيين
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowResetPasswordModal(false)}
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


