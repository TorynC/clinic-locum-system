"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Filter,
  X,
  ChevronDown,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import axiosInstance from "@/utils/axiosinstance";
import { time } from "console";

export default function DoctorJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    specialty: "",
    distance: "",
    date: "",
    rate: "",
    time: "",
    endTime: "",
  });
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [clinicNames, setClinicNames] = useState<{ [key: string]: string }>({});
  const [clinicCities, setClinicCities] = useState<{ [key: string]: string }>(
    {}
  );

  const malaysiaDate = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kuala_Lumpur",
    })
  );

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
        fetchClinicNames(result.data.jobs);
        fetchClinicCities(result.data.jobs);
        console.log("jobs retrieved successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // After fetching jobs, fetch clinic names
  const fetchClinicNames = async (jobs: any[]) => {
    const token = localStorage.getItem("doctorAccessToken");
    const uniqueClinicIds = Array.from(
      new Set(jobs.map((job) => job.clinic_id))
    );
    const namesMap: { [key: string]: string } = {};

    await Promise.all(
      uniqueClinicIds.map(async (id) => {
        try {
          const res = await axiosInstance.get(`/get-clinic/${id}`, {
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          });
          if (!res.data.error) {
            namesMap[id] = res.data.clinic.clinic_name;
          }
        } catch (e) {
          namesMap[id] = "Unknown Clinic";
        }
      })
    );
    setClinicNames(namesMap);
  };

  // get all clinic cities
  const fetchClinicCities = async (jobs: any[]) => {
    const token = localStorage.getItem("doctorAccessToken");
    const uniqueClinicIds = Array.from(
      new Set(jobs.map((job) => job.clinic_id))
    );
    const citiesMap: { [key: string]: string } = {};

    await Promise.all(
      uniqueClinicIds.map(async (id) => {
        try {
          const res = await axiosInstance.get(`/get-contact-details/${id}`, {
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          });
          if (!res.data.error) {
            citiesMap[id] = res.data.clinic.city;
          }
        } catch (e) {
          citiesMap[id] = "Unknown Clinic";
        }
      })
    );
    setClinicCities(citiesMap);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      (clinicCities[job.clinic_id] || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      clinicNames[job.clinic_id]
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (Array.isArray(job.procedure)
        ? job.procedure.some((proc: string) =>
            proc.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : false);

    const jobDate = job.date
      ? new Date(
          new Date(job.date).toLocaleString("en-US", {
            timeZone: "Asia/Kuala_Lumpur",
          })
        )
      : null;

    // Date range filter
    let matchesDate = true;
    if (selectedFilters.date === "week") {
      const oneWeekFromNow = new Date(malaysiaDate);
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
      matchesDate =
        !!jobDate && jobDate >= malaysiaDate && jobDate <= oneWeekFromNow;
    } else if (selectedFilters.date === "month") {
      const oneMonthFromNow = new Date(malaysiaDate);
      oneMonthFromNow.setDate(oneMonthFromNow.getDate() + 30);
      matchesDate =
        !!jobDate && jobDate >= malaysiaDate && jobDate <= oneMonthFromNow;
    }

    // Time filter (example: filter jobs that start after a certain time)
    let matchesTime = true;
    if (selectedFilters.time) {
      // selectedFilters.time should be in "HH:mm" format
      const [filterHour, filterMinute] = selectedFilters.time
        .split(":")
        .map(Number);
      const [jobHour, jobMinute] = job.start_time.split(":").map(Number);
      // Example: only show jobs that start at or after the selected time
      matchesTime =
        jobHour > filterHour ||
        (jobHour === filterHour && jobMinute >= filterMinute);
    }

    // End time filter (example: filter jobs that end before a certain time)
    let matchesEndTime = true;
    if (selectedFilters.endTime && job.end_time) {
      const [filterHour, filterMinute] = selectedFilters.endTime
        .split(":")
        .map(Number);
      const [jobHour, jobMinute] = job.end_time.split(":").map(Number);
      // Only show jobs that end at or before the selected time
      matchesEndTime =
        jobHour < filterHour ||
        (jobHour === filterHour && jobMinute <= filterMinute);
    }

    const matchesSpecialty = selectedFilters.specialty
      ? job.specialty === selectedFilters.specialty
      : true;
    const matchesDistance = selectedFilters.distance
      ? Number.parseFloat(job.distance) <=
        Number.parseFloat(selectedFilters.distance)
      : true;
    const matchesRate = selectedFilters.rate
      ? job.hourlyRate >= Number.parseInt(selectedFilters.rate)
      : true;

    // Only show jobs in the future
    const isFuture = jobDate ? jobDate > malaysiaDate : false;

    // Only show jobs that are not assigned, or are urgent
    const isAvailable =
      (!job.doctor_id &&
        (job.status === "posted" || job.status === "Urgent")) ||
      job.status === "Urgent";

    const isFutureOrToday = jobDate
      ? jobDate.setHours(0, 0, 0, 0) >= malaysiaDate.setHours(0, 0, 0, 0)
      : false;

    return (
      matchesSearch &&
      matchesSpecialty &&
      matchesDistance &&
      matchesRate &&
      matchesDate &&
      matchesTime &&
      matchesEndTime &&
      isFutureOrToday &&
      isAvailable
    );
  });

  const clearFilters = () => {
    setSelectedFilters({
      specialty: "",
      distance: "",
      date: "",
      rate: "",
      time: "",
      endTime: "",
    });
  };

  useEffect(() => {
    const storedId = localStorage.getItem("doctorId");
    if (storedId) {
      setDoctorId(storedId);
    }
  }, []);

  useEffect(() => {
    if (doctorId) {
      getAllJobs();
    }
  }, [doctorId]);

  return (
    <div className="space-y-4 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black-900">
            Browse Jobs
          </h1>
          <p className="text-gray-500">
            Find locum opportunities that match your skills
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by clinic, location, or specialty..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="border-purple-200 text-black-700 flex items-center gap-2"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <Filter className="h-4 w-4" />
          Filters
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              filterOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <Card className="border-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-black-900">Filter Jobs</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 text-gray-500"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear All
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date Range
                </label>
                <select
                  id="date"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                  value={selectedFilters.date}
                  onChange={(e) =>
                    setSelectedFilters({
                      ...selectedFilters,
                      date: e.target.value,
                    })
                  }
                >
                  <option value="">Any Date</option>
                  <option value="week">Next 7 days</option>
                  <option value="month">Next 30 days</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Time After
                </label>
                <input
                  id="time"
                  type="time"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                  value={selectedFilters.time || ""}
                  onChange={(e) =>
                    setSelectedFilters({
                      ...selectedFilters,
                      time: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="end-time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Time Before
                </label>
                <input
                  id="end-time"
                  type="time"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                  value={selectedFilters.endTime || ""}
                  onChange={(e) =>
                    setSelectedFilters({
                      ...selectedFilters,
                      endTime: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredJobs.length}</span>{" "}
          jobs
        </p>
      </div>

      {/* Job Listings */}
      <div className="space-y-3">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Link
              href={`/doctor/jobs/${job.id}`}
              key={job.id}
              className="block group"
            >
              <Card
                className={cn(
                  "rounded-3xl border-0 shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50/50",
                  job.status === "Urgent" && "border-2 border-red-400"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                          {clinicNames[job.clinic_id]?.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <div>
                              <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              Locum Doctor 
                            </h3>
                              <h3 className="text-lg text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              {clinicNames[job.clinic_id]} 
                            </h3>
                            
                            </div>
                            
                            {job.status === "Urgent" && (
                              <Badge className="bg-red-100 text-red-700 border-red-200 font-semibold animate-pulse">
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-slate-600 mt-1">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-slate-500" />
                              {clinicCities[job.clinic_id]}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-slate-500" />
                              {new Date(job.date).toLocaleDateString("en-MY", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                timeZone: "Asia/Kuala_Lumpur",
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge
                          className={cn(
                            "text-sm font-medium border px-3 py-1",
                            job.gender === "female"
                              ? "bg-pink-100 text-pink-700 border-pink-200"
                              : job.gender === "male"
                              ? "bg-blue-100 text-blue-700 border-pink-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          )}
                        >
                          {job.gender === "any"
                            ? "Any Gender"
                            : job.gender === "male"
                            ? "Male Doctor"
                            : "Female Doctor"}
                        </Badge>

                        {/* Paid/Unpaid Break Tag */}
                        {job.paid_break ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            Paid Break
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 border-red-200">
                            Unpaid Break
                          </Badge>
                        )}

                        {/* Break Time */}
                        {job.break_start && job.break_end && (
                          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                            Break: {job.break_start} - {job.break_end}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.procedure
                          .slice(0, 3)
                          .map((skill: string, i: string) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-sm bg-slate-50 border-slate-200 text-slate-700 px-3 py-1"
                            >
                              {skill}
                            </Badge>
                          ))}
                        {job.procedure.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-sm bg-slate-50 border-slate-200 text-slate-700 px-3 py-1"
                          >
                            +{job.procedure.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 min-w-[220px] shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-6 h-6 rounded-md bg-blue-200 flex items-center justify-center mr-3">
                          <Clock className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                            Duration
                          </p>
                          <p className="font-semibold text-blue-900 text-base">
                            {`${job.start_time.split(":")[0]}:${
                              job.start_time.split(":")[1]
                            } - ${job.end_time.split(":")[0]}:${
                              job.end_time.split(":")[1]
                            }`}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/70 border border-blue-200 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <DollarSign className="h-4 w-4 text-blue-600 mr-1" />
                            <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                              Rate
                            </p>
                          </div>
                          <div className="text-lg font-bold text-blue-700">
                            RM {job.rate}
                            <span className="text-sm font-medium text-blue-600">
                              /hr
                            </span>
                          </div>
                        </div>

                        <div className="bg-blue-200/50 border border-blue-300 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <DollarSign className="h-4 w-4 text-blue-700 mr-1" />
                            <p className="text-sm font-medium text-blue-700 uppercase tracking-wide">
                              Total
                            </p>
                          </div>
                          <div className="text-lg font-bold text-blue-800">
                            RM {job.total_pay}++
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">
              No jobs match your search criteria.
            </p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
