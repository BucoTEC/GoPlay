import type React from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface AppShellProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto bg-background p-6">{children}</main>
      </div>
    </div>
  )
}
