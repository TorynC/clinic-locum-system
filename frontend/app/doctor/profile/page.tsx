"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Upload, X, Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function DoctorProfilePage() {
  const [skills, setSkills] = useState(["IM Injection", "Suturing", "Wound Care", "Venipuncture", "ECG"])
  const [languages, setLanguages] = useState(["English", "Malay"])
  const [isVerified, setIsVerified] = useState(true)

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const removeLanguage = (language: string) => {
    setLanguages(languages.filter((l) => l !== language))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Doctor Profile</h1>
          <p className="text-gray-500">Manage your personal and professional information</p>
        </div>
        <div className="flex items-center space-x-2">
          {isVerified && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" />
              Verified
            </Badge>
          )}
          <Button className="bg-purple-gradient hover:bg-purple-700">Save Changes</Button>
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
                  DR
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-white border-purple-200"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">Upload a professional photo. It will be visible to clinics.</p>
            </div>

            <div className="space-y-2 pt-4">
              <Label htmlFor="verification-status">Verification Status</Label>
              <div className="flex items-center space-x-2">
                <Switch id="verification-status" checked={isVerified} onCheckedChange={setIsVerified} />
                <Label htmlFor="verification-status">{isVerified ? "Verified Account" : "Pending Verification"}</Label>
              </div>
              <p className="text-xs text-gray-500">
                Your account has been verified by our team. This increases your chances of being hired.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-purple-900">Personal Information</CardTitle>
            <CardDescription>Your basic personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" defaultValue="Dr. Robert Chen" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ic-number">IC Number</Label>
                <Input id="ic-number" defaultValue="880101-14-5523" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue="42 Jalan Medic, Taman Kesihatan" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" defaultValue="Kuala Lumpur" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" defaultValue="Wilayah Persekutuan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal-code">Postal Code</Label>
                <Input id="postal-code" defaultValue="50400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+60 12-345-6789" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="dr.robert@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" defaultValue="1988-01-01" />
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
              <CardTitle className="text-purple-900">Professional Information</CardTitle>
              <CardDescription>Your medical credentials and qualifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mmc-number">MMC Number</Label>
                  <Input id="mmc-number" defaultValue="MMC-54321" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apc-number">APC Number</Label>
                  <Input id="apc-number" defaultValue="APC-12345" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>MMC Certificate</Label>
                <div className="border border-dashed border-purple-200 rounded-md p-4 bg-purple-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-purple-100 rounded-md">
                        <Upload className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">MMC_Certificate.pdf</p>
                        <p className="text-xs text-gray-500">Uploaded on 10 Jan 2025</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-500">
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
                      <div className="p-2 bg-purple-100 rounded-md">
                        <Upload className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">APC_Certificate.pdf</p>
                        <p className="text-xs text-gray-500">Uploaded on 10 Jan 2025</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-500">
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
                >
                  <option value="general">General Practice</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="dental">Dental</option>
                  <option value="emergency">Emergency Medicine</option>
                  <option value="surgery">Surgery</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input id="experience" type="number" defaultValue="8" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  defaultValue="General practitioner with 8 years of experience in primary care and emergency medicine. Passionate about preventive healthcare and patient education."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-900">Skills & Languages</CardTitle>
              <CardDescription>Your medical skills and languages spoken</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Medical Skills & Procedures</Label>
                  <Button variant="outline" size="sm" className="gap-1 border-purple-200 text-purple-700">
                    <Plus className="h-4 w-4" />
                    Add Skill
                  </Button>
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
                  Add all medical procedures and skills you are proficient in. This helps clinics find you for specific
                  needs.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Languages Spoken</Label>
                  <Button variant="outline" size="sm" className="gap-1 border-purple-200 text-purple-700">
                    <Plus className="h-4 w-4" />
                    Add Language
                  </Button>
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
                  Add all languages you can communicate in with patients. Include your proficiency level if relevant.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-900">Job Preferences</CardTitle>
              <CardDescription>Set your preferences for locum jobs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="min-hourly-rate">Minimum Hourly Rate (RM)</Label>
                <Input id="min-hourly-rate" type="number" defaultValue="80" />
                <p className="text-xs text-gray-500">
                  You will only be shown jobs that meet or exceed this hourly rate.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Preferred Work Days</Label>
                <div className="grid grid-cols-4 gap-2">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <input type="checkbox" id={`day-${day}`} className="h-4 w-4 rounded border-gray-300" />
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
                    <Input id="start-time" type="time" defaultValue="08:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">Latest End Time</Label>
                    <Input id="end-time" type="time" defaultValue="20:00" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Maximum Travel Distance</Label>
                <div className="flex items-center space-x-2">
                  <Input id="travel-distance" type="number" defaultValue="25" />
                  <span className="text-gray-500">km</span>
                </div>
                <p className="text-xs text-gray-500">
                  You will only be shown jobs within this distance from your address.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Notification Preferences</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="email-notifications" defaultChecked />
                    <Label htmlFor="email-notifications">Email notifications for new matching jobs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="sms-notifications" defaultChecked />
                    <Label htmlFor="sms-notifications">SMS notifications for urgent requests</Label>
                  </div>
                </div>
              </div>

              <Button className="bg-purple-gradient hover:bg-purple-700">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
