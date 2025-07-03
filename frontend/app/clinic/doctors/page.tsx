"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Star,
  StarOff,
  FileText,
  MessageSquare,
  Heart,
  HeartOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosinstance";
import Link from "next/link";

export default function DoctorsPage() {
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [favoriteDoctorIds, setFavoriteDoctorIds] = useState<string[]>([]);
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [doctorProfiles, setDoctorProfiles] = useState<any[]>([]);

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
    if (storedId) setClinicId(storedId);
  }, []);

  useEffect(() => {
    if (!clinicId) return;
    // Fetch all doctors
    axiosInstance.get("/get-doctors").then((res) => {
      if (!res.data.error) setAllDoctors(res.data.doctors);
    });
    // Fetch favorite doctor IDs
    axiosInstance.get(`/favorite-doctors/${clinicId}`).then((res) => {
      if (!res.data.error) setFavoriteDoctorIds(res.data.favoriteDoctorIds);
    });

    getDoctorProfiles();
  }, [clinicId]);

  // Toggle favorite
  const toggleFavorite = async (doctorId: string) => {
    if (!clinicId) return;
    if (favoriteDoctorIds.includes(doctorId)) {
      await axiosInstance.delete(
        `/favorite-doctor?clinic_id=${clinicId}&doctor_id=${doctorId}`
      );
      setFavoriteDoctorIds((ids) => ids.filter((id) => id !== doctorId));
    } else {
      await axiosInstance.post("/favorite-doctor", {
        clinic_id: clinicId,
        doctor_id: doctorId,
      });
      setFavoriteDoctorIds((ids) => [...ids, doctorId]);
    }
  };

  // Preferred doctors
  const preferredDoctors = allDoctors.filter((d) =>
    favoriteDoctorIds.includes(d.id)
  );
  // Non-preferred doctors
  const nonPreferredDoctors = allDoctors.filter(
    (d) => !favoriteDoctorIds.includes(d.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Preferred Doctors</h1>
          <p className="text-gray-500">Manage your preferred locum doctors</p>
        </div>
      </div>

      <Tabs defaultValue="preferred">
        <TabsList>
          <TabsTrigger value="preferred">Preferred Doctors</TabsTrigger>
          <TabsTrigger value="all">All Doctors</TabsTrigger>
        </TabsList>

        <TabsContent value="preferred" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {preferredDoctors.length === 0 && (
              <div className="text-gray-500 col-span-full">
                No preferred doctors yet.
              </div>
            )}
            {preferredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                preferred={true}
                onToggleFavorite={() => toggleFavorite(doctor.id)}
                doctorProfiles={doctorProfiles}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allDoctors.length === 0 && (
              <div className="text-gray-500 col-span-full">
                No doctors found.
              </div>
            )}
            {allDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                preferred={favoriteDoctorIds.includes(doctor.id)}
                onToggleFavorite={() => toggleFavorite(doctor.id)}
                doctorProfiles={doctorProfiles}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// DoctorCard component with favorite toggle
function DoctorCard({
  doctor,
  preferred,
  onToggleFavorite,
  doctorProfiles,
}: {
  doctor: any;
  preferred: boolean;
  onToggleFavorite: () => void;
  doctorProfiles: any[];
}) {
  const profile = doctorProfiles.find((p) => p.id === doctor.id);

  const languages = profile?.languages || [];
  const skills = profile?.skills || [];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-lg font-medium">
              {doctor.name?.charAt(0) || "D"}
            </div>
            <div>
              <h3 className="font-medium">{doctor.name}</h3>
              <p className="text-sm text-gray-500">
                {doctor.specialty || "General Practice"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500"
            onClick={onToggleFavorite}
          >
            {preferred ? (
              <Heart className="h-5 w-5 fill-red-500" />
            ) : (
              <HeartOff className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">LANGUAGES</p>
            <div className="flex flex-wrap gap-1">
              {languages.map((language: string) => (
                <Badge key={language} variant="outline" className="text-xs">
                  {language}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">SKILLS</p>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill: string) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="gap-1">
            <FileText className="h-4 w-4" />
            <Link href={`/clinic/doctors/${doctor.id}`}>View Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
