import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Download, ArrowUpDown } from "lucide-react"

export default function DashboardPage() {
  // Mock data for locum shifts
  const shifts = [
    {
      id: 1,
      date: "May 10, 2025",
      timeSlot: "9:00 AM - 5:00 PM",
      hours: 8,
      pay: "$680",
      doctor: "Dr. Sarah Johnson",
      status: "Completed",
    },
    {
      id: 2,
      date: "May 8, 2025",
      timeSlot: "10:00 AM - 6:00 PM",
      hours: 8,
      pay: "$680",
      doctor: "Dr. Michael Chen",
      status: "Completed",
    },
    {
      id: 3,
      date: "May 5, 2025",
      timeSlot: "8:00 AM - 4:00 PM",
      hours: 8,
      pay: "$680",
      doctor: "Dr. Emily Patel",
      status: "Completed",
    },
    {
      id: 4,
      date: "May 15, 2025",
      timeSlot: "9:00 AM - 5:00 PM",
      hours: 8,
      pay: "$680",
      doctor: "Dr. James Wilson",
      status: "Upcoming",
    },
    {
      id: 5,
      date: "May 18, 2025",
      timeSlot: "10:00 AM - 2:00 PM",
      hours: 4,
      pay: "$340",
      doctor: "Dr. Robert Kim",
      status: "Upcoming",
    },
  ]

  // Calculate statistics
  const totalHours = shifts.reduce((sum, shift) => sum + shift.hours, 0)
  const totalPay = shifts.reduce((sum, shift) => sum + Number.parseInt(shift.pay.replace("$", "")), 0)
  const completedShifts = shifts.filter((shift) => shift.status === "Completed").length
  const upcomingShifts = shifts.filter((shift) => shift.status === "Upcoming").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Dashboard</h1>
          <p className="text-gray-500">History of locum shifts and statistics</p>
        </div>
        <Button className="bg-purple-gradient hover:bg-purple-700">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="Total Hours" value={`${totalHours} hrs`} />
        <StatCard title="Total Pay" value={`$${totalPay}`} />
        <StatCard title="Completed Shifts" value={completedShifts.toString()} />
        <StatCard title="Upcoming Shifts" value={upcomingShifts.toString()} />
      </div>

      <Card className="border-purple-100">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-purple-900">Shift History</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input placeholder="Search shifts..." className="pl-8 border-purple-200" />
              </div>
              <select className="h-10 rounded-md border border-purple-200 bg-background px-3 py-2 text-sm">
                <option value="all">All Shifts</option>
                <option value="completed">Completed</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-purple-100 overflow-hidden mt-4">
            <table className="min-w-full divide-y divide-purple-100">
              <thead className="bg-purple-50">
                <tr>
                  <TableHeader>
                    Date <ArrowUpDown className="h-3 w-3 ml-1" />
                  </TableHeader>
                  <TableHeader>Time Slot</TableHeader>
                  <TableHeader>Hours</TableHeader>
                  <TableHeader>Pay</TableHeader>
                  <TableHeader>Locum Doctor</TableHeader>
                  <TableHeader>Status</TableHeader>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-100">
                {shifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-purple-50 transition-colors">
                    <TableCell>{shift.date}</TableCell>
                    <TableCell>{shift.timeSlot}</TableCell>
                    <TableCell>{shift.hours}</TableCell>
                    <TableCell>{shift.pay}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 mr-2 flex items-center justify-center text-xs font-medium">
                          {shift.doctor.charAt(0)}
                        </div>
                        {shift.doctor}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          shift.status === "Completed" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {shift.status}
                      </span>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="border-purple-100 overflow-hidden">
      <div className="h-1 bg-purple-gradient-light"></div>
      <CardContent className="p-6">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-3xl font-bold text-purple-900 mt-2">{value}</p>
      </CardContent>
    </Card>
  )
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">
      <div className="flex items-center">{children}</div>
    </th>
  )
}

function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{children}</td>
}
