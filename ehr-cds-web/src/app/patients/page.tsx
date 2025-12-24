"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { usePatients, type Patient } from "@/context/patients-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Search, MoreHorizontal, Eye, Pencil, Trash2, Filter, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function PatientsPage() {
  const { patients, loading, error, pagination, filters, setFilters, deletePatient, refreshPatients } = usePatients()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterRisk, setFilterRisk] = useState<string>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || patient.status === filterStatus
    const matchesRisk = filterRisk === "all" || patient.riskLevel === filterRisk
    return matchesSearch && matchesStatus && matchesRisk
  })

  const handleDelete = async () => {
    if (patientToDelete) {
      setIsDeleting(true)
      try {
        await deletePatient(patientToDelete.id)
        toast.success(`Patient ${patientToDelete.firstName} ${patientToDelete.lastName} deleted`)
        setDeleteDialogOpen(false)
        setPatientToDelete(null)
      } catch {
        toast.error("Failed to delete patient")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage })
  }

  if (error) {
    return (
      <AppShell title="Patients" subtitle="Manage your patient records">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-destructive mb-4">Error loading patients: {error}</p>
            <Button onClick={refreshPatients}>Retry</Button>
          </CardContent>
        </Card>
      </AppShell>
    )
  }

  return (
    <AppShell title="Patients" subtitle="Manage your patient records">
      <div className="space-y-6">
        {/* Filters & Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or MRN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Status: {filterStatus === "all" ? "All" : filterStatus}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterStatus("all")}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>Inactive</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("critical")}>Critical</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Risk: {filterRisk === "all" ? "All" : filterRisk}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterRisk("all")}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRisk("low")}>Low</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRisk("moderate")}>Moderate</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRisk("high")}>High</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link href="/patients/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Patient
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Records ({pagination.total})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>MRN</TableHead>
                    <TableHead>Age/Gender</TableHead>
                    <TableHead>Vitals</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => {
                    const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
                    return (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                              {patient.firstName[0]}
                              {patient.lastName[0]}
                            </div>
                            <div>
                              <p className="font-medium">
                                {patient.firstName} {patient.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">{patient.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{patient.mrn}</TableCell>
                        <TableCell>
                          {age}y / {patient.gender === "male" ? "M" : patient.gender === "female" ? "F" : "O"}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>
                              BP: {patient.bloodPressureSystolic || "N/A"}/{patient.bloodPressureDiastolic || "N/A"}
                            </p>
                            <p className="text-muted-foreground">BMI: {patient.bmi ? patient.bmi.toFixed(1) : "N/A"}</p>
                          </div>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
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
                            {patient.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{patient.lastVisit}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/patients/${patient.id}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/patients/${patient.id}/edit`}>
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setPatientToDelete(patient)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing page {pagination.page} of {pagination.pages} ({pagination.total} patients)
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1 || loading}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages || loading}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Patient</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {patientToDelete?.firstName} {patientToDelete?.lastName}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
