"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { usePatients } from "@/context/patients-context"
import { clusterMetabolicSyndrome, type ClusterResult } from "@/lib/prediction-models"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { FlaskConical, ArrowRight, RefreshCw, CheckCircle, XCircle, Users } from "lucide-react"

export default function MetabolicClusteringPage() {
  const searchParams = useSearchParams()
  const { patients, getPatient } = usePatients()
  const [selectedPatientId, setSelectedPatientId] = useState<string>("")
  const [result, setResult] = useState<ClusterResult | null>(null)
  const [populationResults, setPopulationResults] = useState<
    { patient: (typeof patients)[0]; cluster: ClusterResult }[]
  >([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showPopulation, setShowPopulation] = useState(false)

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
      const clusterResult = clusterMetabolicSyndrome(selectedPatient)
      setResult(clusterResult)
      setIsAnalyzing(false)
    }, 1500)
  }

  const runPopulationAnalysis = () => {
    setIsAnalyzing(true)
    setShowPopulation(true)

    setTimeout(() => {
      const results = patients.map((patient) => ({
        patient,
        cluster: clusterMetabolicSyndrome(patient),
      }))
      setPopulationResults(results)
      setIsAnalyzing(false)
    }, 2000)
  }

  const getRiskColor = (level: ClusterResult["riskLevel"]) => {
    switch (level) {
      case "low":
        return "text-accent"
      case "moderate":
        return "text-warning"
      case "high":
        return "text-destructive"
    }
  }

  const getRiskBg = (level: ClusterResult["riskLevel"]) => {
    switch (level) {
      case "low":
        return "bg-accent/10"
      case "moderate":
        return "bg-warning/10"
      case "high":
        return "bg-destructive/10"
    }
  }

  const clusterCounts = populationResults.reduce(
    (acc, { cluster }) => {
      acc[cluster.cluster] = (acc[cluster.cluster] || 0) + 1
      return acc
    },
    {} as Record<number, number>,
  )

  return (
    <AppShell
      title="Metabolic Syndrome Clustering"
      subtitle="K-means clustering for metabolic syndrome pattern identification"
    >
      <div className="space-y-6">
        {/* Model Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10">
                <FlaskConical className="w-6 h-6 text-accent" />
              </div>
              <div>
                <CardTitle>Metabolic Syndrome Clustering Model</CardTitle>
                <CardDescription>
                  Identifies metabolic syndrome patterns using ATP III criteria clustering
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm font-medium text-muted-foreground">Model Type</p>
                <p className="text-lg font-semibold">K-Means Clustering</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm font-medium text-muted-foreground">Clusters</p>
                <p className="text-lg font-semibold">4 Groups</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm font-medium text-muted-foreground">Criteria</p>
                <p className="text-lg font-semibold">ATP III Guidelines</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm font-medium text-muted-foreground">Clinical Use</p>
                <p className="text-lg font-semibold">Risk Stratification</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Options */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Individual Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Individual Patient Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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

                {selectedPatient && (
                  <div className="p-4 rounded-lg bg-secondary">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">BMI</p>
                        <p className="font-semibold">{selectedPatient.bmi.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Triglycerides</p>
                        <p className="font-semibold">{selectedPatient.triglycerides} mg/dL</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">HDL</p>
                        <p className="font-semibold">{selectedPatient.hdlCholesterol} mg/dL</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fasting Glucose</p>
                        <p className="font-semibold">{selectedPatient.fastingGlucose} mg/dL</p>
                      </div>
                    </div>
                  </div>
                )}

                <Button onClick={runAnalysis} disabled={!selectedPatient || isAnalyzing} className="w-full">
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Patient
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Population Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Population Clustering</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Analyze all patients to identify metabolic syndrome clusters and population distribution.
                </p>

                <div className="p-4 rounded-lg bg-secondary">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{patients.length} Patients</p>
                      <p className="text-sm text-muted-foreground">Available for clustering</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={runPopulationAnalysis}
                  disabled={isAnalyzing}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Clustering...
                    </>
                  ) : (
                    <>
                      Run Population Analysis
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Individual Result */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Clustering Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className={cn("p-6 rounded-lg text-center", getRiskBg(result.riskLevel))}>
                  <p className="text-sm text-muted-foreground mb-2">Assigned Cluster</p>
                  <p className={cn("text-4xl font-bold mb-2", getRiskColor(result.riskLevel))}>{result.cluster}</p>
                  <Badge
                    className={cn(
                      result.riskLevel === "low" && "bg-accent text-accent-foreground",
                      result.riskLevel === "moderate" && "bg-warning text-warning-foreground",
                      result.riskLevel === "high" && "bg-destructive text-destructive-foreground",
                    )}
                  >
                    {result.clusterName}
                  </Badge>
                </div>

                <div className="lg:col-span-2 p-4 rounded-lg bg-secondary">
                  <p className="font-medium mb-3">Metabolic Syndrome Criteria ({result.patientCount}/5 met)</p>
                  <div className="space-y-2">
                    {result.characteristics.map((char, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {char.includes("No metabolic") ? (
                          <CheckCircle className="w-4 h-4 text-accent" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive" />
                        )}
                        <span className="text-sm">{char}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Population Results */}
        {showPopulation && populationResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Population Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
                <div className="p-4 rounded-lg bg-accent/10 text-center">
                  <p className="text-3xl font-bold text-accent">{clusterCounts[1] || 0}</p>
                  <p className="text-sm text-muted-foreground">Metabolically Healthy</p>
                </div>
                <div className="p-4 rounded-lg bg-warning/10 text-center">
                  <p className="text-3xl font-bold text-warning">{clusterCounts[2] || 0}</p>
                  <p className="text-sm text-muted-foreground">At-Risk / Pre-Metabolic</p>
                </div>
                <div className="p-4 rounded-lg bg-destructive/10 text-center">
                  <p className="text-3xl font-bold text-destructive">{clusterCounts[3] || 0}</p>
                  <p className="text-sm text-muted-foreground">Metabolic Syndrome</p>
                </div>
                <div className="p-4 rounded-lg bg-destructive/20 text-center">
                  <p className="text-3xl font-bold text-destructive">{clusterCounts[4] || 0}</p>
                  <p className="text-sm text-muted-foreground">Severe Metabolic</p>
                </div>
              </div>

              <div className="space-y-2">
                {populationResults.map(({ patient, cluster }) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {patient.firstName[0]}
                        {patient.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{patient.mrn}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={cn(
                          cluster.riskLevel === "low" && "bg-accent text-accent-foreground",
                          cluster.riskLevel === "moderate" && "bg-warning text-warning-foreground",
                          cluster.riskLevel === "high" && "bg-destructive text-destructive-foreground",
                        )}
                      >
                        Cluster {cluster.cluster}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{cluster.clusterName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
