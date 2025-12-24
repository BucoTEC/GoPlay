"use client"

import { AppShell } from "@/components/layout/app-shell"
import { usePatients } from "@/context/patients-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, AlertTriangle, Activity, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { patients } = usePatients()

  const stats = {
    totalPatients: patients.length,
    criticalPatients: patients.filter((p) => p.status === "critical").length,
    highRisk: patients.filter((p) => p.riskLevel === "high").length,
    avgBMI: (patients.reduce((sum, p) => sum + p.bmi, 0) / patients.length).toFixed(1),
  }

  const recentPatients = patients.slice(0, 5)

  return (
    <AppShell title="Dashboard" subtitle="Overview of your clinical practice">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalPatients}</p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-accent">
                <ArrowUpRight className="w-4 h-4" />
                <span>12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical Status</p>
                  <p className="text-3xl font-bold text-foreground">{stats.criticalPatients}</p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-destructive">
                <ArrowUpRight className="w-4 h-4" />
                <span>Requires attention</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Risk Patients</p>
                  <p className="text-3xl font-bold text-foreground">{stats.highRisk}</p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-warning/10">
                  <Activity className="w-6 h-6 text-warning" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <span>Across all risk models</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average BMI</p>
                  <p className="text-3xl font-bold text-foreground">{stats.avgBMI}</p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-accent">
                <ArrowDownRight className="w-4 h-4" />
                <span>2% improvement</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Patients */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/patients/new"
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Add New Patient</p>
                  <p className="text-sm text-muted-foreground">Register a patient</p>
                </div>
              </Link>
              <Link
                href="/ai-agent"
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent text-accent-foreground">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">AI Assistant</p>
                  <p className="text-sm text-muted-foreground">Query patient data</p>
                </div>
              </Link>
              <Link
                href="/models/ckd-risk"
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning text-warning-foreground">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Run Risk Assessment</p>
                  <p className="text-sm text-muted-foreground">CKD, Diabetes, BP</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Patients</CardTitle>
              <Link href="/patients" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <Link
                    key={patient.id}
                    href={`/patients/${patient.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-medium">
                        {patient.firstName[0]}
                        {patient.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {patient.mrn} | Last visit: {patient.lastVisit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
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
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Distribution */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Risk Model Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">CKD Risk (eGFR {"<"} 60)</span>
                    <span className="text-sm text-muted-foreground">
                      {patients.filter((p) => p.egfr < 60).length} patients
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-destructive"
                      style={{
                        width: `${(patients.filter((p) => p.egfr < 60).length / patients.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Diabetes Risk (HbA1c {"≥"} 6.5)</span>
                    <span className="text-sm text-muted-foreground">
                      {patients.filter((p) => p.hba1c >= 6.5).length} patients
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-warning"
                      style={{
                        width: `${(patients.filter((p) => p.hba1c >= 6.5).length / patients.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Hypertension (BP {"≥"} 140/90)</span>
                    <span className="text-sm text-muted-foreground">
                      {patients.filter((p) => p.bloodPressureSystolic >= 140 || p.bloodPressureDiastolic >= 90).length}{" "}
                      patients
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${(patients.filter((p) => p.bloodPressureSystolic >= 140 || p.bloodPressureDiastolic >= 90).length / patients.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Metabolic Syndrome (BMI {"≥"} 30)</span>
                    <span className="text-sm text-muted-foreground">
                      {patients.filter((p) => p.bmi >= 30).length} patients
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-accent"
                      style={{
                        width: `${(patients.filter((p) => p.bmi >= 30).length / patients.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clinical Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/models/metabolic"
                  className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 mb-3">
                    <Activity className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-medium text-foreground">Metabolic Clustering</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    K-means clustering for metabolic syndrome patterns
                  </p>
                </Link>
                <Link
                  href="/models/blood-pressure"
                  className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground">BP Prediction</h3>
                  <p className="text-sm text-muted-foreground mt-1">NHANES-based blood pressure regression model</p>
                </Link>
                <Link
                  href="/models/ckd-risk"
                  className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/10 mb-3">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <h3 className="font-medium text-foreground">CKD Screening</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Binary classification for reduced kidney function
                  </p>
                </Link>
                <Link
                  href="/models/diabetes"
                  className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/10 mb-3">
                    <Activity className="w-5 h-5 text-warning" />
                  </div>
                  <h3 className="font-medium text-foreground">Diabetes Risk</h3>
                  <p className="text-sm text-muted-foreground mt-1">HbA1c inference engine for undiagnosed patients</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
