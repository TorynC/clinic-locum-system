"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Plus, Filter, CalendarIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function CalendarPage() {
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
      jobs: getJobsForDay(day),
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
        <h1 className="text-3xl font-bold text-purple-900">Calendar</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="border-purple-200 text-purple-700">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" asChild className="bg-purple-gradient hover:bg-purple-700">
            <Link href="/clinic/post-job">
              <Plus className="h-4 w-4 mr-2" />
              Post Job
            </Link>
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
                      {day.jobs.map((job, j) => (
                        <div
                          key={j}
                          className={cn("calendar-event", getJobColor(job.status))}
                          title={`${job.title} (${job.time})`}
                        >
                          {job.time} - {job.title}
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

      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100">
        <div className="text-sm font-medium text-purple-900">Legend:</div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-400 mr-2"></div>
            <span className="text-sm">Posted</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-100 border border-green-400 mr-2"></div>
            <span className="text-sm">Accepted</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-indigo-100 border border-indigo-400 mr-2"></div>
            <span className="text-sm">Completed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions for mock data
function getJobsForDay(day: number) {
  if (!day || day > 31) return []

  // Generate some sample jobs for specific days
  if (day === 13) {
    return [
      { title: "General Practice", time: "9AM-5PM", status: "posted" },
      { title: "Pediatrics", time: "2PM-6PM", status: "posted" },
    ]
  } else if (day === 15) {
    return [{ title: "Dental", time: "8AM-4PM", status: "accepted" }]
  } else if (day === 10) {
    return [{ title: "Emergency", time: "7PM-7AM", status: "completed" }]
  } else if (day === 20) {
    return [{ title: "General Practice", time: "9AM-1PM", status: "posted" }]
  } else if (day % 7 === 0) {
    // Some random days
    return [{ title: "Specialist", time: "10AM-2PM", status: "accepted" }]
  }

  return []
}

function getJobColor(status: string) {
  switch (status) {
    case "posted":
      return "bg-purple-100 border border-purple-400 text-purple-800"
    case "accepted":
      return "bg-green-100 border border-green-400 text-green-800"
    case "completed":
      return "bg-indigo-100 border border-indigo-400 text-indigo-800"
    default:
      return "bg-gray-100 border border-gray-400 text-gray-800"
  }
}
