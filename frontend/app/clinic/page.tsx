"use client";

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
  Calendar,
  Users,
  Clock,
  Trash2,
  BarChart3,
  TrendingUp,
  Plus,
  DollarSign,
  Pencil,
} from "lucide-react";
import axiosInstance from "@/utils/axiosinstance";
import { useState } from "react";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { formatTimeRange } from "@/utils/timeUtils";
import { cn } from "@/lib/utils";

export default function ClinicHomePage() {
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [clinicName, setClinicName] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [doctorProfiles, setDoctorProfiles] = useState<any[]>([]);

  // get jobs
  const getJobs = async () => {
    try {
      const response = await axiosInstance.get(`/get-jobs/${clinicId}/jobs`);
      if (!response.data.error) {
        setJobs(response.data.jobs);
        console.log("retrieved jobs!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // get all job applications specific to this clinic
  const getApplications = async () => {
    try {
      const response = await axiosInstance.get(
        `/clinic-applications/${clinicId}`
      );
      if (!response.data.error) {
        setApplications(response.data.applications);
        console.log("applications retrieved");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // function to delete job
  const deleteJob = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/delete-job/${id}`);
      if (!response.data.error) {
        console.log("Job deleted successfully!");
        getJobs();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // function to get all doctors
  const getDoctors = async () => {
    try {
      const response = await axiosInstance.get("/get-doctors");
      if (!response.data.error) {
        console.log("Doctors retrieved successfully");
        setDoctors(response.data.doctors);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //function to get all doctor profiles
  const getDoctorProfiles = async () => {
    try {
      const response = await axiosInstance.get("/get-all-doctor-profile");
      if (!response.data.error) {
        console.log("Doctor profiles received successfully");
        setDoctorProfiles(response.data.doctors);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //function to get clinic name
  const getClinicName = async () => {
    try {
      const response = await axiosInstance.get(`/get-clinic/${clinicId}`);
      if (!response.data.error) {
        setClinicName(response.data.clinic.clinic_name);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const storedId = localStorage.getItem("clinicId");
    if (storedId) {
      setClinicId(storedId);
    }
  }, []);

  useEffect(() => {
    if (clinicId) {
      getClinicName();
      getJobs();
      getApplications();
      getDoctors();
      getDoctorProfiles();
    }
  }, [clinicId]);

  // Calculate metrics
  const activeJobs = jobs.filter(
    (job) => job.status === "posted" || job.status === "Accepted"
  ).length;
  const totalApplications = applications.length;

  // Upcoming shifts in next 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDaysLater = new Date(today);
  sevenDaysLater.setDate(today.getDate() + 7);

  const upcomingShifts = jobs.filter((job) => {
    const shiftDate = new Date(job.date);
    shiftDate.setHours(0, 0, 0, 0);
    return (
      shiftDate >= today &&
      shiftDate <= sevenDaysLater &&
      job.status === "Accepted"
    );
  }).length;

  // Total hours booked this month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const hoursBooked = jobs
    .filter((job) => {
      const jobDate = new Date(job.date);
      return (
        (job.status === "Accepted" || job.status === "Completed") &&
        jobDate.getMonth() === currentMonth &&
        jobDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, job) => sum + (job.duration || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Welcome back{clinicName ? `, ${clinicName}` : ""}
          </h1>
          <p className="text-slate-600 mt-1">
            Here's what's happening with your locum bookings today
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 transform hover:-translate-y-0.5 w-full sm:w-auto"
        >
          <Link
            href="/clinic/post-job"
            className="flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<BarChart3 className="w-5 sm:w-6 h-5 sm:h-6 text-white" />}
          title="Active Jobs"
          value={activeJobs.toString()}
          change=""
          changeType="neutral"
          color="blue"
        />
        <MetricCard
          icon={<Users className="w-5 sm:w-6 h-5 sm:h-6 text-white-600" />}
          title="Applications"
          value={totalApplications.toString()}
          change=""
          changeType="neutral"
          color="emerald"
        />
        <MetricCard
          icon={<Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-white-600" />}
          title="Upcoming Shifts"
          value={upcomingShifts.toString()}
          change="Next 7 days"
          changeType="neutral"
          color="orange"
        />
        <MetricCard
          icon={<Clock className="w-5 sm:w-6 h-5 sm:h-6 text-white-600" />}
          title="Hours Booked"
          value={hoursBooked.toFixed(2).toString()}
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
                  <CardDescription>
                    Your schedule for the next 7 days
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="bg-white text-slate-700 font-medium px-3 sm:px-6 py-2 sm:py-3 rounded-xl border border-slate-200 shadow-soft hover:shadow-medium transition-all duration-200 transform hover:-translate-y-0.5 hidden sm:flex"
                >
                  <Link href="/clinic/calendar">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
              {jobs
                .filter((shift) => {
                  const shiftDateObj = new Date(shift.date);
                  shiftDateObj.setHours(0, 0, 0, 0);
                  return (
                    shift.doctor_id &&
                    shift.status === "Accepted" &&
                    shiftDateObj >= today
                  );
                })
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .slice(0, 3)
                .map((shift, i) => {
                  const doctorObj = doctors.find(
                    (d) => d.id === shift.doctor_id
                  );
                  const doctorProfile = doctorProfiles.find(
                    (d) => d.id === shift.doctor_id
                  );

                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const shiftDateObj = new Date(shift.date);
                  shiftDateObj.setHours(0, 0, 0, 0);

                  const tomorrow = new Date();
                  tomorrow.setDate(today.getDate() + 1);
                  tomorrow.setHours(0, 0, 0, 0);

                  return shift.doctor_id && shiftDateObj >= today ? (
                    <Link key={shift?.id} href={`/clinic/jobs/${shift?.id}`}>
                      <div
                        key={i}
                        className="flex items-center p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                      >
                        <div
                          className={`w-3 h-3 rounded-full mr-3 sm:mr-4 ${
                            shift.status === "Accepted"
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                              {shiftDateObj.getTime() === today.getTime()
                                ? "Today"
                                : shiftDateObj.getTime() === tomorrow.getTime()
                                ? "Tomorrow"
                                : shiftDateObj.toLocaleDateString("en-MY", {
                                    day: "2-digit",
                                    month: "long",
                                    timeZone: "Asia/Kuala_Lumpur",
                                  })}{" "}
                              •{" "}
                              {formatTimeRange(
                                shift.start_time,
                                shift.end_time
                              )}
                            </p>
                            <Badge
                              className={
                                shift.status === "Accepted"
                                  ? "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 ml-2 flex-shrink-0"
                                  : "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 ml-2 flex-shrink-0"
                              }
                            >
                              {shift.status === "Accepted"
                                ? "Confirmed"
                                : "Cancelled"}
                            </Badge>
                          </div>
                          <p className="text-slate-600 mt-1 text-sm truncate">
                            {doctorObj?.name}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ) : null;
                })}
              <Button
                variant="outline"
                className="w-full bg-white text-slate-700 font-medium px-6 py-2.5 rounded-xl border border-slate-200 shadow-soft hover:shadow-medium transition-all duration-200 sm:hidden mt-2"
                asChild
              >
                <Link href="/clinic/calendar">View All Shifts</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-0 shadow-medium">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-slate-900">
                Recent Applications
              </CardTitle>
              <CardDescription>Doctors who applied recently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
              {applications.slice(0, 3).map((doctor, i) => {
                const doctorObj = doctors.find(
                  (d) => d.id === doctor.doctor_id
                );
                const doctorProfileObj = doctorProfiles.find(
                  (d) => d.id === doctor.doctor_id
                );
                return (
                  <div
                    key={i}
                    className="flex items-center p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 text-blue-600 mr-3 sm:mr-4 flex items-center justify-center font-semibold flex-shrink-0">
                      {(doctor.doctor_name || "")
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                          {doctorObj?.name || ""}
                        </p>
                        <div className="flex items-center text-orange-500 ml-2 flex-shrink-0">
                          <span className="text-sm font-medium">
                            {doctorProfileObj?.reliability_rating}
                          </span>
                          <span className="text-xs ml-1">★</span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-xs sm:text-sm truncate">
                        {`${doctorProfileObj?.experience_years || "0"} Years`}
                      </p>
                    </div>
                  </div>
                );
              })}
              <Button
                variant="outline"
                className="w-full bg-white text-slate-700 font-medium px-6 py-2.5 rounded-xl border border-slate-200 shadow-soft hover:shadow-medium transition-all duration-200"
                asChild
              >
                <Link href={"/clinic/applications"}>View All Applications</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-purple-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-black-900">Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {jobs
              .slice()
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
              .map((job) => {
                const assignedDoctor = doctors.find(
                  (d) => d.id === job.doctor_id
                );
                return (
                  <div key={job.id} className="relative group">
                    <Link href={`/clinic/jobs/${job.id}`} className="block">
                      <Card
                        className={cn(
                          "border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden bg-white",
                          job.status === "Urgent" && "border-2 border-red-400"
                        )}
                      >
                        <CardContent className="p-0">
                          <div className="flex">
                            {/* Left Section - Date, Time & Duration */}
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 md:p-4 flex flex-col justify-center items-center text-center min-w-[100px] sm:min-w-[110px] md:min-w-[140px]">
                              <div className="text-xs md:text-sm font-medium opacity-90 mb-0.5">
                                {new Date(job.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    timeZone: "Asia/Kuala_Lumpur",
                                    month: "long",
                                  }
                                )}
                              </div>
                              <div className="text-3xl md:text-4xl font-bold mb-2">
                                {new Date(job.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    timeZone: "Asia/Kuala_Lumpur",
                                    day: "2-digit",
                                  }
                                )}
                              </div>
                              <div className="space-y-0.5 mb-2">
                                <div className="text-xs md:text-sm font-medium">
                                  {
                                    formatTimeRange(
                                      job.start_time,
                                      job.end_time
                                    ).split("-")[0]
                                  }
                                </div>
                                <div className="text-xs md:text-sm font-medium opacity-75">
                                  -
                                </div>
                                <div className="text-xs md:text-sm font-medium">
                                  {
                                    formatTimeRange(
                                      job.start_time,
                                      job.end_time
                                    ).split("-")[1]
                                  }
                                </div>
                              </div>
                              <div className="flex items-center justify-center bg-white/20 rounded px-1.5 py-0.5 border border-white/30">
                                <Clock className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" />
                                <span className="text-xs md:text-sm font-bold">
                                  {job.duration} h
                                </span>
                              </div>
                            </div>

                            {/* Right Section - Job Details */}
                            <div className="flex-1 p-2.5 md:p-4 relative">
                              {/* Header - Doctor Info & Status */}
                              <div className="mb-2.5 md:mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <h3 className="text-base md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1.5 md:mb-2">
                                  Locum Doctor
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {job.status === "Urgent" && (
                                    <Badge className="bg-red-100 text-red-700 border-red-200 font-semibold animate-pulse">
                                      Urgent
                                    </Badge>
                                  )}
                                  {job.status === "Accepted" && (
                                    <Badge className="bg-green-100 text-green-700 border-green-200 font-semibold">
                                      Confirmed
                                    </Badge>
                                  )}
                                  {assignedDoctor && (
                                    <Badge className="bg-cyan-100 text-cyan-700 border-green-200 font-semibold">
                                      {`Doctor Assigned: ${assignedDoctor.name}`}
                                    </Badge>
                                  )}
                                  {job.status === "posted" && (
                                    <Badge className="bg-blue-100 text-blue-700 border-green-200 font-semibold">
                                      Posted
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Gender, Break, Incentives */}
                              <div className="flex flex-wrap gap-1 md:gap-2 mb-2.5 md:mb-3">
                                <Badge
                                  className={cn(
                                    "text-xs md:text-sm font-medium border px-2 py-0.5 md:px-3 md:py-1",
                                    job.gender === "Female"
                                      ? "bg-pink-100 text-pink-700 border-pink-200"
                                      : job.gender === "Male"
                                      ? "bg-blue-100 text-blue-700 border-blue-200"
                                      : "bg-slate-100 text-slate-700 border-slate-200"
                                  )}
                                >
                                  {job.gender}
                                </Badge>
                                {/* Paid/Unpaid Break Tag */}
                                {job.has_break && job.paid_break ? (
                                  <Badge className="bg-green-100 text-green-700 border-green-200">
                                    Paid Break
                                  </Badge>
                                ) : job.has_break && !job.paid_break ? (
                                  <Badge className="bg-red-100 text-red-700 border-red-200">
                                    Unpaid Break
                                  </Badge>
                                ) : null}
                               
                              </div>

                              {/* Rate/Hour and Total Pay */}
                              <div className="flex items-center gap-2 md:gap-4">
                                <div className="bg-green-100 border-2 border-green-300 rounded-lg px-3 py-2 md:px-4 md:py-3 shadow-sm">
                                  <span className="text-sm md:text-lg font-bold text-green-900">
                                    RM{job.rate}/hr
                                  </span>
                                </div>
                                <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full border-2 border-red-200 bg-red-50">
                                  <span className="text-sm md:text-lg font-bold text-red-600">
                                    RM{job.total_pay}++
                                  </span>
                                </div>
                               
                                  
                                
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                    <button
  className="absolute bottom-2 right-2 rounded-xl bg-blue-50 hover:bg-blue-200 p-2 transition-colors border-blue-200 z-10"
  onClick={() => deleteJob(job.id)}
  aria-label="Delete job"
  type="button"
>
  <Trash2 className="h-5 w-5 text-blue-500" />
</button>
                    
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
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
