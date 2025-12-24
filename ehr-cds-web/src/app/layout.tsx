import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { PatientsProvider } from "@/context/patients-context"
import { Toaster } from "sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ClinicalAI - EHR Clinical Decision Support",
  description: "AI-powered clinical decision support platform for patient management and predictive analytics",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <PatientsProvider>
          {children}
          <Toaster position="top-right" richColors />
        </PatientsProvider>
        <Analytics />
      </body>
    </html>
  )
}
