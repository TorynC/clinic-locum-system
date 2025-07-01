"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  CalendarIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getWeek, isToday } from "date-fns";
import next from "next";
import axiosInstance from "@/utils/axiosinstance";
import { parseISO, setHours, setMinutes, setSeconds } from 'date-fns';

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [events, setEvents] = useState<any[]>([]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar days (simplified for example)
  const calendarDays = getCalendarDays(currentDate);
  
  

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-purple-900">Calendar</h1>
      </div>

      <Card className="border-purple-100 overflow-hidden">
        <div className="h-1 bg-purple-gradient"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="border-purple-200 text-purple-700"
                onClick={viewMode === "month" ? prevMonth : viewMode === "week" ? prevWeek : yesterday}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-bold text-purple-900">
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
              {/*<Button
                variant="outline"
                size="sm"
                className="gap-2 border-purple-200 text-purple-700"
              >
                <CalendarIcon className="h-4 w-4" />
                Today
              </Button>*/}
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

          {viewMode === "month" ? (
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => (
                <div
                  key={day}
                  className="text-center font-medium py-2 text-purple-900"
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
                      : "hover:bg-purple-50 cursor-pointer",
                    day.isToday && "ring-2 ring-purple-400"
                  )}
                >
                  {day.date && (
                    <>
                      <div>
                        <div
                          className={cn(
                            "text-right p-1 font-medium",
                            day.isToday && "text-purple-600"
                          )}
                        >
                          {day.date.getDate()}
                        </div>
                        </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : viewMode === "week" ? (
            <>
              <div className="grid grid-cols-[80px_repeat(7,_1fr)] border-t border-l text-sm">
                <div className="border-r border-b p-2 bg-purple-50"></div>
                {getWeekDays(currentDate).map((day, i) => (
                  <div
                    key={i}
                    className={ cn("border-r border-b p-2 text-center bg-purple-50 font-semibold", day.isToday && "bg-purple-300")}
                  >
                    {days[day.date.getDay()]} {day.date.getDate()}
                  </div>
                ))}

                {[...Array(24)].map((_, hour) => (
                  <React.Fragment key={hour}>
                    <div className="border-r border-b p-1 text-right pr-2 bg-purple-50 text-gray-500 flex flex-col ">
                      {hour === 0 ? "12AM" : hour < 12? `${hour}AM`: hour === 12? "12PM" : `${hour - 12}PM`}
                    </div>
                      {getWeekDays(currentDate).map((day, i) => (
                    <div
                      key={i}
                      className="border-r border-b h-25 hover:bg-purple-50 relative truncate p-1 left-1 right-1 top-1 flex-col flex "
                    >
                      
                    </div>
                  ))}
                  </React.Fragment>
                ))}
                
              </div>
            </>
          ) : viewMode === "day" ? (
            <>
              <div className="grid grid-cols-[80px_1fr] border-t border-l text-sm">
                <div className="border-r border-b p-2 bg-purple-50"></div>
                {today && (
                  <div className={cn("border-b p-2 text-center bg-purple-50 font-semibold", isSameDay(today, new Date()) && "bg-purple-300")}>
                    {days[today.getDay()]} {today.getDate()} 
                  </div>
                )}

                {[...Array(24)].map((_, hour) => (
                  <React.Fragment key={hour}>
                    <div className="border-r border-b p-1 text-right pr-2 bg-purple-50 text-gray-500">
                      {hour === 0 ? "12AM" : hour < 12? `${hour}AM`: hour === 12? "12PM" : `${hour - 12}PM`}
                    </div>
                    <div className="border-r border-b h-25 hover:bg-purple-50 relative">
                    
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

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
            <div className="w-3 h-3 rounded-full bg-indigo-100 border border-indigo-400 mr-2"></div>
            <span className="text-sm">Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  );
}


