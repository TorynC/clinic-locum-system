"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Download,
  ArrowUpDown,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Star,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosinstance";

export default function DoctorDashboardPage() {
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [clinicContactInfo, setClinicContactInfo] = useState<any>(null);
  const jobsPerPage = 5;

  // function to get jobs
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
        console.log("Jobs retrieved successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // function to get clinic contact info
  const getClinicContact = async (clinicId: string) => {
    const token = localStorage.getItem("doctorAccessToken");
    try {
      const result = await axiosInstance.get(
        `/get-contact-details/${clinicId}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (!result.data.error) {
        setClinicContactInfo(result.data.clinic);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // function to get clinics
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
        console.log(result.data.clinics);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // function to get profile
  const getProfile = async () => {
    const token = localStorage.getItem("doctorAccessToken");
    try {
      const result = await axiosInstance.get(
        `/get-doctor-profile/${doctorId}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (!result.data.error) {
        setProfile(result.data.results);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const myJobs = jobs.filter((j) => j.doctor_id === doctorId);

  // Total Hours (sum duration of completed jobs)
  const totalHours = myJobs
    .filter((j) => j.status === "Completed")
    .reduce((sum, j) => sum + (Number(j.duration) || 0), 0);

  // Total Earnings (sum total_pay of completed jobs)
  const totalPay = myJobs
    .filter((j) => j.status === "Completed")
    .reduce((sum, j) => sum + (Number(j.total_pay) || 0), 0);

  // Completed Shifts
  const completedShifts = myJobs.filter((j) => j.status === "Completed").length;

  useEffect(() => {
    const storedId = localStorage.getItem("doctorId");
    if (storedId) {
      setDoctorId(storedId);
    }
  }, []);

  useEffect(() => {
    if (doctorId) {
      getAllJobs();
      getClinics();
      getProfile();
    }
  }, [doctorId]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black">
            My Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Track your shifts, earnings, and performance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 sm:gap-4">
        <StatCard
          title="Total Hours"
          value={`${totalHours} hrs`}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          title="Total Earnings"
          value={`RM ${totalPay}`}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          title="Completed Shifts"
          value={completedShifts.toString()}
          icon={<Calendar className="h-5 w-5" />}
        />
        <StatCard
          title="Average Rating"
          value={profile?.reliability_rating ?? "N/A"}
          icon={<Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />}
        />
      </div>

      <Card className="border-blue-100">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-black">Shift History</CardTitle>
            <div className="flex items-center space-x-2"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-purple-100 overflow-x-auto mt-4">
            <table className="min-w-full divide-y divide-purple-100">
              <thead className="bg-slate-100">
                <tr>
                  <TableHeader>
                    Date <ArrowUpDown className="h-3 w-3 ml-1" />
                  </TableHeader>
                  <TableHeader>Time Slot</TableHeader>
                  <TableHeader>Hours</TableHeader>
                  <TableHeader>Pay</TableHeader>
                  <TableHeader>Clinic</TableHeader>
                  <TableHeader>Location</TableHeader>
                  <TableHeader>Status</TableHeader>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-100">
                {myJobs
                  .filter((job) => job.status === "Completed")
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .slice(indexOfFirstJob, indexOfLastJob)
                  .map((job) => {
                    getClinicContact(job.clinic_id);
                    return (
                      <tr
                        key={job.id}
                        className="hover:bg-blue-100 transition-colors"
                      >
                        <TableCell>
                          {new Date(job.date).toLocaleDateString("en-MY", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          {job.start_time?.slice(0, 5)} -{" "}
                          {job.end_time?.slice(0, 5)}
                        </TableCell>
                        <TableCell>{job.duration}</TableCell>
                        <TableCell>RM {job.total_pay}</TableCell>
                        <TableCell>
                          {job.clinic_name ||
                            clinics.find((c) => c.id === job.clinic_id)
                              ?.clinic_name ||
                            "Clinic"}
                        </TableCell>
                        <TableCell>{clinicContactInfo?.address}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            {job.status}
                          </Badge>
                        </TableCell>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-blue-100 overflow-hidden w-full">
      <div className="h-1 bg-black"></div>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 truncate">
              {title}
            </p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue mt-1 truncate">
              {value}
            </p>
          </div>
          <div className="p-2 rounded-full bg-blue-50 text-blue-600 flex-shrink-0 ml-2">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-blue uppercase tracking-wider">
      <div className="flex items-center">{children}</div>
    </th>
  );
}

function TableCell({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
      {children}
    </td>
  );
}
