from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import Optional
import math

from database import get_db
from models import Demographic, Examination, Labs, Diet, Questionnaire, Medication
from schemas import (
    PatientListItem, PatientDetail, PatientCreate, PatientUpdate,
    MedicationResponse, PaginatedResponse
)

router = APIRouter(prefix="/patients", tags=["patients"])


# ============ Helper Functions ============

def decode_gender(code: Optional[int]) -> str:
    """Convert NHANES gender code to string."""
    if code == 1:
        return "male"
    elif code == 2:
        return "female"
    return "other"


def decode_race_ethnicity(code: Optional[int]) -> Optional[str]:
    """Convert NHANES race/ethnicity code to string."""
    mapping = {
        1: "Mexican American",
        2: "Other Hispanic",
        3: "Non-Hispanic White",
        4: "Non-Hispanic Black",
        5: "Other Race",
        6: "Non-Hispanic Asian",
        7: "Other Race - Including Multi-Racial",
    }
    return mapping.get(code)


def decode_education(code: Optional[int]) -> Optional[str]:
    """Convert NHANES education code to string."""
    mapping = {
        1: "Less than 9th grade",
        2: "9-11th grade",
        3: "High school graduate/GED",
        4: "Some college or AA degree",
        5: "College graduate or above",
    }
    return mapping.get(code)


def decode_marital_status(code: Optional[int]) -> Optional[str]:
    """Convert NHANES marital status code to string."""
    mapping = {
        1: "Married",
        2: "Widowed",
        3: "Divorced",
        4: "Separated",
        5: "Never married",
        6: "Living with partner",
    }
    return mapping.get(code)


def calculate_egfr(creatinine: Optional[float], age: int, gender: str) -> Optional[float]:
    """Calculate eGFR using CKD-EPI equation (simplified)."""
    if creatinine is None or creatinine <= 0:
        return None
    
    # Simplified CKD-EPI formula
    if gender == "female":
        if creatinine <= 0.7:
            egfr = 144 * (creatinine / 0.7) ** -0.329 * 0.993 ** age
        else:
            egfr = 144 * (creatinine / 0.7) ** -1.209 * 0.993 ** age
    else:
        if creatinine <= 0.9:
            egfr = 141 * (creatinine / 0.9) ** -0.411 * 0.993 ** age
        else:
            egfr = 141 * (creatinine / 0.9) ** -1.209 * 0.993 ** age
    
    return round(egfr, 1)


def calculate_risk_level(
    hba1c: Optional[float],
    systolic_bp: Optional[int],
    egfr: Optional[float],
    diabetes: bool,
    hypertension: bool
) -> str:
    """Calculate patient risk level based on clinical markers."""
    risk_score = 0
    
    # HbA1c risk
    if hba1c is not None:
        if hba1c >= 9.0:
            risk_score += 3
        elif hba1c >= 7.0:
            risk_score += 2
        elif hba1c >= 6.5:
            risk_score += 1
    
    # Blood pressure risk
    if systolic_bp is not None:
        if systolic_bp >= 180:
            risk_score += 3
        elif systolic_bp >= 140:
            risk_score += 2
        elif systolic_bp >= 130:
            risk_score += 1
    
    # Kidney function risk
    if egfr is not None:
        if egfr < 30:
            risk_score += 3
        elif egfr < 60:
            risk_score += 2
        elif egfr < 90:
            risk_score += 1
    
    # History factors
    if diabetes:
        risk_score += 1
    if hypertension:
        risk_score += 1
    
    if risk_score >= 5:
        return "high"
    elif risk_score >= 2:
        return "moderate"
    return "low"


def average_bp_readings(*readings) -> Optional[int]:
    """Calculate average of available BP readings."""
    valid = [r for r in readings if r is not None]
    if not valid:
        return None
    return round(sum(valid) / len(valid))


def build_patient_list_item(demo: Demographic) -> PatientListItem:
    """Build a PatientListItem from database models."""
    exam = demo.examination
    labs = demo.labs
    quest = demo.questionnaire
    
    gender = decode_gender(demo.riagendr)
    
    # Get BP readings
    systolic = None
    diastolic = None
    if exam:
        systolic = average_bp_readings(exam.bpxsy1, exam.bpxsy2, exam.bpxsy3)
        diastolic = average_bp_readings(exam.bpxdi1, exam.bpxdi2, exam.bpxdi3)
    
    hba1c = labs.lbxgh if labs else None
    
    # Determine risk factors
    diabetes = quest.diq010 == 1 if quest and quest.diq010 else False
    hypertension = quest.bpq020 == 1 if quest and quest.bpq020 else False
    
    creatinine = labs.lbxscr if labs else None
    egfr = calculate_egfr(creatinine, demo.ridageyr or 0, gender)
    
    risk_level = calculate_risk_level(hba1c, systolic, egfr, diabetes, hypertension)
    
    # Determine status based on risk and recent data
    status = "critical" if risk_level == "high" else "active"
    
    return PatientListItem(
        id=str(demo.seqn),
        seqn=demo.seqn,
        gender=gender,
        age=demo.ridageyr or 0,
        blood_pressure_systolic=systolic,
        blood_pressure_diastolic=diastolic,
        bmi=exam.bmxbmi if exam else None,
        hba1c=hba1c,
        risk_level=risk_level,
        status=status,
    )


def build_patient_detail(demo: Demographic) -> PatientDetail:
    """Build a PatientDetail from database models."""
    exam = demo.examination
    labs = demo.labs
    diet = demo.diet
    quest = demo.questionnaire
    meds = demo.medications
    
    gender = decode_gender(demo.riagendr)
    
    # Get BP readings
    systolic = None
    diastolic = None
    heart_rate = None
    if exam:
        systolic = average_bp_readings(exam.bpxsy1, exam.bpxsy2, exam.bpxsy3)
        diastolic = average_bp_readings(exam.bpxdi1, exam.bpxdi2, exam.bpxdi3)
        heart_rate = exam.bpxpls
    
    # Lab values
    hba1c = labs.lbxgh if labs else None
    creatinine = labs.lbxscr if labs else None
    egfr = calculate_egfr(creatinine, demo.ridageyr or 0, gender)
    
    # Risk factors from questionnaire
    smoker = quest.smq020 == 1 if quest and quest.smq020 else False
    diabetes = quest.diq010 == 1 if quest and quest.diq010 else False
    hypertension = quest.bpq020 == 1 if quest and quest.bpq020 else False
    heart_disease = (
        (quest.mcq160c == 1 if quest and quest.mcq160c else False) or
        (quest.mcq160e == 1 if quest and quest.mcq160e else False)
    )
    kidney_disease = quest.kiq022 == 1 if quest and quest.kiq022 else False
    
    risk_level = calculate_risk_level(hba1c, systolic, egfr, diabetes, hypertension)
    status = "critical" if risk_level == "high" else "active"
    
    # Build medication list
    med_list = [
        MedicationResponse(
            id=m.id,
            seqn=m.seqn,
            rxduse=m.rxduse,
            rxddrug=m.rxddrug,
            rxddrgid=m.rxddrgid,
            rxddays=m.rxddays,
            rxdrsc1=m.rxdrsc1,
            rxdrsd1=m.rxdrsd1,
        )
        for m in meds if m.rxddrug and m.rxddrug not in ("99999", "55555")
    ]
    
    return PatientDetail(
        id=str(demo.seqn),
        seqn=demo.seqn,
        gender=gender,
        age=demo.ridageyr or 0,
        race_ethnicity=decode_race_ethnicity(demo.ridreth3 or demo.ridreth1),
        education=decode_education(demo.dmdeduc2),
        marital_status=decode_marital_status(demo.dmdmartl),
        blood_pressure_systolic=systolic,
        blood_pressure_diastolic=diastolic,
        heart_rate=heart_rate,
        weight=exam.bmxwt if exam else None,
        height=exam.bmxht if exam else None,
        bmi=exam.bmxbmi if exam else None,
        waist_circumference=exam.bmxwaist if exam else None,
        hba1c=hba1c,
        fasting_glucose=labs.lbxsgl if labs else None,
        total_cholesterol=labs.lbxtc if labs else None,
        ldl_cholesterol=labs.lbdldl if labs else None,
        hdl_cholesterol=labs.lbdhdd if labs else None,
        triglycerides=labs.lbxtr if labs else None,
        creatinine=creatinine,
        egfr=egfr,
        albumin=labs.lbxsal if labs else None,
        smoker=smoker,
        diabetes_history=diabetes,
        hypertension_history=hypertension,
        heart_disease_history=heart_disease,
        kidney_disease_history=kidney_disease,
        daily_calories=diet.dr1tkcal if diet else None,
        daily_sodium=diet.dr1tsodi if diet else None,
        medications=med_list,
        risk_level=risk_level,
        status=status,
    )


# ============ API Endpoints ============

@router.get("", response_model=PaginatedResponse)
def get_patients(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    gender: Optional[str] = None,
    min_age: Optional[int] = None,
    max_age: Optional[int] = None,
    risk_level: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Get paginated list of patients with optional filters."""
    query = db.query(Demographic).options(
        joinedload(Demographic.examination),
        joinedload(Demographic.labs),
        joinedload(Demographic.questionnaire),
    )
    
    # Apply filters
    if gender:
        gender_code = 1 if gender == "male" else 2 if gender == "female" else None
        if gender_code:
            query = query.filter(Demographic.riagendr == gender_code)
    
    if min_age is not None:
        query = query.filter(Demographic.ridageyr >= min_age)
    
    if max_age is not None:
        query = query.filter(Demographic.ridageyr <= max_age)
    
    # Get total count
    total = query.count()
    
    # Paginate
    offset = (page - 1) * page_size
    patients = query.offset(offset).limit(page_size).all()
    
    # Build response items
    items = [build_patient_list_item(p) for p in patients]
    
    # Post-filter by risk_level and status (computed fields)
    if risk_level:
        items = [p for p in items if p.risk_level == risk_level]
    if status:
        items = [p for p in items if p.status == status]
    
    pages = math.ceil(total / page_size)
    
    return PaginatedResponse(
        items=[item.model_dump() for item in items],
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


@router.get("/{patient_id}", response_model=PatientDetail)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    """Get detailed patient information by SEQN."""
    patient = db.query(Demographic).options(
        joinedload(Demographic.examination),
        joinedload(Demographic.labs),
        joinedload(Demographic.diet),
        joinedload(Demographic.questionnaire),
        joinedload(Demographic.medications),
    ).filter(Demographic.seqn == patient_id).first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    return build_patient_detail(patient)


@router.post("", response_model=PatientDetail, status_code=201)
def create_patient(patient_data: PatientCreate, db: Session = Depends(get_db)):
    """Create a new patient."""
    # Get next SEQN (max + 1)
    max_seqn = db.query(func.max(Demographic.seqn)).scalar() or 0
    new_seqn = max_seqn + 1
    
    # Create demographic record
    gender_code = 1 if patient_data.gender == "male" else 2 if patient_data.gender == "female" else 3
    
    demo = Demographic(
        seqn=new_seqn,
        riagendr=gender_code,
        ridageyr=patient_data.age,
    )
    db.add(demo)
    
    # Create examination record
    bmi = None
    if patient_data.weight and patient_data.height:
        bmi = round(patient_data.weight / ((patient_data.height / 100) ** 2), 1)
    
    exam = Examination(
        seqn=new_seqn,
        bpxsy1=patient_data.blood_pressure_systolic,
        bpxdi1=patient_data.blood_pressure_diastolic,
        bpxpls=patient_data.heart_rate,
        bmxwt=patient_data.weight,
        bmxht=patient_data.height,
        bmxbmi=bmi,
    )
    db.add(exam)
    
    # Create labs record
    labs = Labs(
        seqn=new_seqn,
        lbxgh=patient_data.hba1c,
        lbxsgl=patient_data.fasting_glucose,
        lbxtc=patient_data.total_cholesterol,
        lbdldl=patient_data.ldl_cholesterol,
        lbdhdd=patient_data.hdl_cholesterol,
        lbxtr=patient_data.triglycerides,
        lbxscr=patient_data.creatinine,
        lbxsal=patient_data.albumin,
    )
    db.add(labs)
    
    # Create questionnaire record
    quest = Questionnaire(
        seqn=new_seqn,
        smq020=1 if patient_data.smoker else 2,
        diq010=1 if patient_data.diabetes_history else 2,
        bpq020=1 if patient_data.hypertension_history else 2,
    )
    db.add(quest)
    
    # Create empty diet record
    diet = Diet(seqn=new_seqn)
    db.add(diet)
    
    db.commit()
    db.refresh(demo)
    
    # Reload with relationships
    patient = db.query(Demographic).options(
        joinedload(Demographic.examination),
        joinedload(Demographic.labs),
        joinedload(Demographic.diet),
        joinedload(Demographic.questionnaire),
        joinedload(Demographic.medications),
    ).filter(Demographic.seqn == new_seqn).first()
    
    return build_patient_detail(patient)


@router.put("/{patient_id}", response_model=PatientDetail)
def update_patient(patient_id: int, patient_data: PatientUpdate, db: Session = Depends(get_db)):
    """Update patient information."""
    patient = db.query(Demographic).filter(Demographic.seqn == patient_id).first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Update examination
    exam = db.query(Examination).filter(Examination.seqn == patient_id).first()
    if exam:
        if patient_data.blood_pressure_systolic is not None:
            exam.bpxsy1 = patient_data.blood_pressure_systolic
        if patient_data.blood_pressure_diastolic is not None:
            exam.bpxdi1 = patient_data.blood_pressure_diastolic
        if patient_data.heart_rate is not None:
            exam.bpxpls = patient_data.heart_rate
        if patient_data.weight is not None:
            exam.bmxwt = patient_data.weight
        if patient_data.height is not None:
            exam.bmxht = patient_data.height
        
        # Recalculate BMI if weight or height changed
        if patient_data.weight is not None or patient_data.height is not None:
            w = patient_data.weight or exam.bmxwt
            h = patient_data.height or exam.bmxht
            if w and h:
                exam.bmxbmi = round(w / ((h / 100) ** 2), 1)
    
    # Update labs
    labs = db.query(Labs).filter(Labs.seqn == patient_id).first()
    if labs:
        if patient_data.hba1c is not None:
            labs.lbxgh = patient_data.hba1c
        if patient_data.fasting_glucose is not None:
            labs.lbxsgl = patient_data.fasting_glucose
        if patient_data.total_cholesterol is not None:
            labs.lbxtc = patient_data.total_cholesterol
        if patient_data.ldl_cholesterol is not None:
            labs.lbdldl = patient_data.ldl_cholesterol
        if patient_data.hdl_cholesterol is not None:
            labs.lbdhdd = patient_data.hdl_cholesterol
        if patient_data.triglycerides is not None:
            labs.lbxtr = patient_data.triglycerides
        if patient_data.creatinine is not None:
            labs.lbxscr = patient_data.creatinine
        if patient_data.albumin is not None:
            labs.lbxsal = patient_data.albumin
    
    # Update questionnaire
    quest = db.query(Questionnaire).filter(Questionnaire.seqn == patient_id).first()
    if quest:
        if patient_data.smoker is not None:
            quest.smq020 = 1 if patient_data.smoker else 2
        if patient_data.diabetes_history is not None:
            quest.diq010 = 1 if patient_data.diabetes_history else 2
        if patient_data.hypertension_history is not None:
            quest.bpq020 = 1 if patient_data.hypertension_history else 2
    
    db.commit()
    
    # Reload with relationships
    updated_patient = db.query(Demographic).options(
        joinedload(Demographic.examination),
        joinedload(Demographic.labs),
        joinedload(Demographic.diet),
        joinedload(Demographic.questionnaire),
        joinedload(Demographic.medications),
    ).filter(Demographic.seqn == patient_id).first()
    
    return build_patient_detail(updated_patient)


@router.delete("/{patient_id}", status_code=204)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    """Delete a patient and all related records."""
    patient = db.query(Demographic).filter(Demographic.seqn == patient_id).first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Delete related records first
    db.query(Medication).filter(Medication.seqn == patient_id).delete()
    db.query(Questionnaire).filter(Questionnaire.seqn == patient_id).delete()
    db.query(Diet).filter(Diet.seqn == patient_id).delete()
    db.query(Labs).filter(Labs.seqn == patient_id).delete()
    db.query(Examination).filter(Examination.seqn == patient_id).delete()
    
    # Delete demographic record
    db.delete(patient)
    db.commit()
    
    return None


@router.get("/{patient_id}/medications", response_model=list[MedicationResponse])
def get_patient_medications(patient_id: int, db: Session = Depends(get_db)):
    """Get all medications for a patient."""
    patient = db.query(Demographic).filter(Demographic.seqn == patient_id).first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    medications = db.query(Medication).filter(
        Medication.seqn == patient_id,
        Medication.rxddrug.notin_(["99999", "55555", None])
    ).all()
    
    return [
        MedicationResponse(
            id=m.id,
            seqn=m.seqn,
            rxduse=m.rxduse,
            rxddrug=m.rxddrug,
            rxddrgid=m.rxddrgid,
            rxddays=m.rxddays,
            rxdrsc1=m.rxdrsc1,
            rxdrsd1=m.rxdrsd1,
        )
        for m in medications
    ]
