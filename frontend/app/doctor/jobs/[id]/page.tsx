"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Building,
  Phone,
  Mail,
  ArrowLeft,
  MessageSquare,
  Bookmark,
  Share2,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  // Mock data for job details
  const job = {
    id: params.id,
    clinicName: "City Medical Clinic",
    address: "123 Medical Center Drive, Kuala Lumpur",
    location: "Kuala Lumpur",
    distance: "3.2 km",
    date: "May 15, 2025",
    timeSlot: "9:00 AM - 5:00 PM",
    hours: 8,
    hourlyRate: 85,
    totalPay: 680,
    specialty: "General Practice",
    skills: ["IM Injection", "Venipuncture", "ECG", "Basic Wound Care"],
    languages: ["English", "Malay"],
    genderPreference: "Any",
    contactPerson: "Dr. Jane Smith",
    contactPhone: "+60 12-345-6789",
    contactEmail: "contact@citymedical.com",
    description:
      "We are looking for a locum doctor to cover a general practice shift. The doctor will be responsible for seeing patients for routine check-ups, minor ailments, and basic procedures. Experience with electronic medical records is preferred.",
    specialInstructions:
      "Please arrive 15 minutes before the shift starts for a brief orientation. Lunch will be provided. Parking is available at the clinic.",
    mapUrl: "https://maps.google.com/?q=City+Medical+Clinic+Kuala+Lumpur",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
          <Link href="/doctor/jobs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-purple-900">Job Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-purple-100">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-purple-900">{job.clinicName}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.address}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 border-purple-200">
                    <Bookmark className="h-4 w-4 text-purple-700" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 border-purple-200">
                    <Share2 className="h-4 w-4 text-purple-700" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 py-4 border-y border-purple-100">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">DATE</p>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-4 w-4 text-purple-600 mr-2" />
                    <span>{job.date}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">TIME</p>
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 text-purple-600 mr-2" />
                    <span>{job.timeSlot}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">DURATION</p>
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 text-purple-600 mr-2" />
                    <span>{job.hours} hours</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">HOURLY RATE</p>
                  <div className="flex items-center text-gray-700">
                    <DollarSign className="h-4 w-4 text-purple-600 mr-2" />
                    <span>RM {job.hourlyRate}/hr</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">TOTAL PAY</p>
                  <div className="flex items-center text-gray-700">
                    <DollarSign className="h-4 w-4 text-purple-600 mr-2" />
                    <span>RM {job.totalPay}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">SPECIALTY</p>
                  <div className="flex items-center text-gray-700">
                    <Building className="h-4 w-4 text-purple-600 mr-2" />
                    <span>{job.specialty}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div>
                  <h3 className="font-medium text-purple-900 mb-2">Job Description</h3>
                  <p className="text-gray-700">{job.description}</p>
                </div>

                <div>
                  <h3 className="font-medium text-purple-900 mb-2">Special Instructions</h3>
                  <p className="text-gray-700">{job.specialInstructions}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <h3 className="font-medium text-purple-900 mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-purple-900 mb-2">Required Languages</h3>
                    <div className="flex flex-wrap gap-1">
                      {job.languages.map((language) => (
                        <Badge
                          key={language}
                          variant="outline"
                          className="bg-purple-50 text-purple-700 border-purple-200"
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-purple-900 mb-2">Gender Preference</h3>
                  <Badge
                    variant="outline"
                    className={
                      job.genderPreference === "Any"
                        ? "bg-gray-50 text-gray-700 border-gray-200"
                        : job.genderPreference === "Male"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-pink-50 text-pink-700 border-pink-200"
                    }
                  >
                    {job.genderPreference}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-900">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative">
                <img src="/placeholder.svg?key=kludb" alt="Map location" className="w-full h-full object-cover" />
                <Button
                  asChild
                  className="absolute bottom-4 right-4 bg-white text-purple-700 hover:bg-purple-50 shadow-md"
                >
                  <a href={job.mapUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in Google Maps
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-900">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">CONTACT PERSON</p>
                <p className="text-gray-700">{job.contactPerson}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">PHONE</p>
                <div className="flex items-center text-gray-700">
                  <Phone className="h-4 w-4 text-purple-600 mr-2" />
                  <span>{job.contactPhone}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">EMAIL</p>
                <div className="flex items-center text-gray-700">
                  <Mail className="h-4 w-4 text-purple-600 mr-2" />
                  <span>{job.contactEmail}</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full bg-purple-gradient hover:bg-purple-700">Apply for This Job</Button>
                <Button variant="outline" className="w-full gap-2 border-purple-200 text-purple-700">
                  <MessageSquare className="h-4 w-4" />
                  Contact via WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-900">About the Clinic</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-lg font-medium mr-3">
                  C
                </div>
                <div>
                  <h3 className="font-medium">{job.clinicName}</h3>
                  <p className="text-sm text-gray-500">{job.specialty} Clinic</p>
                </div>
              </div>

              <p className="text-gray-700 text-sm">
                City Medical Clinic provides comprehensive healthcare services to the community with a focus on family
                medicine and preventive care.
              </p>

              <Button variant="outline" asChild className="w-full border-purple-200 text-purple-700">
                <Link href="#">View Clinic Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-900">Similar Jobs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  clinicName: "Family Health Clinic",
                  location: "Ampang",
                  date: "May 22, 2025",
                  timeSlot: "9:00 AM - 1:00 PM",
                },
                {
                  clinicName: "Wellness Medical Center",
                  location: "Cheras",
                  date: "May 25, 2025",
                  timeSlot: "2:00 PM - 8:00 PM",
                },
              ].map((similarJob, i) => (
                <div
                  key={i}
                  className="p-3 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                >
                  <h4 className="font-medium text-purple-900">{similarJob.clinicName}</h4>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{similarJob.location}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-3 w-3 text-purple-600 mr-1" />
                      <span>{similarJob.date}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-3 w-3 text-purple-600 mr-1" />
                      <span>{similarJob.timeSlot}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
