"use client";
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Download, ArrowUpDown, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosinstance";
import Link from "next/link";

export default function DashboardPage() {
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [favoriteDoctors, setFavoriteDoctors] = useState<string[]>([]);

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

  // function to favorite a doctor
  const favoriteDoctor = async (doctorId: string) => {
    try {
      const response = await axiosInstance.post("/favorite-doctor", {
        clinic_id: clinicId,
        doctor_id: doctorId,
      });
      if (!response.data.error) {
        console.log("favorite doctor added");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // function to remove favorite doctor
  const removeFavoriteDoctor = async (doctorId: string) => {
    try {
      await axiosInstance.delete(
        `/favorite-doctor?clinic_id=${clinicId}&doctor_id=${doctorId}`
      );
      console.log("favorite doctor removed");
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
      getJobs();
      getDoctors();
    }
  }, [clinicId]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!clinicId) return;
      try {
        const response = await axiosInstance.get(
          `/favorite-doctors/${clinicId}`
        );
        if (!response.data.error) {
          setFavoriteDoctors(response.data.favoriteDoctorIds);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchFavorites();
  }, [clinicId]);

  const toggleFavorite = (doctorId: string) => {
    setFavoriteDoctors((prev) =>
      prev.includes(doctorId)
        ? prev.filter((id) => id !== doctorId)
        : [...prev, doctorId]
    );
  };

  // Only completed jobs
  const completedJobs = jobs.filter((shift) => shift.status === "Completed");

  // Stats for completed jobs
  const totalHours = completedJobs.reduce(
    (sum, shift) => sum + (shift.duration || 0),
    0
  );
  const totalPay = completedJobs.reduce(
    (sum, shift) => sum + Number(shift.total_pay || 0),
    0
  );
  const completedShifts = completedJobs.length;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            History of locum shifts and statistics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        <StatCard title="Total Hours" value={`${totalHours.toFixed(1)} hrs`} />
        <StatCard title="Total Pay" value={`RM ${totalPay.toFixed(2)}`} />
        <StatCard title="Completed Shifts" value={completedShifts.toString()} />
      </div>

      <Card className="border-blue-100">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-black">Shift History</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search shifts..."
                  className="pl-8 border-purple-200"
                />
              </div>
              <select className="h-10 rounded-md border border-purple-200 bg-background px-3 py-2 text-sm">
                <option value="all">All Shifts</option>
                <option value="completed">Completed</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
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
                  <TableHeader>
                    Locum Doctor
                  </TableHeader>
                  <TableHeader >
                    Status
                  </TableHeader>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-100">
                {completedJobs.map((shift) => {
                  const doctorObj = doctors.find(
                    (d) => d.id === shift.doctor_id
                  );
                  return shift.status === "Completed" ? (
                    <tr
                      key={shift.id}
                      className="hover:bg-blue-100 transition-colors"
                    >
                      <TableCell>
                        {new Date(shift.date).toLocaleDateString("en-MY", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          timeZone: "Asia/Kuala_Lumpur",
                        })}
                      </TableCell>
                      <TableCell>
                        {shift.start_time.split(":")[0]}:
                        {shift.start_time.split(":")[1]} -{" "}
                        {shift.end_time.split(":")[0]}:
                        {shift.end_time.split(":")[1]}
                      </TableCell>
                      <TableCell>{shift.duration}</TableCell>
                      <TableCell>RM {shift.total_pay}</TableCell>
                      <TableCell >
                        <div className="flex items-center gap-2">
                          <Link
                            className="hover:underline"
                            href={`/clinic/doctors/${doctorObj?.id}`}
                          >
                            {doctorObj?.name}
                          </Link>
                          <button
                            type="button"
                            className="focus:outline-none"
                            onClick={() => {
                              toggleFavorite(doctorObj?.id);
                              if (favoriteDoctors.includes(doctorObj?.id)) {
                                removeFavoriteDoctor(doctorObj.id);
                              } else {
                                favoriteDoctor(doctorObj.id);
                              }
                            }}
                            aria-label="Favorite doctor"
                          >
                            <Heart
                              className={
                                favoriteDoctors.includes(doctorObj?.id)
                                  ? "text-red-500 fill-red-500"
                                  : "text-gray-400"
                              }
                              fill={
                                favoriteDoctors.includes(doctorObj?.id)
                                  ? "currentColor"
                                  : "none"
                              }
                              size={18}
                            />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell >
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            shift.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {shift.status}
                        </span>
                      </TableCell>
                    </tr>
                  ) : null;
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="border-blue-100 overflow-hidden">
      <div className="h-1 bg-black"></div>
      <CardContent className="p-6">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-3xl font-bold text-blue mt-2">{value}</p>
      </CardContent>
    </Card>
  );
}

function TableHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-3 sm:px-6 py-3 text-left text-xs font-medium text-blue uppercase tracking-wider ${className}`}
    >
      <div className="flex items-center">{children}</div>
    </th>
  );
}

function TableCell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={`px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 ${className}`}
    >
      {children}
    </td>
  );
}
