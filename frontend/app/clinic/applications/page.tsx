"use client";
import React, { use } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosinstance";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatTimeRange } from "@/utils/timeUtils";
import { useRouter } from "next/navigation";

export default function applicationsPage() {
  const [clinicId, setClinicid] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [doctorProfiles, setDoctorProfiles] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("pending");
  // Add loading state
  const [updatingApplicationId, setUpdatingApplicationId] = useState<
    string | null
  >(null);
  const router = useRouter();

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

  // function to update application status
  const updateApplication = async (id: string, newStatus: string) => {
    try {
      const response = await axiosInstance.patch(
        `/update-job-application/${id}`,
        { status: newStatus }
      );
      console.log("status updated succesfully");
      getApplications();
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

  // function get jobs
  const getJobs = async () => {
    try {
      const response = await axiosInstance.get(`/get-jobs/${clinicId}/jobs`);
      if (!response.data.error) {
        console.log("jobs received");
        setJobs(response.data.jobs);
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

  useEffect(() => {
    const storedId = localStorage.getItem("clinicId");
    if (storedId) {
      setClinicid(storedId);
    }
  }, []);

  useEffect(() => {
    if (clinicId) {
      getApplications();
      getDoctors();
      getDoctorProfiles();
      getJobs();
    }
  }, [clinicId]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Applications
        </h1>
        <p className="text-slate-600 mt-1">
          View, Reject or Accept Applications to your Upcoming Jobs
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-blue-100 text-blue-600">
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="filled">Filled Positions</TabsTrigger>
        </TabsList>

        <TabsContent value="filled" className="mt-6">
          <Card className="border-0 shadow-medium">
            <CardHeader className="pb-2 sm:pb-4">
              <div>
                <CardTitle className="text-slate-900">
                  Filled Positions
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
              {jobs
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .filter((job) => job.status === "Accepted")
                .map((job) => {
                  const jobApplications = applications.filter(
                    (app) => app.job_id === job.id && app.status !== "Cancelled"
                  );

                  const jobEnd = new Date(job.date);
                  const [endH, endM, endS] = job.end_time
                    .split(":")
                    .map(Number);
                  jobEnd.setHours(endH, endM, endS || 0, 0);

                  const now = new Date();
                  const isPast = now > jobEnd;

                  return (
                    <div key={job.id} className="mb-4 border rounded p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col items-start ">
                          <div className="flex items-center">
                            <div className="font-semibold text-lg">
                              Locum Doctor
                            </div>
                            <span className="ml-2 text-slate-500 text-xs">
                              Status: {job.status}
                            </span>
                          </div>

                          <div>
                            {isPast && (
                              <div className="text-xs text-red-500 mb-2">
                                Applications for this job are closed.
                              </div>
                            )}
                          </div>
                          <span className="text-slate-500">
                            • Shift Date:{" "}
                            {new Date(job.date).toLocaleDateString("en-MY", {
                              timeZone: "Asia/Kuala_Lumpur",
                            })}
                          </span>
                          <span className="text-slate-500">
                            • Shift Time:{" "}
                            {formatTimeRange(job.start_time, job.end_time)}
                          </span>
                          <span className="text-slate-500">
                            • Total Pay: RM{job.total_pay}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            setExpandedJobId(
                              expandedJobId === job.id ? null : job.id
                            )
                          }
                          className="text-blue-600 text-sm"
                        >
                          {expandedJobId === job.id
                            ? "Hide Applications"
                            : "Show Applications"}
                        </button>
                      </div>
                      <Button
                        className="mt-3"
                        variant="outline"
                        onClick={() => router.push(`/clinic/jobs/${job.id}`)}
                      >
                        View Job Details
                      </Button>
                      {expandedJobId === job.id && (
                        <div className="mt-3 space-y-2">
                          {jobApplications.length === 0 ? (
                            <div className="text-xs text-gray-500">
                              No applications yet.
                            </div>
                          ) : (
                            jobApplications
                              .sort(
                                (a, b) =>
                                  new Date(b.applied_at || 0).getTime() -
                                  new Date(a.applied_at || 0).getTime()
                              ) // Sort applications by application date (newest first)
                              .map((application, i) => {
                                const doctor = doctors.find(
                                  (d) => application.doctor_id === d.id
                                );

                                return (
                                  <div
                                    key={application.id || i}
                                    className="p-2 border rounded mb-2 bg-slate-50"
                                  >
                                    {/* Doctor info, status, actions, etc. */}
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-xs flex items-center gap-2">
                                          Status: {application.status}
                                          {application.status ===
                                            "Cancelled" && (
                                            <span className="ml-2 px-2 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200 text-xs">
                                              Cancelled
                                            </span>
                                          )}
                                          {application.status ===
                                            "Accepted" && (
                                            <span className="ml-2 px-2 py-0.5 rounded bg-green-100 text-green-700 border border-green-200 text-xs">
                                              Accepted
                                            </span>
                                          )}
                                          {application.status ===
                                            "Rejected" && (
                                            <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 text-xs">
                                              Rejected
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-xs">
                                          Doctor ID: {application.doctor_id}
                                        </div>
                                      </div>
                                      <div>
                                        <Button
                                          size="sm"
                                          className="bg-green-100 text-green-700 hover:bg-green-200"
                                          disabled={
                                            application.status === "Accepted" ||
                                            isPast ||
                                            updatingApplicationId ===
                                              application.id ||
                                            job.status === "Accepted"
                                          }
                                          onClick={async () => {
                                            setUpdatingApplicationId(
                                              application.id
                                            );
                                            try {
                                              await updateApplication(
                                                application.id,
                                                "Accepted"
                                              );
                                              await Promise.all([
                                                getApplications(),
                                                getJobs(),
                                                getDoctors(),
                                                getDoctorProfiles(),
                                              ]);
                                            } finally {
                                              setUpdatingApplicationId(null);
                                            }
                                          }}
                                        >
                                          {updatingApplicationId ===
                                          application.id
                                            ? "Processing..."
                                            : "Accept"}
                                        </Button>
                                        <Button
                                          size="sm"
                                          className="ml-2 bg-red-100 text-red-700 hover:bg-red-200"
                                          disabled={
                                            application.status === "Rejected" ||
                                            isPast ||
                                            updatingApplicationId ===
                                              application.id ||
                                            job.status === "Accepted"
                                          }
                                          onClick={async () => {
                                            setUpdatingApplicationId(
                                              application.id
                                            );
                                            try {
                                              await updateApplication(
                                                application.id,
                                                "Rejected"
                                              );
                                              await Promise.all([
                                                getApplications(),
                                                getJobs(),
                                                getDoctors(),
                                                getDoctorProfiles(),
                                              ]);
                                            } finally {
                                              setUpdatingApplicationId(null);
                                            }
                                          }}
                                        >
                                          {updatingApplicationId ===
                                          application.id
                                            ? "Processing..."
                                            : "Reject"}
                                        </Button>
                                        <Link
                                          key={application.doctor_id}
                                          href={`/clinic/doctors/${application.doctor_id}`}
                                        >
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="ml-2 border-blue-200 text-blue-700 hover:bg-blue-50 mt-1"
                                            type="button"
                                          >
                                            View Profile
                                          </Button>
                                        </Link>
                                      </div>
                                    </div>

                                    {/* Doctor Profile Preview */}
                                    <div className="flex items-start gap-4 mb-2">
                                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium">
                                        {doctor?.name?.charAt(0) || "D"}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <h3 className="font-semibold text-base">
                                            {doctor?.name}
                                          </h3>
                                          {/* Rating */}
                                          {doctorProfiles.find(
                                            (p) => p.id === doctor?.id
                                          )?.reliability_rating && (
                                            <span className="flex items-center text-yellow-500 text-xs font-medium ml-2">
                                              <Star className="w-4 h-4 mr-1 fill-yellow-500" />
                                              {
                                                doctorProfiles.find(
                                                  (p) => p.id === doctor?.id
                                                )?.reliability_rating
                                              }
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-xs text-gray-500 mb-1">
                                         
                                          {doctorProfiles.find(
                                            (p) => p.id === doctor?.id
                                          )?.experience_years
                                            ? ` • ${
                                                doctorProfiles.find(
                                                  (p) => p.id === doctor?.id
                                                )?.experience_years
                                              } yrs exp`
                                            : ""}
                                        </div>
                                        {/* Languages */}
                                        <div className="flex flex-wrap gap-1 mb-1">
                                          {(
                                            doctorProfiles.find(
                                              (p) => p.id === doctor?.id
                                            )?.languages || []
                                          ).map((language: string) => (
                                            <Badge
                                              key={language}
                                              variant={"outline"}
                                              className="text-xs"
                                            >
                                              {language}
                                            </Badge>
                                          ))}
                                        </div>
                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-1">
                                          {(
                                            doctorProfiles.find(
                                              (p) => p.id === doctor?.id
                                            )?.skills || []
                                          ).map((skill: string) => (
                                            <Badge
                                              key={skill}
                                              variant={"outline"}
                                              className="text-xs"
                                            >
                                              {skill}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <Card className="border-0 shadow-medium">
            <CardHeader className="pb-2 sm:pb-4">
              <div>
                <CardTitle className="text-slate-900">
                  Applications Pending Review
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
              {jobs
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .filter(
                  (job) => job.status === "posted" || job.status === "Urgent"
                )
                .map((job) => {
                  const jobApplications = applications.filter(
                    (app) => app.job_id === job.id && app.status !== "Cancelled"
                  );

                  const jobEnd = new Date(job.date);
                  const [endH, endM, endS] = job.end_time
                    .split(":")
                    .map(Number);
                  jobEnd.setHours(endH, endM, endS || 0, 0);

                  const now = new Date();
                  const isPast = now > jobEnd;

                  return (
                    <div key={job.id} className="mb-4 border rounded p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col items-start ">
                          <div className="flex items-center">
                            <div className="font-semibold text-lg">
                              Locum Doctor
                            </div>
                            <span className="ml-2 text-slate-500 text-xs">
                              Status: {job.status}
                            </span>
                          </div>
                          <div>
                            {isPast && (
                              <div className="text-xs text-red-500 mb-2">
                                Applications for this job are closed.
                              </div>
                            )}
                          </div>
                          <span className="text-slate-500">
                            • Shift Date:{" "}
                            {new Date(job.date).toLocaleDateString("en-MY", {
                              timeZone: "Asia/Kuala_Lumpur",
                            })}
                          </span>
                          <span className="text-slate-500">
                            • Shift Time:{" "}
                            {formatTimeRange(job.start_time, job.end_time)}
                          </span>
                          <span className="text-slate-500">
                            • Total Pay: RM{job.total_pay}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            setExpandedJobId(
                              expandedJobId === job.id ? null : job.id
                            )
                          }
                          className="text-blue-600 text-sm"
                        >
                          {expandedJobId === job.id
                            ? "Hide Applications"
                            : "Show Applications"}
                        </button>
                      </div>
                      <Button
                        className="mt-3"
                        variant="outline"
                        onClick={() => router.push(`/clinic/jobs/${job.id}`)}
                      >
                        View Job Details
                      </Button>
                      {expandedJobId === job.id && (
                        <div className="mt-3 space-y-2">
                          {jobApplications.length === 0 ? (
                            <div className="text-xs text-gray-500">
                              No applications yet.
                            </div>
                          ) : (
                            jobApplications
                              .sort(
                                (a, b) =>
                                  new Date(b.applied_at || 0).getTime() -
                                  new Date(a.applied_at || 0).getTime()
                              ) // Sort applications by application date (newest first)
                              .map((application, i) => {
                                const doctor = doctors.find(
                                  (d) => application.doctor_id === d.id
                                );

                                return (
                                  <div
                                    key={application.id || i}
                                    className="p-2 border rounded mb-2 bg-slate-50"
                                  >
                                    {/* Doctor info, status, actions, etc. */}
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-xs flex items-center gap-2">
                                          Status: {application.status}
                                          {application.status ===
                                            "Cancelled" && (
                                            <span className="ml-2 px-2 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200 text-xs">
                                              Cancelled
                                            </span>
                                          )}
                                          {application.status ===
                                            "Accepted" && (
                                            <span className="ml-2 px-2 py-0.5 rounded bg-green-100 text-green-700 border border-green-200 text-xs">
                                              Accepted
                                            </span>
                                          )}
                                          {application.status ===
                                            "Rejected" && (
                                            <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 text-xs">
                                              Rejected
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-xs">
                                          Doctor ID: {application.doctor_id}
                                        </div>
                                      </div>
                                      <div>
                                        <Button
                                          size="sm"
                                          className="bg-green-100 text-green-700 hover:bg-green-200"
                                          disabled={
                                            application.status === "Accepted" ||
                                            isPast ||
                                            updatingApplicationId ===
                                              application.id
                                          }
                                          onClick={async () => {
                                            setUpdatingApplicationId(
                                              application.id
                                            );
                                            try {
                                              await updateApplication(
                                                application.id,
                                                "Accepted"
                                              );
                                              await Promise.all([
                                                getApplications(),
                                                getJobs(),
                                                getDoctors(),
                                                getDoctorProfiles(),
                                              ]);
                                            } finally {
                                              setUpdatingApplicationId(null);
                                            }
                                          }}
                                        >
                                          {updatingApplicationId ===
                                          application.id
                                            ? "Processing..."
                                            : "Accept"}
                                        </Button>
                                        <Button
                                          size="sm"
                                          className="ml-2 bg-red-100 text-red-700 hover:bg-red-200"
                                          disabled={
                                            application.status === "Rejected" ||
                                            isPast ||
                                            updatingApplicationId ===
                                              application.id
                                          }
                                          onClick={async () => {
                                            setUpdatingApplicationId(
                                              application.id
                                            );
                                            try {
                                              await updateApplication(
                                                application.id,
                                                "Rejected"
                                              );
                                              await Promise.all([
                                                getApplications(),
                                                getJobs(),
                                                getDoctors(),
                                                getDoctorProfiles(),
                                              ]);
                                            } finally {
                                              setUpdatingApplicationId(null);
                                            }
                                          }}
                                        >
                                          {updatingApplicationId ===
                                          application.id
                                            ? "Processing..."
                                            : "Reject"}
                                        </Button>
                                        <Link
                                          key={application.doctor_id}
                                          href={`/clinic/doctors/${application.doctor_id}`}
                                        >
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="ml-2 border-blue-200 text-blue-700 hover:bg-blue-50 mt-1"
                                            type="button"
                                          >
                                            View Profile
                                          </Button>
                                        </Link>
                                      </div>
                                    </div>

                                    {/* Doctor Profile Preview */}
                                    <div className="flex items-start gap-4 mb-2">
                                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium">
                                        {doctor?.name?.charAt(0) || "D"}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <h3 className="font-semibold text-base">
                                            {doctor?.name}
                                          </h3>
                                          {/* Rating */}
                                          {doctorProfiles.find(
                                            (p) => p.id === doctor?.id
                                          )?.reliability_rating && (
                                            <span className="flex items-center text-yellow-500 text-xs font-medium ml-2">
                                              <Star className="w-4 h-4 mr-1 fill-yellow-500" />
                                              {
                                                doctorProfiles.find(
                                                  (p) => p.id === doctor?.id
                                                )?.reliability_rating
                                              }
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-xs text-gray-500 mb-1">
                                          
                                          {doctorProfiles.find(
                                            (p) => p.id === doctor?.id
                                          )?.experience_years
                                            ? ` • ${
                                                doctorProfiles.find(
                                                  (p) => p.id === doctor?.id
                                                )?.experience_years
                                              } yrs exp`
                                            : ""}
                                        </div>
                                        {/* Languages */}
                                        <div className="flex flex-wrap gap-1 mb-1">
                                          {(
                                            doctorProfiles.find(
                                              (p) => p.id === doctor?.id
                                            )?.languages || []
                                          ).map((language: string) => (
                                            <Badge
                                              key={language}
                                              variant={"outline"}
                                              className="text-xs"
                                            >
                                              {language}
                                            </Badge>
                                          ))}
                                        </div>
                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-1">
                                          {(
                                            doctorProfiles.find(
                                              (p) => p.id === doctor?.id
                                            )?.skills || []
                                          ).map((skill: string) => (
                                            <Badge
                                              key={skill}
                                              variant={"outline"}
                                              className="text-xs"
                                            >
                                              {skill}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <Card className="border-0 shadow-medium">
            <CardHeader className="pb-2 sm:pb-4">
              <div>
                <CardTitle className="text-slate-900">
                  All Applications
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
              {jobs
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map((job) => {
                  const jobApplications = applications.filter(
                    (app) => app.job_id === job.id && app.status !== "Cancelled"
                  );

                  const jobEnd = new Date(job.date);
                  const [endH, endM, endS] = job.end_time
                    .split(":")
                    .map(Number);
                  jobEnd.setHours(endH, endM, endS || 0, 0);

                  const now = new Date();
                  const isPast = now > jobEnd;

                  return (
                    <div key={job.id} className="mb-4 border rounded p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col items-start ">
                          <div className="flex items-center">
                            <div className="font-semibold text-lg">
                              Locum Doctor
                            </div>
                            <span className="ml-2 text-slate-500 text-xs">
                              Status: {job.status}
                            </span>
                          </div>
                          <div>
                            {isPast && (
                              <div className="text-xs text-red-500 mb-2">
                                Applications for this job are closed.
                              </div>
                            )}
                          </div>
                          <span className="text-slate-500">
                            • Shift Date:{" "}
                            {new Date(job.date).toLocaleDateString("en-MY", {
                              timeZone: "Asia/Kuala_Lumpur",
                            })}
                          </span>
                          <span className="text-slate-500">
                            • Shift Time:{" "}
                            {formatTimeRange(job.start_time, job.end_time)}
                          </span>
                          <span className="text-slate-500">
                            • Total Pay: RM{job.total_pay}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            setExpandedJobId(
                              expandedJobId === job.id ? null : job.id
                            )
                          }
                          className="text-blue-600 text-sm"
                        >
                          {expandedJobId === job.id
                            ? "Hide Applications"
                            : "Show Applications"}
                        </button>
                      </div>
                      <Button
                        className="mt-3"
                        variant="outline"
                        onClick={() => router.push(`/clinic/jobs/${job.id}`)}
                      >
                        View Job Details
                      </Button>
                      {expandedJobId === job.id && (
                        <div className="mt-3 space-y-2">
                          {jobApplications.length === 0 ? (
                            <div className="text-xs text-gray-500">
                              No applications yet.
                            </div>
                          ) : (
                            jobApplications
                              .sort(
                                (a, b) =>
                                  new Date(b.applied_at || 0).getTime() -
                                  new Date(a.applied_at || 0).getTime()
                              ) // Sort applications by application date (newest first)
                              .map((application, i) => {
                                const doctor = doctors.find(
                                  (d) => application.doctor_id === d.id
                                );

                                return (
                                  <div
                                    key={application.id || i}
                                    className="p-2 border rounded mb-2 bg-slate-50"
                                  >
                                    {/* Doctor info, status, actions, etc. */}
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-xs flex items-center gap-2">
                                          Status: {application.status}
                                          {application.status ===
                                            "Cancelled" && (
                                            <span className="ml-2 px-2 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200 text-xs">
                                              Cancelled
                                            </span>
                                          )}
                                          {application.status ===
                                            "Accepted" && (
                                            <span className="ml-2 px-2 py-0.5 rounded bg-green-100 text-green-700 border border-green-200 text-xs">
                                              Accepted
                                            </span>
                                          )}
                                          {application.status ===
                                            "Rejected" && (
                                            <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 text-xs">
                                              Rejected
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-xs">
                                          Doctor ID: {application.doctor_id}
                                        </div>
                                      </div>
                                      <div>
                                        <Button
                                          size="sm"
                                          className="bg-green-100 text-green-700 hover:bg-green-200"
                                          disabled={
                                            application.status === "Accepted" ||
                                            isPast ||
                                            updatingApplicationId ===
                                              application.id ||
                                            job.status === "Accepted"
                                          }
                                          onClick={async () => {
                                            setUpdatingApplicationId(
                                              application.id
                                            );
                                            try {
                                              await updateApplication(
                                                application.id,
                                                "Accepted"
                                              );
                                              await Promise.all([
                                                getApplications(),
                                                getJobs(),
                                                getDoctors(),
                                                getDoctorProfiles(),
                                              ]);
                                            } finally {
                                              setUpdatingApplicationId(null);
                                            }
                                          }}
                                        >
                                          {updatingApplicationId ===
                                          application.id
                                            ? "Processing..."
                                            : "Accept"}
                                        </Button>
                                        <Button
                                          size="sm"
                                          className="ml-2 bg-red-100 text-red-700 hover:bg-red-200"
                                          disabled={
                                            application.status === "Rejected" ||
                                            isPast ||
                                            updatingApplicationId ===
                                              application.id ||
                                            job.status === "Accepted"
                                          }
                                          onClick={async () => {
                                            setUpdatingApplicationId(
                                              application.id
                                            );
                                            try {
                                              await updateApplication(
                                                application.id,
                                                "Rejected"
                                              );
                                              await Promise.all([
                                                getApplications(),
                                                getJobs(),
                                                getDoctors(),
                                                getDoctorProfiles(),
                                              ]);
                                            } finally {
                                              setUpdatingApplicationId(null);
                                            }
                                          }}
                                        >
                                          {updatingApplicationId ===
                                          application.id
                                            ? "Processing..."
                                            : "Reject"}
                                        </Button>
                                        <Link
                                          key={application.doctor_id}
                                          href={`/clinic/doctors/${application.doctor_id}`}
                                        >
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="ml-2 border-blue-200 text-blue-700 hover:bg-blue-50 mt-1"
                                            type="button"
                                          >
                                            View Profile
                                          </Button>
                                        </Link>
                                      </div>
                                    </div>

                                    {/* Doctor Profile Preview */}
                                    <div className="flex items-start gap-4 mb-2">
                                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium">
                                        {doctor?.name?.charAt(0) || "D"}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <h3 className="font-semibold text-base">
                                            {doctor?.name}
                                          </h3>
                                          {/* Rating */}
                                          {doctorProfiles.find(
                                            (p) => p.id === doctor?.id
                                          )?.reliability_rating && (
                                            <span className="flex items-center text-yellow-500 text-xs font-medium ml-2">
                                              <Star className="w-4 h-4 mr-1 fill-yellow-500" />
                                              {
                                                doctorProfiles.find(
                                                  (p) => p.id === doctor?.id
                                                )?.reliability_rating
                                              }
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-xs text-gray-500 mb-1">
                                          
                                          {doctorProfiles.find(
                                            (p) => p.id === doctor?.id
                                          )?.experience_years
                                            ? ` • ${
                                                doctorProfiles.find(
                                                  (p) => p.id === doctor?.id
                                                )?.experience_years
                                              } yrs exp`
                                            : ""}
                                        </div>
                                        {/* Languages */}
                                        <div className="flex flex-wrap gap-1 mb-1">
                                          {(
                                            doctorProfiles.find(
                                              (p) => p.id === doctor?.id
                                            )?.languages || []
                                          ).map((language: string) => (
                                            <Badge
                                              key={language}
                                              variant={"outline"}
                                              className="text-xs"
                                            >
                                              {language}
                                            </Badge>
                                          ))}
                                        </div>
                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-1">
                                          {(
                                            doctorProfiles.find(
                                              (p) => p.id === doctor?.id
                                            )?.skills || []
                                          ).map((skill: string) => (
                                            <Badge
                                              key={skill}
                                              variant={"outline"}
                                              className="text-xs"
                                            >
                                              {skill}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
