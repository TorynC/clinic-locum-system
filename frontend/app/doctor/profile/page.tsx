"use client";

import { use, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Upload, X, Plus, VerifiedIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { profile } from "console";
import { title } from "process";
import { Span } from "next/dist/trace";
import axiosInstance from "@/utils/axiosinstance";
import { setDate } from "date-fns";


export default function DoctorProfilePage() {
  const [skills, setSkills] = useState([
    "IM Injection",
    "Suturing",
    "Wound Care",
    "Venipuncture",
    "ECG",
  ]);
  const [languages, setLanguages] = useState(["English", "Malay"]);
  const [verified, setVerified] = useState(false);
  const [mmcNumber, setMmcNumber] = useState("");
  const [apcNumber, setApcNumber] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experienceYears, setExperienceYears] = useState(0);
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [IC, setIC] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postal, setPostal] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [minimumPay, setMinimumPay] = useState(0);
  const [preferredDays, setPreferredDays] = useState<String[]>([]);
  const [earliestStart, setEarliestStart] = useState("");
  const [latestEnd, setLatestEnd] = useState("");
  const [maxDistance, setMaxDistance] = useState(0);
  const [emailNotif, setEmailNotif] = useState(false);
  const [SMSNotif, setSMSNotif] = useState(false);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  

  type Experience = {
    id: number;
    title: string;
    place: string;
    year: string;
    description: string;
  };

  const [mmcFile, setMmcFile] = useState<File | null>(null);
  const [mmcFileUrl, setMmcFileUrl] = useState<string | null>(null);
  const [workExperience, setWorkExperience] = useState<Experience[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newPlace, setNewPlace] = useState("");
  const [newYear, setNewYear] = useState("");
  const [newDescrition, setNewDescription] = useState("");
  const [bank, setBank] = useState("");
  const [profilepic, setProfilepic] = useState<File | null>(null);
  const [apcFile, setApcFile] = useState<File | null>(null);
  const [apcFileUrl, setApcFileUrl] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  // function to save profile changes 
  const handleProfileChanges = async () => {
  try {
    const formData = new FormData();
    formData.append("skills", JSON.stringify(skills));
    formData.append("languages", JSON.stringify(languages));
    formData.append("mmcNumber", mmcNumber);
    formData.append("apcNumber", apcNumber);
    formData.append("specialization", specialization);
    formData.append("experienceYears", experienceYears.toString());
    formData.append("bio", bio);
    formData.append("IC", IC);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("postal", postal);
    formData.append("phone", phone);
    formData.append("workExperience", JSON.stringify(workExperience));
    formData.append("gender", gender);
    formData.append("birthday", birthday);
    formData.append("minimumPay", minimumPay.toString());
    formData.append("preferredDays", JSON.stringify(preferredDays));
    formData.append("earliestStart", earliestStart);
    formData.append("latestEnd", latestEnd);
    formData.append("maxDistance", maxDistance.toString());
    formData.append("emailNotif", emailNotif ? "true" : "false");
    formData.append("SMSNotif", SMSNotif ? "true" : "false");
    formData.append("verified", verified ? "true" : "false");
    formData.append("bank", bank);
    const token = localStorage.getItem("doctorAccessToken");
    if (profilepic) formData.append("profilepic", profilepic);
    if (mmcFile) formData.append("mmcFile", mmcFile);
    if (apcFile) formData.append("apcFile", apcFile);
    
    
    await axiosInstance.patch(`/doctor-profile/${doctorId}`, formData, {
      
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    console.log("Profile updated successfully");
      } catch (error) {
        console.error(error);
      }
    };

  const getName = async() => {
    const token = localStorage.getItem("doctorAccessToken");
    try {
      const response = await axiosInstance.get(
        `/get-doctor/${doctorId}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          }
        }
      );
      if (!response.data.error) {
        setEmail(response.data.doctor.email)
        setName(response.data.doctor.name)
      }
    } catch (error) {
      console.error(error);
    }
  }

  const getProfile = async() => {
    const token = localStorage.getItem("doctorAccessToken");
    try {
      const response = await axiosInstance.get(`/get-doctor-profile/${doctorId}`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          }
        })
        if (!response.data.error) {
          console.log("profile retrieved successfully");
          setProfilePicUrl(response.data.results?.profile_pic ?? null);
          setIC(response.data.results?.ic || "");
          setAddress(response.data.results?.address || "");
          setBank(response.data.results?.bank_number ?? 0);
          setCity(response.data.results?.city ?? "");
          setState(response.data.results?.state ?? "");
          setPostal(response.data.results?.postal ?? "");
          setPhone(response.data.results?.phone ?? "");
          setGender(response.data.results?.gender ?? "");

          let formattedBirthday = "";
          if (response.data.results?.birthday) {
            const utcDate = new Date(response.data.results?.birthday)
            const malaysianDate = new Date(utcDate.getTime() + 28800000)
            formattedBirthday = malaysianDate.toISOString().slice(0, 10);
            setBirthday(formattedBirthday);
          }
          
          setVerified(response.data.results?.verified ?? "");
          setMmcNumber(response.data.results?.mmc_number ?? "");
          setApcNumber(response.data.results?.apc_number ?? "");
          setSpecialization(response.data.results?.specialization ?? "");
          setExperienceYears(response.data.results?.experience_years ?? 0);
          setBio(response.data.results?.bio ?? "");
          setLanguages(response.data.results?.languages ?? []);
          setSkills(response.data.results?.skills ?? []);
          setMinimumPay(response.data.results?.minimum_pay ?? 0);
          setPreferredDays(response.data.results?.preferred_days ?? "");
          setEarliestStart(response.data.results?.earliest_start ?? "");
          setLatestEnd(response.data.results?.latest_end ?? "");
          setMaxDistance(response.data.results?.max_distance ?? 0);
          setSMSNotif(response.data.results?.sms_notif ?? false);
          setEmailNotif(response.data.results?.email_notif ?? false);
          setMmcFileUrl(response.data.results?.mmc_file ?? null);
          setApcFileUrl(response.data.results?.apc_file ?? null);
          setWorkExperience(response.data.results?.work_experience ?? []);
        }
    } catch (error) {
      console.error(error);
    }
  }

  // function to save name
  const handleSaveName = async () => {
    const token = localStorage.getItem("doctorAccessToken");
    try {
      await axiosInstance.patch(`/doctor-info/${doctorId}`, {
        name: name
      }, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          }
        })
      console.log("success");
    } catch (error) {
      console.error(error)
    }
  }
  // function to save email
  const handleSaveEmail = async () => {
    const token = localStorage.getItem("doctorAccessToken");
    try {
      await axiosInstance.patch(`/doctor-info/${doctorId}`, {
        email: email
      },{
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          }
        })
      console.log("success");
    } catch (error) {
      console.error(error)
    }
  } 

  function handleMmcChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setMmcFile(e.target.files[0]);
      setMmcFileUrl(null);
    }
  }

  function handleApcChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setApcFile(e.target.files[0])
    }
  }

  function handlePicChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setProfilepic(e.target.files[0]);
    }
  }

  const addExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPlace || !newYear) return;
    setWorkExperience([
      ...workExperience,
      {
        id: Date.now(),
        title: newTitle,
        place: newPlace,
        year: newYear,
        description: newDescrition,
      },
    ]);
    setNewTitle("");
    setNewPlace("");
    setNewYear("");
    setNewDescription("");
  };

  // Delete experience
  const deleteExperience = (id: number) => {
    setWorkExperience(workExperience.filter((exp) => exp.id !== id));
  };
  
  const addSkill = (skill: string) => {
    setSkills([...skills, skill])
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addLanguage = (language: string) => {
    setLanguages([...languages, language])
  }

  const removeLanguage = (language: string) => {
    setLanguages(languages.filter((l) => l !== language));
  };

  useEffect(() => {
    const storedId = localStorage.getItem("doctorId");
    if (storedId) {
      setDoctorId(storedId)
    }
  }, []);

  useEffect(() => {
      if (doctorId) {
        getName();
        getProfile();
      };
    }, [doctorId])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Doctor Profile</h1>
          <p className="text-gray-500">
            Manage your personal and professional information
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {verified && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Verified
            </Badge>
          )}
          <Button className="bg-purple-gradient hover:bg-purple-700" onClick={() => {
            handleProfileChanges();
            handleSaveEmail();
            handleSaveName();
          }}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-purple-100 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-purple-900">Profile Photo</CardTitle>
            <CardDescription>Upload your professional photo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-4xl font-medium">
                  {profilepic ? (
                    <img
                      className="rounded-full w-30 h-30 border-none"
                      src={URL.createObjectURL(profilepic)}
                      alt="Upload preview"
                    />
                  ) : profilePicUrl ? (
                    <img
                        className="rounded-full w-32 h-32 object-cover border-none"
                        src={`http://localhost:5000/${profilePicUrl.replace(/\\/g, "/")}`}
                        alt="Profile"
                      />
                    ) : (
                      <span>
                        {/* Optionally, show initials or a placeholder */}
                        <span className="text-4xl text-purple-400">?</span>
                      </span>
                  )}
                </div>
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePicChange}
                />
                <label htmlFor="profile-pic-upload">
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-white border-purple-200 cursor-pointer"
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4" />
                    </span>
                  </Button>
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Upload a professional photo. It will be visible to clinics.
              </p>
            </div>

            <div className="space-y-2 pt-4">
              <Label htmlFor="verification-status">Verification Status</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="verification-status"
                  checked={verified}
                  onCheckedChange={setVerified}
                />
                <Label htmlFor="verification-status">
                  {verified ? "Verified Account" : "Pending Verification"}
                </Label>
              </div>
              <p className="text-xs text-gray-500">
                {verified ? "Your account has been verified by our team. This increases your chances of being hired." : 
                "Your account has not been verified yet"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-purple-900">
              Personal Information
            </CardTitle>
            <CardDescription>Your basic personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ic-number">IC Number</Label>
                <Input
                  id="ic-number"
                  value={IC}
                  onChange={(e) => {
                    setIC(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank-number">Bank Account Number</Label>
              <Input
                id="bank"
                type="number"
                value={bank}
                onChange={(e) => {
                  setBank(e.target.value);
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal-code">Postal Code</Label>
                <Input
                  id="postal-code"
                  value={postal}
                  onChange={(e) => {
                    setPostal(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                >
                  <option value="">Select gender...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={birthday}
                  onChange={(e) => {
                    setBirthday(e.target.value);
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="professional">
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-purple-100 text-purple-600">
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="skills">Skills & Languages</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="professional" className="mt-6">
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-900">
                Professional Information
              </CardTitle>
              <CardDescription>
                Your medical credentials and qualifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mmc-number">MMC Number</Label>
                  <Input
                    id="mmc-number"
                    value={mmcNumber}
                    onChange={(e) => {
                      setMmcNumber(e.target.value);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apc-number">APC Number</Label>
                  <Input
                    id="apc-number"
                    value={apcNumber}
                    onChange={(e) => {
                      setApcNumber(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>MMC Certificate</Label>
                <div className="border border-dashed border-purple-200 rounded-md p-4 bg-purple-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="mmc-upload" className="p-2 bg-purple-50 rounded-md cursor-pointer hover:bg-purple-100">
                            <Upload className="h-5 w-5 text-purple-600" />
                        </label>
                        
                        <input id="mmc-upload" type="file" onChange={handleMmcChange} accept=".pdf" className="hidden"/>
                        {mmcFile && <span className="text-sm text-gray-700">{mmcFile.name}</span>}
                        
                        {!mmcFile && mmcFileUrl && (
                          <a
                            href={`http://localhost:5000/${mmcFileUrl.replace(/\\/g, "/")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-700 underline"
                            download
                          >
                            {mmcFileUrl.split("\\")[1]}
                          </a>
                        )}
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-500" onClick={() => {
                      setMmcFile(null);
                      setMmcFileUrl(null);
                      }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>APC Certificate</Label>
                <div className="border border-dashed border-purple-200 rounded-md p-4 bg-purple-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="apc-upload" className="p-2 bg-purple-50 rounded-md cursor-pointer hover:bg-purple-100">
                          <Upload className="h-5 w-5 text-purple-600" />
                        </label>
                        <input id="apc-upload" className="hidden" type="file" onChange={handleApcChange} accept=".pdf" />
                        {apcFile && <span className="text-sm text-gray-700">{apcFile.name}</span>}
                        {!apcFile && apcFileUrl && (
                          <a 
                            href={`http://localhost:5000/${apcFileUrl.replace(/\\/g, "/")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-700 underline"
                            download
                          >
                            {apcFileUrl.split("\\")[1]}
                          </a>
                        )}
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-500" onClick={() => {
                        setApcFile(null);
                        setApcFileUrl(null);
                      }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <select
                  id="specialization"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={specialization}
                  onChange={(e) => {
                    setSpecialization(e.target.value);
                  }}
                >
                  <option value="">Select Your Specialization</option>
                  <option value="General Practice">General Practice</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Dental">Dental</option>
                  <option value="Emergency Medicine">Emergency Medicine</option>
                  <option value="Surgery">Surgery</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={experienceYears}
                  onChange={(e) => {
                    setExperienceYears(Number(e.target.value));
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value);
                  }}
                />
              </div>

              <div className="space-y-4">
                <form onSubmit={addExperience}>
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">
                      Professional Experience
                    </Label>
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className="gap-1 border-purple-200 text-purple-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add Experience
                    </Button>
                  </div>

                  <div className="space-y-4 mt-2">
                    <div className="p-4 border border-purple-100 rounded-lg bg-purple-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="space-y-2">
                            <Label
                              htmlFor="exp1-title"
                              className="text-xs text-gray-600"
                            >
                              Title
                            </Label>
                            <Input
                              id="exp1-title"
                              value={newTitle}
                              onChange={(e) => {
                                setNewTitle(e.target.value);
                              }}
                              placeholder="e.g., Doctor"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div className="space-y-2">
                              <Label
                                htmlFor="exp1-workplace"
                                className="text-xs text-gray-600"
                              >
                                Place of Work
                              </Label>
                              <Input
                                id="exp1-workplace"
                                value={newPlace}
                                onChange={(e) => {
                                  setNewPlace(e.target.value);
                                }}
                                placeholder="e.g., Hospital Kuala Lumpur"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="exp1-years"
                                className="text-xs text-gray-600"
                              >
                                Years
                              </Label>
                              <Input
                                id="exp1-years"
                                value={newYear}
                                onChange={(e) => {
                                  setNewYear(e.target.value);
                                }}
                                placeholder="e.g., 2020 - 2023"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="exp1-description"
                              className="text-xs text-gray-600"
                            >
                              Brief Description
                            </Label>
                            <Textarea
                              id="exp1-description"
                              rows={2}
                              value={newDescrition}
                              onChange={(e) => {
                                setNewDescription(e.target.value);
                              }}
                              placeholder="Brief description of your role and responsibilities"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <p className="text-xs text-gray-500">
                  Add your professional experience to help clinics understand
                  your background and expertise.
                </p>

                {workExperience.map((exp) => (
                  <div className="space-y-4" key={exp.id}>
                    <div className="flex flex-col md:flex-row md:items-start  gap-4 p-4 border border-purple-100 rounded-lg bg-purple-50">
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <span className="block text-xs text-gray-600 font-medium">
                              Title
                            </span>
                            <span className="block">{exp.title}</span>
                          </div>
                          <div>
                            <span className="block text-xs text-gray-600 font-medium">
                              Years
                            </span>
                            <span className="block">{exp.year}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="block text-xs text-gray-600 font-medium">
                              Place of Work
                            </span>
                            <span className="block">{exp.place}</span>
                          </div>
                          <div>
                            <span className="block text-xs text-gray-600 font-medium">
                              Brief Description
                            </span>
                            <span className="block">{exp.description}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-600 mt-2 md:mt-0"
                        onClick={() => deleteExperience(exp.id)}
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-900">
                Skills & Languages
              </CardTitle>
              <CardDescription>
                Your medical skills and languages spoken
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Medical Skills & Procedures</Label>
                  <div className="flex items-center gap-2 ml-auto">
                    
                    <Input className=" w-40" value={newSkill} onChange={(e) => {setNewSkill(e.target.value)}}></Input>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 border-purple-200 text-purple-700"
                      onClick={() => {
                        addSkill(newSkill.trim());
                        setNewSkill("");
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="pl-3 pr-2 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200"
                    >
                      {skill}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 text-purple-700 hover:text-purple-900 hover:bg-transparent"
                        onClick={() => removeSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Add all medical procedures and skills you are proficient in.
                  This helps clinics find you for specific needs.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Languages Spoken</Label>
                  <div className="flex items-center gap-2 ml-auto">
                    
                    <Input className=" w-40" value={newLanguage} onChange={(e) => {setNewLanguage(e.target.value)}}></Input>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 border-purple-200 text-purple-700"
                      onClick={() => {
                        newLanguage.trim();
                        addLanguage(newLanguage);
                        setNewLanguage("");
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      
                    </Button>
                  </div>
                  
                  
                </div>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language) => (
                    <Badge
                      key={language}
                      variant="secondary"
                      className="pl-3 pr-2 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200"
                    >
                      {language}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 text-purple-700 hover:text-purple-900 hover:bg-transparent"
                        onClick={() => removeLanguage(language)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Add all languages you can communicate in with patients.
                  Include your proficiency level if relevant.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-900">Job Preferences</CardTitle>
              <CardDescription>
                Set your preferences for locum jobs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="min-hourly-rate">
                  Minimum Hourly Rate (RM)
                </Label>
                <Input
                  id="min-hourly-rate"
                  type="number"
                  value={minimumPay}
                  onChange={(e) => {
                    setMinimumPay(Number(e.target.value));
                  }}
                />
                <p className="text-xs text-gray-500">
                  You will only be shown jobs that meet or exceed this hourly
                  rate.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Preferred Work Days</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`day-${day}`}
                        className="h-4 w-4 rounded border-gray-300"
                        checked={preferredDays.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPreferredDays([...preferredDays, day]);
                          } else {
                            setPreferredDays(
                              preferredDays.filter((q) => q !== day)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={`day-${day}`}>{day}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Work Hours</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Earliest Start Time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={earliestStart}
                      onChange={(e) => {
                        setEarliestStart(e.target.value);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">Latest End Time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={latestEnd}
                      onChange={(e) => {
                        setLatestEnd(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Maximum Travel Distance</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="travel-distance"
                    type="number"
                    value={maxDistance}
                    onChange={(e) => {
                      setMaxDistance(Number(e.target.value));
                    }}
                  />
                  <span className="text-gray-500">km</span>
                </div>
                <p className="text-xs text-gray-500">
                  You will only be shown jobs within this distance from your
                  address.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Notification Preferences (Available in the next update)</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="email-notifications"
                      checked={emailNotif}
                      onCheckedChange={setEmailNotif}
                    />
                    <Label htmlFor="email-notifications">
                      Email notifications for new matching jobs
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sms-notifications"
                      checked={SMSNotif}
                      onCheckedChange={setSMSNotif}
                    />
                    <Label htmlFor="sms-notifications">
                      SMS notifications for urgent requests
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
