from pydantic import BaseModel, Field, computed_field
from typing import Optional
from datetime import date


# ============ Medication Schemas ============

class MedicationBase(BaseModel):
    rxduse: Optional[int] = None
    rxddrug: Optional[str] = None
    rxddrgid: Optional[str] = None
    rxddays: Optional[int] = None
    rxdrsc1: Optional[str] = None
    rxdrsd1: Optional[str] = None


class MedicationResponse(MedicationBase):
    id: int
    seqn: int
    
    class Config:
        from_attributes = True


# ============ Examination Schemas ============

class ExaminationBase(BaseModel):
    bpxsy1: Optional[int] = None
    bpxdi1: Optional[int] = None
    bpxsy2: Optional[int] = None
    bpxdi2: Optional[int] = None
    bpxsy3: Optional[int] = None
    bpxdi3: Optional[int] = None
    bpxpls: Optional[int] = None
    bmxwt: Optional[float] = None
    bmxht: Optional[float] = None
    bmxbmi: Optional[float] = None
    bmxwaist: Optional[float] = None


class ExaminationResponse(ExaminationBase):
    seqn: int
    
    class Config:
        from_attributes = True


# ============ Labs Schemas ============

class LabsBase(BaseModel):
    urxuma: Optional[float] = None
    lbxscr: Optional[float] = None
    lbxsgl: Optional[float] = None
    lbxgh: Optional[float] = None
    lbxtc: Optional[float] = None
    lbdldl: Optional[float] = None
    lbdhdd: Optional[float] = None
    lbxtr: Optional[float] = None
    lbxwbcsi: Optional[float] = None
    lbxhgb: Optional[float] = None
    lbxhct: Optional[float] = None


class LabsResponse(LabsBase):
    seqn: int
    lbxin: Optional[float] = None
    lbxglt: Optional[float] = None
    lbxsal: Optional[float] = None
    lbxsbu: Optional[float] = None
    
    class Config:
        from_attributes = True


# ============ Diet Schemas ============

class DietBase(BaseModel):
    dr1tkcal: Optional[float] = None
    dr1tprot: Optional[float] = None
    dr1tcarb: Optional[float] = None
    dr1ttfat: Optional[float] = None
    dr1tsfat: Optional[float] = None
    dr1tsodi: Optional[float] = None
    dr1tfibe: Optional[float] = None
    dr1tsugr: Optional[float] = None


class DietResponse(DietBase):
    seqn: int
    
    class Config:
        from_attributes = True


# ============ Questionnaire Schemas ============

class QuestionnaireBase(BaseModel):
    bpq020: Optional[int] = None
    diq010: Optional[int] = None
    smq020: Optional[int] = None
    smq040: Optional[int] = None
    alq101: Optional[int] = None
    mcq160b: Optional[int] = None
    mcq160c: Optional[int] = None
    mcq160e: Optional[int] = None
    mcq160f: Optional[int] = None
    kiq022: Optional[int] = None


class QuestionnaireResponse(QuestionnaireBase):
    seqn: int
    
    class Config:
        from_attributes = True


# ============ Patient Schemas (Aggregated) ============

class PatientListItem(BaseModel):
    """Simplified patient for list view."""
    id: str
    seqn: int
    gender: str
    age: int
    blood_pressure_systolic: Optional[int] = None
    blood_pressure_diastolic: Optional[int] = None
    bmi: Optional[float] = None
    hba1c: Optional[float] = None
    risk_level: str = "low"
    status: str = "active"
    
    class Config:
        from_attributes = True


class PatientDetail(BaseModel):
    """Full patient details with all related data."""
    id: str
    seqn: int
    
    # Demographics
    gender: str
    age: int
    race_ethnicity: Optional[str] = None
    education: Optional[str] = None
    marital_status: Optional[str] = None
    
    # Vital signs
    blood_pressure_systolic: Optional[int] = None
    blood_pressure_diastolic: Optional[int] = None
    heart_rate: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    bmi: Optional[float] = None
    waist_circumference: Optional[float] = None
    
    # Lab values
    hba1c: Optional[float] = None
    fasting_glucose: Optional[float] = None
    total_cholesterol: Optional[float] = None
    ldl_cholesterol: Optional[float] = None
    hdl_cholesterol: Optional[float] = None
    triglycerides: Optional[float] = None
    creatinine: Optional[float] = None
    egfr: Optional[float] = None
    albumin: Optional[float] = None
    
    # Risk factors
    smoker: bool = False
    diabetes_history: bool = False
    hypertension_history: bool = False
    heart_disease_history: bool = False
    kidney_disease_history: bool = False
    
    # Diet summary
    daily_calories: Optional[float] = None
    daily_sodium: Optional[float] = None
    
    # Medications
    medications: list[MedicationResponse] = []
    
    # Computed
    risk_level: str = "low"
    status: str = "active"
    
    class Config:
        from_attributes = True


class PatientCreate(BaseModel):
    """Schema for creating a new patient."""
    gender: str = Field(..., pattern="^(male|female|other)$")
    age: int = Field(..., ge=0, le=120)
    
    # Vital signs
    blood_pressure_systolic: Optional[int] = Field(None, ge=60, le=250)
    blood_pressure_diastolic: Optional[int] = Field(None, ge=30, le=150)
    heart_rate: Optional[int] = Field(None, ge=30, le=220)
    weight: Optional[float] = Field(None, ge=1, le=500)
    height: Optional[float] = Field(None, ge=30, le=280)
    
    # Lab values
    hba1c: Optional[float] = Field(None, ge=3, le=20)
    fasting_glucose: Optional[float] = Field(None, ge=20, le=600)
    total_cholesterol: Optional[float] = Field(None, ge=50, le=500)
    ldl_cholesterol: Optional[float] = Field(None, ge=20, le=400)
    hdl_cholesterol: Optional[float] = Field(None, ge=10, le=150)
    triglycerides: Optional[float] = Field(None, ge=20, le=2000)
    creatinine: Optional[float] = Field(None, ge=0.1, le=20)
    albumin: Optional[float] = Field(None, ge=0.1, le=10)
    
    # Risk factors
    smoker: bool = False
    diabetes_history: bool = False
    hypertension_history: bool = False


class PatientUpdate(BaseModel):
    """Schema for updating a patient."""
    blood_pressure_systolic: Optional[int] = Field(None, ge=60, le=250)
    blood_pressure_diastolic: Optional[int] = Field(None, ge=30, le=150)
    heart_rate: Optional[int] = Field(None, ge=30, le=220)
    weight: Optional[float] = Field(None, ge=1, le=500)
    height: Optional[float] = Field(None, ge=30, le=280)
    
    hba1c: Optional[float] = Field(None, ge=3, le=20)
    fasting_glucose: Optional[float] = Field(None, ge=20, le=600)
    total_cholesterol: Optional[float] = Field(None, ge=50, le=500)
    ldl_cholesterol: Optional[float] = Field(None, ge=20, le=400)
    hdl_cholesterol: Optional[float] = Field(None, ge=10, le=150)
    triglycerides: Optional[float] = Field(None, ge=20, le=2000)
    creatinine: Optional[float] = Field(None, ge=0.1, le=20)
    albumin: Optional[float] = Field(None, ge=0.1, le=10)
    
    smoker: Optional[bool] = None
    diabetes_history: Optional[bool] = None
    hypertension_history: Optional[bool] = None


# ============ Pagination Schemas ============

class PaginatedResponse(BaseModel):
    """Generic paginated response."""
    items: list
    total: int
    page: int
    page_size: int
    pages: int
