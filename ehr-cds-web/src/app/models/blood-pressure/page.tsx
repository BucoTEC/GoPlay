"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { usePatients } from "@/context/patients-context"
import { predictBloodPressure, type PredictionResult } from "@/lib/prediction-models"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Activity, AlertTriangle, CheckCircle, Info, ArrowRight, RefreshCw, TrendingUp } from "lucide-react"

type BPPredictionResult = PredictionResult & { predictedSystolic: number; predictedDiastolic: number }

export default function BloodPressurePage() {
  const searchParams = useSearchParams()
  const { patients, getPatient } = usePatients()
  const [selectedPatientId, setSelectedPatientId] = useState<string>("")
  const [result, setResult] = useState<BPPredictionResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    const patientId = searchParams.get("patientId")
    if (patientId) {
      setSelectedPatientId(patientId)
    }
  }, [searchParams])

  const selectedPatient = selectedPatientId ? getPatient(selectedPatientId) : null

  const runAnalysis = () => {
    if (!selectedPatient) return
    setIsAnalyzing(true)
    setResult(null)

    setTimeout(() => {
      const prediction = predictBloodPressure(selectedPatient)
      setResult(prediction)
      setIsAnalyzing(false)
    }, 1500)
  }

  const getRiskColor = (level: PredictionResult["riskLevel"]) => {
    switch (level) {
      case "low":
        return "text-accent"
      case "moderate":
        return "text-warning"
      case "high":
        return "text-destructive"
      case "very-high":
        return "text-destructive"
    }
  }

  const getRiskBg = (level: PredictionResult["riskLevel"]) => {
    switch (level) {
      case "low":
        return "bg-accent/10"
      case "moderate":
        return "bg-warning/10"
      case "high":
        return "bg-destructive/10"
      case "very-high":
        return "bg-destructive/20"
    }
  }

  return (
    <AppShell title="Blood Pressure Prediction" subtitle="NHANES-based regression model for BP risk assessment">
      <div className="space-y-6">
        {/* Model Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Blood Pressure Prediction Model</CardTitle>
                <CardDescription>NHANES-based regression model using demographic and clinical factors</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm font-medium text-muted-foreground">Model Type</p>
                <p className="text-lg font-semibold">Linear Regression</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm font-medium text-muted-foreground">Data Source</p>
                <p className="text-lg font-semibold">NHANES Coefficients</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm font-medium text-muted-foreground">Clinical Use</p>
                <p className="text-lg font-semibold">Hypertension Management</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a patient to analyze..." />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} ({patient.mrn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={runAnalysis} disabled={!selectedPatient || isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Run Analysis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {selectedPatient && (
              <div className="mt-4 p-4 rounded-lg bg-secondary">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current BP</p>
                    <p className="text-xl font-semibold">
                      {selectedPatient.bloodPressureSystolic}/{selectedPatient.bloodPressureDiastolic}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">BMI</p>
                    <p className="text-xl font-semibold">{selectedPatient.bmi.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="text-xl font-semibold">
                      {new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Smoker</p>
                    <p className="text-xl font-semibold">{selectedPatient.smoker ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && selectedPatient && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Prediction Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  BP Prediction vs Actual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary/10 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Predicted BP</p>
                    <p className="text-3xl font-bold text-primary">
                      {result.predictedSystolic}/{result.predictedDiastolic}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">mmHg</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary text-center">
                    <p className="text-sm text-muted-foreground mb-1">Actual BP</p>
                    <p className="text-3xl font-bold">
                      {selectedPatient.bloodPressureSystolic}/{selectedPatient.bloodPressureDiastolic}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">mmHg</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Badge
                    className={cn(
                      "text-lg px-4 py-2",
                      result.riskLevel === "low" && "bg-accent text-accent-foreground",
                      result.riskLevel === "moderate" && "bg-warning text-warning-foreground",
                      (result.riskLevel === "high" || result.riskLevel === "very-high") &&
                        "bg-destructive text-destructive-foreground",
                    )}
                  >
                    {result.riskLevel.replace("-", " ").toUpperCase()} RISK
                  </Badge>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Model Confidence</span>
                    <span className="text-sm font-medium">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={result.confidence * 100} />
                </div>
              </CardContent>
            </Card>

            {/* Contributing Factors */}
            <Card>
              <CardHeader>
                <CardTitle>Contributing Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.factors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                      <div className="flex items-center gap-3">
                        {factor.impact === "negative" ? (
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                        ) : factor.impact === "positive" ? (
                          <CheckCircle className="w-4 h-4 text-accent" />
                        ) : (
                          <Info className="w-4 h-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">{factor.name}</p>
                          <p className="text-sm text-muted-foreground">{factor.value}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          factor.impact === "negative" && "border-destructive text-destructive",
                          factor.impact === "positive" && "border-accent text-accent",
                        )}
                      >
                        {factor.weight > 0 ? `+${factor.weight.toFixed(0)} mmHg` : "Normal"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendation */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Clinical Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={cn("p-4 rounded-lg", getRiskBg(result.riskLevel))}>
                  <p className={cn("text-lg", getRiskColor(result.riskLevel))}>{result.recommendation}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  )
}
