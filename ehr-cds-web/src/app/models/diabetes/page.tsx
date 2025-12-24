"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { usePatients } from "@/context/patients-context"
import { predictDiabetesRisk, type PredictionResult } from "@/lib/prediction-models"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Heart, AlertTriangle, CheckCircle, Info, ArrowRight, RefreshCw } from "lucide-react"

export default function DiabetesRiskPage() {
  const searchParams = useSearchParams()
  const { patients, getPatient } = usePatients()
  const [selectedPatientId, setSelectedPatientId] = useState<string>("")
  const [result, setResult] = useState<PredictionResult | null>(null)
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
      const prediction = predictDiabetesRisk(selectedPatient)
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
    <AppShell title="Diabetes Risk Prediction" subtitle="HbA1c inference engine for screening undiagnosed patients">
      <div className="space-y-6">
        {/* Model Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-warning/10">
                <Heart className="w-6 h-6 text-warning" />
              </div>
              <div>
                <CardTitle>Diabetes Risk Prediction System</CardTitle>
                <CardDescription>
                  Clinical decision support for screening undiagnosed patients using HbA1c inference
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm font-medium text-muted-foreground">Model Type</p>
                <p className="text-lg font-semibold">HbA1c Inference Engine</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm font-medium text-muted-foreground">Key Predictors</p>
                <p className="text-lg font-semibold">HbA1c, Glucose, BMI, Lipids</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm font-medium text-muted-foreground">Clinical Use</p>
                <p className="text-lg font-semibold">Early Diabetes Detection</p>
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
                    <p className="text-sm text-muted-foreground">HbA1c</p>
                    <p className="text-xl font-semibold">{selectedPatient.hba1c}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fasting Glucose</p>
                    <p className="text-xl font-semibold">{selectedPatient.fastingGlucose} mg/dL</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">BMI</p>
                    <p className="text-xl font-semibold">{selectedPatient.bmi.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Triglycerides</p>
                    <p className="text-xl font-semibold">{selectedPatient.triglycerides} mg/dL</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Risk Score */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div
                    className={cn(
                      "inline-flex items-center justify-center w-32 h-32 rounded-full",
                      getRiskBg(result.riskLevel),
                    )}
                  >
                    <div className="text-center">
                      <p className={cn("text-4xl font-bold", getRiskColor(result.riskLevel))}>{result.score}</p>
                      <p className="text-sm text-muted-foreground">Risk Score</p>
                    </div>
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
                        {factor.weight > 0 ? `+${factor.weight}` : "Normal"}
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
