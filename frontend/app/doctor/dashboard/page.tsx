import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, ArrowUpDown, Calendar, Clock, MapPin, DollarSign, Star } from "lucide-react"
import Link from "next/link"

export default function DoctorDashboardPage() {
  // Mock data for shifts
  const shifts = [
    {
      id: 1,
      date: "May 10, 2025",
      timeSlot: "9:00 AM - 5:00 PM",
      hours: 8,
      pay: "RM 680",
      clinic: "City Medical Clinic",
      location: "Kuala Lumpur",
      status: "Completed",
      rating: 5,
    },
    {
      id: 2,
      date: "May 8, 2025",
      timeSlot: "10:00 AM - 6:00 PM",
      hours: 8,
      pay: "RM 720",
      clinic: "KidsCare Pediatric Center",
      location: "Petaling Jaya",
      status: "Completed",
      rating: 4,
    },
    {
      id: 3,
      date: "May 5, 2025",
      timeSlot: "8:00 AM - 4:00 PM",
      hours: 8,
      pay: "RM 760",
      clinic: "Dental Plus",
      location: "Subang Jaya",
      status: "Cancelled",
      rating: null,
    },
    {
      id: 4,
      date: "May 15, 2025",
      timeSlot: "9:00 AM - 5:00 PM",
      hours: 8,
      pay: "RM 680",
      clinic: "Family Health Clinic",
      location: "Ampang",
      status: "Upcoming",
      rating: null,
    },
    {
      id: 5,
      date: "May 16, 2025",
      timeSlot: "10:00 AM - 2:00 PM",
      hours: 4,
      pay: "RM 340",
      clinic: "Wellness Medical Center",
      location: "Cheras",
      status: "Upcoming",
      rating: null,
    },
  ]

  // Calculate statistics
  const totalHours = shifts.reduce((sum, shift) => sum + shift.hours, 0)
  const totalPay = shifts.reduce((sum, shift) => {
    const payValue = Number.parseInt(shift.pay.replace("RM ", ""))
    return sum + (isNaN(payValue) ? 0 : payValue)
  }, 0)
  const completedShifts = shifts.filter((shift) => shift.status === "Completed").length
  const upcomingShifts = shifts.filter((shift) => shift.status === "Upcoming").length
  const averageRating =
    shifts.filter((shift) => shift.rating !== null).reduce((sum, shift) => sum + (shift.rating || 0), 0) /
    shifts.filter((shift) => shift.rating !== null).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">My Dashboard</h1>
          <p className="text-gray-500">Track your shifts, earnings, and performance</p>
        </div>
        <Button className="bg-purple-gradient hover:bg-purple-700">
          <Download className="h-4 w-4 mr-2" />
          Export History
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <StatCard title="Total Hours" value={`${totalHours} hrs`} icon={<Clock className="h-5 w-5" />} />
        <StatCard title="Total Earnings" value={`RM ${totalPay}`} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Completed Shifts" value={completedShifts.toString()} icon={<Calendar className="h-5 w-5" />} />
        <StatCard title="Upcoming Shifts" value={upcomingShifts.toString()} icon={<Calendar className="h-5 w-5" />} />
        <StatCard
          title="Average Rating"
          value={averageRating.toFixed(1)}
          icon={<Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-900">Upcoming Shifts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shifts
                .filter((shift) => shift.status === "Upcoming")
                .map((shift) => (
                  <div
                    key={shift.id}
                    className="flex items-center p-3 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-purple-900">{shift.clinic}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{shift.date}</span>
                        <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                        <span>{shift.timeSlot}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>{shift.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-purple-900">{shift.pay}</p>
                      <p className="text-sm text-gray-500">{shift.hours} hours</p>
                    </div>
                  </div>
                ))}
              {shifts.filter((shift) => shift.status === "Upcoming").length === 0 && (
                <p className="text-center py-4 text-gray-500">No upcoming shifts</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-900">Recent Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shifts
                .filter((shift) => shift.status === "Completed")
                .map((shift) => (
                  <div
                    key={shift.id}
                    className="flex items-center p-3 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-purple-900">{shift.clinic}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{shift.date}</span>
                        <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                        <span>{shift.timeSlot}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-purple-900">{shift.pay}</p>
                      <div className="flex items-center justify-end">
                        {shift.rating && (
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < (shift.rating || 0) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
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
                <option value="cancelled">Cancelled</option>
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
                  <TableHeader>Clinic</TableHeader>
                  <TableHeader>Location</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Rating</TableHeader>
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
                      <Link href="#" className="text-purple-600 hover:underline">
                        {shift.clinic}
                      </Link>
                    </TableCell>
                    <TableCell>{shift.location}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          shift.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : shift.status === "Upcoming"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {shift.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {shift.rating ? (
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < (shift.rating || 0) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
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

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="border-purple-100 overflow-hidden">
      <div className="h-1 bg-purple-gradient-light"></div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-purple-900 mt-2">{value}</p>
          </div>
          <div className="p-2 rounded-full bg-purple-50 text-purple-600">{icon}</div>
        </div>
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
