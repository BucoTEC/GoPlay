"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { usePatients } from "@/context/patients-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewPatientPage() {
  const router = useRouter()
  const { addPatient } = usePatients()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "male" as "male" | "female" | "other",
    email: "",
    phone: "",
    address: "",
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    heartRate: 72,
    weight: 70,
    height: 170,
    hba1c: 5.5,
    fastingGlucose: 95,
    totalCholesterol: 180,
    ldlCholesterol: 100,
    hdlCholesterol: 55,
    triglycerides: 120,
    creatinine: 1.0,
    egfr: 90,
    albumin: 15,
    smoker: false,
    diabetesHistory: false,
    hypertensionHistory: false,
    familyHistoryCardiac: false,
  })

  const calculateBMI = () => {
    const heightM = formData.height / 100
    return formData.weight / (heightM * heightM)
  }

  const determineRiskLevel = () => {
    let riskScore = 0
    if (formData.hba1c >= 6.5) riskScore += 2
    if (formData.egfr < 60) riskScore += 2
    if (formData.bloodPressureSystolic >= 140) riskScore += 1
    if (calculateBMI() >= 30) riskScore += 1
    if (formData.smoker) riskScore += 1
    if (formData.diabetesHistory) riskScore += 1
    if (formData.familyHistoryCardiac) riskScore += 1

    if (riskScore >= 4) return "high"
    if (riskScore >= 2) return "moderate"
    return "low"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const bmi = calculateBMI()
      const riskLevel = determineRiskLevel()
      const mrn = `MRN-${String(Math.floor(Math.random() * 900000) + 100000)}`

      addPatient({
        ...formData,
        mrn,
        bmi,
        riskLevel,
        status: riskLevel === "high" ? "critical" : "active",
        lastVisit: new Date().toISOString().split("T")[0],
      })

      toast.success("Patient created successfully")
      router.push("/patients")
    } catch (error) {
      toast.error("Failed to create patient")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell title="Add New Patient" subtitle="Register a new patient in the system">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/patients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Patients
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: "male" | "female" | "other") => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Vitals */}
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="systolic">Systolic BP (mmHg)</Label>
                <Input
                  id="systolic"
                  type="number"
                  value={formData.bloodPressureSystolic}
                  onChange={(e) => setFormData({ ...formData, bloodPressureSystolic: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diastolic">Diastolic BP (mmHg)</Label>
                <Input
                  id="diastolic"
                  type="number"
                  value={formData.bloodPressureDiastolic}
                  onChange={(e) => setFormData({ ...formData, bloodPressureDiastolic: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  value={formData.heartRate}
                  onChange={(e) => setFormData({ ...formData, heartRate: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Calculated BMI</Label>
                <div className="flex items-center h-10 px-3 rounded-md bg-secondary text-foreground">
                  {calculateBMI().toFixed(1)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lab Values */}
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Values</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="hba1c">HbA1c (%)</Label>
                <Input
                  id="hba1c"
                  type="number"
                  step="0.1"
                  value={formData.hba1c}
                  onChange={(e) => setFormData({ ...formData, hba1c: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fastingGlucose">Fasting Glucose (mg/dL)</Label>
                <Input
                  id="fastingGlucose"
                  type="number"
                  value={formData.fastingGlucose}
                  onChange={(e) => setFormData({ ...formData, fastingGlucose: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalCholesterol">Total Cholesterol (mg/dL)</Label>
                <Input
                  id="totalCholesterol"
                  type="number"
                  value={formData.totalCholesterol}
                  onChange={(e) => setFormData({ ...formData, totalCholesterol: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ldl">LDL Cholesterol (mg/dL)</Label>
                <Input
                  id="ldl"
                  type="number"
                  value={formData.ldlCholesterol}
                  onChange={(e) => setFormData({ ...formData, ldlCholesterol: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hdl">HDL Cholesterol (mg/dL)</Label>
                <Input
                  id="hdl"
                  type="number"
                  value={formData.hdlCholesterol}
                  onChange={(e) => setFormData({ ...formData, hdlCholesterol: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="triglycerides">Triglycerides (mg/dL)</Label>
                <Input
                  id="triglycerides"
                  type="number"
                  value={formData.triglycerides}
                  onChange={(e) => setFormData({ ...formData, triglycerides: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="creatinine">Creatinine (mg/dL)</Label>
                <Input
                  id="creatinine"
                  type="number"
                  step="0.1"
                  value={formData.creatinine}
                  onChange={(e) => setFormData({ ...formData, creatinine: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="egfr">eGFR (mL/min/1.73m²)</Label>
                <Input
                  id="egfr"
                  type="number"
                  value={formData.egfr}
                  onChange={(e) => setFormData({ ...formData, egfr: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="albumin">Urine Albumin (mg/L)</Label>
                <Input
                  id="albumin"
                  type="number"
                  value={formData.albumin}
                  onChange={(e) => setFormData({ ...formData, albumin: Number(e.target.value) })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Risk Factors */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Factors</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="smoker">Current Smoker</Label>
                <Switch
                  id="smoker"
                  checked={formData.smoker}
                  onCheckedChange={(checked) => setFormData({ ...formData, smoker: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="diabetesHistory">History of Diabetes</Label>
                <Switch
                  id="diabetesHistory"
                  checked={formData.diabetesHistory}
                  onCheckedChange={(checked) => setFormData({ ...formData, diabetesHistory: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="hypertensionHistory">History of Hypertension</Label>
                <Switch
                  id="hypertensionHistory"
                  checked={formData.hypertensionHistory}
                  onCheckedChange={(checked) => setFormData({ ...formData, hypertensionHistory: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="familyHistoryCardiac">Family History of Cardiac Disease</Label>
                <Switch
                  id="familyHistoryCardiac"
                  checked={formData.familyHistoryCardiac}
                  onCheckedChange={(checked) => setFormData({ ...formData, familyHistoryCardiac: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link href="/patients">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Patient"}
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
