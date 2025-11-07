"use client"

import type { ReactNode } from "react"

interface AuthCardProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export default function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-bold font-poppins">{title}</h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
