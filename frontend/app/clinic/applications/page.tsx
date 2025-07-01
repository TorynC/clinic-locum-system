"use client"
import React, { use } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from "@/components/ui/button";
import { Badge } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosinstance';

export default function applicationsPage() {
    const [clinicId, setClinicid] = useState<string | null>(null);
    const [applications, setApplications] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [doctorProfiles, setDoctorProfiles] = useState<any[]>([]);

    const malaysiaDate = new Date(new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kuala_Lumpur",
    }));

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
    
    // function to update application status 
    const updateApplication = async (id: string, newStatus:string) => {
        try {
            const response = await axiosInstance.patch(`/update-job-application/${id}`, {status: newStatus})
            console.log("status updated succesfully");
            getApplications();

        } catch (error) {
            console.error(error);
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

    useEffect(() => {
        const storedId = localStorage.getItem("clinicId");
        if (storedId) {
            setClinicid(storedId);
        };
    }, []);

    useEffect(() => {
        if (clinicId) {
            getApplications();
            getDoctors();
            getDoctorProfiles();
        }
    }, [clinicId]);

    return (
        <div className='space-y-6 sm:space-y-8 animate-fade-in pb-20 md:pb-0'>
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Applications</h1>
                <p className="text-slate-600 mt-1">View, Reject or Accept Applications to your Upcoming Jobs</p>
            </div>
            
            <Card className='border-0 shadow-medium'>
                <CardHeader className='pb-2 sm:pb-4'>
                    <div>
                        <CardTitle className='text-slate-900'>Current Applications</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
                {applications.map((application, i) => {
                const doctorObj = doctors.find(d => d.id === application.doctor_id);
                const doctorProfileObj = doctorProfiles.find(d => d.id === application.doctor_id);
                const jobDate = application.job_date
                    ? new Date(new Date(application.job_date).toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" }))
                    : null;
                const isPast = jobDate ? jobDate < malaysiaDate : false;
                return (
                    <div
                    key={application.id || i}
                    className="flex items-center p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                    >
                    <div className="flex-1 min-w-0">
                        {/* Doctor Info */}
                        <div className="flex items-center gap-3">
                        <div className="rounded-full bg-purple-100 text-purple-700 w-10 h-10 flex items-center justify-center font-bold text-lg">
                            {/* Doctor initials */}
                            {(doctorObj?.name || "D").split(" ").map((n: any[]) => n[0]).join("")}
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900 text-sm sm:text-base">
                            {doctorObj?.name || "Unknown Doctor"}
                            </div>
                            <div className="text-xs text-slate-600">
                            {doctorProfileObj?.specialization || "No specialization"} • {doctorProfileObj?.experience_years != null ? `${doctorProfileObj.experience_years} yrs` : "No experience"}
                            </div>
                        </div>
                        </div>

                        {/* Job Info */}
                        <div className="mt-2 text-xs text-slate-700">
                        <span className="font-medium">{application.job_title || "Job"}</span>
                        {application.job_date && (
                            <> • {new Date(application.job_date).toLocaleDateString("en-MY", { month: "short", day: "numeric" })}</>
                        )}
                        <span className="ml-2 text-slate-400">Job ID: {application.job_id}</span>
                        </div>

                        {/* Application Status */}
                        <div className="mt-3 flex gap-2">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium
                                ${application.status === "Accepted"
                                ? "bg-emerald-100 text-emerald-800"
                                : application.status === "Rejected"
                                ? "bg-red-100 text-red-700" : application.status === "Pending" ? "bg-purple-100 text-purple-800" 
                                : "bg-orange-100 text-orange-800"}
                            `}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                            {isPast && <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700`}>
                                Application Expired 
                            </span>}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-4">
                        <Button
                        size="sm"
                        className="bg-green-100 text-green-700 hover:bg-green-200"
                        disabled={application.status === "Accepted" || isPast}
                        onClick={() => {
                            updateApplication(application.id, "Accepted");
                        }}
                        >
                        Accept
                        </Button>
                        <Button
                        size="sm"
                        className="bg-red-100 text-red-700 hover:bg-red-200"
                        disabled={application.status === "Rejected" || isPast}
                        onClick={() => {
                            updateApplication(application.id, "Rejected");
                        }}
                        >
                        Reject
                        </Button>
                        <Link href={`/clinic/doctors/${application.doctor_id}`}>
                        <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-200 text-blue-700 hover:bg-blue-50 mt-1"
                        type="button"
                        >
                        View Profile
                        </Button>
                        </Link>
                    </div>
                    </div>
                );
                })}
                </CardContent>
            </Card>
        </div>
    )
}