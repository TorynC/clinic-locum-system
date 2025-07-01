"use client"
import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Star,
  Bell,
  TrendingUp,
  ArrowRight,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/utils/axiosinstance";

export default function DoctorHomePage() {
  const [name, setName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);

  // get name
  const getName = async (id: String) => {
    const token = localStorage.getItem("doctorAccessToken");
    try {
      const response = await axiosInstance.get(`/get-doctor/${doctorId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!response.data.error) {
        setName(response.data.doctor.name);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // function to get all available jobs 
  const getAllJobs = async () => {
    const token = localStorage.getItem("doctorAccessToken");
    try {
      const result = await axiosInstance.get(`/get-all-jobs`, 
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          }
        })
      if (!result.data.error) {
        setJobs(result.data.jobs);
        console.log("jobs retrieved successfully")
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const storedId = localStorage.getItem("doctorId");
    if (storedId) {
      setDoctorId(storedId);
    }
  }, []);

  useEffect(() => {
    if (doctorId) {
      getName(doctorId);
      getAllJobs();
    }
  }, [doctorId]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-20 md:pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{`Welcome back, Dr. ${name}`}</h1>
          <p className="text-slate-600 mt-1">
            Discover new opportunities and manage your locum schedule
          </p>
        </div>
        <Button
          asChild
          className="bg-emerald-gradient text-white font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 transform hover:-translate-y-0.5 w-full sm:w-auto"
        >
          <Link
            href="/doctor/jobs"
            className="flex items-center justify-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Browse Jobs
          </Link>
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Briefcase className="w-5 sm:w-6 h-5 sm:h-6 text-white-600" />}
          title="Available Jobs"
          value={`${jobs.length}`}
          change="Matching your profile"
          changeType="neutral"
          color="blue"
        />
        <MetricCard
          icon={<Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-white-600" />}
          title="Upcoming Shifts"
          value="3"
          change="Next 7 days"
          changeType="neutral"
          color="emerald"
        />
        <MetricCard
          icon={<Clock className="w-5 sm:w-6 h-5 sm:h-6 text-white-600" />}
          title="Hours Worked"
          value="42"
          change="+8 from last month"
          changeType="positive"
          color="orange"
        />
        <MetricCard
          icon={<DollarSign className="w-5 sm:w-6 h-5 sm:h-6 text-white-600" />}
          title="Earnings"
          value="RM 3,570"
          change="This month"
          changeType="neutral"
          color="rose"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Upcoming Shifts */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-medium">
            <CardHeader className="pb-2 sm:pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900">
                    Upcoming Shifts
                  </CardTitle>
                  <CardDescription>Your confirmed appointments</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="btn-secondary hidden sm:flex"
                >
                  <Link href="/doctor/calendar">View Calendar</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
              {[
                {
                  clinic: "Klinik Kesihatan Bandar",
                  location: "Kuala Lumpur",
                  date: "Today",
                  time: "9:00 AM - 5:00 PM",
                  pay: "RM 400",
                  type: "General Practice",
                },
                {
                  clinic: "Pusat Pediatrik KidsCare",
                  location: "Petaling Jaya",
                  date: "Tomorrow",
                  time: "10:00 AM - 6:00 PM",
                  pay: "RM 440",
                  type: "Pediatrics",
                },
                {
                  clinic: "Klinik Keluarga Ampang",
                  location: "Ampang",
                  date: "May 18",
                  time: "2:00 PM - 8:00 PM",
                  pay: "RM 270",
                  type: "General Practice",
                },
              ].map((shift, i) => (
                <div
                  key={i}
                  className="flex items-center p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mr-3 sm:mr-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                        {shift.clinic}
                      </p>
                      <Badge className="status-upcoming ml-2 flex-shrink-0">
                        Confirmed
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs sm:text-sm text-slate-600">
                      <div className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                        {shift.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                        {shift.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                        {shift.location}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs sm:text-sm text-slate-500">
                        {shift.type}
                      </span>
                      <span className="font-semibold text-emerald-600 text-sm sm:text-base">
                        {shift.pay}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full btn-secondary sm:hidden"
                asChild
              >
                <Link href="/doctor/calendar">View Calendar</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-0 shadow-medium">
            <CardHeader className="pb-2 sm:pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900">Recommended</CardTitle>
                  <CardDescription>Jobs matching your profile</CardDescription>
                </div>
                <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
                  5 New
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
              {[
                {
                  clinic: "Pusat Kesihatan Cheras",
                  location: "Cheras",
                  date: "May 22",
                  time: "9:00 AM - 1:00 PM",
                  pay: "RM 180",
                  genderPref: "Any",
                  isNew: true,
                  urgency: "high",
                },
                {
                  clinic: "Klinik Wanita Ampang",
                  location: "Ampang",
                  date: "May 25",
                  time: "2:00 PM - 6:00 PM",
                  pay: "RM 200",
                  genderPref: "Female",
                  isNew: true,
                  urgency: "medium",
                },
                {
                  clinic: "Klinik Pergigian Dental Plus",
                  location: "Subang Jaya",
                  date: "May 28",
                  time: "8:00 AM - 4:00 PM",
                  pay: "RM 384",
                  genderPref: "Any",
                  isNew: false,
                  urgency: "low",
                },
              ].map((job, i) => (
                <div
                  key={i}
                  className="p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                          {job.clinic}
                        </p>
                        {job.isNew && (
                          <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs flex-shrink-0">
                            New
                          </Badge>
                        )}
                        {job.genderPref === "Female" && (
                          <Badge className="bg-pink-100 text-pink-700 border border-pink-200 text-xs flex-shrink-0">
                            Female Dr
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs sm:text-sm text-slate-600">
                        <div className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          {job.date}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1" />
                          {job.location}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs sm:text-sm text-slate-500">
                          {job.time}
                        </span>
                        <span className="font-semibold text-blue-600 text-sm sm:text-base">
                          {job.pay}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors ml-2 flex-shrink-0" />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full btn-secondary">
                <Link href="/doctor/jobs">View All Jobs</Link>
              </Button>
            </CardContent>  
          </Card>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        {/* Recent Ratings */}
        <Card className="border-0 shadow-medium">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-slate-900">Recent Reviews</CardTitle>
            <CardDescription>Feedback from your recent shifts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
            {[
              {
                clinic: "Klinik Kesihatan Bandar",
                date: "May 10, 2025",
                rating: 5,
                comment:
                  "Excellent work ethic and patient care. Would definitely hire again.",
              },
              {
                clinic: "Pusat Pediatrik KidsCare",
                date: "May 8, 2025",
                rating: 4,
                comment:
                  "Great with children and very professional. Arrived on time.",
              },
            ].map((review, i) => (
              <div key={i} className="p-3 sm:p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-slate-900 text-sm sm:text-base">
                    {review.clinic}
                  </p>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                          i < review.rating
                            ? "fill-orange-400 text-orange-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mb-2">
                  {review.comment}
                </p>
                <p className="text-xs text-slate-500">{review.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-medium">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-slate-900">Notifications</CardTitle>
            <CardDescription>Recent updates and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
            {[
              {
                title: "New Job Matches",
                description: "5 new jobs match your profile in KL area",
                time: "2 hours ago",
                type: "info",
                icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />,
              },
              {
                title: "Shift Reminder",
                description: "You have a shift tomorrow at 9:00 AM",
                time: "1 day ago",
                type: "warning",
                icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />,
              },
              {
                title: "Profile Verified",
                description: "Your profile has been successfully verified",
                time: "2 days ago",
                type: "success",
                icon: <Bell className="w-4 h-4 sm:w-5 sm:h-5" />,
              },
            ].map((notification, i) => (
              <div
                key={i}
                className="flex items-start p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 ${
                    notification.type === "info"
                      ? "bg-blue-100 text-blue-600"
                      : notification.type === "warning"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {notification.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                      {notification.title}
                    </p>
                    <p className="text-xs text-slate-500 ml-2 flex-shrink-0">
                      {notification.time}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {notification.description}
                  </p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full btn-secondary">
              <Link href="/doctor/notifications">View All Notifications</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
  change,
  changeType,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  color: "blue" | "emerald" | "orange" | "rose";
}) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    emerald: "from-emerald-500 to-emerald-600",
    orange: "from-orange-500 to-orange-600",
    rose: "from-rose-500 to-rose-600",
  };

  return (
    <Card className="border-0 shadow-medium hover:shadow-strong transition-all duration-200 group">
      <CardContent className="p-3 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-slate-600">
              {title}
            </p>
            <p className="text-xl sm:text-3xl font-bold text-slate-900 mt-1 sm:mt-2">
              {value}
            </p>
            <div className="flex items-center mt-1 sm:mt-2">
              {changeType === "positive" && (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 mr-1" />
              )}
              <p
                className={`text-xs sm:text-sm ${
                  changeType === "positive"
                    ? "text-emerald-600"
                    : changeType === "negative"
                    ? "text-rose-600"
                    : "text-slate-500"
                }`}
              >
                {change}
              </p>
            </div>
          </div>
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
