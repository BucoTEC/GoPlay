from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Demographic(Base):
    """Patient demographic information from NHANES demographic.csv"""
    __tablename__ = "demographics"
    
    seqn = Column(Integer, primary_key=True, index=True)
    riagendr = Column(Integer)  # Gender: 1=Male, 2=Female
    ridageyr = Column(Integer)  # Age in years
    ridreth1 = Column(Integer)  # Race/Hispanic origin
    ridreth3 = Column(Integer)  # Race/Hispanic origin with NH Asian
    dmdeduc2 = Column(Integer)  # Education level - Adults 20+
    dmdeduc3 = Column(Integer)  # Education level - Children/Youth 6-19
    dmdmartl = Column(Integer)  # Marital status
    indhhin2 = Column(Integer)  # Annual household income
    wtint2yr = Column(Float)    # Interview weight
    wtmec2yr = Column(Float)    # MEC exam weight
    
    # Relationships
    examination = relationship("Examination", back_populates="demographic", uselist=False)
    labs = relationship("Labs", back_populates="demographic", uselist=False)
    diet = relationship("Diet", back_populates="demographic", uselist=False)
    questionnaire = relationship("Questionnaire", back_populates="demographic", uselist=False)
    medications = relationship("Medication", back_populates="demographic")


class Examination(Base):
    """Physical examination data from NHANES examination.csv"""
    __tablename__ = "examinations"
    
    seqn = Column(Integer, ForeignKey("demographics.seqn"), primary_key=True, index=True)
    
    # Blood pressure readings
    bpxsy1 = Column(Integer)   # Systolic BP - 1st reading
    bpxdi1 = Column(Integer)   # Diastolic BP - 1st reading
    bpxsy2 = Column(Integer)   # Systolic BP - 2nd reading
    bpxdi2 = Column(Integer)   # Diastolic BP - 2nd reading
    bpxsy3 = Column(Integer)   # Systolic BP - 3rd reading
    bpxdi3 = Column(Integer)   # Diastolic BP - 3rd reading
    bpxsy4 = Column(Integer)   # Systolic BP - 4th reading
    bpxdi4 = Column(Integer)   # Diastolic BP - 4th reading
    bpxpls = Column(Integer)   # Pulse rate (bpm)
    
    # Body measurements
    bmxwt = Column(Float)      # Weight (kg)
    bmxht = Column(Float)      # Height (cm)
    bmxbmi = Column(Float)     # Body Mass Index
    bmxwaist = Column(Float)   # Waist circumference (cm)
    bmxarmc = Column(Float)    # Arm circumference (cm)
    bmxleg = Column(Float)     # Upper leg length (cm)
    bmxarml = Column(Float)    # Upper arm length (cm)
    
    # Grip strength
    mgxh1t1 = Column(Float)    # Grip strength - hand 1, trial 1
    mgxh2t1 = Column(Float)    # Grip strength - hand 2, trial 1
    
    demographic = relationship("Demographic", back_populates="examination")


class Labs(Base):
    """Laboratory results from NHANES labs.csv"""
    __tablename__ = "labs"
    
    seqn = Column(Integer, ForeignKey("demographics.seqn"), primary_key=True, index=True)
    
    # Kidney function
    urxuma = Column(Float)     # Urine albumin (mg/L)
    urxucr = Column(Float)     # Urine creatinine (mg/dL) - using urxucr.x
    lbxscr = Column(Float)     # Serum creatinine (mg/dL)
    
    # Glucose/Diabetes markers
    lbxsgl = Column(Float)     # Serum glucose (mg/dL)
    lbxgh = Column(Float)      # Glycohemoglobin HbA1c (%)
    lbxglt = Column(Float)     # Glucose tolerance test
    lbxin = Column(Float)      # Insulin (uU/mL)
    
    # Lipid panel
    lbxtc = Column(Float)      # Total cholesterol (mg/dL)
    lbdldl = Column(Float)     # LDL cholesterol (mg/dL)
    lbdhdd = Column(Float)     # HDL cholesterol (mg/dL)
    lbxtr = Column(Float)      # Triglycerides (mg/dL)
    
    # Complete blood count
    lbxwbcsi = Column(Float)   # White blood cell count (1000 cells/uL)
    lbxrbcsi = Column(Float)   # Red blood cell count (million cells/uL)
    lbxhgb = Column(Float)     # Hemoglobin (g/dL)
    lbxhct = Column(Float)     # Hematocrit (%)
    lbxmcvsi = Column(Float)   # Mean cell volume (fL)
    lbxpltsi = Column(Float)   # Platelet count (1000 cells/uL)
    
    # Liver function
    lbxsatsi = Column(Float)   # ALT (U/L)
    lbxsassi = Column(Float)   # AST (U/L)
    
    # Other chemistry
    lbxsca = Column(Float)     # Calcium (mg/dL)
    lbxsph = Column(Float)     # Phosphorus (mg/dL)
    lbxsua = Column(Float)     # Uric acid (mg/dL)
    lbxstp = Column(Float)     # Total protein (g/dL)
    lbxsal = Column(Float)     # Albumin (g/dL)
    lbxstb = Column(Float)     # Total bilirubin (mg/dL)
    lbxsbu = Column(Float)     # Blood urea nitrogen (mg/dL)
    
    # Metals/Toxicology
    lbxbpb = Column(Float)     # Blood lead (ug/dL)
    lbxbcd = Column(Float)     # Blood cadmium (ug/L)
    lbxthg = Column(Float)     # Blood mercury (ug/L)
    
    demographic = relationship("Demographic", back_populates="labs")


class Diet(Base):
    """Dietary intake data from NHANES diet.csv"""
    __tablename__ = "diet"
    
    seqn = Column(Integer, ForeignKey("demographics.seqn"), primary_key=True, index=True)
    
    # Energy and macronutrients
    dr1tkcal = Column(Float)   # Total calories (kcal)
    dr1tprot = Column(Float)   # Protein (g)
    dr1tcarb = Column(Float)   # Carbohydrates (g)
    dr1ttfat = Column(Float)   # Total fat (g)
    dr1tsfat = Column(Float)   # Saturated fat (g)
    dr1tmfat = Column(Float)   # Monounsaturated fat (g)
    dr1tpfat = Column(Float)   # Polyunsaturated fat (g)
    dr1tchol = Column(Float)   # Cholesterol (mg)
    
    # Fiber and sugars
    dr1tfibe = Column(Float)   # Dietary fiber (g)
    dr1tsugr = Column(Float)   # Total sugars (g)
    
    # Minerals
    dr1tsodi = Column(Float)   # Sodium (mg)
    dr1tpota = Column(Float)   # Potassium (mg)
    dr1tcalc = Column(Float)   # Calcium (mg)
    dr1tiron = Column(Float)   # Iron (mg)
    dr1tzinc = Column(Float)   # Zinc (mg)
    dr1tmagn = Column(Float)   # Magnesium (mg)
    
    # Vitamins
    dr1tvb12 = Column(Float)   # Vitamin B12 (mcg)
    dr1tvb6 = Column(Float)    # Vitamin B6 (mg)
    dr1tvc = Column(Float)     # Vitamin C (mg)
    dr1tvd = Column(Float)     # Vitamin D (mcg)
    dr1tfola = Column(Float)   # Total folate (mcg)
    
    # Dietary data quality
    dr1_300 = Column(Integer)  # Compare food intake to usual
    dr1_330 = Column(Integer)  # Food eaten at home
    drabf = Column(Integer)    # Breast-fed infant
    
    demographic = relationship("Demographic", back_populates="diet")


class Questionnaire(Base):
    """Health questionnaire data from NHANES questionnaire.csv"""
    __tablename__ = "questionnaires"
    
    seqn = Column(Integer, ForeignKey("demographics.seqn"), primary_key=True, index=True)
    
    # Blood pressure history
    bpq020 = Column(Integer)   # Ever told high blood pressure
    bpq030 = Column(Integer)   # Told high BP 2+ times
    bpq040a = Column(Integer)  # Taking BP medication
    
    # Diabetes
    diq010 = Column(Integer)   # Doctor told you have diabetes
    diq050 = Column(Integer)   # Taking insulin
    diq070 = Column(Integer)   # Taking diabetes pills
    
    # Cardiovascular history
    mcq160b = Column(Integer)  # Ever told heart failure
    mcq160c = Column(Integer)  # Ever told coronary heart disease
    mcq160d = Column(Integer)  # Ever told angina
    mcq160e = Column(Integer)  # Ever told heart attack
    mcq160f = Column(Integer)  # Ever told stroke
    
    # Kidney disease
    kiq022 = Column(Integer)   # Ever told weak/failing kidneys
    
    # Smoking
    smq020 = Column(Integer)   # Smoked 100+ cigarettes in life
    smq040 = Column(Integer)   # Current smoking status
    
    # Alcohol
    alq101 = Column(Integer)   # Had 12+ alcohol drinks in 1 year
    alq120q = Column(Integer)  # Drinks per day
    
    # Physical activity
    paq605 = Column(Integer)   # Vigorous work activity
    paq620 = Column(Integer)   # Moderate work activity
    paq650 = Column(Integer)   # Vigorous recreational activities
    paq665 = Column(Integer)   # Moderate recreational activities
    
    # Depression screening (PHQ-9)
    dpq010 = Column(Integer)   # Little interest in doing things
    dpq020 = Column(Integer)   # Feeling down, depressed
    dpq030 = Column(Integer)   # Trouble sleeping
    dpq040 = Column(Integer)   # Feeling tired
    dpq050 = Column(Integer)   # Poor appetite or overeating
    dpq060 = Column(Integer)   # Feeling bad about yourself
    dpq070 = Column(Integer)   # Trouble concentrating
    dpq080 = Column(Integer)   # Moving or speaking slowly
    dpq090 = Column(Integer)   # Thoughts of self-harm
    
    # Weight history
    whd010 = Column(Float)     # Current self-reported height
    whd020 = Column(Float)     # Current self-reported weight
    
    demographic = relationship("Demographic", back_populates="questionnaire")


class Medication(Base):
    """Current medications from NHANES medications.csv (one-to-many)"""
    __tablename__ = "medications"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    seqn = Column(Integer, ForeignKey("demographics.seqn"), index=True)
    
    rxduse = Column(Integer)   # Prescription medication use (1=Yes, 2=No)
    rxddrug = Column(String)   # Drug name
    rxddrgid = Column(String)  # Drug ID
    rxqseen = Column(Integer)  # Container seen by interviewer
    rxddays = Column(Integer)  # Number of days taken
    
    # ICD-10 condition codes and descriptions
    rxdrsc1 = Column(String)   # ICD-10 code 1
    rxdrsc2 = Column(String)   # ICD-10 code 2
    rxdrsc3 = Column(String)   # ICD-10 code 3
    rxdrsd1 = Column(String)   # Condition description 1
    rxdrsd2 = Column(String)   # Condition description 2
    rxdrsd3 = Column(String)   # Condition description 3
    
    rxdcount = Column(Integer) # Total medication count for patient
    
    demographic = relationship("Demographic", back_populates="medications")
