'use client'

import { AuthProvider } from '@/features/auth/contexts/auth-context'

export function RootProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
