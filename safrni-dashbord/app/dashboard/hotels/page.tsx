'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Pencil, Trash2, Star, Filter, MapPin, Globe, X } from 'lucide-react'
import { hotelsApi } from '@/services/api'
import type { Hotel, CreateHotel } from '@/types'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Country, City, State } from 'country-state-city'

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'country' | 'city' | 'rating'>('all')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [formData, setFormData] = useState<CreateHotel>({
    name: '',
    country: '',
    city: '',
    starRating: 3
  })
  const [submitting, setSubmitting] = useState(false)

  // Countries and cities data
  const [countries, setCountries] = useState<{ value: string; label: string; isoCode: string }[]>([])
  const [cities, setCities] = useState<{ value: string; label: string }[]>([])
  const [filterCities, setFilterCities] = useState<{ value: string; label: string }[]>([])
  const [selectedCountryCode, setSelectedCountryCode] = useState('')
  const [filterCountryCode, setFilterCountryCode] = useState('')

  useEffect(() => {
    fetchHotels()
    loadCountries()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, hotels, filterType, selectedCountry, selectedCity, selectedRating])

  // Load countries with ISO codes
  const loadCountries = () => {
    const allCountries = Country.getAllCountries()
    const countryOptions = allCountries.map(country => ({
      value: country.name,
      label: country.name,
      isoCode: country.isoCode
    }))
    setCountries(countryOptions)
  }

  // Load cities when country is selected (for form)
  useEffect(() => {
    if (selectedCountryCode) {
      const allCities: { value: string; label: string }[] = []
      const states = State.getStatesOfCountry(selectedCountryCode)
      
      if (states && states.length > 0) {
        states.forEach(state => {
          const citiesInState = City.getCitiesOfState(selectedCountryCode, state.isoCode)
          if (citiesInState && citiesInState.length > 0) {
            citiesInState.forEach(city => {
              if (!allCities.find(c => c.value === city.name)) {
                allCities.push({
                  value: city.name,
                  label: city.name
                })
              }
            })
          }
        })
      }
      
      const directCities = City.getCitiesOfCountry(selectedCountryCode)
      if (directCities && directCities.length > 0) {
        directCities.forEach(city => {
          if (!allCities.find(c => c.value === city.name)) {
            allCities.push({
              value: city.name,
              label: city.name
            })
          }
        })
      }
      
      if (allCities.length > 0) {
        allCities.sort((a, b) => a.label.localeCompare(b.label, 'ar'))
        setCities(allCities)
      } else {
        setCities([])
      }
    } else {
      setCities([])
      setFormData(prev => ({ ...prev, city: '' }))
    }
  }, [selectedCountryCode])

  // Load cities when filter country is selected
  useEffect(() => {
    if (filterCountryCode) {
      const allCities: { value: string; label: string }[] = []
      const states = State.getStatesOfCountry(filterCountryCode)
      
      if (states && states.length > 0) {
        states.forEach(state => {
          const citiesInState = City.getCitiesOfState(filterCountryCode, state.isoCode)
          if (citiesInState && citiesInState.length > 0) {
            citiesInState.forEach(city => {
              if (!allCities.find(c => c.value === city.name)) {
                allCities.push({
                  value: city.name,
                  label: city.name
                })
              }
            })
          }
        })
      }
      
      const directCities = City.getCitiesOfCountry(filterCountryCode)
      if (directCities && directCities.length > 0) {
        directCities.forEach(city => {
          if (!allCities.find(c => c.value === city.name)) {
            allCities.push({
              value: city.name,
              label: city.name
            })
          }
        })
      }
      
      if (allCities.length > 0) {
        allCities.sort((a, b) => a.label.localeCompare(b.label, 'ar'))
        setFilterCities(allCities)
      } else {
        setFilterCities([])
      }
    } else {
      setFilterCities([])
      setSelectedCity('')
    }
  }, [filterCountryCode])

  const fetchHotels = async () => {
    try {
      const response = await hotelsApi.getAll()
      setHotels(response.data)
      setFilteredHotels(response.data)
    } catch (error) {
      console.error('فشل في جلب الفنادق:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = async () => {
    let results = hotels

    // Apply search
    if (searchTerm) {
      results = results.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.country?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply specific filters
    if (filterType === 'country' && selectedCountry) {
      results = results.filter(h => h.country === selectedCountry)
    } else if (filterType === 'city' && selectedCity) {
      results = results.filter(h => h.city === selectedCity)
    } else if (filterType === 'rating' && selectedRating !== null) {
      results = results.filter(h => h.starRating === selectedRating)
    }

    setFilteredHotels(results)
  }

  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name || !formData.country || !formData.city) {
      alert('الرجاء ملء جميع الحقول الإجبارية (الاسم، الدولة، المدينة)')
      return
    }
    
    setSubmitting(true)
    try {
      await hotelsApi.create(formData)
      await fetchHotels()
      setShowAddModal(false)
      resetForm()
      alert('تم إضافة الفندق بنجاح!')
    } catch (error) {
      console.error('فشل في إضافة الفندق:', error)
      alert('فشل في إضافة الفندق')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditHotel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingHotel) return
    
    // Validate required fields
    if (!formData.name || !formData.country || !formData.city) {
      alert('الرجاء ملء جميع الحقول الإجبارية (الاسم، الدولة، المدينة)')
      return
    }
    
    setSubmitting(true)
    try {
      await hotelsApi.update(editingHotel.hotelId, formData)
      await fetchHotels()
      setShowEditModal(false)
      setEditingHotel(null)
      resetForm()
      alert('تم تحديث الفندق بنجاح!')
    } catch (error) {
      console.error('فشل في تحديث الفندق:', error)
      alert('فشل في تحديث الفندق')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الفندق؟ سيتم حذف جميع الحجوزات المرتبطة به.')) {
      try {
        await hotelsApi.delete(id)
        await fetchHotels()
        alert('تم حذف الفندق بنجاح!')
      } catch (error) {
        console.error('فشل في حذف الفندق:', error)
        alert('فشل في حذف الفندق. قد يكون مرتبطاً بحجوزات موجودة.')
      }
    }
  }

  const openAddModal = () => {
    resetForm()
    setShowAddModal(true)
  }

  const openEditModal = (hotel: Hotel) => {
    setEditingHotel(hotel)
    setFormData({
      name: hotel.name,
      country: hotel.country || '',
      city: hotel.city || '',
      starRating: hotel.starRating || 3
    })
    
    // Set country code for loading cities
    const country = countries.find(c => c.value === hotel.country)
    if (country) {
      setSelectedCountryCode(country.isoCode)
    }
    
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      country: '',
      city: '',
      starRating: 3
    })
    setCities([])
    setSelectedCountryCode('')
  }

  const handleCountryChange = (countryName: string) => {
    const country = countries.find(c => c.value === countryName)
    setFormData({ ...formData, country: countryName, city: '' })
    setSelectedCountryCode(country?.isoCode || '')
  }

  const handleFilterCountryChange = (countryName: string) => {
    const country = countries.find(c => c.value === countryName)
    setSelectedCountry(countryName)
    setFilterCountryCode(country?.isoCode || '')
    setFilterType(countryName ? 'country' : 'all')
    
    if (countryName) {
      handleFilterByCountry(countryName)
    } else {
      setFilteredHotels(hotels)
    }
  }

  const renderStars = (rating: number | undefined) => {
    if (!rating) return 'غير مصنف'
    return (
      <div className="flex items-center gap-1">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-700 text-yellow-700" />
        ))}
      </div>
    )
  }

  const handleSearchByName = async () => {
    if (!searchTerm) {
      fetchHotels()
      return
    }
    try {
      setLoading(true)
      const response = await hotelsApi.search(searchTerm)
      setFilteredHotels(response.data)
    } catch (error) {
      console.error('فشل في البحث:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterByCountry = async (country: string) => {
    if (country) {
      try {
        setLoading(true)
        const response = await hotelsApi.getByCountry(country)
        setFilteredHotels(response.data)
      } catch (error) {
        console.error('فشل في التصفية حسب الدولة:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleFilterByCity = async (city: string) => {
    setSelectedCity(city)
    setFilterType(city ? 'city' : 'all')
    
    if (city) {
      try {
        setLoading(true)
        const response = await hotelsApi.getByCity(city)
        setFilteredHotels(response.data)
      } catch (error) {
        console.error('فشل في التصفية حسب المدينة:', error)
      } finally {
        setLoading(false)
      }
    } else if (selectedCountry) {
      handleFilterByCountry(selectedCountry)
    } else {
      setFilteredHotels(hotels)
    }
  }

  const resetFilters = () => {
    setSearchTerm('')
    setFilterType('all')
    setSelectedCountry('')
    setSelectedCity('')
    setSelectedRating(null)
    setFilterCities([])
    setFilterCountryCode('')
    setFilteredHotels(hotels)
  }

  const getStatsByRating = () => {
    const stats = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: hotels.filter(h => h.starRating === rating).length
    }))
    return stats
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الفنادق...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الفنادق</h1>
          <p className="text-gray-600 mt-1">إدارة شركاء الفنادق والبحث المتقدم</p>
        </div>
        <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 ml-2" />
          إضافة فندق
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {getStatsByRating().map(({ rating, count }) => (
          <Card
            key={rating}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRating === rating ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => {
              if (selectedRating === rating) {
                setSelectedRating(null)
                setFilterType('all')
              } else {
                setSelectedRating(rating)
                setFilterType('rating')
              }
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">فنادق {rating} نجوم</p>
                  <p className="text-2xl font-bold mt-1">{count}</p>
                </div>
                <div className="flex">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-700 text-yellow-700" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Advanced Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            البحث والتصفية المتقدمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search by name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البحث بالاسم
              </label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-700" />
                <Input
                  placeholder="ابحث عن فندق..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchByName()}
                  className="pr-10"
                />
              </div>
            </div>

            {/* Filter by country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline h-4 w-4 ml-1" />
                التصفية حسب الدولة
              </label>
              <SearchableSelect
                options={countries}
                value={selectedCountry}
                onChange={handleFilterCountryChange}
                placeholder="اختر الدولة..."
              />
            </div>

            {/* Filter by city */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 ml-1" />
                التصفية حسب المدينة
              </label>
              <SearchableSelect
                options={filterCities}
                value={selectedCity}
                onChange={handleFilterByCity}
                placeholder={selectedCountry ? "اختر المدينة..." : "اختر الدولة أولاً"}
                isDisabled={!selectedCountry}
              />
            </div>

            {/* Reset button */}
            <div className="flex items-end">
              <Button variant="outline" onClick={resetFilters} className="w-full">
                إعادة تعيين الفلاتر
              </Button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <span>الفلتر النشط:</span>
            {filterType === 'all' && <span className="font-medium">الكل</span>}
            {filterType === 'country' && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                الدولة: {selectedCountry}
              </span>
            )}
            {filterType === 'city' && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                المدينة: {selectedCity}
              </span>
            )}
            {filterType === 'rating' && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                التصنيف: {selectedRating} نجوم
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hotels Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة الفنادق</CardTitle>
            <span className="text-sm text-gray-600">
              عرض {filteredHotels.length} من {hotels.length} فندق
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-right py-3 px-4 font-medium text-gray-700">الرقم</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">اسم الفندق</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">المدينة</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">الدولة</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">التصنيف</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredHotels.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      لا توجد فنادق
                    </td>
                  </tr>
                ) : (
                  filteredHotels.map((hotel) => (
                    <tr key={hotel.hotelId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{hotel.hotelId}</td>
                      <td className="py-3 px-4 font-medium">{hotel.name}</td>
                      <td className="py-3 px-4 text-gray-600">{hotel.city || 'غير محدد'}</td>
                      <td className="py-3 px-4 text-gray-600">{hotel.country || 'غير محدد'}</td>
                      <td className="py-3 px-4">{renderStars(hotel.starRating)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-start gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditModal(hotel)}
                            className="hover:bg-blue-50"
                            title="تعديل"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(hotel.hotelId)}
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
        </CardContent>
      </Card>

      {/* Add Hotel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">إضافة فندق جديد</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-700 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddHotel} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الفندق <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="أدخل اسم الفندق"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="inline h-4 w-4 ml-1" />
                  الدولة <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={countries}
                  value={formData.country || ''}
                  onChange={handleCountryChange}
                  placeholder="اختر الدولة..."
                />
                {!formData.country && (
                  <p className="text-xs text-red-500 mt-1">الدولة إجبارية</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 ml-1" />
                  المدينة <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={cities}
                  value={formData.city || ''}
                  onChange={(value) => setFormData({ ...formData, city: value })}
                  placeholder={formData.country ? "اختر المدينة..." : "اختر الدولة أولاً"}
                  isDisabled={!formData.country}
                />
                {cities.length === 0 && formData.country && (
                  <p className="text-xs text-amber-600 mt-1">لا توجد مدن متاحة لهذه الدولة</p>
                )}
                {!formData.city && formData.country && (
                  <p className="text-xs text-red-500 mt-1">المدينة إجبارية</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التصنيف (عدد النجوم)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, starRating: rating })}
                      className={`flex items-center gap-1 px-3 py-2 rounded border transition-colors ${
                        formData.starRating === rating
                          ? 'bg-yellow-50 border-yellow-700 text-yellow-700'
                          : 'bg-white border-gray-700 text-gray-600 hover:border-yellow-700'
                      }`}
                    >
                      {rating}
                      <Star className={`h-4 w-4 ${formData.starRating === rating ? 'fill-yellow-700 text-yellow-700' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={submitting || !formData.name || !formData.country || !formData.city}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'جاري الإضافة...' : 'إضافة الفندق'}
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

      {/* Edit Hotel Modal */}
      {showEditModal && editingHotel && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">تعديل الفندق</h2>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingHotel(null)
                }}
                className="text-gray-700 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditHotel} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الفندق <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="أدخل اسم الفندق"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="inline h-4 w-4 ml-1" />
                  الدولة <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={countries}
                  value={formData.country || ''}
                  onChange={handleCountryChange}
                  placeholder="اختر الدولة..."
                />
                {!formData.country && (
                  <p className="text-xs text-red-500 mt-1">الدولة إجبارية</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 ml-1" />
                  المدينة <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={cities}
                  value={formData.city || ''}
                  onChange={(value) => setFormData({ ...formData, city: value })}
                  placeholder={formData.country ? "اختر المدينة..." : "اختر الدولة أولاً"}
                  isDisabled={!formData.country}
                />
                {cities.length === 0 && formData.country && (
                  <p className="text-xs text-amber-600 mt-1">لا توجد مدن متاحة لهذه الدولة</p>
                )}
                {!formData.city && formData.country && (
                  <p className="text-xs text-red-500 mt-1">المدينة إجبارية</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التصنيف (عدد النجوم)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, starRating: rating })}
                      className={`flex items-center gap-1 px-3 py-2 rounded border transition-colors ${
                        formData.starRating === rating
                          ? 'bg-yellow-50 border-yellow-700 text-yellow-700'
                          : 'bg-white border-gray-700 text-gray-600 hover:border-yellow-700'
                      }`}
                    >
                      {rating}
                      <Star className={`h-4 w-4 ${formData.starRating === rating ? 'fill-yellow-700 text-yellow-700' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={submitting || !formData.name || !formData.country || !formData.city}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'جاري التحديث...' : 'تحديث الفندق'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingHotel(null)
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

