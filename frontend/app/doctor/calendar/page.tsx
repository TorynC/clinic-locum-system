"use client"

import { Calendar } from "@/components/ui/calendar"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Filter, CalendarIcon, Clock, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function DoctorCalendarPage() {
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")
  const [currentMonth, setCurrentMonth] = useState("May 2025")

  // Mock data for calendar
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Generate calendar days (simplified for example)
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const day = i - 3 // Offset to start month on correct day
    return {
      date: day > 0 && day <= 31 ? day : null,
      isToday: day === 13,
      shifts: getShiftsForDay(day),
    }
  })

  const nextMonth = () => {
    setCurrentMonth("June 2025")
  }

  const prevMonth = () => {
    setCurrentMonth("April 2025")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-purple-900">My Calendar</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="border-purple-200 text-purple-700">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Card className="border-purple-100 overflow-hidden">
        <div className="h-1 bg-purple-gradient"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" className="border-purple-200 text-purple-700" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-bold text-purple-900">{currentMonth}</h2>
              <Button variant="outline" size="icon" className="border-purple-200 text-purple-700" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="gap-2 border-purple-200 text-purple-700">
                <CalendarIcon className="h-4 w-4" />
                Today
              </Button>
              <select
                className="h-9 rounded-md border border-purple-200 bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => (
              <div key={day} className="text-center font-medium py-2 text-purple-900">
                {day}
              </div>
            ))}

            {calendarDays.map((day, i) => (
              <div
                key={i}
                className={cn(
                  "calendar-day border rounded-md p-1",
                  !day.date ? "bg-gray-50 text-gray-400" : "hover:bg-purple-50 cursor-pointer",
                  day.isToday && "ring-2 ring-purple-400",
                )}
              >
                {day.date && (
                  <>
                    <div className={cn("text-right p-1 font-medium", day.isToday && "text-purple-600")}>{day.date}</div>
                    <div className="space-y-1">
                      {day.shifts.map((shift, j) => (
                        <div
                          key={j}
                          className={cn("calendar-event", getShiftColor(shift.status))}
                          title={`${shift.clinicName} (${shift.time})`}
                        >
                          {shift.time} - {shift.clinicName}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-purple-100">
          <CardContent className="p-6">
            <h3 className="font-bold text-purple-900 mb-4">Upcoming Shifts</h3>
            <div className="space-y-3">
              {[
                {
                  clinicName: "City Medical Clinic",
                  location: "Kuala Lumpur",
                  date: "May 15, 2025",
                  time: "9:00 AM - 5:00 PM",
                  status: "upcoming",
                },
                {
                  clinicName: "KidsCare Pediatric Center",
                  location: "Petaling Jaya",
                  date: "May 16, 2025",
                  time: "10:00 AM - 6:00 PM",
                  status: "upcoming",
                },
              ].map((shift, i) => (
                <div
                  key={i}
                  className="flex items-center p-3 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-purple-900">{shift.clinicName}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{shift.date}</span>
                      <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                      <span>{shift.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>{shift.location}</span>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">Upcoming</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardContent className="p-6">
            <h3 className="font-bold text-purple-900 mb-4">Recent Shifts</h3>
            <div className="space-y-3">
              {[
                {
                  clinicName: "Emergency Care Center",
                  location: "Shah Alam",
                  date: "May 10, 2025",
                  time: "7:00 PM - 7:00 AM",
                  status: "completed",
                },
                {
                  clinicName: "Family Health Clinic",
                  location: "Ampang",
                  date: "May 8, 2025",
                  time: "9:00 AM - 1:00 PM",
                  status: "completed",
                },
              ].map((shift, i) => (
                <div
                  key={i}
                  className="flex items-center p-3 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-purple-900">{shift.clinicName}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{shift.date}</span>
                      <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                      <span>{shift.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>{shift.location}</span>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100">
        <div className="text-sm font-medium text-purple-900">Legend:</div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-400 mr-2"></div>
            <span className="text-sm">Upcoming</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-100 border border-green-400 mr-2"></div>
            <span className="text-sm">Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-100 border border-red-400 mr-2"></div>
            <span className="text-sm">Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions for mock data
function getShiftsForDay(day: number) {
  if (!day || day > 31) return []

  // Generate some sample shifts for specific days
  if (day === 15) {
    return [{ clinicName: "City Medical Clinic", time: "9AM-5PM", status: "upcoming" }]
  } else if (day === 16) {
    return [{ clinicName: "KidsCare Pediatric", time: "10AM-6PM", status: "upcoming" }]
  } else if (day === 10) {
    return [{ clinicName: "Emergency Care", time: "7PM-7AM", status: "completed" }]
  } else if (day === 8) {
    return [{ clinicName: "Family Health", time: "9AM-1PM", status: "completed" }]
  } else if (day === 5) {
    return [{ clinicName: "Dental Plus", time: "8AM-4PM", status: "cancelled" }]
  }

  return []
}

function getShiftColor(status: string) {
  switch (status) {
    case "upcoming":
      return "bg-purple-100 border border-purple-400 text-purple-800"
    case "completed":
      return "bg-green-100 border border-green-400 text-green-800"
    case "cancelled":
      return "bg-red-100 border border-red-400 text-red-800"
    default:
      return "bg-gray-100 border border-gray-400 text-gray-800"
  }
}
