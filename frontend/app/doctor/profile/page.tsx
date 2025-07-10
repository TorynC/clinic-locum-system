"use client";

import { use, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-number-input";
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
import { CheckCircle, Upload, X, Plus } from "lucide-react";
import axiosInstance from "@/utils/axiosinstance";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DoctorProfilePage() {
  const [skills, setSkills] = useState([""]);
  const [languages, setLanguages] = useState([""]);
  const [isSaving, setIsSaving] = useState(false);
  const [mmcNumber, setMmcNumber] = useState("");
  const [apcNumber, setApcNumber] = useState("");
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
  const [earliestStart, setEarliestStart] = useState("09:00");
  const [latestEnd, setLatestEnd] = useState("18:00");
  const [maxDistance, setMaxDistance] = useState(0);
  const [bankName, setBankName] = useState("");
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const router = useRouter();
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
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  // function to validate profile information
  const validateInfo = () => {
    if (
      !name ||
      name.trim() === "" ||
      !IC ||
      IC.trim() === "" ||
      !address ||
      address.trim() === "" ||
      !city ||
      city.trim() === "" ||
      !state ||
      state.trim() === "" ||
      !postal ||
      postal.trim() === "" ||
      !phone ||
      phone.trim() === "" ||
      !email ||
      email.trim() === "" ||
      !gender ||
      gender.trim() === "" ||
      !birthday ||
      !bankName ||
      bankName.trim() === "" ||
      !bank ||
      bank.trim() === "" ||
      !mmcNumber ||
      mmcNumber.trim() === "" ||
      !apcNumber ||
      apcNumber.trim() === "" ||
      !experienceYears ||
      (!mmcFile && !mmcFileUrl) ||
      (!apcFile && !apcFileUrl)
    ) {
      toast.error("Please fill in all required fields (marked with *)");
      return false;
    }
    return true;
  };

  // function to save profile changes
  const handleProfileChanges = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("skills", JSON.stringify(skills));
      formData.append("languages", JSON.stringify(languages));
      formData.append("mmcNumber", mmcNumber);
      formData.append("apcNumber", apcNumber);
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
      formData.append("bank", bank);
      formData.append("bankName", bankName);
      const token = localStorage.getItem("doctorAccessToken");
      // Only append file if a new file is selected
      if (profilepic) formData.append("profilepic", profilepic);
      if (mmcFile) formData.append("mmcFile", mmcFile);
      if (apcFile) formData.append("apcFile", apcFile);

      const response = await axiosInstance.patch(
        `/doctor-profile/${doctorId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      toast.success("Profile updated successfully");
      // Always refresh profile after save to get latest file URLs and data
      await getProfile();
      // Only clear file state if a new file was uploaded
      if (profilepic) setProfilepic(null);
      if (mmcFile) setMmcFile(null);
      if (apcFile) setApcFile(null);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const getName = async () => {
    const token = localStorage.getItem("doctorAccessToken");
    try {
      const response = await axiosInstance.get(`/get-doctor/${doctorId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!response.data.error) {
        setEmail(response.data.doctor.email);
        setName(response.data.doctor.name);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getProfile = async () => {
    const token = localStorage.getItem("doctorAccessToken");
    try {
      const response = await axiosInstance.get(
        `/get-doctor-profile/${doctorId}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
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
          const utcDate = new Date(response.data.results?.birthday);
          const malaysianDate = new Date(utcDate.getTime() + 28800000);
          formattedBirthday = malaysianDate.toISOString().slice(0, 10);
          setBirthday(formattedBirthday);
        }

        setMmcNumber(response.data.results?.mmc_number ?? "");
        setApcNumber(response.data.results?.apc_number ?? "");
        setExperienceYears(response.data.results?.experience_years ?? 0);
        setBio(response.data.results?.bio ?? "");
        setLanguages(response.data.results?.languages ?? []);
        setSkills(response.data.results?.skills ?? []);
        setMinimumPay(response.data.results?.minimum_pay ?? 0);
        setPreferredDays(response.data.results?.preferred_days ?? []);
        setEarliestStart(response.data.results?.earliest_start ?? "09:00");
        setLatestEnd(response.data.results?.latest_end ?? "18:00");
        setMaxDistance(response.data.results?.max_distance ?? 0);
        setBankName(response.data.results?.bank_name ?? "");
        if (response.data.results?.mmc_file) {
          setMmcFileUrl(response.data.results.mmc_file);
        }
        if (response.data.results?.apc_file) {
          setApcFileUrl(response.data.results.apc_file);
        }
        setWorkExperience(response.data.results?.work_experience ?? []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // function to save name
  const handleSaveName = async () => {
    const token = localStorage.getItem("doctorAccessToken");
    try {
      await axiosInstance.patch(
        `/doctor-info/${doctorId}`,
        {
          name: name,
        },
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      console.log("success");
    } catch (error) {
      console.error(error);
    }
  };
  // function to save email
  const handleSaveEmail = async () => {
    const token = localStorage.getItem("doctorAccessToken");
    try {
      await axiosInstance.patch(
        `/doctor-info/${doctorId}`,
        {
          email: email,
        },
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      console.log("success");
    } catch (error) {
      console.error(error);
    }
  };

  function handleMmcChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setMmcFile(e.target.files[0]);
      setMmcFileUrl(null);
    }
  }

  function handleApcChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setApcFile(e.target.files[0]);
      setApcFileUrl(null);
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

  useEffect(() => {
    const storedId = localStorage.getItem("doctorId");
    if (storedId) {
      setDoctorId(storedId);
    }
  }, []);

  useEffect(() => {
    if (doctorId) {
      getName();
      getProfile();
    }
  }, [doctorId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Doctor Profile</h1>
          <p className="text-gray-500">
            Manage your personal and professional information
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/*verified && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Verified
            </Badge>
          )*/}
          <Button
            className="bg-blue-500 hover:bg-blue-700"
            disabled={isSaving}
            onClick={async () => {
              if (validateInfo()) {
                await handleProfileChanges();
                await handleSaveEmail();
                await handleSaveName();
                router.push("/doctor")
              }
            }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-blue-100 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-black">Profile Photo</CardTitle>
            <CardDescription>Upload your professional photo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 text-4xl font-medium">
                  {profilepic ? (
                    <img
                      className="rounded-full w-30 h-30 border-none"
                      src={URL.createObjectURL(profilepic)}
                      alt="Upload preview"
                    />
                  ) : profilePicUrl ? (
                    <img
                      className="rounded-full w-32 h-32 object-cover border-none"
                      src={`http://localhost:5000/${profilePicUrl.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt="Profile"
                    />
                  ) : (
                    <span>
                      {/* Optionally, show initials or a placeholder */}
                      <span className="text-4xl text-blue-400">?</span>
                    </span>
                  )}
                </div>
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePicChange}
                  disabled={isSaving}
                />
                <label htmlFor="profile-pic-upload">
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-white border-blue-200 cursor-pointer"
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
          </CardContent>
        </Card>

        <Card className="border-blue-100 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-black">Personal Information</CardTitle>
            <CardDescription>Your basic personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name *</Label>
                <Input
                  id="full-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ic-number">IC Number *</Label>
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
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal-code">Postal Code *</Label>
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
                <Label htmlFor="phone">Phone Number *</Label>
                <PhoneInput
                    id="phone"
                    international
                    defaultCountry="MY"
                    value={phone}
                    onChange={(value) => setPhone(value || "")}
                    country="MY"
                    limitMaxLength
                    className="w-full rounded-md border border-input px-3 py-2 text-sm"
                    placeholder="60123456789"
                  />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
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
                <Label htmlFor="gender">Gender *</Label>
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
                <Label htmlFor="dob">Date of Birth *</Label>
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

            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name *</Label>
              <Input
                id="bank-name"
                value={bankName}
                onChange={(e) => {
                  setBankName(e.target.value);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank-number">Bank Account Number *</Label>
              <Input
                id="bank"
                type="number"
                value={bank}
                onChange={(e) => {
                  setBank(e.target.value);
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="professional">
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-blue-100 text-blue-600">
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="skills">Skills & Languages</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="professional" className="mt-6">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-black">
                Professional Information
              </CardTitle>
              <CardDescription>
                Your medical credentials and qualifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mmc-number">MMC Number *</Label>
                  <Input
                    id="mmc-number"
                    value={mmcNumber}
                    onChange={(e) => {
                      setMmcNumber(e.target.value);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apc-number">APC Number *</Label>
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
                <Label>MMC Certificate *</Label>
                <div className="border border-dashed border-blue-200 rounded-md p-4 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="mmc-upload"
                        className="p-2 bg-blue-50 rounded-md cursor-pointer hover:bg-blue-100"
                      >
                        <Upload className="h-5 w-5 text-blue-600" />
                      </label>

                      <input
                        id="mmc-upload"
                        type="file"
                        onChange={handleMmcChange}
                        accept=".pdf"
                        className="hidden"
                        disabled={isSaving}
                      />
                      {mmcFile && (
                        <span className="text-sm text-gray-700">
                          {mmcFile.name}
                        </span>
                      )}

                      {!mmcFile && mmcFileUrl && (
                        <a
                          href={`http://localhost:5000/${mmcFileUrl.replace(
                            /\\/g,
                            "/"
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 underline"
                          download
                        >
                          {mmcFileUrl.split("\\")[1]}
                        </a>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500"
                      onClick={() => {
                        setMmcFile(null);
                        setMmcFileUrl(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>APC Certificate *</Label>
                <div className="border border-dashed border-blue-200 rounded-md p-4 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="apc-upload"
                        className="p-2 bg-blue-50 rounded-md cursor-pointer hover:bg-blue-100"
                      >
                        <Upload className="h-5 w-5 text-blue-600" />
                      </label>
                      <input
                        id="apc-upload"
                        className="hidden"
                        type="file"
                        onChange={handleApcChange}
                        accept=".pdf"
                        disabled={isSaving}
                      />
                      {apcFile && (
                        <span className="text-sm text-gray-700">
                          {apcFile.name}
                        </span>
                      )}
                      {!apcFile && apcFileUrl && (
                        <a
                          href={`http://localhost:5000/${apcFileUrl.replace(
                            /\\/g,
                            "/"
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 underline"
                          download
                        >
                          {apcFileUrl.split("\\")[1]}
                        </a>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500"
                      onClick={() => {
                        setApcFile(null);
                        setApcFileUrl(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience *</Label>
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
                      className="gap-1 border-blue-200 text-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add Experience
                    </Button>
                  </div>

                  <div className="space-y-4 mt-2">
                    <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
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
                    <div className="flex flex-col md:flex-row md:items-start  gap-4 p-4 border border-blue-100 rounded-lg bg-blue-50">
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
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-black">Skills & Languages</CardTitle>
              <CardDescription>
                Your medical skills and languages spoken
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Medical Skills & Procedures</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                  "Antenatal Care",
                  "Ultrasound",
                  "Surgical Procedure",
                  "Sexual Health",
                  "Paeds Care",
                ].map((skill) => (
                    <div key={skill} className="flex items-center space-x-2 ">
                      <input
                        type="checkbox"
                        id={`skill-${skill}`}
                        className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                        checked={skills.includes(skill)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSkills([...skills, skill]);
                          } else {
                            setSkills(skills.filter((q) => q !== skill));
                          }
                        }}
                      />
                      <Label htmlFor={`skill-${skill}`}>{skill}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Label>Languages Spoken</Label>
                <div className="grid grid-cols-2 gap-2 ">
                  {["Chinese", "Tamil"].map((language) => (
                    <div
                      key={language}
                      className="flex items-center space-x-2 "
                    >
                      <input
                        type="checkbox"
                        id={`lang-${language}`}
                        className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                        checked={languages.includes(language)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLanguages([...languages, language]);
                          } else {
                            setLanguages(
                              languages.filter((q) => q !== language)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={`lang-${language}`}>{language}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-black">Job Preferences</CardTitle>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
