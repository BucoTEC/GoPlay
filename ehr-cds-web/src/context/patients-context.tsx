"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import {
  getPatients,
  getPatient as fetchPatient,
  createPatient,
  updatePatient as apiUpdatePatient,
  deletePatient as apiDeletePatient,
  transformPatientListItemToLegacy,
  transformPatientDetailToLegacy,
} from "@/lib/api"
import type { PatientFilters } from "@/lib/api-types"

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

interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  pages: number
}

interface PatientsContextType {
  patients: Patient[]
  loading: boolean
  error: string | null
  pagination: PaginationInfo
  filters: PatientFilters
  setFilters: (filters: PatientFilters) => void
  refreshPatients: () => Promise<void>
  addPatient: (patient: Omit<Patient, "id">) => Promise<void>
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>
  deletePatient: (id: string) => Promise<void>
  getPatient: (id: string) => Patient | undefined
  fetchPatientDetail: (id: string) => Promise<Patient | null>
}

const PatientsContext = createContext<PatientsContextType | undefined>(undefined)

export function PatientsProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    pageSize: 20,
    pages: 0,
  })
  const [filters, setFilters] = useState<PatientFilters>({
    page: 1,
    page_size: 20,
  })

  const refreshPatients = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getPatients(filters)
      const transformedPatients = response.items.map(transformPatientListItemToLegacy)
      setPatients(transformedPatients)
      setPagination({
        total: response.total,
        page: response.page,
        pageSize: response.page_size,
        pages: response.pages,
      })
    } catch (err) {
      console.error("Failed to fetch patients:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch patients")
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    refreshPatients()
  }, [refreshPatients])

  const addPatient = async (patient: Omit<Patient, "id">) => {
    try {
      const newPatient = await createPatient({
        gender: patient.gender,
        age: new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear(),
        blood_pressure_systolic: patient.bloodPressureSystolic || undefined,
        blood_pressure_diastolic: patient.bloodPressureDiastolic || undefined,
        heart_rate: patient.heartRate || undefined,
        weight: patient.weight || undefined,
        height: patient.height || undefined,
        hba1c: patient.hba1c || undefined,
        fasting_glucose: patient.fastingGlucose || undefined,
        total_cholesterol: patient.totalCholesterol || undefined,
        ldl_cholesterol: patient.ldlCholesterol || undefined,
        hdl_cholesterol: patient.hdlCholesterol || undefined,
        triglycerides: patient.triglycerides || undefined,
        creatinine: patient.creatinine || undefined,
        albumin: patient.albumin || undefined,
        smoker: patient.smoker,
        diabetes_history: patient.diabetesHistory,
        hypertension_history: patient.hypertensionHistory,
      })

      // Refresh the list to include the new patient
      await refreshPatients()
    } catch (err) {
      console.error("Failed to create patient:", err)
      throw err
    }
  }

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      await apiUpdatePatient(id, {
        blood_pressure_systolic: updates.bloodPressureSystolic,
        blood_pressure_diastolic: updates.bloodPressureDiastolic,
        heart_rate: updates.heartRate,
        weight: updates.weight,
        height: updates.height,
        hba1c: updates.hba1c,
        fasting_glucose: updates.fastingGlucose,
        total_cholesterol: updates.totalCholesterol,
        ldl_cholesterol: updates.ldlCholesterol,
        hdl_cholesterol: updates.hdlCholesterol,
        triglycerides: updates.triglycerides,
        creatinine: updates.creatinine,
        albumin: updates.albumin,
        smoker: updates.smoker,
        diabetes_history: updates.diabetesHistory,
        hypertension_history: updates.hypertensionHistory,
      })

      // Refresh the list
      await refreshPatients()
    } catch (err) {
      console.error("Failed to update patient:", err)
      throw err
    }
  }

  const deletePatient = async (id: string) => {
    try {
      await apiDeletePatient(id)
      // Refresh the list
      await refreshPatients()
    } catch (err) {
      console.error("Failed to delete patient:", err)
      throw err
    }
  }

  const getPatient = (id: string) => {
    return patients.find((p) => p.id === id)
  }

  const fetchPatientDetail = async (id: string): Promise<Patient | null> => {
    try {
      const patientDetail = await fetchPatient(id)
      return transformPatientDetailToLegacy(patientDetail)
    } catch (err) {
      console.error("Failed to fetch patient detail:", err)
      return null
    }
  }

  return (
    <PatientsContext.Provider
      value={{
        patients,
        loading,
        error,
        pagination,
        filters,
        setFilters,
        refreshPatients,
        addPatient,
        updatePatient,
        deletePatient,
        getPatient,
        fetchPatientDetail,
      }}
    >
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
