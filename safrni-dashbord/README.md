# Safrni Dashboard - Hotel Management Frontend

A modern, responsive admin dashboard built with Next.js 15, TypeScript, and Tailwind CSS for managing hotel bookings, customers, and payments.

## 🚀 Features

- **Dashboard Overview** - View key statistics and metrics
- **Customer Management** - Add, edit, view, and delete customers
- **Hotel Management** - Manage hotel partners with search and filters
- **Booking Management** - Track and manage hotel reservations
- **Payment Tracking** - Monitor all payment transactions
- **Responsive Design** - Works on all devices
- **Modern UI** - Clean and intuitive interface

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Query** - Data fetching and state management
- **Lucide React** - Beautiful icon library

## 📋 Prerequisites

- Node.js 18+ installed
- ASP.NET Core API running on http://localhost:5185

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5185/api
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
safrni-dashbord/
├── app/
│   ├── dashboard/          # Dashboard pages
│   │   ├── layout.tsx      # Dashboard layout with sidebar
│   │   ├── page.tsx        # Dashboard home
│   │   ├── customers/      # Customer pages
│   │   ├── hotels/         # Hotel pages
│   │   ├── bookings/       # Booking pages
│   │   └── payments/       # Payment pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (redirects to dashboard)
│   └── providers.tsx       # React Query provider
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   └── dashboard/
│       └── sidebar.tsx     # Navigation sidebar
├── services/
│   └── api.ts              # API service layer
├── types/
│   └── index.ts            # TypeScript interfaces
├── lib/
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
```

## 🔌 API Integration

The dashboard connects to the ASP.NET Core backend API at `http://localhost:5185/api`.

### Available Endpoints:

- **Customers**: `/api/customers`
- **Hotels**: `/api/hotels`
- **Bookings**: `/api/bookings`
- **Payments**: `/api/payments`
- **Lookup**: `/api/lookup/*`

## 🎨 Features Overview

### Dashboard Home
- Quick statistics cards
- Recent activity
- Quick action links

### Customers Page
- View all customers in a table
- Search by name, email, or phone
- Add new customers
- Edit existing customers
- Delete customers

### Hotels Page
- View all hotels
- Search by name, city, or country
- Star rating display
- CRUD operations

### Bookings Page
- View all bookings
- Search by booking code, customer, or hotel
- Status badges (Confirmed, Pending, Cancelled)
- Date formatting
- CRUD operations

### Payments Page
- View all payment transactions
- Search functionality
- Payment type badges
- Total amount calculation
- Currency formatting

## 🎯 Available Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint
```

## 🔧 Configuration

### Tailwind CSS
Tailwind is configured in `tailwind.config.ts` with custom colors and theme settings.

### TypeScript
TypeScript configuration is in `tsconfig.json` with strict mode enabled.

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5185/api` |

## 🎨 UI Components

The dashboard uses custom UI components built with Tailwind CSS:

- **Button** - Multiple variants (default, outline, ghost, etc.)
- **Card** - Container component with header, content, footer
- **Input** - Styled form input
- **Label** - Form label component

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

Build the project and deploy the `.next` folder:

```bash
npm run build
```

## 🐛 Troubleshooting

### API Connection Issues

1. Ensure the ASP.NET Core API is running on http://localhost:5185
2. Check CORS settings in the backend
3. Verify the `NEXT_PUBLIC_API_URL` environment variable

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [React Query](https://tanstack.com/query/latest)

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

---

**Built with ❤️ using Next.js 15 and TypeScript**
