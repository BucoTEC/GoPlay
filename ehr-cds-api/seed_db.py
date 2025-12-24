"""
Database seeding script to load CSV data into SQLite database.
Run this script to initialize the database with NHANES data.
"""
import os
import pandas as pd
from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
from models import Demographic, Examination, Labs, Diet, Questionnaire, Medication
from config import get_settings
import math


def clean_value(val):
    """Clean NaN/None values for database insertion."""
    if pd.isna(val):
        return None
    if isinstance(val, float) and math.isnan(val):
        return None
    return val


def clean_int(val):
    """Clean and convert to int, handling NaN."""
    if pd.isna(val):
        return None
    try:
        return int(val)
    except (ValueError, TypeError):
        return None


def clean_float(val):
    """Clean and convert to float, handling NaN."""
    if pd.isna(val):
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def clean_str(val):
    """Clean and convert to string, handling NaN."""
    if pd.isna(val):
        return None
    return str(val)


def seed_demographics(db: Session, csv_path: str):
    """Seed demographics table from CSV."""
    print("Loading demographics...")
    df = pd.read_csv(os.path.join(csv_path, "demographic.csv"), encoding='latin-1')
    
    for _, row in df.iterrows():
        demo = Demographic(
            seqn=clean_int(row.get("SEQN")),
            riagendr=clean_int(row.get("RIAGENDR")),
            ridageyr=clean_int(row.get("RIDAGEYR")),
            ridreth1=clean_int(row.get("RIDRETH1")),
            ridreth3=clean_int(row.get("RIDRETH3")),
            dmdeduc2=clean_int(row.get("DMDEDUC2")),
            dmdeduc3=clean_int(row.get("DMDEDUC3")),
            dmdmartl=clean_int(row.get("DMDMARTL")),
            indhhin2=clean_int(row.get("INDHHIN2")),
            wtint2yr=clean_float(row.get("WTINT2YR")),
            wtmec2yr=clean_float(row.get("WTMEC2YR")),
        )
        db.add(demo)
    
    db.commit()
    print(f"  Loaded {len(df)} demographic records")


def seed_examinations(db: Session, csv_path: str):
    """Seed examinations table from CSV."""
    print("Loading examinations...")
    df = pd.read_csv(os.path.join(csv_path, "examination.csv"), encoding='latin-1')
    
    # Get existing SEQNs from demographics
    existing_seqns = {d.seqn for d in db.query(Demographic.seqn).all()}
    
    count = 0
    for _, row in df.iterrows():
        seqn = clean_int(row.get("SEQN"))
        if seqn not in existing_seqns:
            continue
            
        exam = Examination(
            seqn=seqn,
            bpxsy1=clean_int(row.get("BPXSY1")),
            bpxdi1=clean_int(row.get("BPXDI1")),
            bpxsy2=clean_int(row.get("BPXSY2")),
            bpxdi2=clean_int(row.get("BPXDI2")),
            bpxsy3=clean_int(row.get("BPXSY3")),
            bpxdi3=clean_int(row.get("BPXDI3")),
            bpxsy4=clean_int(row.get("BPXSY4")),
            bpxdi4=clean_int(row.get("BPXDI4")),
            bpxpls=clean_int(row.get("BPXPLS")),
            bmxwt=clean_float(row.get("BMXWT")),
            bmxht=clean_float(row.get("BMXHT")),
            bmxbmi=clean_float(row.get("BMXBMI")),
            bmxwaist=clean_float(row.get("BMXWAIST")),
            bmxarmc=clean_float(row.get("BMXARMC")),
            bmxleg=clean_float(row.get("BMXLEG")),
            bmxarml=clean_float(row.get("BMXARML")),
            mgxh1t1=clean_float(row.get("MGXH1T1")),
            mgxh2t1=clean_float(row.get("MGXH2T1")),
        )
        db.add(exam)
        count += 1
    
    db.commit()
    print(f"  Loaded {count} examination records")


def seed_labs(db: Session, csv_path: str):
    """Seed labs table from CSV."""
    print("Loading labs...")
    df = pd.read_csv(os.path.join(csv_path, "labs.csv"), encoding='latin-1')
    
    existing_seqns = {d.seqn for d in db.query(Demographic.seqn).all()}
    
    count = 0
    for _, row in df.iterrows():
        seqn = clean_int(row.get("SEQN"))
        if seqn not in existing_seqns:
            continue
            
        lab = Labs(
            seqn=seqn,
            urxuma=clean_float(row.get("URXUMA")),
            urxucr=clean_float(row.get("URXUCR.x") or row.get("URXUCR")),
            lbxscr=clean_float(row.get("LBXSCR")),
            lbxsgl=clean_float(row.get("LBXSGL")),
            lbxgh=clean_float(row.get("LBXGH")),
            lbxglt=clean_float(row.get("LBXGLT")),
            lbxin=clean_float(row.get("LBXIN")),
            lbxtc=clean_float(row.get("LBXTC")),
            lbdldl=clean_float(row.get("LBDLDL")),
            lbdhdd=clean_float(row.get("LBDHDD")),
            lbxtr=clean_float(row.get("LBXTR")),
            lbxwbcsi=clean_float(row.get("LBXWBCSI")),
            lbxrbcsi=clean_float(row.get("LBXRBCSI")),
            lbxhgb=clean_float(row.get("LBXHGB")),
            lbxhct=clean_float(row.get("LBXHCT")),
            lbxmcvsi=clean_float(row.get("LBXMCVSI")),
            lbxpltsi=clean_float(row.get("LBXPLTSI")),
            lbxsatsi=clean_float(row.get("LBXSATSI")),
            lbxsassi=clean_float(row.get("LBXSASSI")),
            lbxsca=clean_float(row.get("LBXSCA")),
            lbxsph=clean_float(row.get("LBXSPH")),
            lbxsua=clean_float(row.get("LBXSUA")),
            lbxstp=clean_float(row.get("LBXSTP")),
            lbxsal=clean_float(row.get("LBXSAL")),
            lbxstb=clean_float(row.get("LBXSTB")),
            lbxsbu=clean_float(row.get("LBXSBU")),
            lbxbpb=clean_float(row.get("LBXBPB")),
            lbxbcd=clean_float(row.get("LBXBCD")),
            lbxthg=clean_float(row.get("LBXTHG")),
        )
        db.add(lab)
        count += 1
    
    db.commit()
    print(f"  Loaded {count} lab records")


def seed_diet(db: Session, csv_path: str):
    """Seed diet table from CSV."""
    print("Loading diet...")
    df = pd.read_csv(os.path.join(csv_path, "diet.csv"), encoding='latin-1')
    
    existing_seqns = {d.seqn for d in db.query(Demographic.seqn).all()}
    
    count = 0
    for _, row in df.iterrows():
        seqn = clean_int(row.get("SEQN"))
        if seqn not in existing_seqns:
            continue
            
        diet = Diet(
            seqn=seqn,
            dr1tkcal=clean_float(row.get("DR1TKCAL")),
            dr1tprot=clean_float(row.get("DR1TPROT")),
            dr1tcarb=clean_float(row.get("DR1TCARB")),
            dr1ttfat=clean_float(row.get("DR1TTFAT")),
            dr1tsfat=clean_float(row.get("DR1TSFAT")),
            dr1tmfat=clean_float(row.get("DR1TMFAT")),
            dr1tpfat=clean_float(row.get("DR1TPFAT")),
            dr1tchol=clean_float(row.get("DR1TCHOL")),
            dr1tfibe=clean_float(row.get("DR1TFIBE")),
            dr1tsugr=clean_float(row.get("DR1TSUGR")),
            dr1tsodi=clean_float(row.get("DR1TSODI")),
            dr1tpota=clean_float(row.get("DR1TPOTA")),
            dr1tcalc=clean_float(row.get("DR1TCALC")),
            dr1tiron=clean_float(row.get("DR1TIRON")),
            dr1tzinc=clean_float(row.get("DR1TZINC")),
            dr1tmagn=clean_float(row.get("DR1TMAGN")),
            dr1tvb12=clean_float(row.get("DR1TVB12")),
            dr1tvb6=clean_float(row.get("DR1TVB6")),
            dr1tvc=clean_float(row.get("DR1TVC")),
            dr1tvd=clean_float(row.get("DR1TVD")),
            dr1tfola=clean_float(row.get("DR1TFOLA")),
            dr1_300=clean_int(row.get("DR1_300")),
            dr1_330=clean_int(row.get("DR1_330")),
            drabf=clean_int(row.get("DRABF")),
        )
        db.add(diet)
        count += 1
    
    db.commit()
    print(f"  Loaded {count} diet records")


def seed_questionnaires(db: Session, csv_path: str):
    """Seed questionnaires table from CSV."""
    print("Loading questionnaires...")
    df = pd.read_csv(os.path.join(csv_path, "questionnaire.csv"), encoding='latin-1')
    
    existing_seqns = {d.seqn for d in db.query(Demographic.seqn).all()}
    
    count = 0
    for _, row in df.iterrows():
        seqn = clean_int(row.get("SEQN"))
        if seqn not in existing_seqns:
            continue
            
        quest = Questionnaire(
            seqn=seqn,
            bpq020=clean_int(row.get("BPQ020")),
            bpq030=clean_int(row.get("BPQ030")),
            bpq040a=clean_int(row.get("BPQ040A")),
            diq010=clean_int(row.get("DIQ010")),
            diq050=clean_int(row.get("DIQ050")),
            diq070=clean_int(row.get("DIQ070")),
            mcq160b=clean_int(row.get("MCQ160B")),
            mcq160c=clean_int(row.get("MCQ160C")),
            mcq160d=clean_int(row.get("MCQ160D")),
            mcq160e=clean_int(row.get("MCQ160E")),
            mcq160f=clean_int(row.get("MCQ160F")),
            kiq022=clean_int(row.get("KIQ022")),
            smq020=clean_int(row.get("SMQ020")),
            smq040=clean_int(row.get("SMQ040")),
            alq101=clean_int(row.get("ALQ101")),
            alq120q=clean_int(row.get("ALQ120Q")),
            paq605=clean_int(row.get("PAQ605")),
            paq620=clean_int(row.get("PAQ620")),
            paq650=clean_int(row.get("PAQ650")),
            paq665=clean_int(row.get("PAQ665")),
            dpq010=clean_int(row.get("DPQ010")),
            dpq020=clean_int(row.get("DPQ020")),
            dpq030=clean_int(row.get("DPQ030")),
            dpq040=clean_int(row.get("DPQ040")),
            dpq050=clean_int(row.get("DPQ050")),
            dpq060=clean_int(row.get("DPQ060")),
            dpq070=clean_int(row.get("DPQ070")),
            dpq080=clean_int(row.get("DPQ080")),
            dpq090=clean_int(row.get("DPQ090")),
            whd010=clean_float(row.get("WHD010")),
            whd020=clean_float(row.get("WHD020")),
        )
        db.add(quest)
        count += 1
    
    db.commit()
    print(f"  Loaded {count} questionnaire records")


def seed_medications(db: Session, csv_path: str):
    """Seed medications table from CSV."""
    print("Loading medications...")
    df = pd.read_csv(os.path.join(csv_path, "medications.csv"), encoding='latin-1')
    
    existing_seqns = {d.seqn for d in db.query(Demographic.seqn).all()}
    
    count = 0
    for _, row in df.iterrows():
        seqn = clean_int(row.get("SEQN"))
        if seqn not in existing_seqns:
            continue
            
        med = Medication(
            seqn=seqn,
            rxduse=clean_int(row.get("RXDUSE")),
            rxddrug=clean_str(row.get("RXDDRUG")),
            rxddrgid=clean_str(row.get("RXDDRGID")),
            rxqseen=clean_int(row.get("RXQSEEN")),
            rxddays=clean_int(row.get("RXDDAYS")),
            rxdrsc1=clean_str(row.get("RXDRSC1")),
            rxdrsc2=clean_str(row.get("RXDRSC2")),
            rxdrsc3=clean_str(row.get("RXDRSC3")),
            rxdrsd1=clean_str(row.get("RXDRSD1")),
            rxdrsd2=clean_str(row.get("RXDRSD2")),
            rxdrsd3=clean_str(row.get("RXDRSD3")),
            rxdcount=clean_int(row.get("RXDCOUNT")),
        )
        db.add(med)
        count += 1
    
    db.commit()
    print(f"  Loaded {count} medication records")


def init_db():
    """Initialize database and seed with CSV data."""
    settings = get_settings()
    csv_path = settings.csv_data_path
    
    print(f"Initializing database...")
    print(f"CSV data path: {csv_path}")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully")
    
    # Seed data
    db = SessionLocal()
    try:
        # Check if data already exists
        existing_count = db.query(Demographic).count()
        if existing_count > 0:
            print(f"Database already contains {existing_count} records. Skipping seed.")
            return
        
        seed_demographics(db, csv_path)
        seed_examinations(db, csv_path)
        seed_labs(db, csv_path)
        seed_diet(db, csv_path)
        seed_questionnaires(db, csv_path)
        seed_medications(db, csv_path)
        
        print("\nDatabase seeding complete!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
