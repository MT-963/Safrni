# Setup Admin User Script
# This script creates the first admin user in the Safrni system

Write-Host "=== Safrni Admin Setup ===" -ForegroundColor Cyan
Write-Host ""

$apiUrl = "http://localhost:5185/api/auth/setup-admin"

# Get admin details
$name = Read-Host "Enter admin name (e.g., محمد أحمد)"
$email = Read-Host "Enter admin email (e.g., admin@safrni.com)"
$password = Read-Host "Enter admin password" -AsSecureString
$passwordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

# Create the request body
$body = @{
    name = $name
    email = $email
    password = $passwordPlain
} | ConvertTo-Json

Write-Host ""
Write-Host "Creating admin user..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json"
    
    Write-Host ""
    Write-Host "✓ Admin user created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Admin Details:" -ForegroundColor Cyan
    Write-Host "  Name: $($response.name)" -ForegroundColor White
    Write-Host "  Email: $($response.email)" -ForegroundColor White
    Write-Host "  Role: $($response.role)" -ForegroundColor White
    Write-Host "  Seller ID: $($response.sellerId)" -ForegroundColor White
    Write-Host ""
    Write-Host "You can now login with this account at: http://localhost:3000/login" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host ""
    Write-Host "✗ Error creating admin user:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host $responseBody -ForegroundColor Red
    }
}

