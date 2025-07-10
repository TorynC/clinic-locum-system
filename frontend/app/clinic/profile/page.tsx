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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosinstance";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfilePage() {
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [clinicName, setClinicName] = useState("");
  const [clinicDescription, setClinicDescription] = useState("");
  const [clinicType, setClinicType] = useState("general");
  const [clinicEmail, setClinicEmail] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [clinicCity, setClinicCity] = useState("");
  const [clinicPostal, setClinicPostal] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [rate, setRate] = useState<number>(0);
  const [state, setState] = useState("");
  const [doctor, setDoctor] = useState("");
  const [gender, setGender] = useState("");
  const [nightRateAvailable, setNightRateAvailable] = useState<boolean>(false);
  const [nightRate, setNightRate] = useState<number>(0);
  const [activeTab, setActiveTab] = useState("general");
  const router = useRouter();

  // validation
  const validateGeneralInfo = () => {
    console.log("Validating general info:", { clinicName, clinicType }); // Add debugging
    if (
      !clinicName ||
      clinicName.trim() === "" ||
      !clinicType ||
      clinicType.trim() === ""
    ) {
      toast.error("Please fill in all required fields (marked with *)");
      return false;
    }
    return true;
  };

  const validateContactInfo = () => {
    console.log("Validating contact info:", {
      clinicAddress,
      clinicCity,
      state,
      clinicPostal,
      doctor,
      clinicPhone,
      clinicEmail,
    }); // Add debugging

    if (
      !clinicAddress ||
      clinicAddress.trim() === "" ||
      !clinicCity ||
      clinicCity.trim() === "" ||
      !state ||
      state.trim() === "" ||
      !clinicPostal ||
      !doctor ||
      doctor.trim() === "" ||
      !clinicPhone ||
      clinicPhone.trim() === "" ||
      !clinicEmail ||
      clinicEmail.trim() === ""
    ) {
      toast.error("Please fill in all required fields (marked with *)");
      return false;
    }
    return true;
  };

  const validatePreferences = () => {
    console.log("Validating preferences:", { rate }); // Add debugging
    if (!rate || rate <= 0) {
      toast.error("Please enter a valid default rate");
      return false;
    }
    return true;
  };

  // function to save changes
  const handleSaveGeneral = async () => {
    try {
      // send clinic general info
      await axiosInstance.patch(`/general-info/${clinicId}`, {
        type: clinicType,
        description: clinicDescription,
      });
      toast.success("General information saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save general information");
    }
  };

  // function to save preferences
  const handleSavePreferences = async () => {
    try {
      const response = await axiosInstance.patch(`/preferences/${clinicId}`, {
        qualifications,
        languages,
        nightRate,
        nightRateAvailable,
        rate,
        gender,
      });

      console.log("Preferences saved successfully:", response.data);
      toast.success("Clinic preferences saved successfully");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save clinic preferences");
    }
  };
  // function to save name
  const handleSaveName = async () => {
    try {
      await axiosInstance.patch(`/name-email/${clinicId}`, {
        clinic_name: clinicName,
      });
      console.log("success");
    } catch (error) {
      console.error(error);
    }
  };

  // function to save email
  const handleSaveEmail = async () => {
    try {
      await axiosInstance.patch(`/name-email/${clinicId}`, {
        email: clinicEmail,
      });
      console.log("success");
    } catch (error) {
      console.error(error);
    }
  };

  // function to save contact details
  const handleSaveContact = async () => {
    try {
      await axiosInstance.patch(`/contact-details/${clinicId}`, {
        address: clinicAddress,
        city: clinicCity,
        state,
        postal: clinicPostal,
        phone: clinicPhone,
        doctor,
      });
      toast.success("Contact information saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save contact information");
    }
  };

  // function to get clinic preferences
  const getClinicPreferences = async () => {
    try {
      const response = await axiosInstance.get(`/get-preferences/${clinicId}`);
      if (!response.data.error) {
        setQualifications(response.data.clinic.qualifications || []);
        setLanguages(response.data.clinic.languages || []);
        setRate(response.data.clinic.default_rate || 0);
        setGender(response.data.clinic.gender);
        setNightRate(response.data.clinic.night_rate);
        setNightRateAvailable(response.data.clinic.night_rate_available);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //function to get clinic name/email
  const getClinicNameEmail = async () => {
    try {
      const response = await axiosInstance.get(`/get-clinic/${clinicId}`);
      if (!response.data.error) {
        setClinicName(response.data.clinic.clinic_name);
        setClinicEmail(response.data.clinic.email);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //function to get other clinic general info
  const getGeneralInfo = async () => {
    try {
      const response = await axiosInstance.get(
        `/get-clinic-general/${clinicId}`
      );
      if (!response.data.error) {
        setClinicDescription(response.data.clinic.description);
        setClinicType(response.data.clinic.type);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // function to get contact details
  const getContactInfo = async () => {
    try {
      const response = await axiosInstance.get(
        `/get-contact-details/${clinicId}`
      );
      console.log("Contact info response:", response.data);
      if (!response.data.error) {
        setClinicAddress(response.data.clinic.address);
        setClinicCity(response.data.clinic.city);
        setClinicPostal(response.data.clinic.postal);
        setClinicPhone(response.data.clinic.phone);
        setState(response.data.clinic.state || ""); // <-- add this
        setDoctor(response.data.clinic.doctor || ""); // <-- add this
      }
    } catch (error) {
      console.error("Error fetching contact info:", error);
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
      getClinicNameEmail();
      getGeneralInfo();
      getContactInfo();
      getClinicPreferences();
    }
  }, [clinicId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Clinic Profile</h1>
        <p className="text-gray-500">
          Manage your clinic information and settings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-blue-100 text-blue-600">
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="contact">Contact Details</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-black">General Information</CardTitle>
              <CardDescription>
                Update your clinic's basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinic-name">Clinic Name *</Label>
                <Input
                  id="clinic-name"
                  value={clinicName || ""}
                  onChange={(e) => setClinicName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinic-type">Clinic Type *</Label>
                <select
                  id="clinic-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={clinicType || "general"} // <-- Change "medical" to "general" to match first option
                  onChange={(e) => {
                    setClinicType(e.target.value);
                  }}
                >
                  <option value="general">GP Clinic</option>
                  <option value="dental">Dental Clinic</option>
                  <option value="hospital">Hospital</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Clinic Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={clinicDescription ? `${clinicDescription}` : ""}
                  onChange={(e) => {
                    setClinicDescription(e.target.value);
                  }}
                />
              </div>

              <Button
                className="bg-blue-700 hover:bg-blue-900"
                onClick={() => {
                  if (validateGeneralInfo()) {
                    handleSaveGeneral();
                    handleSaveName();
                    setActiveTab("contact");
                  }
                }}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-black-900">Contact Details</CardTitle>
              <CardDescription>
                Update your clinic's contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={clinicAddress}
                  onChange={(e) => {
                    setClinicAddress(e.target.value);
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={clinicCity || ""}
                    onChange={(e) => {
                      setClinicCity(e.target.value);
                    }}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State * </Label>
                  <Input
                    id="state"
                    className="w-full"
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
                    value={clinicPostal || ""}
                    onChange={(e) => {
                      setClinicPostal(e.target.value);
                    }}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor">Person In Charge (PIC) Name * </Label>
                <Input
                  id="doctor"
                  value={doctor}
                  onChange={(e) => {
                    setDoctor(e.target.value);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={clinicPhone || ""}
                  onChange={(e) => setClinicPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={clinicEmail || ""}
                  onChange={(e) => setClinicEmail(e.target.value)}
                />
              </div>

              <Button
                className="bg-blue-700 hover:bg-blue-900"
                onClick={() => {
                  if (validateContactInfo()) {
                    handleSaveContact();
                    handleSaveEmail();
                    setActiveTab("preferences");
                  }
                }}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-black">Preferences</CardTitle>
              <CardDescription>
                Set your default preferences for job postings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 ">
              <div className="space-y-2">
                <Label htmlFor="default-rate">Default Rate/Hour (MYR) *</Label>
                <Input
                  id="default-rate"
                  type="number"
                  value={Number(rate)}
                  onChange={(e) => {
                    setRate(Number(e.target.value));
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="night-rate">Night Rate Available?</Label>
                <div className=" flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="night-rate"
                    className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                    checked={nightRateAvailable}
                    onChange={(e) => setNightRateAvailable(e.target.checked)}
                  />
                </div>
              </div>

              {nightRateAvailable && (
                <div className="space-y-2">
                  <Label htmlFor="night-rate">
                    Default Night Rate/Hour (MYR)
                  </Label>
                  <Input
                    id="night-rate"
                    type="number"
                    value={Number(nightRate)}
                    onChange={(e) => {
                      setNightRate(Number(e.target.value));
                    }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Preferred Doctor Qualifications</Label>
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
                        checked={qualifications.includes(skill)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setQualifications([...qualifications, skill]);
                          } else {
                            setQualifications(
                              qualifications.filter((q) => q !== skill)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={`skill-${skill}`}>{skill}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Languages</Label>
                <div className="grid grid-cols-2 gap-2 ">
                  {[
                    "Chinese",
                    "Tamil"
                  ].map((language) => (
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

              <div className="space-y-2">
                <Label>Preferred Gender</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="any-gender"
                      name="gender"
                      className="h-4 w-4"
                      value="any"
                      checked={gender === "any"}
                      onChange={() => {
                        setGender("any");
                      }}
                    />
                    <Label htmlFor="any-gender">Any</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      className="h-4 w-4"
                      value={"male"}
                      checked={gender === "male"}
                      onChange={() => {
                        setGender("male");
                      }}
                    />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      className="h-4 w-4"
                      value={"female"}
                      checked={gender === "female"}
                      onChange={() => {
                        setGender("female");
                      }}
                    />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </div>
              </div>

              <Button
                className="bg-blue-700 hover:bg-blue-900"
                onClick={async () => {
                  if (validatePreferences()) {
                    await handleSavePreferences();
                    // Check if this completes the profile setup
                    toast.success(
                      "Profile setup completed! Welcome to LocumLah!"
                    );
                    router.push("/clinic");
                  }
                }}
              >
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
