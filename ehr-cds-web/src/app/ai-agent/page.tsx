"use client"

import { useState, useRef, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { usePatients, type Patient } from "@/context/patients-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  Bot,
  Send,
  User,
  Sparkles,
  Users,
  Activity,
  AlertTriangle,
  Search,
  TrendingUp,
  Heart,
  Droplets,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  data?: {
    type: "patients" | "stats" | "risk"
    patients?: Patient[]
    stats?: Record<string, number | string>
  }
}

const quickActions = [
  { label: "Show all critical patients", icon: AlertTriangle },
  { label: "List high-risk patients for CKD", icon: Droplets },
  { label: "Patients with HbA1c > 6.5%", icon: Heart },
  { label: "Summary statistics", icon: TrendingUp },
  { label: "Find patients with metabolic syndrome", icon: Activity },
  { label: "Patients needing BP intervention", icon: Search },
]

export default function AIAgentPage() {
  const { patients } = usePatients()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your Clinical Decision Support AI assistant. I can help you query patient data, identify at-risk populations, and provide clinical insights. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const processQuery = (query: string): Message => {
    const lowerQuery = query.toLowerCase()
    const response: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
    }

    // Critical patients
    if (lowerQuery.includes("critical")) {
      const criticalPatients = patients.filter((p) => p.status === "critical")
      response.content = `Found ${criticalPatients.length} patient(s) with critical status. These patients require immediate attention.`
      response.data = { type: "patients", patients: criticalPatients }
    }
    // CKD risk
    else if (lowerQuery.includes("ckd") || lowerQuery.includes("kidney") || lowerQuery.includes("egfr")) {
      const ckdRisk = patients.filter((p) => p.egfr < 60)
      response.content = `Found ${ckdRisk.length} patient(s) with eGFR < 60 mL/min/1.73m², indicating potential chronic kidney disease. These patients should be monitored closely and may need nephrology referral.`
      response.data = { type: "patients", patients: ckdRisk }
    }
    // HbA1c / Diabetes
    else if (lowerQuery.includes("hba1c") || lowerQuery.includes("diabetes") || lowerQuery.includes("a1c")) {
      const diabeticPatients = patients.filter((p) => p.hba1c >= 6.5)
      const prediabeticPatients = patients.filter((p) => p.hba1c >= 5.7 && p.hba1c < 6.5)
      response.content = `Diabetes screening results:\n• ${diabeticPatients.length} patient(s) with HbA1c ≥ 6.5% (diabetic range)\n• ${prediabeticPatients.length} patient(s) with HbA1c 5.7-6.4% (pre-diabetic range)\n\nShowing patients in diabetic range:`
      response.data = { type: "patients", patients: diabeticPatients }
    }
    // Blood pressure
    else if (
      lowerQuery.includes("blood pressure") ||
      lowerQuery.includes("bp") ||
      lowerQuery.includes("hypertension")
    ) {
      const hypertensive = patients.filter((p) => p.bloodPressureSystolic >= 140 || p.bloodPressureDiastolic >= 90)
      response.content = `Found ${hypertensive.length} patient(s) with blood pressure ≥ 140/90 mmHg, meeting criteria for hypertension. Consider medication adjustment or lifestyle intervention.`
      response.data = { type: "patients", patients: hypertensive }
    }
    // Metabolic syndrome
    else if (lowerQuery.includes("metabolic") || lowerQuery.includes("syndrome")) {
      const metabolicSyndrome = patients.filter((p) => {
        let criteria = 0
        if (p.bmi >= 30) criteria++
        if (p.bloodPressureSystolic >= 130 || p.bloodPressureDiastolic >= 85) criteria++
        if (p.triglycerides >= 150) criteria++
        if (p.hdlCholesterol < 40) criteria++
        if (p.fastingGlucose >= 100) criteria++
        return criteria >= 3
      })
      response.content = `Found ${metabolicSyndrome.length} patient(s) meeting ≥3 criteria for metabolic syndrome (elevated BMI, BP, triglycerides, fasting glucose, or low HDL). These patients benefit from aggressive lifestyle intervention.`
      response.data = { type: "patients", patients: metabolicSyndrome }
    }
    // Statistics
    else if (lowerQuery.includes("statistics") || lowerQuery.includes("summary") || lowerQuery.includes("overview")) {
      const stats = {
        total: patients.length,
        critical: patients.filter((p) => p.status === "critical").length,
        highRisk: patients.filter((p) => p.riskLevel === "high").length,
        avgBMI: (patients.reduce((sum, p) => sum + p.bmi, 0) / patients.length).toFixed(1),
        avgHbA1c: (patients.reduce((sum, p) => sum + p.hba1c, 0) / patients.length).toFixed(1),
        avgEGFR: Math.round(patients.reduce((sum, p) => sum + p.egfr, 0) / patients.length),
        diabetic: patients.filter((p) => p.hba1c >= 6.5).length,
        ckdRisk: patients.filter((p) => p.egfr < 60).length,
      }
      response.content = `**Population Statistics:**\n• Total patients: ${stats.total}\n• Critical status: ${stats.critical}\n• High risk: ${stats.highRisk}\n• Average BMI: ${stats.avgBMI}\n• Average HbA1c: ${stats.avgHbA1c}%\n• Average eGFR: ${stats.avgEGFR}\n• Diabetic (HbA1c ≥ 6.5%): ${stats.diabetic}\n• CKD risk (eGFR < 60): ${stats.ckdRisk}`
      response.data = { type: "stats", stats }
    }
    // High risk
    else if (lowerQuery.includes("high risk") || lowerQuery.includes("high-risk")) {
      const highRiskPatients = patients.filter((p) => p.riskLevel === "high")
      response.content = `Found ${highRiskPatients.length} patient(s) classified as high risk based on their clinical profile. These patients should be prioritized for intervention.`
      response.data = { type: "patients", patients: highRiskPatients }
    }
    // All patients
    else if (
      lowerQuery.includes("all patients") ||
      lowerQuery.includes("list all") ||
      lowerQuery.includes("show all")
    ) {
      response.content = `Here are all ${patients.length} patients in the system:`
      response.data = { type: "patients", patients }
    }
    // Default response
    else {
      response.content = `I can help you with:\n• Finding critical or high-risk patients\n• CKD risk screening (eGFR < 60)\n• Diabetes screening (HbA1c levels)\n• Blood pressure/hypertension analysis\n• Metabolic syndrome identification\n• Population statistics and summaries\n\nTry asking something like "Show all critical patients" or "List patients with HbA1c > 6.5%"`
    }

    return response
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI processing delay
    setTimeout(() => {
      const response = processQuery(input)
      setMessages((prev) => [...prev, response])
      setIsLoading(false)
    }, 800)
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
    handleSend()
  }

  return (
    <AppShell title="AI Assistant" subtitle="Query patient data with natural language">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 h-[calc(100vh-12rem)]">
        {/* Quick Actions Sidebar */}
        <Card className="lg:col-span-1 hidden lg:flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="w-4 h-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-3 bg-transparent"
                  onClick={() => {
                    setInput(action.label)
                    setTimeout(() => {
                      const userMessage: Message = {
                        id: Date.now().toString(),
                        role: "user",
                        content: action.label,
                        timestamp: new Date(),
                      }
                      setMessages((prev) => [...prev, userMessage])
                      setIsLoading(true)
                      setTimeout(() => {
                        const response = processQuery(action.label)
                        setMessages((prev) => [...prev, response])
                        setIsLoading(false)
                      }, 800)
                    }, 100)
                  }}
                >
                  <action.icon className="w-4 h-4 mr-2 shrink-0" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Clinical AI Agent</CardTitle>
                <p className="text-sm text-muted-foreground">Powered by patient data analysis</p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                <Users className="w-3 h-3 mr-1" />
                {patients.length} patients
              </Badge>
            </div>
          </CardHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-4",
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary",
                    )}
                  >
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>

                    {/* Render patient data cards */}
                    {message.data?.patients && message.data.patients.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.data.patients.slice(0, 5).map((patient) => (
                          <div
                            key={patient.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-background/50"
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                {patient.firstName[0]}
                                {patient.lastName[0]}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {patient.firstName} {patient.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground">{patient.mrn}</p>
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
                                className="text-xs"
                              >
                                {patient.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        {message.data.patients.length > 5 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            + {message.data.patients.length - 5} more patients
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-secondary rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-100" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your patients..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
