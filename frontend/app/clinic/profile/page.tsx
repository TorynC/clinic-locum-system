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
import { Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function ProfilePage() {
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [clinicName, setClinicName] = useState("");
  const [clinicDescription, setClinicDescription] = useState("");
  const [clinicType, setClinicType] = useState("");
  const [clinicYear, setClinicYear] = useState("");
  const [clinicEmail, setClinicEmail] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [clinicCity, setClinicCity] = useState("");
  const [clinicPostal, setClinicPostal] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");
  const [clinicWebsite, setClinicWebsite] = useState("");
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [preferredDoctors, setPreferredDoctors] = useState<boolean>(false);
  const [dayRate, setDayRate] = useState<number>(0);
  const [nightRate, setNightRate] = useState<number>(0);
  const [dayStart, setDayStart] = useState<string>("09:00");
  const [dayEnd, setDayEnd] = useState<string>("17:00");
  const [nightStart, setNightStart] = useState<string>("17:00");
  const [nightEnd, setNightEnd] = useState<string>("21:00");
  const [twoRates, setTwoRates] = useState(false);
  const [rate, setRate] = useState<number>(0);
  const [start, setStart] = useState<string>("09:00");
  const [end, setEnd] = useState<string>("18:00");

  // function to save changes
  const handleSaveGeneral = async () => {
    try {
      // send clinic general info
      await axiosInstance.patch(`/general-info/${clinicId}`, {
        type: clinicType,
        description: clinicDescription,
        year: clinicYear,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // function to save preferences
  const handleSavePreferences = async () => {
    try {
      const response = await axiosInstance.patch(`/preferences/${clinicId}`, {
        dayRate,
        nightRate,
        dayStart,
        dayEnd,
        nightStart,
        nightEnd,
        qualifications,
        languages,
        preferredDoctors, 
        twoRates,
        rate,
        start,
        end
      });

      // Update local state with the response data if needed
      console.log("Preferences saved successfully:", response.data);

      // Optional: Show success message to user
    } catch (error) {
      console.error("Error saving preferences:", error);
      // Optional: Show error message to user
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
        postal: clinicPostal,
        phone: clinicPhone,
        website: clinicWebsite,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // function to get clinic preferences
  const getClinicPreferences = async () => {
    try {
      const response = await axiosInstance.get(`/get-preferences/${clinicId}`);
      if (!response.data.error) {
        setDayRate(response.data.clinic.day_rate);
        setNightRate(response.data.clinic.night_rate);
        setQualifications(response.data.clinic.qualifications || []);
        setLanguages(response.data.clinic.languages || []);
        setPreferredDoctors(response.data.clinic.preferred_doctors_only);
        setDayStart(response.data.clinic.day_start_time);
        setDayEnd(response.data.clinic.day_end_time);
        setNightStart(response.data.clinic.night_start_time);
        setNightEnd(response.data.clinic.night_end_time);
        setRate(response.data.clinic.default_rate);
        setTwoRates(response.data.clinic.two_rates);
        setStart(response.data.clinic.start_time);
        setEnd(response.data.clinic.end_time);
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
        setClinicYear(response.data.clinic.year);
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
        setClinicWebsite(response.data.clinic.website);
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
        <h1 className="text-3xl font-bold text-purple-900">Clinic Profile</h1>
        <p className="text-gray-500">
          Manage your clinic information and settings
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-purple-100 text-purple-600">
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="contact">Contact Details</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-900">
                General Information
              </CardTitle>
              <CardDescription>
                Update your clinic's basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinic-name">Clinic Name</Label>
                <Input
                  id="clinic-name"
                  value={clinicName ? `${clinicName}` : ""}
                  onChange={(e) => {
                    setClinicName(e.target.value);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinic-type">Clinic Type</Label>
                <select
                  id="clinic-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={clinicType ? `${clinicType}` : "medical"}
                  onChange={(e) => {
                    setClinicType(e.target.value);
                  }}
                >
                  <option value="medical">Medical Clinic</option>
                  <option value="dental">Dental Clinic</option>
                  <option value="specialist">Specialist Clinic</option>
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

              <div className="space-y-2">
                <Label htmlFor="established">Year Established</Label>
                <Input
                  id="established"
                  type="number"
                  value={clinicYear ? `${clinicYear}` : ""}
                  onChange={(e) => {
                    setClinicYear(e.target.value);
                  }}
                />
              </div>

              <Button
                className="bg-purple-gradient hover:bg-purple-700"
                onClick={() => {
                  handleSaveGeneral();
                  handleSaveName();
                }}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-900">Contact Details</CardTitle>
              <CardDescription>
                Update your clinic's contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={clinicAddress}
                  onChange={(e) => {
                    setClinicAddress(e.target.value);
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={clinicCity ? `${clinicCity}` : ""}
                    onChange={(e) => {
                      setClinicCity(e.target.value);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal-code">Postal Code</Label>
                  <Input
                    id="postal-code"
                    value={clinicPostal ? `${clinicPostal}` : ""}
                    onChange={(e) => {
                      setClinicPostal(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={clinicPhone ? `${clinicPhone}` : ""}
                  onChange={(e) => setClinicPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={clinicEmail ? `${clinicEmail}` : ""}
                  onChange={(e) => setClinicEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={clinicWebsite ? `${clinicWebsite}` : ""}
                  onChange={(e) => setClinicWebsite(e.target.value)}
                />
              </div>

              <Button
                className="bg-purple-gradient hover:bg-purple-700"
                onClick={() => {
                  handleSaveContact();
                  handleSaveEmail();
                }}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-900">Preferences</CardTitle>
              <CardDescription>
                Set your default preferences for job postings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 ">
              <div className="flex items-center space-x-2">
                <Switch
                  id="two-rates"
                  checked={twoRates}
                  onCheckedChange={setTwoRates}
                ></Switch>
                <Label htmlFor="two-rates">
                  Enable Day Time and Night Time rates
                </Label>
              </div>
              {twoRates && (
                <div className="space-y-2">
                  {twoRates && (
                    <Label htmlFor="default-day-rate">
                      Default Day Time Rate (MYR)
                    </Label>
                  )}
                  {twoRates && (
                    <Input
                      id="default-day-rate"
                      type="number"
                      value={Number(dayRate)}
                      onChange={(e) => setDayRate(Number(e.target.value))}
                    />
                  )}
                </div>
              )}

              {!twoRates && (
                <div className="space-y-2">
                  <Label htmlFor="default-rate">Default Rate (MYR)</Label>
                  <Input
                    id="default-rate"
                    type="number"
                    value={Number(rate)}
                    onChange={(e) => {
                      setRate(Number(e.target.value));
                    }}
                  />
                </div>
              )}

              {!twoRates && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Default Shift Start Time</Label>
                    <div className="relative">
                      <Input
                        id="start-time"
                        type="time"
                        value={start}
                        onChange={(e) => {
                          setStart(e.target.value);
                        }}
                      />
                      <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">Default Shift End Time</Label>
                    <div className="relative">
                      <Input
                        id="end-time"
                        type="time"
                        value={end}
                        onChange={(e) => {
                          setEnd(e.target.value);
                        }}
                      />
                      <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}

              {twoRates && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Day Start Time</Label>
                    <div className="relative">
                      <Input
                        id="start-time"
                        type="time"
                        value={dayStart}
                        onChange={(e) => {
                          setDayStart(e.target.value);
                        }}
                      />
                      <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">Day End Time</Label>
                    <div className="relative">
                      <Input
                        id="end-time"
                        type="time"
                        value={dayEnd}
                        onChange={(e) => {
                          setDayEnd(e.target.value);
                        }}
                      />
                      <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}

              {twoRates && (
                <div className="space-y-2">
                  <Label htmlFor="default-night-rate">
                    Default Night Time Rate (MYR)
                  </Label>
                  <Input
                    id="default-night-rate"
                    type="number"
                    value={Number(nightRate)}
                    onChange={(e) => setNightRate(Number(e.target.value))}
                  />
                </div>
              )}

              {twoRates && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Night Start Time</Label>
                    <div className="relative">
                      <Input
                        id="start-time"
                        type="time"
                        value={nightStart}
                        onChange={(e) => {
                          setNightStart(e.target.value);
                        }}
                      />
                      <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">Night End Time</Label>
                    <div className="relative">
                      <Input
                        id="end-time"
                        type="time"
                        value={nightEnd}
                        onChange={(e) => {
                          setNightEnd(e.target.value);
                        }}
                      />
                      <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Preferred Doctor Qualifications</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Antenatal Care",
                    "IM Injection",
                    "ECG",
                    "Suturing",
                    "Paeds Care",
                    "Venipuncture",
                    "Wound Care",
                    "Basic Surgery",
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
                  {["English", "Malay", "Mandarin", "Tamil", "Cantonese"].map(
                    (language) => (
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
                    )
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="preferred-only"
                  className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                  checked={preferredDoctors}
                  onChange={(e) => setPreferredDoctors(e.target.checked)}
                />
                <Label htmlFor="preferred-only">
                  Default to "Preferred Doctors Only" for new job postings
                </Label>
              </div>

              <Button
                className="bg-purple-gradient hover:bg-purple-700"
                onClick={handleSavePreferences}
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
