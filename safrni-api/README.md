# Safrni - Hotel Booking Management API

A complete ASP.NET Core Web API backend for hotel booking management system using Entity Framework Core with MySQL database.

## 🚀 Features

- **Clean Architecture** - Separation of concerns with Repository Pattern and Service Layer
- **Database-First Approach** - Entity models generated from existing MySQL database
- **RESTful API** - Complete CRUD operations for all entities
- **AutoMapper** - Automatic object-to-object mapping
- **Swagger/OpenAPI** - Interactive API documentation
- **CORS Enabled** - Ready for frontend integration
- **Entity Framework Core** - Using Pomelo MySQL provider

## 📋 Prerequisites

- .NET 8.0 SDK
- MySQL Server 8.0+
- MySQL database named `safrni`

## 🗄️ Database Schema

The API manages the following entities:

- **Customers** - Client information
- **Vendors** - Vendor/Agent details
- **Suppliers** - Hotel suppliers
- **Hotels** - Hotel information
- **Bookings** - Booking records
- **BookingRooms** - Room details for bookings
- **Payments** - Payment transactions
- **Commissions** - Commission records
- **Extras** - Additional services
- **BookingStatus** - Booking status types
- **Currencies** - Currency information
- **RoomTypes** - Room type definitions
- **ViewTypes** - View type options
- **MealPlans** - Meal plan options
- **PaymentMethods** - Payment method types

## ⚙️ Configuration

Update the connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;database=safrni;user=root;password=yourpassword;TreatTinyAsBoolean=false;"
  }
}
```

## 🏗️ Project Structure

```
safrni/
├── Controllers/           # API Controllers
│   ├── CustomersController.cs
│   ├── BookingsController.cs
│   ├── HotelsController.cs
│   ├── PaymentsController.cs
│   └── LookupController.cs
├── Data/                 # Database Context
│   └── SafrniDbContext.cs
├── DTOs/                 # Data Transfer Objects
│   ├── CustomerDto.cs
│   ├── BookingDto.cs
│   ├── HotelDto.cs
│   ├── PaymentDto.cs
│   ├── VendorDto.cs
│   ├── SupplierDto.cs
│   └── CommonDto.cs
├── Interfaces/           # Service & Repository Interfaces
│   ├── IGenericRepository.cs
│   ├── ICustomerRepository.cs
│   ├── IBookingRepository.cs
│   ├── IHotelRepository.cs
│   ├── IPaymentRepository.cs
│   ├── ICustomerService.cs
│   ├── IBookingService.cs
│   ├── IHotelService.cs
│   └── IPaymentService.cs
├── Mapping/              # AutoMapper Profiles
│   └── MappingProfile.cs
├── Models/               # Entity Models (Generated from DB)
│   ├── Booking.cs
│   ├── Customer.cs
│   ├── Hotel.cs
│   ├── Payment.cs
│   └── ... (all entities)
├── Repositories/         # Repository Implementations
│   ├── GenericRepository.cs
│   ├── CustomerRepository.cs
│   ├── BookingRepository.cs
│   ├── HotelRepository.cs
│   └── PaymentRepository.cs
├── Services/             # Business Logic Services
│   ├── CustomerService.cs
│   ├── BookingService.cs
│   ├── HotelService.cs
│   └── PaymentService.cs
└── Program.cs           # Application Entry Point
```

## 🚀 Getting Started

### 1. Clone and Navigate

```bash
cd safrni
```

### 2. Restore Dependencies

```bash
dotnet restore
```

### 3. Update Database Connection

Edit `appsettings.json` with your MySQL credentials.

### 4. Build the Project

```bash
dotnet build
```

### 5. Run the Application

```bash
dotnet run
```

The API will be available at:
- **HTTP**: `http://localhost:5000`
- **HTTPS**: `https://localhost:5001`
- **Swagger UI**: `http://localhost:5000` or `https://localhost:5001`

## 📚 API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `GET /api/customers/{id}/with-bookings` - Get customer with bookings
- `GET /api/customers/search/{name}` - Search customers by name
- `GET /api/customers/by-email/{email}` - Get customer by email
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/{id}` - Get booking by ID with full details
- `GET /api/bookings/customer/{customerId}` - Get bookings by customer
- `GET /api/bookings/hotel/{hotelId}` - Get bookings by hotel
- `GET /api/bookings/status/{statusId}` - Get bookings by status
- `GET /api/bookings/date-range?startDate=...&endDate=...` - Get bookings by date range
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Delete booking

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/{id}` - Get hotel by ID
- `GET /api/hotels/search/{name}` - Search hotels by name
- `GET /api/hotels/country/{country}` - Get hotels by country
- `GET /api/hotels/city/{city}` - Get hotels by city
- `GET /api/hotels/star-rating/{starRating}` - Get hotels by star rating
- `POST /api/hotels` - Create new hotel
- `PUT /api/hotels/{id}` - Update hotel
- `DELETE /api/hotels/{id}` - Delete hotel

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/{id}` - Get payment by ID
- `GET /api/payments/booking/{bookingId}` - Get payments by booking
- `GET /api/payments/booking/{bookingId}/total` - Get total payments for booking
- `GET /api/payments/date-range?startDate=...&endDate=...` - Get payments by date range
- `POST /api/payments` - Create new payment
- `PUT /api/payments/{id}` - Update payment
- `DELETE /api/payments/{id}` - Delete payment

### Lookup Data
- `GET /api/lookup/booking-statuses` - Get all booking statuses
- `GET /api/lookup/currencies` - Get all currencies
- `GET /api/lookup/room-types` - Get all room types
- `GET /api/lookup/view-types` - Get all view types
- `GET /api/lookup/meal-plans` - Get all meal plans
- `GET /api/lookup/payment-methods` - Get all payment methods
- `GET /api/lookup/vendors` - Get all vendors
- `GET /api/lookup/suppliers` - Get all suppliers

## 🧪 Testing with Swagger

1. Run the application
2. Open your browser and navigate to the root URL
3. Use the Swagger UI to test all endpoints interactively
4. Click "Try it out" on any endpoint to test it

## 📦 NuGet Packages

- **Pomelo.EntityFrameworkCore.MySql** (9.0.0) - MySQL provider for EF Core
- **Microsoft.EntityFrameworkCore.Tools** (9.0.10) - EF Core tools for scaffolding
- **Microsoft.EntityFrameworkCore.Design** (9.0.10) - Design-time support for EF Core
- **AutoMapper.Extensions.Microsoft.DependencyInjection** (12.0.1) - Object mapping
- **Swashbuckle.AspNetCore** (6.6.2) - Swagger/OpenAPI support

## 🔄 Regenerating Entities from Database

If your database schema changes, regenerate the entities:

```bash
dotnet ef dbcontext scaffold "server=localhost;database=safrni;user=root;password=root;TreatTinyAsBoolean=false;" Pomelo.EntityFrameworkCore.MySql -o Models -c SafrniDbContext --context-dir Data --force
```

## 🏛️ Architecture Patterns

### Repository Pattern
- Generic repository for common CRUD operations
- Specific repositories for complex queries
- Async operations throughout

### Service Layer
- Business logic separated from controllers
- DTO mapping using AutoMapper
- Clean separation of concerns

### Dependency Injection
- All services and repositories registered in Program.cs
- Scoped lifetime for database contexts
- Easy to test and maintain

## 🔐 CORS Configuration

CORS is configured to allow all origins, methods, and headers. For production, update the CORS policy in `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("Production", policy =>
    {
        policy.WithOrigins("https://yourdomain.com")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

## 📝 Example Requests

### Create a Customer
```http
POST /api/customers
Content-Type: application/json

{
  "fullName": "John Doe",
  "nationality": "USA",
  "peopleCount": 2,
  "phone": "+1234567890",
  "email": "john@example.com"
}
```

### Create a Booking
```http
POST /api/bookings
Content-Type: application/json

{
  "customerId": 1,
  "hotelId": 5,
  "vendorId": 2,
  "supplierId": 3,
  "bookingCode": "BK2024001",
  "checkIn": "2024-12-01",
  "checkOut": "2024-12-05",
  "statusId": 1,
  "notes": "Special request for ocean view",
  "createdBy": "admin"
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Safrni Team**

## 🙏 Acknowledgments

- Built with ASP.NET Core 8.0
- Uses Entity Framework Core with Pomelo MySQL Provider
- Follows Clean Architecture principles
- RESTful API design best practices

