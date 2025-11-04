"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Pencil, Trash2, Search, Plane } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"

export interface Aircraft {
  id: string
  model: string
  serialNumber: string
  type: "Commercial" | "Military" | "Private"
  status: "Planning" | "In Production" | "Testing" | "Completed"
  startDate: string
  completionDate?: string
  assignedEngineer?: string
}

const initialAircraft: Aircraft[] = [
  {
    id: "1",
    model: "A320neo",
    serialNumber: "AC-2024-001",
    type: "Commercial",
    status: "In Production",
    startDate: "2024-01-15",
    assignedEngineer: "John Engineer",
  },
  {
    id: "2",
    model: "F-35 Lightning II",
    serialNumber: "AC-2024-002",
    type: "Military",
    status: "Testing",
    startDate: "2023-11-20",
    assignedEngineer: "John Engineer",
  },
  {
    id: "3",
    model: "Gulfstream G650",
    serialNumber: "AC-2024-003",
    type: "Private",
    status: "Planning",
    startDate: "2024-02-01",
  },
]

export default function AircraftPage() {
  const { user } = useAuth()
  const [aircraft, setAircraft] = useState<Aircraft[]>(initialAircraft)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAircraft, setEditingAircraft] = useState<Aircraft | null>(null)
  const [formData, setFormData] = useState<Partial<Aircraft>>({
    model: "",
    serialNumber: "",
    type: "Commercial",
    status: "Planning",
    startDate: new Date().toISOString().split("T")[0],
  })

  const canEdit = user?.role === "Administrator" || user?.role === "Engineer"

  const filteredAircraft = aircraft.filter(
    (a) =>
      a.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAdd = () => {
    const newAircraft: Aircraft = {
      id: Date.now().toString(),
      model: formData.model || "",
      serialNumber: formData.serialNumber || "",
      type: formData.type as Aircraft["type"],
      status: formData.status as Aircraft["status"],
      startDate: formData.startDate || "",
    }
    setAircraft([...aircraft, newAircraft])
    setIsAddDialogOpen(false)
    setFormData({
      model: "",
      serialNumber: "",
      type: "Commercial",
      status: "Planning",
      startDate: new Date().toISOString().split("T")[0],
    })
  }

  const handleEdit = () => {
    if (!editingAircraft) return
    setAircraft(aircraft.map((a) => (a.id === editingAircraft.id ? { ...editingAircraft, ...formData } : a)))
    setIsEditDialogOpen(false)
    setEditingAircraft(null)
    setFormData({
      model: "",
      serialNumber: "",
      type: "Commercial",
      status: "Planning",
      startDate: new Date().toISOString().split("T")[0],
    })
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this aircraft?")) {
      setAircraft(aircraft.filter((a) => a.id !== id))
    }
  }

  const openEditDialog = (aircraft: Aircraft) => {
    setEditingAircraft(aircraft)
    setFormData(aircraft)
    setIsEditDialogOpen(true)
  }

  const getStatusColor = (status: Aircraft["status"]) => {
    switch (status) {
      case "Planning":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "In Production":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "Testing":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20"
      case "Completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
    }
  }

  const stats = {
    total: aircraft.length,
    inProduction: aircraft.filter((a) => a.status === "In Production").length,
    testing: aircraft.filter((a) => a.status === "Testing").length,
    completed: aircraft.filter((a) => a.status === "Completed").length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Aircraft Management</h1>
        <p className="text-muted-foreground mt-2">Manage and track all aircraft in production</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Aircraft</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>In Production</CardDescription>
            <CardTitle className="text-3xl">{stats.inProduction}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Testing</CardDescription>
            <CardTitle className="text-3xl">{stats.testing}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Aircraft List</CardTitle>
              <CardDescription>View and manage all aircraft records</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search aircraft..."
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
                      Add Aircraft
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Aircraft</DialogTitle>
                      <DialogDescription>Enter the details for the new aircraft</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Input
                          id="model"
                          value={formData.model}
                          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                          placeholder="e.g., A320neo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="serialNumber">Serial Number</Label>
                        <Input
                          id="serialNumber"
                          value={formData.serialNumber}
                          onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                          placeholder="e.g., AC-2024-001"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value) => setFormData({ ...formData, type: value as Aircraft["type"] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Commercial">Commercial</SelectItem>
                            <SelectItem value="Military">Military</SelectItem>
                            <SelectItem value="Private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => setFormData({ ...formData, status: value as Aircraft["status"] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Planning">Planning</SelectItem>
                            <SelectItem value="In Production">In Production</SelectItem>
                            <SelectItem value="Testing">Testing</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
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
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAdd}>Add Aircraft</Button>
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
                  <TableHead>Model</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Engineer</TableHead>
                  {canEdit && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAircraft.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canEdit ? 7 : 6} className="text-center py-8 text-muted-foreground">
                      <Plane className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>No aircraft found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAircraft.map((aircraft) => (
                    <TableRow key={aircraft.id}>
                      <TableCell className="font-medium">{aircraft.model}</TableCell>
                      <TableCell className="font-mono text-sm">{aircraft.serialNumber}</TableCell>
                      <TableCell>{aircraft.type}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(aircraft.status)}>
                          {aircraft.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(aircraft.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{aircraft.assignedEngineer || "-"}</TableCell>
                      {canEdit && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(aircraft)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(aircraft.id)}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Aircraft</DialogTitle>
            <DialogDescription>Update the aircraft details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-model">Model</Label>
              <Input
                id="edit-model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-serialNumber">Serial Number</Label>
              <Input
                id="edit-serialNumber"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as Aircraft["type"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Military">Military</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Aircraft["status"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Production">In Production</SelectItem>
                  <SelectItem value="Testing">Testing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
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
