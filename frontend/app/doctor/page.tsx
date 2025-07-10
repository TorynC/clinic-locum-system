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
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/utils/axiosinstance";
import { formatTimeRange } from "@/utils/timeUtils";
import { useRouter } from "next/navigation";

// MetricCard component for displaying metrics
type MetricCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  color: "blue" | "emerald" | "orange" | "rose";
};

const colorClasses: Record<string, string> = {
  blue: "from-blue-500 to-blue-600",
  emerald: "from-emerald-500 to-emerald-600",
  orange: "from-orange-500 to-orange-600",
  rose: "from-rose-500 to-rose-600",
};



function MetricCard({
  icon,
  title,
  value,
  change,
  changeType,
  color,
}: MetricCardProps) {
  return (
    <Card className="border-0 shadow-medium hover:shadow-strong transition-all duration-200 group">
      <CardContent className="p-3 sm:p-6">
        <div className="flex items-center justify-between">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0`}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0 ml-4">
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
        </div>
      </CardContent>
    </Card>
  );
}

export default function DoctorHomePage() {
  const [name, setName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const router = useRouter();

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
      const result = await axiosInstance.get(`/get-all-jobs`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!result.data.error) {
        setJobs(result.data.jobs);
        console.log("jobs retrieved successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getApplications = async () => {
    const token = localStorage.getItem("doctorAccessToken");
    try {
      const result = await axiosInstance.get(`/get-applications/${doctorId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!result.data.error) {
        setApplications(result.data.applications);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getClinics = async () => {
    const token = localStorage.getItem("doctorAccessToken");
    try {
      const result = await axiosInstance.get(`/get-all-clinics`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!result.data.error) {
        setClinics(result.data.clinics);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      getApplications();
      getClinics();
    }
  }, [doctorId]);

  let jobsApplied: any[] = [];
  applications.forEach((application) => {
    const job = jobs.find((j) => j.id === application.job_id);
    if (job) jobsApplied.push(job);
  });

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobsApplied.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobsApplied.length / jobsPerPage);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingShifts = jobs.filter(
    (job) =>
      job.doctor_id === doctorId &&
      job.status === "Accepted" &&
      new Date(job.date) >= today
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const hoursWorked = jobs
    .filter(
      (job) =>
        job.doctor_id === doctorId &&
        job.status === "Completed" &&
        new Date(job.date).getMonth() === currentMonth &&
        new Date(job.date).getFullYear() === currentYear
    )
    .reduce((sum, job) => sum + (Number(job.duration) || 0), 0);

  const earnings = jobs
  .filter(
    (job) =>
      job.doctor_id === doctorId &&
      job.status === "Completed" &&
      new Date(job.date).getMonth() === currentMonth &&
      new Date(job.date).getFullYear() === currentYear
  )
  .reduce((sum, job) => sum + (Number(job.total_pay) || 0), 0);
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
          value={`${jobs.filter(d => d.status !== "Accepted" && d.status !== "Completed").length}`}
          change="Matching your profile"
          changeType="neutral"
          color="blue"
        />
        <MetricCard
          icon={<Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-white-600" />}
          title="Upcoming Shifts"
          value={`${upcomingShifts.length}`}
          change=""
          changeType="neutral"
          color="emerald"
        />
        <MetricCard
          icon={<Clock className="w-5 sm:w-6 h-5 sm:h-6 text-white-600" />}
          title="Hours Worked"
          value={`${hoursWorked}`}
          change=""
          changeType="neutral"
          color="orange"
        />
        <MetricCard
          icon={<DollarSign className="w-5 sm:w-6 h-5 sm:h-6 text-white-600" />}
          title="Earnings"
          value={`RM ${earnings.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`}
          change="This month"
          changeType="neutral"
          color="rose"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-1">
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
              {jobs
                .filter(
                  (job) =>
                    job.doctor_id === doctorId && job.status === "Accepted"
                )
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map((job) => {
                  const clinic = clinics.find((c) => c.id === job.clinic_id);
                  return (
                    
                    <div
                      key={job.id}
                      className="flex items-center p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      
                      <div className="w-3 h-3 rounded-full bg-emerald-500 mr-3 sm:mr-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center ">
                            <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                            {clinic ? clinic.clinic_name : "Clinic"}
                          </p>
                            <Badge className="status-upcoming ml-2 flex-shrink-0">
                            Confirmed
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs sm:text-sm text-slate-600">
                          <div className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                            {new Date(job.date).toLocaleDateString("en-MY", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              timeZone: "Asia/Kuala_Lumpur",
                            })}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                            {formatTimeRange(job.start_time, job.end_time)}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                            {job.address}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          
                          <span className="font-semibold text-emerald-600 text-sm sm:text-base">
                            RM {job.total_pay}
                          </span>
                        </div>
                      </div>
                      {/* Cancel Button UI */}

                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-4 text-black border-slate-200 hover:bg-slate-100"
                        onClick={() => router.push(`/doctor/jobs/${job.id}`)}
                      >
                        View Job Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-4 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={async () => {
                          await axiosInstance.patch(`/cancel-job/${job.id}`, {
                            doctorId,
                          });
                          getAllJobs();
                          getApplications(); // Add this line
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  );
                })}
              {/* If no upcoming shifts */}
              {jobs.filter(
                (job) => job.doctor_id === doctorId && job.status === "Accepted"
              ).length === 0 && (
                <div className="text-gray-500 text-center py-4">
                  No upcoming shifts found.
                </div>
              )}
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
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-1">
       

        {/* Job Applications */}
        <Card className="border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-900">Job Applications</CardTitle>
            <CardDescription>Recently Applied Jobs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
            {currentJobs.map((job, i) => {
              const clinic = clinics.find((c) => c.id === job.clinic_id);
              const application = applications.find(
                (app) => app.job_id === job.id
              );
              return (
                <div
                  key={i}
                  className="p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                >
                  <Link key={job.id} href={`/doctor/jobs/${job.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                          {clinic ? clinic.clinic_name : ""}
                        </p>
                        {application?.status === "Pending" && (
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs flex-shrink-0">
                            Pending
                          </Badge>
                        )}
                        {application?.status === "Cancelled" && (
                          <Badge className="bg-red-100 text-red-700 border-red-200 text-xs flex-shrink-0">
                            Cancelled
                          </Badge>
                        )}
                        {application?.status === "Rejected" && (
                          <Badge className="bg-red-100 text-red-700 border-red-200 text-xs flex-shrink-0">
                            Rejected
                          </Badge>
                        )}
                        {application?.status === "Accepted" && (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs flex-shrink-0">
                            Accepted
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs sm:text-sm text-slate-600">
                        <div className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          {new Date(job.date).toLocaleDateString("en-MY", {
                            month: "short",
                            day: "numeric",
                            timeZone: "Asia/Kuala_Lumpur",
                          })}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1" />
                          {job.address}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1"/>
                          {formatTimeRange(job.start_time, job.end_time)}
                        </div>
                      </div>
                    </div>
                    
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors ml-2 flex-shrink-0" />
                    
                  </div>
                  </Link>
                </div>
              );
            })}
            {jobsApplied.length === 0 && (
              <p className="text-center py-4 text-gray-500">
                No job applications found
              </p>
            )}
            <div className="flex justify-center mt-4 gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="px-2 py-1 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
