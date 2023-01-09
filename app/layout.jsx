"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './globals.css'

export default function RootLayout({ children }) {
  const queryClient = new QueryClient()
  return (
    <html lang="en">
      <head />
      <QueryClientProvider client={queryClient}>
        <body>{children}</body>
      </QueryClientProvider>
    </html>
  )
}
