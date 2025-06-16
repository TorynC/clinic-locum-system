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
import { Calendar, ClipboardList, Users, Clock, Trash2 } from "lucide-react";
import axiosInstance from "@/utils/axiosinstance";
import { useState } from "react";
import { useEffect } from "react";

export default function ClinicHomePage() {
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [clinicName, setClinicName] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);

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

  console.log(jobs);

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
    }
  }, [clinicId]);
  
  
      
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">
            Welcome{clinicName ? `, ${clinicName}` : ""}
          </h1>
          <p className="text-gray-500">Your locum booking dashboard</p>
        </div>
        <Button asChild className="bg-purple-gradient hover:bg-purple-700">
          <Link href="/clinic/post-job">Post a New Job</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          icon={<ClipboardList className="h-8 w-8 text-purple-500" />}
          title="Active Jobs"
          value={`${jobs.length}`}
          description="Currently open positions"
        />
        <DashboardCard
          icon={<Users className="h-8 w-8 text-purple-500" />}
          title="Applications"
          value="12"
          description="Doctors applied to your jobs"
        />
        <DashboardCard
          icon={<Calendar className="h-8 w-8 text-purple-500" />}
          title="Upcoming Shifts"
          value="3"
          description="In the next 7 days"
        />
        <DashboardCard
          icon={<Clock className="h-8 w-8 text-purple-500" />}
          title="Hours Booked"
          value="24"
          description="This month"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-900">Upcoming Shifts</CardTitle>
            <CardDescription>Next 7 days schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  date: "Today, 9:00 AM - 5:00 PM",
                  doctor: "Dr. Sarah Johnson",
                  type: "General Practice",
                },
                {
                  date: "Tomorrow, 10:00 AM - 6:00 PM",
                  doctor: "Dr. Michael Chen",
                  type: "Pediatrics",
                },
                {
                  date: "May 15, 8:00 AM - 4:00 PM",
                  doctor: "Pending Applications",
                  type: "Dental",
                },
              ].map((shift, i) => (
                <div
                  key={i}
                  className="flex items-center p-3 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      i === 2 ? "bg-amber-500" : "bg-purple-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium">{shift.date}</p>
                    <p className="text-sm text-gray-500">
                      {shift.doctor} • {shift.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-900">
              Recent Applications
            </CardTitle>
            <CardDescription>Doctors who applied to your jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Dr. James Wilson",
                  specialty: "General Practice",
                  experience: "8 years",
                },
                {
                  name: "Dr. Emily Patel",
                  specialty: "Pediatrics",
                  experience: "5 years",
                },
                {
                  name: "Dr. Robert Kim",
                  specialty: "Dental",
                  experience: "10 years",
                },
              ].map((doctor, i) => (
                <div
                  key={i}
                  className="flex items-center p-3 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 mr-3 flex items-center justify-center">
                    {doctor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-sm text-gray-500">
                      {doctor.specialty} • {doctor.experience}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    </div>
        <Card className="border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-900">All Upcoming Jobs</CardTitle>
            <CardDescription>View, Edit, Delete Posted Jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs.slice().sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((job, i) => (
                <div className="flex items-center justify-between p-3 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors" key={job.id}>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 mr-3 flex items-center justify-center">
                        {job.title.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-gray-500">
                          {job.status} • {`Total Pay Before Incentives: RM${job.total_pay}`} • {job.start_time}-{job.end_time} • {new Date(job.date).toLocaleDateString("en-MY", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            timeZone: "Asia/Kuala_Lumpur",
                          })} • {`Procedure: ${job.procedure}`} • {`Job ID: ${job.id}`} 
                        </p>
                      </div>
                    </div>
                    <div className="rounded-full bg-purple-100 flex items-center justify-center w-10 h-10 hover:bg-purple-200 cursor-pointer">
                      <button
                          className="rounded-full bg-purple-100 flex items-center justify-center w-10 h-10 hover:bg-purple-200 cursor-pointer border-none outline-none"
                          onClick={() => deleteJob(job.id)}
                          aria-label="Delete job"
                          type="button"
                          >
                      <Trash2 className="h-6 w-6 text-purple-500" />
                    </button>
                    </div>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  
  );
}

function DashboardCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <Card className="border-purple-100 overflow-hidden">
      <div className="h-1 bg-purple-gradient-light"></div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-purple-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <div className="p-2 rounded-full bg-purple-50">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
