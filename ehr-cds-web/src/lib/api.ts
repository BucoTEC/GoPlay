/**
 * API Client for EHR CDS Backend
 */

import type {
  PatientListItem,
  PatientDetail,
  PatientCreate,
  PatientUpdate,
  PaginatedResponse,
  PatientFilters,
  Medication,
} from "./api-types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    let errorData: unknown
    try {
      errorData = await response.json()
    } catch {
      errorData = await response.text()
    }

    throw new ApiError(
      response.status,
      `API Error: ${response.statusText}`,
      errorData
    )
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

// ============ Patients API ============

export async function getPatients(
  filters: PatientFilters = {}
): Promise<PaginatedResponse<PatientListItem>> {
  const params = new URLSearchParams()

  if (filters.page) params.set("page", String(filters.page))
  if (filters.page_size) params.set("page_size", String(filters.page_size))
  if (filters.gender) params.set("gender", filters.gender)
  if (filters.min_age) params.set("min_age", String(filters.min_age))
  if (filters.max_age) params.set("max_age", String(filters.max_age))
  if (filters.risk_level) params.set("risk_level", filters.risk_level)
  if (filters.status) params.set("status", filters.status)

  const query = params.toString()
  const endpoint = query ? `/patients?${query}` : "/patients"

  return fetchApi<PaginatedResponse<PatientListItem>>(endpoint)
}

export async function getPatient(id: string): Promise<PatientDetail> {
  return fetchApi<PatientDetail>(`/patients/${id}`)
}

export async function createPatient(
  data: PatientCreate
): Promise<PatientDetail> {
  return fetchApi<PatientDetail>("/patients", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updatePatient(
  id: string,
  data: PatientUpdate
): Promise<PatientDetail> {
  return fetchApi<PatientDetail>(`/patients/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deletePatient(id: string): Promise<void> {
  return fetchApi<void>(`/patients/${id}`, {
    method: "DELETE",
  })
}

export async function getPatientMedications(
  id: string
): Promise<Medication[]> {
  return fetchApi<Medication[]>(`/patients/${id}/medications`)
}

// ============ Health Check ============

export async function healthCheck(): Promise<{ status: string }> {
  return fetchApi<{ status: string }>("/health")
}

// ============ Transform Functions ============

/**
 * Transform API PatientDetail to the format expected by existing components
 */
export function transformPatientDetailToLegacy(patient: PatientDetail) {
  return {
    id: patient.id,
    mrn: `MRN-${patient.seqn}`,
    firstName: `Patient`,
    lastName: `#${patient.seqn}`,
    dateOfBirth: calculateDateOfBirth(patient.age),
    gender: patient.gender,
    email: `patient${patient.seqn}@example.com`,
    phone: "(555) 000-0000",
    address: "Address not available",
    
    bloodPressureSystolic: patient.blood_pressure_systolic ?? 0,
    bloodPressureDiastolic: patient.blood_pressure_diastolic ?? 0,
    heartRate: patient.heart_rate ?? 0,
    weight: patient.weight ?? 0,
    height: patient.height ?? 0,
    bmi: patient.bmi ?? 0,
    
    hba1c: patient.hba1c ?? 0,
    fastingGlucose: patient.fasting_glucose ?? 0,
    totalCholesterol: patient.total_cholesterol ?? 0,
    ldlCholesterol: patient.ldl_cholesterol ?? 0,
    hdlCholesterol: patient.hdl_cholesterol ?? 0,
    triglycerides: patient.triglycerides ?? 0,
    creatinine: patient.creatinine ?? 0,
    egfr: patient.egfr ?? 0,
    albumin: patient.albumin ?? 0,
    
    smoker: patient.smoker,
    diabetesHistory: patient.diabetes_history,
    hypertensionHistory: patient.hypertension_history,
    familyHistoryCardiac: patient.heart_disease_history,
    
    lastVisit: new Date().toISOString().split("T")[0],
    status: patient.status,
    riskLevel: patient.risk_level,
  }
}

/**
 * Transform API PatientListItem to the format expected by existing components
 */
export function transformPatientListItemToLegacy(patient: PatientListItem) {
  return {
    id: patient.id,
    mrn: `MRN-${patient.seqn}`,
    firstName: `Patient`,
    lastName: `#${patient.seqn}`,
    dateOfBirth: calculateDateOfBirth(patient.age),
    gender: patient.gender,
    email: `patient${patient.seqn}@example.com`,
    phone: "(555) 000-0000",
    address: "Address not available",
    
    bloodPressureSystolic: patient.blood_pressure_systolic ?? 0,
    bloodPressureDiastolic: patient.blood_pressure_diastolic ?? 0,
    heartRate: 0,
    weight: 0,
    height: 0,
    bmi: patient.bmi ?? 0,
    
    hba1c: patient.hba1c ?? 0,
    fastingGlucose: 0,
    totalCholesterol: 0,
    ldlCholesterol: 0,
    hdlCholesterol: 0,
    triglycerides: 0,
    creatinine: 0,
    egfr: 0,
    albumin: 0,
    
    smoker: false,
    diabetesHistory: false,
    hypertensionHistory: false,
    familyHistoryCardiac: false,
    
    lastVisit: new Date().toISOString().split("T")[0],
    status: patient.status,
    riskLevel: patient.risk_level,
  }
}

function calculateDateOfBirth(age: number): string {
  const today = new Date()
  const birthYear = today.getFullYear() - age
  return `${birthYear}-01-01`
}

export { ApiError }
