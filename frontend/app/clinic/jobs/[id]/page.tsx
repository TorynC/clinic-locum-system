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
  ArrowLeft,
  MessageSquare,
  Bookmark,
  Share2,
  FileText,
  Gift,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosinstance";
import { formatTimeRange } from "@/utils/timeUtils";

export default function ClinicJobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const { id } = React.use(params);
    const [job, setJob] = useState<any>();
    const [clinicId, setClinicId] = useState<string | null>(null);

    const getJob = async () => {
        try {
        const result = await axiosInstance.get(`/get-job/${id}`);
        if (!result.data.error) {
            setJob(result.data.job);
            console.log("job retrieved successfully");
            console.log(result.data.job);
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
        getJob();
    }
  }, [clinicId]);

    return (
        <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center gap-3">
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Job Details
          </h1>
          <p className="text-slate-600">Review job requirements and apply</p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-0 shadow-medium bg-gradient-to-br from-white to-slate-50/50">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    L
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-slate-900">
                      Locum Doctor Job
                    </CardTitle>
                    
                    <CardDescription className="flex items-center mt-2 text-slate-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job?.address}
                    </CardDescription>
                  </div>
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
                    <p className="font-semibold text-slate-900">{
                      formatTimeRange(job?.start_time, job?.end_time)}
                   </p>
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
                {job?.has_break && job?.break_start && job?.break_end && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        BREAK TIME
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-purple-700">
                          {formatTimeRange(job?.break_start, job?.break_end)}
                        </span>
                        {job?.has_break && <span
                          className={cn(
                            "px-2 py-0.5 rounded text-xs font-medium border",
                            job.paid_break
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-red-100 text-red-700 border-red-200"
                          )}
                        >
                          {job.paid_break ? "Paid Break" : "Unpaid Break"}
                        </span>}
                      </div>
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

          
        </div>

        
      </div>
    </div>
  );
}