"use client"

import { use, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { usePatients, type Patient } from "@/context/patients-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Pencil, Activity, Heart, Droplets, FlaskConical, Loader2 } from "lucide-react"

export default function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { fetchPatientDetail } = usePatients()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPatient() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchPatientDetail(id)
        if (!data) {
          setError("Patient not found")
        } else {
          setPatient(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load patient")
      } finally {
        setLoading(false)
      }
    }
    loadPatient()
  }, [id, fetchPatientDetail])

  if (loading) {
    return (
      <AppShell title="Loading..." subtitle="Please wait">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    )
  }

  if (error || !patient) {
    notFound()
  }

  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()

  return (
    <AppShell title={`${patient.firstName} ${patient.lastName}`} subtitle={`MRN: ${patient.mrn}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/patients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Patients
            </Button>
          </Link>
          <Link href={`/patients/${patient.id}/edit`}>
            <Button>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Patient
            </Button>
          </Link>
        </div>

        {/* Patient Overview */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary text-xl font-semibold">
                  {patient.firstName[0]}
                  {patient.lastName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {age} years old | {patient.gender}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant={
                    patient.status === "critical"
                      ? "destructive"
                      : patient.status === "active"
                        ? "default"
                        : "secondary"
                  }
                >
                  {patient.status}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    patient.riskLevel === "high"
                      ? "border-destructive text-destructive"
                      : patient.riskLevel === "moderate"
                        ? "border-warning text-warning"
                        : "border-accent text-accent"
                  }
                >
                  {patient.riskLevel} risk
                </Badge>
              </div>
              <div className="pt-4 space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Email:</span> {patient.email}
                </p>
                <p>
                  <span className="text-muted-foreground">Phone:</span> {patient.phone}
                </p>
                <p>
                  <span className="text-muted-foreground">Address:</span> {patient.address}
                </p>
                <p>
                  <span className="text-muted-foreground">Last Visit:</span> {patient.lastVisit}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Vital Signs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-sm text-muted-foreground">Blood Pressure</p>
                  <p className="text-2xl font-semibold">
                    {patient.bloodPressureSystolic || "N/A"}/{patient.bloodPressureDiastolic || "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">mmHg</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-sm text-muted-foreground">Heart Rate</p>
                  <p className="text-2xl font-semibold">{patient.heartRate || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">bpm</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-sm text-muted-foreground">BMI</p>
                  <p className="text-2xl font-semibold">{patient.bmi ? patient.bmi.toFixed(1) : "N/A"}</p>
                  <p className="text-xs text-muted-foreground">kg/m²</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="text-2xl font-semibold">{patient.weight || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">kg</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-sm text-muted-foreground">Height</p>
                  <p className="text-2xl font-semibold">{patient.height || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">cm</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lab Values */}
        <Card>
          <CardHeader>
            <CardTitle>Laboratory Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm text-muted-foreground">HbA1c</p>
                <p className="text-xl font-semibold">{patient.hba1c ? `${patient.hba1c}%` : "N/A"}</p>
                {patient.hba1c && (
                  <Badge
                    variant="outline"
                    className={
                      patient.hba1c >= 6.5
                        ? "border-destructive text-destructive mt-1"
                        : patient.hba1c >= 5.7
                          ? "border-warning text-warning mt-1"
                          : "border-accent text-accent mt-1"
                    }
                  >
                    {patient.hba1c >= 6.5 ? "Diabetic" : patient.hba1c >= 5.7 ? "Pre-diabetic" : "Normal"}
                  </Badge>
                )}
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm text-muted-foreground">Fasting Glucose</p>
                <p className="text-xl font-semibold">{patient.fastingGlucose || "N/A"}</p>
                <p className="text-xs text-muted-foreground">mg/dL</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm text-muted-foreground">eGFR</p>
                <p className="text-xl font-semibold">{patient.egfr || "N/A"}</p>
                {patient.egfr && (
                  <Badge
                    variant="outline"
                    className={
                      patient.egfr < 60
                        ? "border-destructive text-destructive mt-1"
                        : patient.egfr < 90
                          ? "border-warning text-warning mt-1"
                          : "border-accent text-accent mt-1"
                    }
                  >
                    {patient.egfr < 60 ? "CKD Risk" : patient.egfr < 90 ? "Mild Decrease" : "Normal"}
                  </Badge>
                )}
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm text-muted-foreground">Creatinine</p>
                <p className="text-xl font-semibold">{patient.creatinine || "N/A"}</p>
                <p className="text-xs text-muted-foreground">mg/dL</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm text-muted-foreground">Urine Albumin</p>
                <p className="text-xl font-semibold">{patient.albumin || "N/A"}</p>
                <p className="text-xs text-muted-foreground">mg/L</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm text-muted-foreground">Total Cholesterol</p>
                <p className="text-xl font-semibold">{patient.totalCholesterol || "N/A"}</p>
                <p className="text-xs text-muted-foreground">mg/dL</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm text-muted-foreground">LDL</p>
                <p className="text-xl font-semibold">{patient.ldlCholesterol || "N/A"}</p>
                <p className="text-xs text-muted-foreground">mg/dL</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm text-muted-foreground">HDL</p>
                <p className="text-xl font-semibold">{patient.hdlCholesterol || "N/A"}</p>
                <p className="text-xs text-muted-foreground">mg/dL</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm text-muted-foreground">Triglycerides</p>
                <p className="text-xl font-semibold">{patient.triglycerides || "N/A"}</p>
                <p className="text-xs text-muted-foreground">mg/dL</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors & Quick Actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Risk Factors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span>Current Smoker</span>
                <Badge variant={patient.smoker ? "destructive" : "secondary"}>{patient.smoker ? "Yes" : "No"}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span>Diabetes History</span>
                <Badge variant={patient.diabetesHistory ? "destructive" : "secondary"}>
                  {patient.diabetesHistory ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span>Hypertension History</span>
                <Badge variant={patient.hypertensionHistory ? "destructive" : "secondary"}>
                  {patient.hypertensionHistory ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span>Family History of Cardiac Disease</span>
                <Badge variant={patient.familyHistoryCardiac ? "destructive" : "secondary"}>
                  {patient.familyHistoryCardiac ? "Yes" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Run Risk Assessments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href={`/models/ckd-risk?patientId=${patient.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/10">
                  <Droplets className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium">CKD Risk Assessment</p>
                  <p className="text-sm text-muted-foreground">Evaluate kidney function</p>
                </div>
              </Link>
              <Link
                href={`/models/diabetes?patientId=${patient.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/10">
                  <Heart className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium">Diabetes Risk Assessment</p>
                  <p className="text-sm text-muted-foreground">HbA1c inference</p>
                </div>
              </Link>
              <Link
                href={`/models/blood-pressure?patientId=${patient.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Blood Pressure Prediction</p>
                  <p className="text-sm text-muted-foreground">NHANES-based model</p>
                </div>
              </Link>
              <Link
                href={`/models/metabolic?patientId=${patient.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
                  <FlaskConical className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Metabolic Syndrome Clustering</p>
                  <p className="text-sm text-muted-foreground">Pattern analysis</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
