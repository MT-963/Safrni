# Safrni API Test Script
# اختبار شامل لجميع نقاط API

$baseUrl = "http://localhost:5185/api"
$testResults = @()

Write-Host "🧪 بدء اختبار API..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Description,
        [object]$Body = $null
    )
    
    $url = "$baseUrl$Endpoint"
    Write-Host "`n📍 اختبار: $Description" -ForegroundColor Yellow
    Write-Host "   $Method $url" -ForegroundColor Gray
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        $params = @{
            Uri = $url
            Method = $Method
            Headers = $headers
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "   ✅ نجح" -ForegroundColor Green
        
        $testResults += @{
            Endpoint = $Endpoint
            Method = $Method
            Status = "✅ نجح"
            Description = $Description
        }
        
        return $response
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   ❌ فشل - Status Code: $statusCode" -ForegroundColor Red
        Write-Host "   خطأ: $($_.Exception.Message)" -ForegroundColor Red
        
        $testResults += @{
            Endpoint = $Endpoint
            Method = $Method
            Status = "❌ فشل ($statusCode)"
            Description = $Description
        }
        
        return $null
    }
}

Write-Host "`n🔍 اختبار Lookup Endpoints" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta

Test-Endpoint -Method "GET" -Endpoint "/lookup/booking-statuses" -Description "الحصول على حالات الحجز"
Test-Endpoint -Method "GET" -Endpoint "/lookup/currencies" -Description "الحصول على العملات"
Test-Endpoint -Method "GET" -Endpoint "/lookup/room-types" -Description "الحصول على أنواع الغرف"
Test-Endpoint -Method "GET" -Endpoint "/lookup/view-types" -Description "الحصول على أنواع الإطلالة"
Test-Endpoint -Method "GET" -Endpoint "/lookup/meal-plans" -Description "الحصول على خطط الوجبات"
Test-Endpoint -Method "GET" -Endpoint "/lookup/payment-methods" -Description "الحصول على طرق الدفع"
Test-Endpoint -Method "GET" -Endpoint "/lookup/sellers" -Description "الحصول على الموظفين"
Test-Endpoint -Method "GET" -Endpoint "/lookup/brokers" -Description "الحصول على الوسطاء"
Test-Endpoint -Method "GET" -Endpoint "/lookup/suppliers" -Description "الحصول على الموردين"

Write-Host "`n👥 اختبار Customer Endpoints" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta

$customers = Test-Endpoint -Method "GET" -Endpoint "/customers" -Description "الحصول على جميع العملاء"
if ($customers -and $customers.Count -gt 0) {
    $customerId = $customers[0].customerId
    Test-Endpoint -Method "GET" -Endpoint "/customers/$customerId" -Description "الحصول على عميل محدد"
}

Write-Host "`n🏨 اختبار Hotel Endpoints" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta

$hotels = Test-Endpoint -Method "GET" -Endpoint "/hotels" -Description "الحصول على جميع الفنادق"
if ($hotels -and $hotels.Count -gt 0) {
    $hotelId = $hotels[0].hotelId
    Test-Endpoint -Method "GET" -Endpoint "/hotels/$hotelId" -Description "الحصول على فندق محدد"
    
    $country = $hotels[0].country
    if ($country) {
        Test-Endpoint -Method "GET" -Endpoint "/hotels/country/$country" -Description "الحصول على فنادق حسب الدولة"
    }
}

Write-Host "`n📅 اختبار Booking Endpoints" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta

$bookings = Test-Endpoint -Method "GET" -Endpoint "/bookings" -Description "الحصول على جميع الحجوزات"
if ($bookings -and $bookings.Count -gt 0) {
    $bookingId = $bookings[0].bookingId
    Test-Endpoint -Method "GET" -Endpoint "/bookings/$bookingId" -Description "الحصول على حجز محدد"
    
    if ($bookings[0].customerId) {
        Test-Endpoint -Method "GET" -Endpoint "/bookings/customer/$($bookings[0].customerId)" -Description "الحصول على حجوزات عميل"
    }
    
    if ($bookings[0].hotelId) {
        Test-Endpoint -Method "GET" -Endpoint "/bookings/hotel/$($bookings[0].hotelId)" -Description "الحصول على حجوزات فندق"
    }
    
    if ($bookings[0].statusId) {
        Test-Endpoint -Method "GET" -Endpoint "/bookings/status/$($bookings[0].statusId)" -Description "الحصول على حجوزات حسب الحالة"
    }
}

Write-Host "`n💰 اختبار Payment Endpoints" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta

$payments = Test-Endpoint -Method "GET" -Endpoint "/payments" -Description "الحصول على جميع المدفوعات"
if ($payments -and $payments.Count -gt 0) {
    $paymentId = $payments[0].paymentId
    Test-Endpoint -Method "GET" -Endpoint "/payments/$paymentId" -Description "الحصول على دفعة محددة"
    
    if ($payments[0].bookingId) {
        Test-Endpoint -Method "GET" -Endpoint "/payments/booking/$($payments[0].bookingId)" -Description "الحصول على دفعات حجز"
        Test-Endpoint -Method "GET" -Endpoint "/payments/booking/$($payments[0].bookingId)/total" -Description "الحصول على مجموع دفعات حجز"
    }
}

Write-Host "`n🏪 اختبار Seller Endpoints" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta

$sellers = Test-Endpoint -Method "GET" -Endpoint "/sellers" -Description "الحصول على جميع الموظفين"
if ($sellers -and $sellers.Count -gt 0) {
    $sellerId = $sellers[0].sellerId
    Test-Endpoint -Method "GET" -Endpoint "/sellers/$sellerId" -Description "الحصول على موظف محدد"
}

Write-Host "`n🤝 اختبار Broker Endpoints" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta

$brokers = Test-Endpoint -Method "GET" -Endpoint "/brokers" -Description "الحصول على جميع الوسطاء"
if ($brokers -and $brokers.Count -gt 0) {
    $brokerId = $brokers[0].brokerId
    Test-Endpoint -Method "GET" -Endpoint "/brokers/$brokerId" -Description "الحصول على وسيط محدد"
}

Write-Host "`n💳 اختبار Payment Category Endpoints" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta

Test-Endpoint -Method "GET" -Endpoint "/payment-categories" -Description "الحصول على جميع فئات الدفع"

Write-Host "`n📊 ملخص النتائج" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

$total = $testResults.Count
$success = ($testResults | Where-Object { $_.Status -like "*نجح*" }).Count
$failed = $total - $success
$successRate = [math]::Round(($success / $total) * 100, 2)

Write-Host "`n📈 الإحصائيات:" -ForegroundColor White
Write-Host "   إجمالي الاختبارات: $total" -ForegroundColor White
Write-Host "   نجح: $success" -ForegroundColor Green
Write-Host "   فشل: $failed" -ForegroundColor Red
Write-Host "   نسبة النجاح: $successRate%" -ForegroundColor $(if ($successRate -ge 90) { "Green" } elseif ($successRate -ge 70) { "Yellow" } else { "Red" })

Write-Host "`n📋 النتائج التفصيلية:" -ForegroundColor White
$testResults | Format-Table -Property Method, Endpoint, Status, Description -AutoSize

if ($failed -gt 0) {
    Write-Host "`n⚠️ يوجد $failed اختبار فاشل. يرجى مراجعة التفاصيل أعلاه." -ForegroundColor Yellow
} else {
    Write-Host "`n✅ جميع الاختبارات نجحت!" -ForegroundColor Green
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "تم الانتهاء من الاختبار" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

