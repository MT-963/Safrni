'use client'

import { Sidebar } from '@/components/dashboard/sidebar'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div 
        className="flex h-screen overflow-hidden"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <Sidebar />
        <main 
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        >
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
