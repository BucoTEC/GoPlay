import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error

def build_and_run_inference():
    # 1. LOAD DATA
    print("Loading NHANES datasets...")
    demo = pd.read_csv('demographic.csv')[['SEQN', 'RIDAGEYR', 'RIAGENDR']]
    exam = pd.read_csv('examination.csv')[['SEQN', 'BPXSY1', 'BMXBMI', 'BMXWAIST']]
    labs = pd.read_csv('labs.csv')[['SEQN', 'LBXTC']]
    meds = pd.read_csv('medications.csv')

    # 2. DEFINE BP-AFFECTING MEDICATIONS
    # Common keywords for antihypertensives in NHANES (RXDDRUG field)
    bp_med_keywords = [
        'LISINOPRIL', 'AMLODIPINE', 'METOPROLOL', 'HYDROCHLOROTHIAZIDE', 
        'LOSARTAN', 'ATENOLOL', 'ENALAPRIL', 'FUROSEMIDE', 'PROPRANOLOL',
        'VALSARTAN', 'DILTIAZEM', 'CARVEDILOL', 'SPIRONOLACTONE'
    ]
    
    # Identify SEQN of people taking BP meds
    # RXDRSD1 often contains the reason (e.g., "Hypertension")
    is_bp_med = meds['RXDDRUG'].str.contains('|'.join(bp_med_keywords), case=False, na=False) | \
                meds['RXDRSD1'].str.contains('hypertension', case=False, na=False)
    
    treated_seqns = meds[is_bp_med]['SEQN'].unique()

    # 3. DATA INTEGRATION
    df = demo.merge(exam, on='SEQN').merge(labs, on='SEQN')
    
    # Add a flag for Medication Status
    df['on_bp_meds'] = df['SEQN'].isin(treated_seqns).astype(int)

    # 4. PREPARE TRAINING SET (Only those NOT on medication)
    # We want to predict natural SBP, so we train on the untreated population
    train_df = df[df['on_bp_meds'] == 0].dropna(subset=['BPXSY1'])
    
    features = ['RIDAGEYR', 'RIAGENDR', 'BMXBMI', 'BMXWAIST', 'LBXTC']
    X = train_df[features]
    y = train_df['BPXSY1']

    # Preprocessing
    imputer = SimpleImputer(strategy='median')
    scaler = StandardScaler()
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    X_train_processed = scaler.fit_transform(imputer.fit_transform(X_train))
    X_test_processed = scaler.transform(imputer.transform(X_test))

    # Train Model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_processed, y_train)
    
    mae = mean_absolute_error(y_test, model.predict(X_test_processed))
    print(f"Model trained on untreated baseline. Test MAE: {mae:.2f} mmHg")

    # 5. EHR APP LOGIC SIMULATION
    def ehr_inference_logic(patient_data):
        """
        Simulates the logic gate in an EHR app.
        patient_data: dict containing features and medication status
        """
        print(f"\n--- Processing Patient ID: {patient_data['SEQN']} ---")
        
        if patient_data['on_bp_meds'] == 1:
            return {
                "action": "SKIP_INFERENCE",
                "reason": "Patient is already on antihypertensive medication.",
                "recommendation": "Monitor treatment efficacy via clinical readings."
            }
        else:
            # Prepare feature vector
            feat_vals = np.array([[patient_data[f] for f in features]])
            feat_prepped = scaler.transform(imputer.transform(feat_vals))
            prediction = model.predict(feat_prepped)[0]
            
            return {
                "action": "RUN_INFERENCE",
                "predicted_sbp": round(prediction, 1),
                "risk_status": "High" if prediction > 130 else "Normal",
                "recommendation": "Screen for hypertension if not already diagnosed."
            }

    # Test the logic on two sample cases from the dataset
    sample_treated = df[df['on_bp_meds'] == 1].iloc[0].to_dict()
    sample_untreated = df[df['on_bp_meds'] == 0].iloc[0].to_dict()

    print(ehr_inference_logic(sample_treated))
    print(ehr_inference_logic(sample_untreated))

if __name__ == "__main__":
    build_and_run_inference()
