"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Building,
  Phone,
  Mail,
  ArrowLeft,
  MessageSquare,
  Bookmark,
  Share2,
  ExternalLink,
  FileText,
  Gift,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosinstance";

export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [job, setJob] = useState<any>();
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [clinicName, setClinicName] = useState("");
  const router = useRouter();
  const getJob = async () => {
    const token = localStorage.getItem("doctorAccessToken");
    try {
      const result = await axiosInstance.get(`/get-job/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!result.data.error) {
        setJob(result.data.job);
        console.log("job retrieved successfully");
        console.log(result.data.job);
        fetchClinicNames(result.data.job);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const postJobApplication = async () => {
    const token = localStorage.getItem("doctorAccessToken");
    const payLoad = { id, doctorId, status: "Pending" };
    try {
      const result = await axiosInstance.post(
        "/post-job-application",
        payLoad,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (!result.data.error) {
        console.log("Application posted successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const googleMapsUrl = job?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        clinicName
      )}`
    : "#";

  const fetchClinicNames = async (job: any) => {
    const token = localStorage.getItem("doctorAccessToken");
    try {
      const result = await axiosInstance.get(`/get-clinic/${job.clinic_id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!result.data.error) {
        setClinicName(result.data.clinic.clinic_name);
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
      getJob();
    }
  }, [doctorId]);

  function formatTime(timeStr?: string) {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    return `${h}:${m}`;
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-10 w-10 rounded-xl hover:bg-slate-100"
        >
          <Link href="/doctor/jobs">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Job Details
          </h1>
          <p className="text-slate-600">Review job requirements and apply</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-0 shadow-medium bg-gradient-to-br from-white to-slate-50/50">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {clinicName.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-slate-900">
                      {clinicName}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-2 text-slate-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job?.address}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-xl border-slate-200 hover:bg-slate-100"
                  >
                    <Bookmark className="h-5 w-5 text-slate-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-xl border-slate-200 hover:bg-slate-100"
                  >
                    <Share2 className="h-5 w-5 text-slate-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6 py-6 border-y border-slate-200">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">DATE</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(job?.date).toLocaleDateString("en-MY", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        timeZone: "Asia/Kuala_Lumpur",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-emerald-600 mr-2" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">TIME</p>
                    <p className="font-semibold text-slate-900">{`${formatTime(
                      job?.start_time
                    )} - ${formatTime(job?.end_time)}`}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-purple-600 mr-2" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      DURATION
                    </p>
                    <p className="font-semibold text-slate-900">
                      {job?.duration} hours
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      HOURLY RATE
                    </p>
                    <p className="font-semibold text-slate-900">
                      RM {job?.rate}/hr
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      TOTAL PAY
                    </p>
                    <p className="font-semibold text-green-600">
                      RM {job?.total_pay}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Building
                    className={cn(
                      "h-5 w-5 mr-2",
                      job?.gender === "female"
                        ? "text-pink-600"
                        : job?.gender === "male"
                        ? "text-blue-600"
                        : "text-slate-600"
                    )}
                  />
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      GENDER PREF
                    </p>
                    <p
                      className={cn(
                        "font-semibold",
                        job?.gender === "female"
                          ? "text-pink-600"
                          : job?.gender === "male"
                          ? "text-blue-600"
                          : "text-slate-600"
                      )}
                    >
                      {job?.gender}
                    </p>
                  </div>
                </div>

                {/* Break Time */}
                {job?.break_start && job?.break_end && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        BREAK TIME
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-purple-700">
                          {formatTime(job.break_start)} -{" "}
                          {formatTime(job.break_end)}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-xs font-medium border",
                            job.paid_break
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-red-100 text-red-700 border-red-200"
                          )}
                        >
                          {job.paid_break ? "Paid Break" : "Unpaid Break"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shift Type */}
                {(job?.shift_type === "day" || job?.shift_type === "night") && (
                  <div className="flex items-center">
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        SHIFT TYPE
                      </p>
                      <p className="font-semibold text-blue-700 capitalize">
                        {job.shift_type}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6 mt-8">
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Job Description
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {job?.description}
                  </p>
                </div>

                <div className="bg-red-50 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center">
                    <Gift className="h-5 w-5 mr-2 text-red-600" />
                    Job Incentives
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {job?.incentives}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                    Special Instructions
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {job?.special_instructions}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-emerald-50 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                      <Building className="h-5 w-5 mr-2 text-emerald-600" />
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job?.procedure.map((skill: string) => (
                        <Badge
                          key={skill}
                          className="bg-emerald-100 text-emerald-700 border-emerald-200 font-medium"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-orange-600" />
                      Required Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job?.languages.map((language: string) => (
                        <Badge
                          key={language}
                          className="bg-orange-100 text-orange-700 border-orange-200 font-medium"
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-medium bg-gradient-to-br from-white to-slate-50/50">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden relative">
                <img
                  src="/placeholder.svg?height=300&width=600&text=Map+Location"
                  alt="Map location"
                  className="w-full h-full object-cover"
                />
                <Button
                  asChild
                  className="absolute bottom-4 right-4 bg-white text-slate-700 hover:bg-slate-50 shadow-lg rounded-xl"
                >
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in Google Maps
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-medium bg-gradient-to-br from-white to-slate-50/50">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 mb-1">
                    CONTACT PERSON
                  </p>
                  <p className="font-semibold text-slate-900">{job?.contact}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 mb-1">
                    PHONE
                  </p>
                  <div className="flex items-center text-slate-700">
                    <Phone className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="font-medium">{job?.phone}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 mb-1">
                    EMAIL
                  </p>
                  <div className="flex items-center text-slate-700">
                    <Mail className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="font-medium text-sm break-all">
                      {job?.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg"
                  onClick={() => {
                    postJobApplication();
                    router.push("/doctor")
                  }}
                >
                  Apply for This Job
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
