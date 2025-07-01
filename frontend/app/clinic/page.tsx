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
import { Calendar, ClipboardList, Users, Clock, Trash2, BarChart3, TrendingUp, Plus, ArrowRight } from "lucide-react";
import axiosInstance from "@/utils/axiosinstance";
import { useState } from "react";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge"
import { link } from "fs";


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
    try{
      const response = await axiosInstance.get(`/clinic-applications/${clinicId}`);
      if (!response.data.error) {
        setApplications(response.data.applications);
        console.log("applications retrieved")
      }
    } catch (error) {
      console.error(error);
    }
  }

  // function to delete job 
  const deleteJob = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/delete-job/${id}`);
      if (!response.data.error) {
        console.log("Job deleted successfully!")
        getJobs();
      }
    } catch (error) {
      console.error(error)
    }
  }

  // function to get all doctors 
  const getDoctors = async() => {
    try { 
      const response = await axiosInstance.get('/get-doctors');
      if (!response.data.error) {
        console.log("Doctors retrieved successfully");
        setDoctors(response.data.doctors);
        
      }
    } catch (error) {
      console.error(error);
    }
  }

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
  }

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
  

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Welcome back{clinicName ? `, ${clinicName}` : ""}</h1>
          <p className="text-slate-600 mt-1">Here's what's happening with your locum bookings today</p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 transform hover:-translate-y-0.5 w-full sm:w-auto"
        >
          <Link href="/clinic/post-job" className="flex items-center justify-center">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Link>
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<BarChart3 className="w-5 sm:w-6 h-5 sm:h-6 text-white" />}
          title="Active Jobs"
          value="12"
          change="+3 from last week"
          changeType="positive"
          color="blue"
        />
        <MetricCard
          icon={<Users className="w-5 sm:w-6 h-5 sm:h-6 text-white-600" />}
          title="Applications"
          value="28"
          change="+12 from last week"
          changeType="positive"
          color="emerald"
        />
        <MetricCard
          icon={<Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-white-600" />}
          title="Upcoming Shifts"
          value="8"
          change="Next 7 days"
          changeType="neutral"
          color="orange"
        />
        <MetricCard
          icon={<Clock className="w-5 sm:w-6 h-5 sm:h-6 text-white-600" />}
          title="Hours Booked"
          value="156"
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
                  <CardTitle className="text-slate-900">Upcoming Shifts</CardTitle>
                  <CardDescription>Your schedule for the next 7 days</CardDescription>
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
              {[
                {
                  date: "Today",
                  time: "9:00 AM - 5:00 PM",
                  doctor: "Dr. Siti Aminah",
                  type: "General Practice",
                  status: "confirmed",
                },
                {
                  date: "Tomorrow",
                  time: "10:00 AM - 6:00 PM",
                  doctor: "Dr. Ahmad Rahman",
                  type: "Pediatrics",
                  status: "confirmed",
                },
                {
                  date: "May 15",
                  time: "8:00 AM - 4:00 PM",
                  doctor: "Pending Applications",
                  type: "Dental",
                  status: "pending",
                },
              ].map((shift, i) => (
                <div
                  key={i}
                  className="flex items-center p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                >
                  <div
                    className={`w-3 h-3 rounded-full mr-3 sm:mr-4 ${
                      shift.status === "confirmed" ? "bg-emerald-500" : "bg-orange-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                        {shift.date} • {shift.time}
                      </p>
                      <Badge
                        className={
                          shift.status === "confirmed"
                            ? "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 ml-2 flex-shrink-0"
                            : "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200 ml-2 flex-shrink-0"
                        }
                      >
                        {shift.status === "confirmed" ? "Confirmed" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-slate-600 mt-1 text-sm truncate">
                      {shift.doctor} • {shift.type}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors ml-2 flex-shrink-0" />
                </div>
              ))}
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
              <CardTitle className="text-slate-900">Recent Applications</CardTitle>
              <CardDescription>Doctors who applied recently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
              {applications.slice(0,3).map((doctor, i) => {
                const doctorObj = doctors.find(d => d.id === doctor.doctor_id);
                const doctorProfileObj = doctorProfiles.find(d => d.id === doctor.doctor_id);
                return (
                <div
                  key={i}
                  className="flex items-center p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 text-blue-600 mr-3 sm:mr-4 flex items-center justify-center font-semibold flex-shrink-0">
                    {(doctor.doctor_name || "")
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">{doctorObj?.name || ""}</p>
                      <div className="flex items-center text-orange-500 ml-2 flex-shrink-0">
                        <span className="text-sm font-medium">rating</span>
                        <span className="text-xs ml-1">★</span>
                      </div>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm truncate">
                      {doctorProfileObj?.specialization || "No Specialization"} • {`${doctorProfileObj?.experience_years || "0"} Years`}
                    </p>
                  </div>
                  
                </div>
                )
              })}
              <Button
                variant="outline"
                className="w-full bg-white text-slate-700 font-medium px-6 py-2.5 rounded-xl border border-slate-200 shadow-soft hover:shadow-medium transition-all duration-200"
                
              >
                <Link href={"/clinic/applications"}>View All Applications</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-0 shadow-medium hover:shadow-strong transition-all duration-200 cursor-pointer group">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Post a Job</h3>
                <p className="text-slate-600 text-xs sm:text-sm">Create a new locum position</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-medium hover:shadow-strong transition-all duration-200 cursor-pointer group">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Browse Doctors</h3>
                <p className="text-slate-600 text-xs sm:text-sm">Find preferred doctors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-medium hover:shadow-strong transition-all duration-200 cursor-pointer group">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">View Analytics</h3>
                <p className="text-slate-600 text-xs sm:text-sm">Track your performance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="border-purple-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-purple-900">All Upcoming Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs
              .slice()
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((job) => {
                const assignedDoctor = doctors.find(d => d.id === job.doctor_id)
                return (
                <div
                  key={job.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-purple-100 rounded-xl bg-white hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-center gap-4  min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl flex-shrink-0">
                      {job.title.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-base truncate">{job.title}</span>
                        <Badge
                          className={
                            job.status === "Accepted"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200 text-xs"
                              : "bg-orange-100 text-orange-700 border-orange-200 text-xs"
                          }
                        >
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </Badge>
                        
                        <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-200">
                          {job.procedure?.map((skill: string, id: number) => (
                            <Badge
                              className="bg-purple-100 text-purple-700 border-purple-200 text-xs flex items-center whitespace-nowrap"
                              key={id}
                            >
                              {skill.trim()}
                            </Badge>
                          ))}
                        </div>
                      
                      </div>
                      <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-x-2 gap-y-1">
                        <span>
                          <Calendar className="inline w-4 h-4 mr-1" />
                          {new Date(job.date).toLocaleDateString("en-MY", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            timeZone: "Asia/Kuala_Lumpur",
                          })}
                        </span>
                        <span>
                          <Clock className="inline w-4 h-4 mr-1" />
                          {job.start_time} - {job.end_time}
                        </span>
                        <span>
                          <span className="font-medium">Pay:</span> RM{job.total_pay}
                        </span>
                        <span>
                          <span className="font-medium">Job ID:</span> {job.id}
                        </span>
                        {assignedDoctor && <span>
                          <span className="font-medium">Assigned Doctor: </span> {assignedDoctor.name}
                        </span>}
                      </div>
                    </div>
                  </div>
                  <button
                    className="rounded-full bg-purple-50 hover:bg-purple-200 p-2 transition-colors border-none outline-none"
                    onClick={() => deleteJob(job.id)}
                    aria-label="Delete job"
                    type="button"
                  >
                    <Trash2 className="h-5 w-5 text-purple-500" />
                  </button>
                </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({
  icon,
  title,
  value,
  change,
  changeType,
  color,
}: {
  icon: React.ReactNode
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  color: "blue" | "emerald" | "orange" | "rose"
}) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    emerald: "from-emerald-500 to-emerald-600",
    orange: "from-orange-500 to-orange-600",
    rose: "from-rose-500 to-rose-600",
  }

  return (
    <Card className="border-0 shadow-medium hover:shadow-strong transition-all duration-200 group">
      <CardContent className="p-3 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-slate-600">{title}</p>
            <p className="text-xl sm:text-3xl font-bold text-slate-900 mt-1 sm:mt-2">{value}</p>
            <div className="flex items-center mt-1 sm:mt-2">
              {changeType === "positive" && <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 mr-1" />}
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
  )
}