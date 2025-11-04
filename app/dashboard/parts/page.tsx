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
import { Plus, Pencil, Trash2, Search, Package, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"

export interface Part {
  id: string
  name: string
  partNumber: string
  category: "Engine" | "Avionics" | "Structural" | "Hydraulic" | "Electrical" | "Interior"
  supplier: string
  quantity: number
  minQuantity: number
  unitPrice: number
  location: string
  description?: string
}

const initialParts: Part[] = [
  {
    id: "1",
    name: "Turbofan Engine",
    partNumber: "ENG-TF-001",
    category: "Engine",
    supplier: "Pratt & Whitney",
    quantity: 8,
    minQuantity: 5,
    unitPrice: 12500000,
    location: "Warehouse A-1",
    description: "High-efficiency turbofan engine for commercial aircraft",
  },
  {
    id: "2",
    name: "Flight Control Computer",
    partNumber: "AVI-FCC-002",
    category: "Avionics",
    supplier: "Honeywell Aerospace",
    quantity: 15,
    minQuantity: 10,
    unitPrice: 450000,
    location: "Warehouse B-3",
    description: "Primary flight control computer system",
  },
  {
    id: "3",
    name: "Wing Spar Assembly",
    partNumber: "STR-WSA-003",
    category: "Structural",
    supplier: "Spirit AeroSystems",
    quantity: 3,
    minQuantity: 5,
    unitPrice: 2800000,
    location: "Warehouse A-2",
    description: "Main wing structural component",
  },
  {
    id: "4",
    name: "Hydraulic Pump",
    partNumber: "HYD-PMP-004",
    category: "Hydraulic",
    supplier: "Parker Aerospace",
    quantity: 25,
    minQuantity: 15,
    unitPrice: 85000,
    location: "Warehouse C-1",
  },
  {
    id: "5",
    name: "Wiring Harness",
    partNumber: "ELC-WH-005",
    category: "Electrical",
    supplier: "TE Connectivity",
    quantity: 50,
    minQuantity: 30,
    unitPrice: 12000,
    location: "Warehouse B-1",
  },
]

export default function PartsPage() {
  const { user } = useAuth()
  const [parts, setParts] = useState<Part[]>(initialParts)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPart, setEditingPart] = useState<Part | null>(null)
  const [formData, setFormData] = useState<Partial<Part>>({
    name: "",
    partNumber: "",
    category: "Engine",
    supplier: "",
    quantity: 0,
    minQuantity: 0,
    unitPrice: 0,
    location: "",
    description: "",
  })

  const canEdit = user?.role === "Administrator" || user?.role === "Engineer"

  const filteredParts = parts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleAdd = () => {
    const newPart: Part = {
      id: Date.now().toString(),
      name: formData.name || "",
      partNumber: formData.partNumber || "",
      category: formData.category as Part["category"],
      supplier: formData.supplier || "",
      quantity: formData.quantity || 0,
      minQuantity: formData.minQuantity || 0,
      unitPrice: formData.unitPrice || 0,
      location: formData.location || "",
      description: formData.description,
    }
    setParts([...parts, newPart])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEdit = () => {
    if (!editingPart) return
    setParts(parts.map((p) => (p.id === editingPart.id ? { ...editingPart, ...formData } : p)))
    setIsEditDialogOpen(false)
    setEditingPart(null)
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this part?")) {
      setParts(parts.filter((p) => p.id !== id))
    }
  }

  const openEditDialog = (part: Part) => {
    setEditingPart(part)
    setFormData(part)
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      partNumber: "",
      category: "Engine",
      supplier: "",
      quantity: 0,
      minQuantity: 0,
      unitPrice: 0,
      location: "",
      description: "",
    })
  }

  const lowStockParts = parts.filter((p) => p.quantity < p.minQuantity)
  const totalValue = parts.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0)

  const stats = {
    totalParts: parts.length,
    lowStock: lowStockParts.length,
    totalValue: totalValue,
    categories: new Set(parts.map((p) => p.category)).size,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Parts Management</h1>
        <p className="text-muted-foreground mt-2">Track inventory and manage aircraft parts</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Parts</CardDescription>
            <CardTitle className="text-3xl">{stats.totalParts}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Low Stock Items</CardDescription>
            <CardTitle className="text-3xl text-destructive">{stats.lowStock}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Inventory Value</CardDescription>
            <CardTitle className="text-3xl">${(stats.totalValue / 1000000).toFixed(1)}M</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Categories</CardDescription>
            <CardTitle className="text-3xl">{stats.categories}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {lowStockParts.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Low Stock Alert</CardTitle>
            </div>
            <CardDescription>The following parts are below minimum quantity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockParts.map((part) => (
                <div key={part.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{part.name}</span>
                  <span className="text-muted-foreground">
                    {part.quantity} / {part.minQuantity} units
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Parts Inventory</CardTitle>
              <CardDescription>View and manage all parts in stock</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Engine">Engine</SelectItem>
                  <SelectItem value="Avionics">Avionics</SelectItem>
                  <SelectItem value="Structural">Structural</SelectItem>
                  <SelectItem value="Hydraulic">Hydraulic</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Interior">Interior</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search parts..."
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
                      Add Part
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Part</DialogTitle>
                      <DialogDescription>Enter the details for the new part</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Part Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Turbofan Engine"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="partNumber">Part Number</Label>
                        <Input
                          id="partNumber"
                          value={formData.partNumber}
                          onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                          placeholder="e.g., ENG-TF-001"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value as Part["category"] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Engine">Engine</SelectItem>
                            <SelectItem value="Avionics">Avionics</SelectItem>
                            <SelectItem value="Structural">Structural</SelectItem>
                            <SelectItem value="Hydraulic">Hydraulic</SelectItem>
                            <SelectItem value="Electrical">Electrical</SelectItem>
                            <SelectItem value="Interior">Interior</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supplier">Supplier</Label>
                        <Input
                          id="supplier"
                          value={formData.supplier}
                          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                          placeholder="e.g., Pratt & Whitney"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minQuantity">Minimum Quantity</Label>
                        <Input
                          id="minQuantity"
                          type="number"
                          value={formData.minQuantity}
                          onChange={(e) =>
                            setFormData({ ...formData, minQuantity: Number.parseInt(e.target.value) || 0 })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unitPrice">Unit Price ($)</Label>
                        <Input
                          id="unitPrice"
                          type="number"
                          value={formData.unitPrice}
                          onChange={(e) =>
                            setFormData({ ...formData, unitPrice: Number.parseFloat(e.target.value) || 0 })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="e.g., Warehouse A-1"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Optional description"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAdd}>Add Part</Button>
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
                  <TableHead>Part Name</TableHead>
                  <TableHead>Part Number</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  {canEdit && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canEdit ? 8 : 7} className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>No parts found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredParts.map((part) => (
                    <TableRow key={part.id}>
                      <TableCell className="font-medium">{part.name}</TableCell>
                      <TableCell className="font-mono text-sm">{part.partNumber}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{part.category}</Badge>
                      </TableCell>
                      <TableCell>{part.supplier}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{part.quantity}</span>
                          {part.quantity < part.minQuantity && <AlertTriangle className="h-4 w-4 text-destructive" />}
                        </div>
                      </TableCell>
                      <TableCell>{part.location}</TableCell>
                      <TableCell className="text-right font-mono">${part.unitPrice.toLocaleString()}</TableCell>
                      {canEdit && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(part)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(part.id)}>
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
            <DialogTitle>Edit Part</DialogTitle>
            <DialogDescription>Update the part details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Part Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-partNumber">Part Number</Label>
              <Input
                id="edit-partNumber"
                value={formData.partNumber}
                onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as Part["category"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engine">Engine</SelectItem>
                  <SelectItem value="Avionics">Avionics</SelectItem>
                  <SelectItem value="Structural">Structural</SelectItem>
                  <SelectItem value="Hydraulic">Hydraulic</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Interior">Interior</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-supplier">Supplier</Label>
              <Input
                id="edit-supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity</Label>
              <Input
                id="edit-quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-minQuantity">Minimum Quantity</Label>
              <Input
                id="edit-minQuantity"
                type="number"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-unitPrice">Unit Price ($)</Label>
              <Input
                id="edit-unitPrice"
                type="number"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
