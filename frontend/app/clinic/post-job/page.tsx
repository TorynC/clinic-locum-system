"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Save, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useState } from "react"
import axiosInstance from "@/utils/axiosinstance"
import { useEffect } from "react"


export default function PostJobPage() {
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [date, setDate] = useState<Date>()
  const [rate, setRate] = useState(0);
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [preferredDoctors, setPreferredDoctors] = useState(false);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const qualificationOptions: Record<string, string> = {
  'General Practice': 'General Consultation',
  'Pediatrics': 'Pediatric Care',
  'Dental': 'Dental Procedure',
  'Emergency': 'Emergency Care',
  'Surgery': 'Minor Surgery',
};

  // function to get email 
  const getEmail = async () => {
    try {
      const response = await axiosInstance.get(`/get-clinic/${clinicId}`);
      console.log(response.data);
      if (!response.data.error) {
        setEmail(response.data.clinic.email);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // function to get clinic contact details 
  const getClinicContact = async () => {
    try {
      const response = await axiosInstance.get(`/get-contact-details/${clinicId}`);
      console.log("Contact info response:", response.data);
      if (!response.data.error) {
        setAddress(response.data.clinic.address);
        setPhone(response.data.clinic.phone);
      }
    } catch(error) {
      console.error(error);
    }
  }

  // function to get clinic preferences
  const getClinicPreferences = async () => {
    try {
      const response = await axiosInstance.get(`/get-preferences/${clinicId}`);
      if (!response.data.error) {
        setRate(response.data.clinic.rate);
        setQualifications(response.data.clinic.qualifications || []);
        setLanguages(response.data.clinic.languages || []);
        setPreferredDoctors(response.data.clinic.preferred_doctors_only);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const storedId = localStorage.getItem("clinicId");
    if (storedId) {
      setClinicId(storedId);
      }
    }, []);
  
    useEffect(() => {
    if (clinicId) {
      getClinicPreferences();
      getClinicContact();
      getEmail();
      }
    }, [clinicId]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Post a Locum Job</h1>
          <p className="text-gray-500">Create a new job posting for locum doctors</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-purple-200 text-purple-700">
            Save as Draft
          </Button>
          <Button className="bg-purple-gradient hover:bg-purple-700">Publish Job</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Basic information about the job</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title</Label>
              <Input id="job-title" placeholder="e.g., General Practitioner Locum" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="procedure-type">Type of Procedure</Label>
              <select
                id="procedure-type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select procedure type</option>
                {qualifications.map((q) => (qualificationOptions[q] && (<option key={q} value={q}>
                  {qualificationOptions[q]}
                </option>)))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Describe the responsibilities, requirements, and any specific details about the job"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourly-rate">Hourly Rate (MYR)</Label>
              <Input id="hourly-rate" type="number" value={rate} onChange={(e) => {setRate(Number(e.target.value))}} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle>Schedule & Requirements</CardTitle>
            <CardDescription>When and who you need</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <div className="relative">
                  <Input id="start-time" type="time" defaultValue="09:00" />
                  <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <div className="relative">
                  <Input id="end-time" type="time" defaultValue="17:00" />
                  <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preferred Gender</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="any-gender" name="gender" className="h-4 w-4" defaultChecked />
                  <Label htmlFor="any-gender">Any</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="male" name="gender" className="h-4 w-4" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="female" name="gender" className="h-4 w-4" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Required Languages</Label>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <input type="checkbox" id={`lang-${language}`} className="h-4 w-4 rounded border-gray-300" />
                    <Label htmlFor={`lang-${language}`}>{language}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch id="preferred-only" checked={preferredDoctors} onCheckedChange={setPreferredDoctors}/>
              <Label htmlFor="preferred-only">Restrict to Preferred Doctors Only</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-purple-100">
        <CardHeader>
          <CardTitle>Location & Contact</CardTitle>
          <CardDescription>Pre-filled from your clinic profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={address} onChange={(e) => {setAddress(e.target.value)}} />
              <p className="text-xs text-gray-500">This is pre-filled from your clinic profile</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-person">Contact Person</Label>
              <Input id="contact-person" defaultValue="Dr. Jane Smith" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone">Contact Phone</Label>
              <Input id="contact-phone" value={phone} onChange={(e) => {setPhone(e.target.value)}} />
              <p className="text-xs text-gray-500">This is pre-filled from your clinic profile</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input id="contact-email" value={email} onChange={(e) => {setEmail(e.target.value)}} />
              <p className="text-xs text-gray-500">This is pre-filled from your clinic profile</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="special-instructions">Special Instructions for Applicants</Label>
            <Textarea
              id="special-instructions"
              rows={3}
              placeholder="Any additional information or instructions for doctors applying to this job"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" className="gap-2 border-purple-200 text-purple-700">
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button className="gap-2 bg-purple-gradient hover:bg-purple-700">
          <Save className="h-4 w-4" />
          Publish Job
        </Button>
      </div>
    </div>
  )
}
