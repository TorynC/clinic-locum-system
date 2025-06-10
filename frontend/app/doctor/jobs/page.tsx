"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Calendar, Clock, DollarSign, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function DoctorJobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)

  // Mock data for jobs
  const jobs = [
    {
      id: 1,
      clinicName: "City Medical Clinic",
      location: "Kuala Lumpur",
      distance: "3.2 km",
      date: "May 15, 2025",
      timeSlot: "9:00 AM - 5:00 PM",
      hours: 8,
      hourlyRate: 85,
      totalPay: 680,
      specialty: "General Practice",
      skills: ["IM Injection", "Venipuncture", "ECG"],
      languages: ["English", "Malay"],
      genderPreference: "Any",
      isNew: true,
    },
    {
      id: 2,
      clinicName: "KidsCare Pediatric Center",
      location: "Petaling Jaya",
      distance: "5.8 km",
      date: "May 16, 2025",
      timeSlot: "10:00 AM - 6:00 PM",
      hours: 8,
      hourlyRate: 90,
      totalPay: 720,
      specialty: "Pediatrics",
      skills: ["Vaccination", "Child Development"],
      languages: ["English", "Mandarin"],
      genderPreference: "Female",
      isNew: true,
    },
    {
      id: 3,
      clinicName: "Dental Plus",
      location: "Subang Jaya",
      distance: "8.5 km",
      date: "May 18, 2025",
      timeSlot: "8:00 AM - 4:00 PM",
      hours: 8,
      hourlyRate: 95,
      totalPay: 760,
      specialty: "Dental",
      skills: ["General Dentistry", "Cosmetic Dentistry"],
      languages: ["English", "Malay"],
      genderPreference: "Any",
      isNew: false,
    },
    {
      id: 4,
      clinicName: "Emergency Care Center",
      location: "Shah Alam",
      distance: "12.3 km",
      date: "May 20, 2025",
      timeSlot: "7:00 PM - 7:00 AM",
      hours: 12,
      hourlyRate: 100,
      totalPay: 1200,
      specialty: "Emergency Medicine",
      skills: ["Trauma Care", "Critical Care"],
      languages: ["English"],
      genderPreference: "Male",
      isNew: false,
    },
    {
      id: 5,
      clinicName: "Family Health Clinic",
      location: "Ampang",
      distance: "6.7 km",
      date: "May 22, 2025",
      timeSlot: "9:00 AM - 1:00 PM",
      hours: 4,
      hourlyRate: 85,
      totalPay: 340,
      specialty: "General Practice",
      skills: ["Family Medicine", "Geriatrics"],
      languages: ["English", "Malay", "Tamil"],
      genderPreference: "Any",
      isNew: false,
    },
  ]

  const filteredJobs = jobs.filter((job) => {
    if (!searchQuery) return true
    return (
      job.clinicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Browse Jobs</h1>
          <p className="text-gray-500">Find locum opportunities that match your skills</p>
        </div>
        <Button
          variant="outline"
          className="gap-2 border-purple-200 text-purple-700"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search by clinic, location, or specialty..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filterOpen && (
        <Card className="border-purple-100">
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Any Location</option>
                  <option value="near">Near Me (25km)</option>
                  <option value="kl">Kuala Lumpur</option>
                  <option value="pj">Petaling Jaya</option>
                  <option value="subang">Subang Jaya</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" className="text-sm" placeholder="From" />
                  <Input type="date" className="text-sm" placeholder="To" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Specialty</label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Any Specialty</option>
                  <option value="general">General Practice</option>
                  <option value="pediatric">Pediatrics</option>
                  <option value="dental">Dental</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hourly Rate</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Input type="number" className="pl-7 text-sm" placeholder="Min" />
                    <span className="absolute left-2 top-2.5 text-gray-500">RM</span>
                  </div>
                  <div className="relative">
                    <Input type="number" className="pl-7 text-sm" placeholder="Max" />
                    <span className="absolute left-2 top-2.5 text-gray-500">RM</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" size="sm" className="border-purple-200 text-purple-700">
                Reset
              </Button>
              <Button size="sm" className="bg-purple-gradient hover:bg-purple-700">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-purple-100 text-purple-600">
          <TabsTrigger value="all">All Jobs</TabsTrigger>
          <TabsTrigger value="new">New Jobs</TabsTrigger>
          <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <div className="space-y-4">
            {filteredJobs
              .filter((job) => job.isNew)
              .map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <div className="text-center py-8 text-gray-500">
            <p>You haven't saved any jobs yet.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function JobCard({ job }: { job: any }) {
  return (
    <Card className="border-purple-100 hover:border-purple-300 transition-colors">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-purple-900">{job.clinicName}</h3>
                {job.isNew && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">New</Badge>
                )}
              </div>
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {job.location} • {job.distance}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-4 w-4 text-purple-600 mr-2" />
                <span className="text-sm">{job.date}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="h-4 w-4 text-purple-600 mr-2" />
                <span className="text-sm">{job.timeSlot}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <DollarSign className="h-4 w-4 text-purple-600 mr-2" />
                <span className="text-sm">
                  RM {job.hourlyRate}/hr • RM {job.totalPay}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">SPECIALTY</p>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {job.specialty}
                </Badge>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">REQUIRED SKILLS</p>
                <div className="flex flex-wrap gap-1">
                  {job.skills.map((skill: string) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">LANGUAGES</p>
                <div className="flex flex-wrap gap-1">
                  {job.languages.map((language: string) => (
                    <Badge key={language} variant="outline" className="text-xs">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col justify-between md:justify-start items-end md:items-center gap-4">
            <div className="text-center">
              <p className="text-xs font-medium text-gray-500 mb-1">GENDER PREFERENCE</p>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  job.genderPreference === "Any"
                    ? "bg-gray-50 text-gray-700 border-gray-200"
                    : job.genderPreference === "Male"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-pink-50 text-pink-700 border-pink-200",
                )}
              >
                {job.genderPreference}
              </Badge>
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild className="bg-purple-gradient hover:bg-purple-700">
                <Link href={`/doctor/jobs/${job.id}`}>View Details</Link>
              </Button>
              <Button variant="outline" className="border-purple-200 text-purple-700">
                Save Job
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
