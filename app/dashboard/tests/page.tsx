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
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export interface Test {
  id: string
  aircraftId: string
  aircraftModel: string
  testType: "Structural" | "Avionics" | "Engine" | "Hydraulic" | "Flight" | "Safety"
  testName: string
  status: "Scheduled" | "In Progress" | "Passed" | "Failed" | "Pending Review"
  testDate: string
  inspector: string
  result?: string
  notes?: string
  score?: number
}

const initialTests: Test[] = [
  {
    id: "1",
    aircraftId: "1",
    aircraftModel: "A320neo",
    testType: "Structural",
    testName: "Wing Load Test",
    status: "Passed",
    testDate: "2024-02-15",
    inspector: "Mike Smith",
    result: "All structural integrity tests passed within specifications",
    score: 98,
  },
  {
    id: "2",
    aircraftId: "1",
    aircraftModel: "A320neo",
    testType: "Avionics",
    testName: "Flight Control System Test",
    status: "In Progress",
    testDate: "2024-03-01",
    inspector: "Mike Smith",
    notes: "Testing autopilot systems",
    score: 85,
  },
  {
    id: "3",
    aircraftId: "2",
    aircraftModel: "F-35 Lightning II",
    testType: "Engine",
    testName: "Thrust Performance Test",
    status: "Passed",
    testDate: "2024-02-20",
    inspector: "John Engineer",
    result: "Engine performance exceeds specifications",
    score: 95,
  },
  {
    id: "4",
    aircraftId: "2",
    aircraftModel: "F-35 Lightning II",
    testType: "Avionics",
    testName: "Radar System Test",
    status: "Failed",
    testDate: "2024-02-25",
    inspector: "Mike Smith",
    result: "Signal interference detected, requires recalibration",
    notes: "Scheduled for retest after adjustments",
    score: 62,
  },
  {
    id: "5",
    aircraftId: "3",
    aircraftModel: "Gulfstream G650",
    testType: "Safety",
    testName: "Emergency Systems Test",
    status: "Scheduled",
    testDate: "2024-03-10",
    inspector: "Mike Smith",
  },
]

export default function TestsPage() {
  const { user } = useAuth()
  const [tests, setTests] = useState<Test[]>(initialTests)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTest, setEditingTest] = useState<Test | null>(null)
  const [formData, setFormData] = useState<Partial<Test>>({
    aircraftModel: "",
    testType: "Structural",
    testName: "",
    status: "Scheduled",
    testDate: new Date().toISOString().split("T")[0],
    inspector: "",
    result: "",
    notes: "",
    score: 0,
  })

  const canEdit = user?.role === "Administrator" || user?.role === "Engineer"

  const filteredTests = tests.filter((t) => {
    const matchesSearch =
      t.aircraftModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.inspector.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || t.status === statusFilter
    const matchesType = typeFilter === "all" || t.testType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const handleAdd = () => {
    const newTest: Test = {
      id: Date.now().toString(),
      aircraftId: Date.now().toString(),
      aircraftModel: formData.aircraftModel || "",
      testType: formData.testType as Test["testType"],
      testName: formData.testName || "",
      status: formData.status as Test["status"],
      testDate: formData.testDate || "",
      inspector: formData.inspector || "",
      result: formData.result,
      notes: formData.notes,
      score: formData.score,
    }
    setTests([...tests, newTest])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEdit = () => {
    if (!editingTest) return
    setTests(tests.map((t) => (t.id === editingTest.id ? { ...editingTest, ...formData } : t)))
    setIsEditDialogOpen(false)
    setEditingTest(null)
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this test?")) {
      setTests(tests.filter((t) => t.id !== id))
    }
  }

  const openEditDialog = (test: Test) => {
    setEditingTest(test)
    setFormData(test)
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      aircraftModel: "",
      testType: "Structural",
      testName: "",
      status: "Scheduled",
      testDate: new Date().toISOString().split("T")[0],
      inspector: "",
      result: "",
      notes: "",
      score: 0,
    })
  }

  const getStatusIcon = (status: Test["status"]) => {
    switch (status) {
      case "Passed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "Failed":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "In Progress":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      default:
        return <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: Test["status"]) => {
    switch (status) {
      case "Scheduled":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
      case "In Progress":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "Passed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "Failed":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      case "Pending Review":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
    }
  }

  const stats = {
    total: tests.length,
    passed: tests.filter((t) => t.status === "Passed").length,
    failed: tests.filter((t) => t.status === "Failed").length,
    inProgress: tests.filter((t) => t.status === "In Progress").length,
  }

  const passRate = stats.total > 0 ? Math.round((stats.passed / (stats.passed + stats.failed)) * 100) : 0
  const avgScore =
    tests.filter((t) => t.score).length > 0
      ? Math.round(
          tests.filter((t) => t.score).reduce((sum, t) => sum + (t.score || 0), 0) /
            tests.filter((t) => t.score).length,
        )
      : 0

  const testsByType = {
    Structural: tests.filter((t) => t.testType === "Structural").length,
    Avionics: tests.filter((t) => t.testType === "Avionics").length,
    Engine: tests.filter((t) => t.testType === "Engine").length,
    Hydraulic: tests.filter((t) => t.testType === "Hydraulic").length,
    Flight: tests.filter((t) => t.testType === "Flight").length,
    Safety: tests.filter((t) => t.testType === "Safety").length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tests & Quality Assurance</h1>
        <p className="text-muted-foreground mt-2">Track testing procedures and quality metrics</p>
      </div>

      <Tabs defaultValue="tests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Tests</CardDescription>
                <CardTitle className="text-3xl">{stats.total}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Passed</CardDescription>
                <CardTitle className="text-3xl text-green-500">{stats.passed}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Failed</CardDescription>
                <CardTitle className="text-3xl text-destructive">{stats.failed}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>In Progress</CardDescription>
                <CardTitle className="text-3xl text-blue-500">{stats.inProgress}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Test Records</CardTitle>
                  <CardDescription>View and manage all quality assurance tests</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Structural">Structural</SelectItem>
                      <SelectItem value="Avionics">Avionics</SelectItem>
                      <SelectItem value="Engine">Engine</SelectItem>
                      <SelectItem value="Hydraulic">Hydraulic</SelectItem>
                      <SelectItem value="Flight">Flight</SelectItem>
                      <SelectItem value="Safety">Safety</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Passed">Passed</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Pending Review">Pending Review</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tests..."
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
                          Add Test
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add New Test</DialogTitle>
                          <DialogDescription>Enter the details for the new test</DialogDescription>
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
                            <Label htmlFor="testName">Test Name</Label>
                            <Input
                              id="testName"
                              value={formData.testName}
                              onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                              placeholder="e.g., Wing Load Test"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="testType">Test Type</Label>
                            <Select
                              value={formData.testType}
                              onValueChange={(value) =>
                                setFormData({ ...formData, testType: value as Test["testType"] })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Structural">Structural</SelectItem>
                                <SelectItem value="Avionics">Avionics</SelectItem>
                                <SelectItem value="Engine">Engine</SelectItem>
                                <SelectItem value="Hydraulic">Hydraulic</SelectItem>
                                <SelectItem value="Flight">Flight</SelectItem>
                                <SelectItem value="Safety">Safety</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                              value={formData.status}
                              onValueChange={(value) => setFormData({ ...formData, status: value as Test["status"] })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Scheduled">Scheduled</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Passed">Passed</SelectItem>
                                <SelectItem value="Failed">Failed</SelectItem>
                                <SelectItem value="Pending Review">Pending Review</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="testDate">Test Date</Label>
                            <Input
                              id="testDate"
                              type="date"
                              value={formData.testDate}
                              onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="inspector">Inspector</Label>
                            <Input
                              id="inspector"
                              value={formData.inspector}
                              onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                              placeholder="e.g., Mike Smith"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="score">Score (0-100)</Label>
                            <Input
                              id="score"
                              type="number"
                              min="0"
                              max="100"
                              value={formData.score}
                              onChange={(e) =>
                                setFormData({ ...formData, score: Number.parseInt(e.target.value) || 0 })
                              }
                            />
                          </div>
                          <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="result">Result</Label>
                            <Textarea
                              id="result"
                              value={formData.result}
                              onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                              placeholder="Test result summary"
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                              id="notes"
                              value={formData.notes}
                              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                              placeholder="Additional notes"
                              rows={2}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAdd}>Add Test</Button>
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
                      <TableHead>Test Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Inspector</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Score</TableHead>
                      {canEdit && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={canEdit ? 8 : 7} className="text-center py-8 text-muted-foreground">
                          <ClipboardCheck className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p>No tests found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTests.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell className="font-medium">{test.aircraftModel}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{test.testName}</div>
                              {test.result && (
                                <div className="text-xs text-muted-foreground line-clamp-1">{test.result}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{test.testType}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={getStatusColor(test.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(test.status)}
                                {test.status}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell>{test.inspector}</TableCell>
                          <TableCell>{new Date(test.testDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {test.score !== undefined ? (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{test.score}%</span>
                                {test.score >= 90 ? (
                                  <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : test.score < 70 ? (
                                  <TrendingDown className="h-4 w-4 text-destructive" />
                                ) : null}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          {canEdit && (
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => openEditDialog(test)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(test.id)}>
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
                <DialogTitle>Edit Test</DialogTitle>
                <DialogDescription>Update the test details</DialogDescription>
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
                  <Label htmlFor="edit-testName">Test Name</Label>
                  <Input
                    id="edit-testName"
                    value={formData.testName}
                    onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-testType">Test Type</Label>
                  <Select
                    value={formData.testType}
                    onValueChange={(value) => setFormData({ ...formData, testType: value as Test["testType"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Structural">Structural</SelectItem>
                      <SelectItem value="Avionics">Avionics</SelectItem>
                      <SelectItem value="Engine">Engine</SelectItem>
                      <SelectItem value="Hydraulic">Hydraulic</SelectItem>
                      <SelectItem value="Flight">Flight</SelectItem>
                      <SelectItem value="Safety">Safety</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as Test["status"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Passed">Passed</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Pending Review">Pending Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-testDate">Test Date</Label>
                  <Input
                    id="edit-testDate"
                    type="date"
                    value={formData.testDate}
                    onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-inspector">Inspector</Label>
                  <Input
                    id="edit-inspector"
                    value={formData.inspector}
                    onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-score">Score (0-100)</Label>
                  <Input
                    id="edit-score"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="edit-result">Result</Label>
                  <Textarea
                    id="edit-result"
                    value={formData.result}
                    onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
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
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>Overall testing performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pass Rate</span>
                    <span className="font-medium">{passRate}%</span>
                  </div>
                  <Progress value={passRate} className="h-3" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Average Score</span>
                    <span className="font-medium">{avgScore}%</span>
                  </div>
                  <Progress value={avgScore} className="h-3" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-2xl font-bold text-green-500">{stats.passed}</div>
                    <div className="text-xs text-muted-foreground">Tests Passed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
                    <div className="text-xs text-muted-foreground">Tests Failed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tests by Type</CardTitle>
                <CardDescription>Distribution across test categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(testsByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{type}</span>
                      <div className="flex items-center gap-3">
                        <Progress value={(count / stats.total) * 100} className="h-2 w-24" />
                        <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
              <CardDescription>Latest quality assurance outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tests
                  .filter((t) => t.status === "Passed" || t.status === "Failed")
                  .slice(0, 5)
                  .map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(test.status)}
                        <div>
                          <div className="font-medium">{test.testName}</div>
                          <div className="text-sm text-muted-foreground">
                            {test.aircraftModel} • {test.testType}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {test.score !== undefined && <div className="font-medium">{test.score}%</div>}
                        <div className="text-xs text-muted-foreground">
                          {new Date(test.testDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
