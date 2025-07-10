"use client";
import { use, useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosinstance";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Heart } from "lucide-react";
import React from "react";
import Link from "next/link";

export default function ClinicDoctorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [favoriteDoctors, setFavoriteDoctors] = useState<string[]>([]);
  const [doctor, setDoctor] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [clinicId, setClinicId] = useState<string | null>(null);

  // Get clinicId from localStorage on mount
  useEffect(() => {
    const storedId = localStorage.getItem("clinicId");
    if (storedId) setClinicId(storedId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorRes = await axiosInstance.get(`/get-doctor/${id}`);
        if (!doctorRes.data.error) setDoctor(doctorRes.data.doctor);

        const profileRes = await axiosInstance.get(`/get-doctor-profile/${id}`);
        if (!profileRes.data.error) setProfile(profileRes.data.results);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!clinicId) return;
    const fetchFavorites = async () => {
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

  if (!doctor || !profile) {
    return (
      <div className="p-8 text-center text-gray-500">Loading profile...</div>
    );
  }

  const toggleFavorite = (doctorId: string) => {
    if (favoriteDoctors.includes(doctorId)) {
      unheartDoctor(doctorId);
    } else {
      heartDoctor(doctorId);
    }
  };

  const heartDoctor = async (doctorId: string) => {
    try {
      await axiosInstance.post("/favorite-doctor", {
        clinic_id: clinicId,
        doctor_id: doctorId,
      });
      setFavoriteDoctors((prev) => [...prev, doctorId]);
    } catch (error) {
      console.error(error);
    }
  };

  const unheartDoctor = async (doctorId: string) => {
    try {
      await axiosInstance.delete(
        `/favorite-doctor?clinic_id=${clinicId}&doctor_id=${doctorId}`
      );
      setFavoriteDoctors((prev) => prev.filter((id) => id !== doctorId));
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <Card className="border-purple-100">
        <CardContent className="flex flex-col md:flex-row gap-8 p-6">
          {/* Profile Picture & Certificates */}
          <div className="flex flex-col items-center gap-4 md:w-1/3">
            <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-4xl font-medium overflow-hidden">
              {profile.profile_pic ? (
                <img
                  src={`http://localhost:5000/${profile.profile_pic.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full"
                />
              ) : (
                <span>
                  {doctor.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </span>
              )}
            </div>
            {profile.verified && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Verified
              </Badge>
            )}
            <div className="space-y-2 w-full">
              <div>
                <span className="font-semibold">MMC Certificate:</span>{" "}
                {profile.mmc_file ? (
                  <a
                    href={`http://localhost:5000/${profile.mmc_file.replace(
                      /\\/g,
                      "/"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-700 underline"
                  >
                    View MMC
                  </a>
                ) : (
                  <span className="text-gray-400">Not uploaded</span>
                )}
              </div>
              <div>
                <span className="font-semibold">APC Certificate:</span>{" "}
                {profile.apc_file ? (
                  <a
                    href={`http://localhost:5000/${profile.apc_file.replace(
                      /\\/g,
                      "/"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-700 underline"
                  >
                    View APC
                  </a>
                ) : (
                  <span className="text-gray-400">Not uploaded</span>
                )}
              </div>
              <div>
                <span className="font-semibold">Bank Name:</span>
                <p className=" text-gray-700 text-sm">{profile.bank_name}</p>
              </div>
              <div>
                <span className="font-semibold">Bank Account Number:</span>
                <p className=" text-gray-700 text-sm">{profile.bank_number}</p>
              </div>
            </div>
          </div>
          {/* Doctor Info */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-black">
                  {doctor.name}{" "}
                </h2>
                <button
                  type="button"
                  className="focus:outline-none"
                  onClick={() => toggleFavorite(doctor?.id)}
                  aria-label="Favorite doctor"
                >
                  <Heart
                    className={
                      favoriteDoctors.includes(doctor?.id)
                        ? "text-red-500 fill-red-500"
                        : "text-gray-400"
                    }
                    fill={
                      favoriteDoctors.includes(doctor?.id)
                        ? "currentColor"
                        : "none"
                    }
                    size={25}
                  />
                </button>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {profile.experience_years != null
                  ? `${profile.experience_years} years experience`
                  : ""}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600 font-medium">
                  Reliability Rating:
                </span>
                <span className="text-lg font-semibold text-yellow-500">
                  {profile.reliability_rating != null
                    ? profile.reliability_rating
                    : "5.0"}
                </span>
                <span className="text-2xl text-yellow-500">★</span>
                  
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-medium text-slate-900">Contact</div>
                <div className="text-sm text-gray-700">{doctor.email}</div>
                <Link href={`https://api.whatsapp.com/send?phone=${profile.phone.split("+")[1]}`}>
                <div className="text-sm text-purple-700 hover:cursor-pointer underline">{profile.phone}</div>
                </Link>
              </div>
              <div>
                <div className="font-medium text-slate-900">Location</div>
                <div className="text-sm text-gray-700">{profile.address}</div>
                <div className="text-sm text-gray-700">
                  {profile.city}, {profile.state} {profile.postal}
                </div>
              </div>
            </div>
            <div>
              <div className="font-medium text-slate-900">Bio</div>
              <div className="text-sm text-gray-700">
                {profile.bio || "No bio provided."}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.skills?.map((skill: string) => (
                <Badge key={skill} className="bg-slate-100 text-black">
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.languages?.map((lang: string) => (
                <Badge key={lang} className="bg-blue-100 text-blue-700">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-black">
            Professional Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.work_experience && profile.work_experience.length > 0 ? (
            profile.work_experience.map((exp: any) => (
              <div
                key={exp.id}
                className="p-4 border border-blue-100 rounded-lg bg-slate-50"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <div className="flex-1">
                    <div className="font-semibold">{exp.title}</div>
                    <div className="text-sm text-gray-700">{exp.place}</div>
                    <div className="text-xs text-gray-500">{exp.year}</div>
                  </div>
                  <div className="text-sm text-gray-600">{exp.description}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400">No experience listed.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
