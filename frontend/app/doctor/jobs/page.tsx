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
import { formatTimeRange } from "@/utils/timeUtils";

export default function DoctorJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
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
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
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
            placeholder="Search by clinic, location"
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
      <div className="space-y-2">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Link
              href={`/doctor/jobs/${job.id}`}
              key={job.id}
              className="block group"
            >
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
                        {new Date(job.date).toLocaleDateString("en-US", {
                          timeZone: "Asia/Kuala_Lumpur",
                          month: "long",
                        })}
                      </div>
                      <div className="text-3xl md:text-4xl font-bold mb-2">
                        {new Date(job.date).toLocaleDateString("en-US", {
                          timeZone: "Asia/Kuala_Lumpur",
                          day: "2-digit",
                        })}
                      </div>
                      <div className="space-y-0.5 mb-2">
                        <div className="text-xs md:text-sm font-medium">
                          {
                            formatTimeRange(job.start_time, job.end_time).split(
                              "-"
                            )[0]
                          }
                        </div>
                        <div className="text-xs md:text-sm font-medium opacity-75">
                          -
                        </div>
                        <div className="text-xs md:text-sm font-medium">
                          {
                            formatTimeRange(job.start_time, job.end_time).split(
                              "-"
                            )[1]
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
                      {/* Header - Clinic Info */}
                      <div className="mb-2.5 md:mb-3">
                        <h3 className="text-base md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1.5 md:mb-2">
                          {clinicNames[job.clinic_id]}
                        </h3>

                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                          <span className="text-xs md:text-sm mr-2">
                            {clinicCities[job.clinic_id]}
                          </span>
                          {job.status === "Urgent" && (
                            <Badge className="bg-red-100 text-red-700 border-red-200 font-semibold animate-pulse">
                              Urgent
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Procedures Tags - First Row */}
                      <div className="flex flex-wrap gap-1 md:gap-2 mb-2.5 md:mb-3">
                        {job.procedure
                          .slice(0, 3)
                          .map((skill: string, i: any) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs md:text-sm bg-gray-50 border-gray-200 text-gray-700 px-2 py-0.5 md:px-3 md:py-1"
                            >
                              {skill}
                            </Badge>
                          ))}
                        {job.procedure.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs md:text-sm bg-gray-50 border-gray-200 text-gray-700 px-2 py-0.5 md:px-3 md:py-1"
                          >
                            +{job.procedure.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Break + Gender + Language Tags - Second Row */}
                      <div className="flex flex-nowrap gap-1 md:gap-2 mb-3 md:mb-4 overflow-x-auto">
                        {/* Paid/Unpaid Break Tag */}
                        <Badge
                          className={cn(
                            "text-xs md:text-sm font-medium border px-2 py-0.5 md:px-3 md:py-1 whitespace-nowrap",
                            job.paid_break
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-orange-100 text-orange-700 border-orange-200"
                          )}
                        >
                          {job.paid_break ? "Paid Break" : "Unpaid Break"}
                        </Badge>

                        {/* Gender Preference */}
                        {job.gender !== "Any" && (
                          <Badge
                            className={cn(
                              "text-xs md:text-sm font-medium border px-2 py-0.5 md:px-3 md:py-1 whitespace-nowrap",
                              job.gender === "Female"
                                ? "bg-pink-100 text-pink-700 border-pink-200"
                                : "bg-blue-100 text-blue-700 border-blue-200"
                            )}
                          >
                            {job.gender}
                          </Badge>
                        )}

                        {/* Language Bonus */}
                        {job.languages && job.languages.length > 0 && (
                          <>
                            {job.languages.includes("Chinese") && (
                              <Badge className="text-xs md:text-sm font-medium border px-2 py-0.5 md:px-3 md:py-1 bg-purple-100 text-purple-700 border-purple-200 whitespace-nowrap">
                                Chinese Speaking
                              </Badge>
                            )}
                            {job.languages.includes("Tamil") && (
                              <Badge className="text-xs md:text-sm font-medium border px-2 py-0.5 md:px-3 md:py-1 bg-purple-100 text-purple-700 border-purple-200 whitespace-nowrap">
                                Tamil Speaking
                              </Badge>
                            )}
                          </>
                        )}
                      </div>

                      {/* Bottom Row - Rate/Hour and Total Pay */}
                      <div className="flex items-center gap-2 md:gap-4">
                        {/* Rate/Hour - More Distinct */}
                        <div className="bg-green-100 border-2 border-green-300 rounded-lg px-3 py-2 md:px-4 md:py-3 shadow-sm">
                          <span className="text-sm md:text-lg font-bold text-green-900">
                            RM{job.rate}/hr
                          </span>
                        </div>

                        {/* Total Pay - Next to Rate */}
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
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">
              No jobs match your search criteria.
            </p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
