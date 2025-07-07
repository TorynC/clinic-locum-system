"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import axiosInstance from "@/utils/axiosinstance";

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [jobs, setJobs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Generate calendar days (simplified for example)
  const calendarDays = getCalendarDays(currentDate);
  
  // get jobs 
  const getJobs = async () => {
    try {
      const response = await axiosInstance.get(`/get-jobs/${clinicId}/jobs`);
      if (!response.data.error) {
        setJobs(response.data.jobs);
      }
    } catch (error) {
      console.error(error)
    }
  }

  // get doctors 
  const getDoctors = async () => {
    try { 
      const response = await axiosInstance.get(`/get-doctors`)
      if (!response.data.error) {
        setDoctors(response.data.doctors)
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Get real calendar days
  function getCalendarDays(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const current = new Date(year, month, i + 1);
      return {
        date: current,
        isToday: isSameDay(current, new Date()),
      };
    });
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
  console.log(events)
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
    newDate.setDate(currentDate.getDate() + 7)
    setCurrentDate(newDate); 
  };

  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7)
    setCurrentDate(newDate);
  }

  const tomorrow = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  }

  const yesterday = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  }

  const today = currentDate

  useEffect(() => {
    const storedId = localStorage.getItem("clinicId");
    if (storedId) {
      setClinicId(storedId);
    }
  }, []);

  useEffect(() => {
    if (clinicId) {
      getJobs();
      getDoctors();
    }
  }, [clinicId])

  useEffect(() => {
      if (jobs.length > 0 && doctors.length > 0) {
      const formattedEvents = jobs.map((job) => {
      const utcDate = new Date(job.date);
      const malaysiaDate = new Date(utcDate.getTime() + 28800000);
      const doctorObj = doctors.find(d => d.id === job.doctor_id)
      // Parse time components
      const [startH, startM, startS] = job.start_time.split(':').map(Number);
      const [endH, endM, endS] = job.end_time.split(':').map(Number);

      // Set times on Malaysia date
      const start = new Date(malaysiaDate)
      start.setHours(startH, startM, startS);

      const end = new Date(malaysiaDate);
      end.setHours(endH, endM, endS);

      if (end <= start) {
        end.setDate(end.getDate() + 1)
      }
      return {
        start,
        end,
        status: job.status,
        id: job.id,
        start_time: job.start_time,
        end_time: job.end_time,
        doctor_name: doctorObj ? doctorObj.name :  ""
      };
    });
    setEvents(formattedEvents);
  }
}, [jobs, doctors]);


  const getEventsforDayMonth = (day: Date) => {
    return events.filter(event =>
      event.start.getDate() === day.getDate() &&
      event.start.getMonth() === day.getMonth() &&
      event.start.getFullYear() === day.getFullYear()
    )
  }

  const getEventsforDayWeek = (day: Date) => {
    const startOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0);
    const endOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59);

    return events.filter(event =>
      event.end > startOfDay && event.start < endOfDay
    );
  };

  function getJobColor(status: string) {
    switch (status) {
      case "posted":
        return "bg-purple-100 border border-purple-400 text-purple-800";
      case "Accepted":
        return "bg-green-100 border border-green-400 text-green-800";
      case "Completed":
        return "bg-indigo-100 border border-indigo-400 text-indigo-800";
      default:
        return "bg-gray-100 border border-gray-400 text-gray-800";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Calendar</h1>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            asChild
            className="bg-blue-700 hover:bg-blue-900"
          >
            <Link href="/clinic/post-job">
              <Plus className="h-4 w-4 mr-2" />
              Post Job
            </Link>
          </Button>
        </div>
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
                onClick={viewMode === "month" ? prevMonth : viewMode === "week" ? prevWeek : yesterday}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-bold text-blue-900">
                {currentMonth}
              </h2>
              <Button
                variant="outline"
                size="icon"
                className="border-purple-200 text-purple-700"
                onClick={viewMode === "month" ? nextMonth : viewMode === "week" ? nextWeek : tomorrow}
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
                    !day.date
                      ? "bg-gray-50 text-gray-400"
                      : "hover:bg-blue-50 cursor-pointer",
                    day.isToday && "ring-2 ring-blue-400"
                  )}
                >
                  {day.date && (
                    <>
                      <div>
                        <div
                          className={cn(
                            "text-right p-1 font-medium",
                            day.isToday && "text-blue-600"
                          )}
                        >
                          {day.date.getDate()}
                        </div>
                          {getEventsforDayMonth(day.date).map(event => (
                            <div key={event.id}  className={cn(
                              "text-xs truncate rounded p-0.5 flex-col z-0 ",
                              getJobColor(event.status))}>
                              {event.doctor_name} 
                              <div className=" text-xs z-10">
                                {`${event.start_time}-${event.end_time}`}
                              </div>
                            </div>
                          ))}
                        </div>
                    </>
                  )}
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
                    className={ cn("border-r border-b p-2 text-center bg-blue-50 font-semibold", day.isToday && "bg-blue-300")}
                  >
                    {days[day.date.getDay()]} {day.date.getDate()}
                  </div>
                ))}

                {[...Array(24)].map((_, hour) => (
                  <React.Fragment key={hour}>
                    <div className="border-r border-b p-1 text-right pr-2 bg-blue-50 text-gray-500 flex flex-col ">
                      {hour === 0 ? "12AM" : hour < 12? `${hour}AM`: hour === 12? "12PM" : `${hour - 12}PM`}
                    </div>
                      {getWeekDays(currentDate).map((day, i) => (
                    <div
                      key={i}
                      className="border-r border-b h-25 hover:bg-blue-50 relative truncate p-1 left-1 right-1 top-1 flex-col flex "
                    >
                      {getEventsforDayWeek(day.date)
                          .filter(event => 
                            (event.start <= new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate(), hour, 59, 59)) &&
                            (event.end > new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate(), hour, 0, 0)))
                            .map(event => (
                            <div key={event.id}  className={cn(
                              "text-xs truncate rounded p-0.5 flex-col z-0 ",
                              getJobColor(event.status))}>
                              {event.doctor_name} 
                              <div className=" text-xs z-10">
                                {`${event.start_time}-${event.end_time}`}
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
                  <div className={cn("border-b p-2 text-center bg-blue-50 font-semibold", isSameDay(today, new Date()) && "bg-blue-300")}>
                    {days[today.getDay()]} {today.getDate()} 
                  </div>
                )}

                {[...Array(24)].map((_, hour) => (
                  <React.Fragment key={hour}>
                    <div className="border-r border-b p-1 text-right pr-2 bg-blue-50 text-gray-500">
                      {hour === 0 ? "12AM" : hour < 12? `${hour}AM`: hour === 12? "12PM" : `${hour - 12}PM`}
                    </div>
                    <div className="border-r border-b h-25 hover:bg-blue-50 relative">
                      {getEventsforDayWeek(today)
                          .filter(event => 
                            (event.start <= new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, 59, 59)) &&
                            (event.end > new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, 0, 0)))
                            .map(event => (
                            <div key={event.id}  className={cn(
                              "text-xs truncate rounded p-0.5 flex-col z-0 ",
                              getJobColor(event.status))}>
                              {event.doctor_name} 
                              <div className=" text-xs z-10">
                                {`${event.start_time}-${event.end_time}`}
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
  );
}


