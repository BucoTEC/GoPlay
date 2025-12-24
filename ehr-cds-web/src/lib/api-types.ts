/**
 * API Types for EHR CDS API
 */

export interface Medication {
  id: number
  seqn: number
  rxduse: number | null
  rxddrug: string | null
  rxddrgid: string | null
  rxddays: number | null
  rxdrsc1: string | null
  rxdrsd1: string | null
}

export interface PatientListItem {
  id: string
  seqn: number
  gender: "male" | "female" | "other"
  age: number
  blood_pressure_systolic: number | null
  blood_pressure_diastolic: number | null
  bmi: number | null
  hba1c: number | null
  risk_level: "low" | "moderate" | "high"
  status: "active" | "inactive" | "critical"
}

export interface PatientDetail {
  id: string
  seqn: number
  
  // Demographics
  gender: "male" | "female" | "other"
  age: number
  race_ethnicity: string | null
  education: string | null
  marital_status: string | null
  
  // Vital signs
  blood_pressure_systolic: number | null
  blood_pressure_diastolic: number | null
  heart_rate: number | null
  weight: number | null
  height: number | null
  bmi: number | null
  waist_circumference: number | null
  
  // Lab values
  hba1c: number | null
  fasting_glucose: number | null
  total_cholesterol: number | null
  ldl_cholesterol: number | null
  hdl_cholesterol: number | null
  triglycerides: number | null
  creatinine: number | null
  egfr: number | null
  albumin: number | null
  
  // Risk factors
  smoker: boolean
  diabetes_history: boolean
  hypertension_history: boolean
  heart_disease_history: boolean
  kidney_disease_history: boolean
  
  // Diet summary
  daily_calories: number | null
  daily_sodium: number | null
  
  // Medications
  medications: Medication[]
  
  // Computed
  risk_level: "low" | "moderate" | "high"
  status: "active" | "inactive" | "critical"
}

export interface PatientCreate {
  gender: "male" | "female" | "other"
  age: number
  
  blood_pressure_systolic?: number
  blood_pressure_diastolic?: number
  heart_rate?: number
  weight?: number
  height?: number
  
  hba1c?: number
  fasting_glucose?: number
  total_cholesterol?: number
  ldl_cholesterol?: number
  hdl_cholesterol?: number
  triglycerides?: number
  creatinine?: number
  albumin?: number
  
  smoker?: boolean
  diabetes_history?: boolean
  hypertension_history?: boolean
}

export interface PatientUpdate {
  blood_pressure_systolic?: number
  blood_pressure_diastolic?: number
  heart_rate?: number
  weight?: number
  height?: number
  
  hba1c?: number
  fasting_glucose?: number
  total_cholesterol?: number
  ldl_cholesterol?: number
  hdl_cholesterol?: number
  triglycerides?: number
  creatinine?: number
  albumin?: number
  
  smoker?: boolean
  diabetes_history?: boolean
  hypertension_history?: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  pages: number
}

export interface PatientFilters {
  page?: number
  page_size?: number
  gender?: string
  min_age?: number
  max_age?: number
  risk_level?: string
  status?: string
}
