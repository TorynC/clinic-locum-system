"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import axiosInstance from "@/utils/axiosinstance";
import { formatTimeRange } from "@/utils/timeUtils";

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [events, setEvents] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar days (simplified for example)
  const calendarDays = getCalendarDays(currentDate);

  useEffect(() => {
    // Get doctorId from localStorage or context
    const storedId = localStorage.getItem("doctorId");
    if (storedId) setDoctorId(storedId);
  }, []);

  useEffect(() => {
    if (!doctorId) return;
    // Fetch all jobs
    axiosInstance.get("/get-all-jobs").then((res) => {
      if (!res.data.error) setJobs(res.data.jobs);
    });
    // Fetch all clinics (for clinic name lookup)
    axiosInstance.get("/get-all-clinics").then((res) => {
      if (!res.data.error) setClinics(res.data.clinics);
    });
    axiosInstance.get(`/get-applications/${doctorId}`).then((res) => {
      if (!res.data.error) setApplications(res.data.applications);
    });
    // Fetch current doctor info
    axiosInstance.get(`/get-doctor/${doctorId}`).then((res) => {
      if (!res.data.error) {
        // Set doctors array with just the current doctor for consistency
        setDoctors([res.data.doctor]);
      }
    });
  }, [doctorId]);

  useEffect(() => {
    if (jobs.length === 0 || doctors.length === 0) return;

    // Get current doctor info
    const currentDoctor = doctors[0]; // Since we only fetch the current doctor

    // 1. Normal jobs (doctor assigned)
    const doctorEvents = jobs
      .filter((job) => job.doctor_id === doctorId)
      .map((job) => {
        const utcDate = new Date(job.date);
        const malaysiaDate = new Date(utcDate.getTime() + 28800000);
        const [startH, startM, startS] = job.start_time.split(":").map(Number);
        const [endH, endM, endS] = job.end_time.split(":").map(Number);
        const start = new Date(malaysiaDate);
        start.setHours(startH, startM, startS);
        const end = new Date(malaysiaDate);
        end.setHours(endH, endM, endS);
        if (end <= start) end.setDate(end.getDate() + 1);
        const clinic = clinics.find((c) => c.id === job.clinic_id);
        return {
          start,
          end,
          status: job.status,
          id: job.id,
          start_time: job.start_time,
          end_time: job.end_time,
          clinic_name: clinic ? clinic.clinic_name : "Clinic",
        };
      });

    // 2. Cancelled jobs (from applications)
    const cancelledEvents = applications
      .filter((app) => app.status === "Cancelled")
      .map((app) => {
        const job = jobs.find((j) => j.id === app.job_id);
        if (!job) return null;
        const utcDate = new Date(job.date);
        const malaysiaDate = new Date(utcDate.getTime() + 28800000);
        const [startH, startM, startS] = job.start_time.split(":").map(Number);
        const [endH, endM, endS] = job.end_time.split(":").map(Number);
        const start = new Date(malaysiaDate);
        start.setHours(startH, startM, startS);
        const end = new Date(malaysiaDate);
        end.setHours(endH, endM, endS);
        if (end <= start) end.setDate(end.getDate() + 1);
        const clinic = clinics.find((c) => c.id === job.clinic_id);
        return {
          start,
          end,
          status: "Cancelled",
          id: `${job.id}-cancelled`,
          start_time: job.start_time,
          end_time: job.end_time,
          clinic_name: clinic ? clinic.clinic_name : "Clinic",
        };
      })
      .filter(Boolean);

    setEvents([...doctorEvents, ...cancelledEvents]);
  }, [jobs, doctors, applications, doctorId]);

  // Get real calendar days with proper weekday alignment
  function getCalendarDays(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Get the first day of the month and find what day of the week it is
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayWeekday = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Get the last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Calculate how many days we need from the previous month
    const daysFromPrevMonth = firstDayWeekday;

    // Calculate how many days we need from the next month to fill the grid
    const totalCells = 42; // 6 weeks × 7 days
    const daysFromNextMonth = totalCells - daysFromPrevMonth - daysInMonth;

    const calendarDays = [];

    // Add days from previous month
    if (daysFromPrevMonth > 0) {
      const prevMonth = new Date(year, month - 1, 1);
      const daysInPrevMonth = new Date(year, month, 0).getDate();

      for (
        let i = daysInPrevMonth - daysFromPrevMonth + 1;
        i <= daysInPrevMonth;
        i++
      ) {
        const dayDate = new Date(year, month - 1, i);
        calendarDays.push({
          date: dayDate,
          isToday: isSameDay(dayDate, new Date()),
          isCurrentMonth: false,
        });
      }
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      calendarDays.push({
        date: dayDate,
        isToday: isSameDay(dayDate, new Date()),
        isCurrentMonth: true,
      });
    }

    // Add days from next month
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const dayDate = new Date(year, month + 1, i);
      calendarDays.push({
        date: dayDate,
        isToday: isSameDay(dayDate, new Date()),
        isCurrentMonth: false,
      });
    }

    return calendarDays;
  }

  function getWeekDays(date: Date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Sunday

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return {
        date: day,
        isToday: isSameDay(day, new Date()),
      };
    });
  }
  console.log(events);
  function isSameDay(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  const currentMonth = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const tomorrow = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const yesterday = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const today = currentDate;

  const cancelledApplications = applications.filter(
    (app) => app.status === "Cancelled"
  );

  const cancelledJobs = cancelledApplications
    .map((app) => jobs.find((job) => job.id === app.job_id))
    .filter(Boolean); // Remove undefined if job not found

  const confirmedJobs = jobs.filter(
    (job) =>
      job.doctor_id === doctorId &&
      (job.status === "Accepted" || job.status === "Completed")
  );

  // Helper: get events for a specific day (for month view)
  const getEventsForDay = (day: Date) =>
    events.filter(
      (event) =>
        event.start.getFullYear() === day.getFullYear() &&
        event.start.getMonth() === day.getMonth() &&
        event.start.getDate() === day.getDate()
    );

  // Helper: get events overlapping a specific hour (for week/day view)
  const getEventsForHour = (date: Date, hour: number) =>
    events.filter(
      (event) =>
        event.start <=
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            hour,
            59,
            59
          ) &&
        event.end >
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            hour,
            0,
            0
          )
    );

  // Helper: get color for event status
  function getEventColor(status: string) {
    switch (status) {
      case "Completed":
        return "bg-green-100 border border-green-400 text-green-800";
      case "Accepted":
        return "bg-purple-100 border border-purple-400 text-purple-800";
      case "Urgent":
        return "bg-red-200 border border-red-400 text-red-800";
      case "Cancelled":
        return "bg-red-100 border border-red-400 text-red-800";
      default:
        return "bg-gray-100 border border-gray-400 text-gray-800";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Calendar</h1>
      </div>

      <Card className="border-purple-100 overflow-hidden">
        <div className="h-1 bg-blue-700"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="border-purple-200 text-blue-700"
                onClick={
                  viewMode === "month"
                    ? prevMonth
                    : viewMode === "week"
                    ? prevWeek
                    : yesterday
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-bold text-blue-900">
                {currentMonth}
              </h2>
              <Button
                variant="outline"
                size="icon"
                className="border-purple-200 text-blue-700"
                onClick={
                  viewMode === "month"
                    ? nextMonth
                    : viewMode === "week"
                    ? nextWeek
                    : tomorrow
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <select
                className="h-9 rounded-md border border-blue-200 bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
              </select>
            </div>
          </div>

          {/* MONTH VIEW */}
          {viewMode === "month" ? (
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => (
                <div
                  key={day}
                  className="text-center font-medium py-2 text-black"
                >
                  {day}
                </div>
              ))}
              {calendarDays.map((day, i) => (
                <div
                  key={i}
                  className={cn(
                    "calendar-day border rounded-md p-1",
                    !day.isCurrentMonth
                      ? "bg-gray-50 text-gray-400"
                      : "hover:bg-blue-50 cursor-pointer",
                    day.isToday && "ring-2 ring-blue-400"
                  )}
                >
                  <div>
                    <div
                      className={cn(
                        "text-right p-1 font-medium",
                        day.isToday && "text-blue-600",
                        !day.isCurrentMonth && "text-gray-400"
                      )}
                    >
                      {day.date.getDate()}
                    </div>
                    {/* Render all events for this day */}
                    {day.isCurrentMonth &&
                      getEventsForDay(day.date).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "text-xs truncate rounded p-0.5 flex-col z-0",
                          getEventColor(event.status)
                        )}
                      >
                        {event.clinic_name}
                        <div className="text-xs z-10">
                          {formatTimeRange(event.start_time, event.end_time)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : viewMode === "week" ? (
            <>
              <div className="grid grid-cols-[80px_repeat(7,_1fr)] border-t border-l text-sm">
                <div className="border-r border-b p-2 bg-blue-50"></div>
                {getWeekDays(currentDate).map((day, i) => (
                  <div
                    key={i}
                    className={cn(
                      "border-r border-b p-2 text-center bg-blue-50 font-semibold",
                      day.isToday && "bg-blue-300"
                    )}
                  >
                    {days[day.date.getDay()]} {day.date.getDate()}
                  </div>
                ))}
                {[...Array(24)].map((_, hour) => (
                  <React.Fragment key={hour}>
                    <div className="border-r border-b p-1 text-right pr-2 bg-blue-50 text-gray-500 flex flex-col ">
                      {hour === 0
                        ? "12AM"
                        : hour < 12
                        ? `${hour}AM`
                        : hour === 12
                        ? "12PM"
                        : `${hour - 12}PM`}
                    </div>
                    {getWeekDays(currentDate).map((day, i) => (
                      <div
                        key={i}
                        className="border-r border-b h-25 hover:bg-blue-50 relative truncate p-1 left-1 right-1 top-1 flex-col flex"
                      >
                        {/* Render all events overlapping this hour */}
                        {getEventsForHour(day.date, hour).map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "text-xs truncate rounded p-0.5 flex-col z-0",
                              getEventColor(event.status)
                            )}
                          >
                            {event.clinic_name}
                            <div className="text-xs z-10">
                              {formatTimeRange(
                                event.start_time,
                                event.end_time
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </>
          ) : viewMode === "day" ? (
            <>
              <div className="grid grid-cols-[80px_1fr] border-t border-l text-sm">
                <div className="border-r border-b p-2 bg-blue-50"></div>
                {today && (
                  <div
                    className={cn(
                      "border-b p-2 text-center bg-blue-50 font-semibold",
                      isSameDay(today, new Date()) && "bg-blue-300"
                    )}
                  >
                    {days[today.getDay()]} {today.getDate()}
                  </div>
                )}
                {[...Array(24)].map((_, hour) => (
                  <React.Fragment key={hour}>
                    <div className="border-r border-b p-1 text-right pr-2 bg-blue-50 text-gray-500">
                      {hour === 0
                        ? "12AM"
                        : hour < 12
                        ? `${hour}AM`
                        : hour === 12
                        ? "12PM"
                        : `${hour - 12}PM`}
                    </div>
                    <div className="border-r border-b h-25 hover:bg-blue-50 relative">
                      {/* Render all events overlapping this hour */}
                      {getEventsForHour(today, hour).map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "text-xs truncate rounded p-0.5 flex-col z-0",
                            getEventColor(event.status)
                          )}
                        >
                          {event.clinic_name}
                          <div className="text-xs z-10">
                            {formatTimeRange(event.start_time, event.end_time)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="text-sm font-medium text-blue-900">Legend:</div>
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
  );
}
