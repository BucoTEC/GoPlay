"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Patient {
  id: string
  mrn: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  email: string
  phone: string
  address: string
  // Clinical data
  bloodPressureSystolic: number
  bloodPressureDiastolic: number
  heartRate: number
  weight: number // kg
  height: number // cm
  bmi: number
  // Lab values
  hba1c: number
  fastingGlucose: number
  totalCholesterol: number
  ldlCholesterol: number
  hdlCholesterol: number
  triglycerides: number
  creatinine: number
  egfr: number
  albumin: number
  // Risk factors
  smoker: boolean
  diabetesHistory: boolean
  hypertensionHistory: boolean
  familyHistoryCardiac: boolean
  // Metadata
  lastVisit: string
  status: "active" | "inactive" | "critical"
  riskLevel: "low" | "moderate" | "high"
}

interface PatientsContextType {
  patients: Patient[]
  addPatient: (patient: Omit<Patient, "id">) => void
  updatePatient: (id: string, patient: Partial<Patient>) => void
  deletePatient: (id: string) => void
  getPatient: (id: string) => Patient | undefined
}

const PatientsContext = createContext<PatientsContextType | undefined>(undefined)

// Mock data with realistic NHANES-style values
const initialPatients: Patient[] = [
  {
    id: "1",
    mrn: "MRN-001234",
    firstName: "John",
    lastName: "Mitchell",
    dateOfBirth: "1958-03-15",
    gender: "male",
    email: "john.mitchell@email.com",
    phone: "(555) 123-4567",
    address: "123 Oak Street, Boston, MA 02101",
    bloodPressureSystolic: 142,
    bloodPressureDiastolic: 88,
    heartRate: 78,
    weight: 98,
    height: 178,
    bmi: 30.9,
    hba1c: 6.8,
    fastingGlucose: 126,
    totalCholesterol: 245,
    ldlCholesterol: 158,
    hdlCholesterol: 38,
    triglycerides: 198,
    creatinine: 1.4,
    egfr: 58,
    albumin: 45,
    smoker: false,
    diabetesHistory: true,
    hypertensionHistory: true,
    familyHistoryCardiac: true,
    lastVisit: "2024-01-10",
    status: "active",
    riskLevel: "high",
  },
  {
    id: "2",
    mrn: "MRN-001235",
    firstName: "Sarah",
    lastName: "Johnson",
    dateOfBirth: "1975-07-22",
    gender: "female",
    email: "sarah.johnson@email.com",
    phone: "(555) 234-5678",
    address: "456 Maple Ave, Cambridge, MA 02139",
    bloodPressureSystolic: 118,
    bloodPressureDiastolic: 72,
    heartRate: 68,
    weight: 62,
    height: 165,
    bmi: 22.8,
    hba1c: 5.4,
    fastingGlucose: 92,
    totalCholesterol: 185,
    ldlCholesterol: 98,
    hdlCholesterol: 62,
    triglycerides: 110,
    creatinine: 0.8,
    egfr: 95,
    albumin: 12,
    smoker: false,
    diabetesHistory: false,
    hypertensionHistory: false,
    familyHistoryCardiac: false,
    lastVisit: "2024-01-08",
    status: "active",
    riskLevel: "low",
  },
  {
    id: "3",
    mrn: "MRN-001236",
    firstName: "Michael",
    lastName: "Chen",
    dateOfBirth: "1962-11-08",
    gender: "male",
    email: "m.chen@email.com",
    phone: "(555) 345-6789",
    address: "789 Pine Road, Somerville, MA 02143",
    bloodPressureSystolic: 156,
    bloodPressureDiastolic: 94,
    heartRate: 82,
    weight: 105,
    height: 172,
    bmi: 35.5,
    hba1c: 7.9,
    fastingGlucose: 168,
    totalCholesterol: 268,
    ldlCholesterol: 172,
    hdlCholesterol: 34,
    triglycerides: 285,
    creatinine: 1.8,
    egfr: 42,
    albumin: 120,
    smoker: true,
    diabetesHistory: true,
    hypertensionHistory: true,
    familyHistoryCardiac: true,
    lastVisit: "2024-01-12",
    status: "critical",
    riskLevel: "high",
  },
  {
    id: "4",
    mrn: "MRN-001237",
    firstName: "Emily",
    lastName: "Rodriguez",
    dateOfBirth: "1988-04-30",
    gender: "female",
    email: "emily.r@email.com",
    phone: "(555) 456-7890",
    address: "321 Elm Street, Brookline, MA 02445",
    bloodPressureSystolic: 124,
    bloodPressureDiastolic: 78,
    heartRate: 72,
    weight: 71,
    height: 168,
    bmi: 25.2,
    hba1c: 5.9,
    fastingGlucose: 108,
    totalCholesterol: 198,
    ldlCholesterol: 118,
    hdlCholesterol: 52,
    triglycerides: 145,
    creatinine: 0.9,
    egfr: 88,
    albumin: 18,
    smoker: false,
    diabetesHistory: false,
    hypertensionHistory: false,
    familyHistoryCardiac: true,
    lastVisit: "2024-01-05",
    status: "active",
    riskLevel: "moderate",
  },
  {
    id: "5",
    mrn: "MRN-001238",
    firstName: "Robert",
    lastName: "Williams",
    dateOfBirth: "1950-09-12",
    gender: "male",
    email: "rwilliams@email.com",
    phone: "(555) 567-8901",
    address: "654 Cedar Lane, Newton, MA 02458",
    bloodPressureSystolic: 148,
    bloodPressureDiastolic: 92,
    heartRate: 76,
    weight: 88,
    height: 175,
    bmi: 28.7,
    hba1c: 6.4,
    fastingGlucose: 118,
    totalCholesterol: 225,
    ldlCholesterol: 142,
    hdlCholesterol: 42,
    triglycerides: 178,
    creatinine: 1.6,
    egfr: 48,
    albumin: 85,
    smoker: false,
    diabetesHistory: true,
    hypertensionHistory: true,
    familyHistoryCardiac: true,
    lastVisit: "2024-01-11",
    status: "active",
    riskLevel: "high",
  },
  {
    id: "6",
    mrn: "MRN-001239",
    firstName: "Lisa",
    lastName: "Thompson",
    dateOfBirth: "1982-01-25",
    gender: "female",
    email: "lisa.t@email.com",
    phone: "(555) 678-9012",
    address: "987 Birch Ave, Quincy, MA 02169",
    bloodPressureSystolic: 112,
    bloodPressureDiastolic: 68,
    heartRate: 64,
    weight: 58,
    height: 162,
    bmi: 22.1,
    hba1c: 5.2,
    fastingGlucose: 88,
    totalCholesterol: 172,
    ldlCholesterol: 88,
    hdlCholesterol: 68,
    triglycerides: 85,
    creatinine: 0.7,
    egfr: 102,
    albumin: 8,
    smoker: false,
    diabetesHistory: false,
    hypertensionHistory: false,
    familyHistoryCardiac: false,
    lastVisit: "2024-01-09",
    status: "active",
    riskLevel: "low",
  },
]

export function PatientsProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients)

  const addPatient = (patient: Omit<Patient, "id">) => {
    const newPatient = {
      ...patient,
      id: Math.random().toString(36).substr(2, 9),
    }
    setPatients((prev) => [...prev, newPatient])
  }

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const deletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id))
  }

  const getPatient = (id: string) => {
    return patients.find((p) => p.id === id)
  }

  return (
    <PatientsContext.Provider value={{ patients, addPatient, updatePatient, deletePatient, getPatient }}>
      {children}
    </PatientsContext.Provider>
  )
}

export function usePatients() {
  const context = useContext(PatientsContext)
  if (!context) {
    throw new Error("usePatients must be used within a PatientsProvider")
  }
  return context
}
