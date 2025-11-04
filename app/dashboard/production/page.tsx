"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Search, Cog, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export interface ProductionStage {
  id: string
  aircraftId: string
  aircraftModel: string
  stageName: string
  stageNumber: number
  status: "Not Started" | "In Progress" | "Completed" | "Delayed"
  assignedTo: string
  startDate?: string
  endDate?: string
  estimatedDuration: number
  actualDuration?: number
  notes?: string
  completionPercentage: number
}

const initialStages: ProductionStage[] = [
  {
    id: "1",
    aircraftId: "1",
    aircraftModel: "A320neo",
    stageName: "Fuselage Assembly",
    stageNumber: 1,
    status: "Completed",
    assignedTo: "John Engineer",
    startDate: "2024-01-15",
    endDate: "2024-02-10",
    estimatedDuration: 25,
    actualDuration: 26,
    completionPercentage: 100,
    notes: "Completed with minor delays due to part delivery",
  },
  {
    id: "2",
    aircraftId: "1",
    aircraftModel: "A320neo",
    stageName: "Wing Integration",
    stageNumber: 2,
    status: "In Progress",
    assignedTo: "John Engineer",
    startDate: "2024-02-11",
    estimatedDuration: 20,
    completionPercentage: 65,
    notes: "On schedule, hydraulic systems being installed",
  },
  {
    id: "3",
    aircraftId: "1",
    aircraftModel: "A320neo",
    stageName: "Engine Installation",
    stageNumber: 3,
    status: "Not Started",
    assignedTo: "John Engineer",
    estimatedDuration: 15,
    completionPercentage: 0,
  },
  {
    id: "4",
    aircraftId: "2",
    aircraftModel: "F-35 Lightning II",
    stageName: "Avionics Integration",
    stageNumber: 4,
    status: "In Progress",
    assignedTo: "John Engineer",
    startDate: "2024-02-20",
    estimatedDuration: 30,
    completionPercentage: 80,
    notes: "Final testing of flight control systems",
  },
  {
    id: "5",
    aircraftId: "2",
    aircraftModel: "F-35 Lightning II",
    stageName: "Weapons Systems",
    stageNumber: 5,
    status: "Delayed",
    assignedTo: "John Engineer",
    startDate: "2024-02-15",
    estimatedDuration: 25,
    actualDuration: 30,
    completionPercentage: 45,
    notes: "Delayed due to supplier issues with targeting systems",
  },
]

export default function ProductionPage() {
  const { user } = useAuth()
  const [stages, setStages] = useState<ProductionStage[]>(initialStages)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingStage, setEditingStage] = useState<ProductionStage | null>(null)
  const [formData, setFormData] = useState<Partial<ProductionStage>>({
    aircraftModel: "",
    stageName: "",
    stageNumber: 1,
    status: "Not Started",
    assignedTo: "",
    estimatedDuration: 0,
    completionPercentage: 0,
    notes: "",
  })

  const canEdit = user?.role === "Administrator" || user?.role === "Engineer"

  const filteredStages = stages.filter((s) => {
    const matchesSearch =
      s.aircraftModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.stageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAdd = () => {
    const newStage: ProductionStage = {
      id: Date.now().toString(),
      aircraftId: Date.now().toString(),
      aircraftModel: formData.aircraftModel || "",
      stageName: formData.stageName || "",
      stageNumber: formData.stageNumber || 1,
      status: formData.status as ProductionStage["status"],
      assignedTo: formData.assignedTo || "",
      estimatedDuration: formData.estimatedDuration || 0,
      completionPercentage: formData.completionPercentage || 0,
      notes: formData.notes,
      startDate: formData.startDate,
    }
    setStages([...stages, newStage])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEdit = () => {
    if (!editingStage) return
    setStages(stages.map((s) => (s.id === editingStage.id ? { ...editingStage, ...formData } : s)))
    setIsEditDialogOpen(false)
    setEditingStage(null)
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this production stage?")) {
      setStages(stages.filter((s) => s.id !== id))
    }
  }

  const openEditDialog = (stage: ProductionStage) => {
    setEditingStage(stage)
    setFormData(stage)
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      aircraftModel: "",
      stageName: "",
      stageNumber: 1,
      status: "Not Started",
      assignedTo: "",
      estimatedDuration: 0,
      completionPercentage: 0,
      notes: "",
    })
  }

  const getStatusIcon = (status: ProductionStage["status"]) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "Delayed":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: ProductionStage["status"]) => {
    switch (status) {
      case "Not Started":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
      case "In Progress":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "Completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "Delayed":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
    }
  }

  const stats = {
    total: stages.length,
    inProgress: stages.filter((s) => s.status === "In Progress").length,
    completed: stages.filter((s) => s.status === "Completed").length,
    delayed: stages.filter((s) => s.status === "Delayed").length,
  }

  const avgCompletion =
    stages.length > 0 ? Math.round(stages.reduce((sum, s) => sum + s.completionPercentage, 0) / stages.length) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Production Stages</h1>
        <p className="text-muted-foreground mt-2">Track and manage aircraft production workflow</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Stages</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl text-blue-500">{stats.inProgress}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl text-green-500">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Delayed</CardDescription>
            <CardTitle className="text-3xl text-destructive">{stats.delayed}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>Average completion across all production stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-medium">{avgCompletion}%</span>
            </div>
            <Progress value={avgCompletion} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Production Stages</CardTitle>
              <CardDescription>View and manage all production stages</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              {canEdit && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Stage
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add Production Stage</DialogTitle>
                      <DialogDescription>Enter the details for the new production stage</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="aircraftModel">Aircraft Model</Label>
                        <Input
                          id="aircraftModel"
                          value={formData.aircraftModel}
                          onChange={(e) => setFormData({ ...formData, aircraftModel: e.target.value })}
                          placeholder="e.g., A320neo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stageName">Stage Name</Label>
                        <Input
                          id="stageName"
                          value={formData.stageName}
                          onChange={(e) => setFormData({ ...formData, stageName: e.target.value })}
                          placeholder="e.g., Fuselage Assembly"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stageNumber">Stage Number</Label>
                        <Input
                          id="stageNumber"
                          type="number"
                          value={formData.stageNumber}
                          onChange={(e) =>
                            setFormData({ ...formData, stageNumber: Number.parseInt(e.target.value) || 1 })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) =>
                            setFormData({ ...formData, status: value as ProductionStage["status"] })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Not Started">Not Started</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Delayed">Delayed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignedTo">Assigned To</Label>
                        <Input
                          id="assignedTo"
                          value={formData.assignedTo}
                          onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                          placeholder="e.g., John Engineer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estimatedDuration">Estimated Duration (days)</Label>
                        <Input
                          id="estimatedDuration"
                          type="number"
                          value={formData.estimatedDuration}
                          onChange={(e) =>
                            setFormData({ ...formData, estimatedDuration: Number.parseInt(e.target.value) || 0 })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="completionPercentage">Completion %</Label>
                        <Input
                          id="completionPercentage"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.completionPercentage}
                          onChange={(e) =>
                            setFormData({ ...formData, completionPercentage: Number.parseInt(e.target.value) || 0 })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="Optional notes"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAdd}>Add Stage</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aircraft</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Duration</TableHead>
                  {canEdit && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canEdit ? 7 : 6} className="text-center py-8 text-muted-foreground">
                      <Cog className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>No production stages found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStages.map((stage) => (
                    <TableRow key={stage.id}>
                      <TableCell className="font-medium">{stage.aircraftModel}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{stage.stageName}</div>
                          <div className="text-xs text-muted-foreground">Stage {stage.stageNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(stage.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(stage.status)}
                            {stage.status}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>{stage.assignedTo}</TableCell>
                      <TableCell>
                        <div className="space-y-1 min-w-[120px]">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{stage.completionPercentage}%</span>
                          </div>
                          <Progress value={stage.completionPercentage} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{stage.estimatedDuration} days</div>
                          {stage.actualDuration && (
                            <div className="text-xs text-muted-foreground">Actual: {stage.actualDuration} days</div>
                          )}
                        </div>
                      </TableCell>
                      {canEdit && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(stage)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(stage.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Production Stage</DialogTitle>
            <DialogDescription>Update the production stage details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-aircraftModel">Aircraft Model</Label>
              <Input
                id="edit-aircraftModel"
                value={formData.aircraftModel}
                onChange={(e) => setFormData({ ...formData, aircraftModel: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-stageName">Stage Name</Label>
              <Input
                id="edit-stageName"
                value={formData.stageName}
                onChange={(e) => setFormData({ ...formData, stageName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-stageNumber">Stage Number</Label>
              <Input
                id="edit-stageNumber"
                type="number"
                value={formData.stageNumber}
                onChange={(e) => setFormData({ ...formData, stageNumber: Number.parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as ProductionStage["status"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-assignedTo">Assigned To</Label>
              <Input
                id="edit-assignedTo"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-estimatedDuration">Estimated Duration (days)</Label>
              <Input
                id="edit-estimatedDuration"
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-completionPercentage">Completion %</Label>
              <Input
                id="edit-completionPercentage"
                type="number"
                min="0"
                max="100"
                value={formData.completionPercentage}
                onChange={(e) =>
                  setFormData({ ...formData, completionPercentage: Number.parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-startDate">Start Date</Label>
              <Input
                id="edit-startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
