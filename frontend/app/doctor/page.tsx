import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Briefcase, MapPin, Calendar, Clock, DollarSign, Star, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function DoctorHomePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Welcome, Dr. Robert</h1>
          <p className="text-gray-500">Find and manage your locum opportunities</p>
        </div>
        <Button asChild className="bg-purple-gradient hover:bg-purple-700">
          <Link href="/doctor/jobs">Browse Jobs</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          icon={<Briefcase className="h-8 w-8 text-purple-500" />}
          title="Available Jobs"
          value="24"
          description="Matching your profile"
        />
        <DashboardCard
          icon={<Calendar className="h-8 w-8 text-purple-500" />}
          title="Upcoming Shifts"
          value="2"
          description="In the next 7 days"
        />
        <DashboardCard
          icon={<Clock className="h-8 w-8 text-purple-500" />}
          title="Hours Worked"
          value="36"
          description="This month"
        />
        <DashboardCard
          icon={<DollarSign className="h-8 w-8 text-purple-500" />}
          title="Earnings"
          value="RM 3,060"
          description="This month"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-900">Upcoming Shifts</CardTitle>
            <CardDescription>Your next 7 days schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  clinic: "City Medical Clinic",
                  location: "Kuala Lumpur",
                  date: "May 15, 2025",
                  time: "9:00 AM - 5:00 PM",
                  pay: "RM 680",
                },
                {
                  clinic: "KidsCare Pediatric Center",
                  location: "Petaling Jaya",
                  date: "May 16, 2025",
                  time: "10:00 AM - 6:00 PM",
                  pay: "RM 720",
                },
              ].map((shift, i) => (
                <div
                  key={i}
                  className="flex items-center p-3 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-purple-900">{shift.clinic}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{shift.date}</span>
                      <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                      <span>{shift.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>{shift.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-purple-900">{shift.pay}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-900">Recommended Jobs</CardTitle>
            <CardDescription>Based on your profile and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  clinic: "Family Health Clinic",
                  location: "Ampang",
                  date: "May 22, 2025",
                  time: "9:00 AM - 1:00 PM",
                  pay: "RM 340",
                  isNew: true,
                },
                {
                  clinic: "Wellness Medical Center",
                  location: "Cheras",
                  date: "May 25, 2025",
                  time: "2:00 PM - 8:00 PM",
                  pay: "RM 510",
                  isNew: true,
                },
                {
                  clinic: "Emergency Care Center",
                  location: "Shah Alam",
                  date: "May 20, 2025",
                  time: "7:00 PM - 7:00 AM",
                  pay: "RM 1,200",
                  isNew: false,
                },
              ].map((job, i) => (
                <div
                  key={i}
                  className="flex items-center p-3 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 mr-3 flex items-center justify-center">
                    {job.clinic.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="font-medium text-purple-900">{job.clinic}</p>
                      {job.isNew && <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">New</Badge>}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{job.date}</span>
                      <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                      <span>{job.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>{job.location}</span>
                      </div>
                      <p className="text-sm font-medium text-purple-900">{job.pay}</p>
                    </div>
                  </div>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full border-purple-200 text-purple-700">
                <Link href="/doctor/jobs">View All Jobs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-900">Recent Ratings & Reviews</CardTitle>
            <CardDescription>Feedback from clinics you've worked with</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  clinic: "City Medical Clinic",
                  date: "May 10, 2025",
                  rating: 5,
                  comment: "Excellent work ethic and patient care. Would definitely hire again.",
                },
                {
                  clinic: "KidsCare Pediatric Center",
                  date: "May 8, 2025",
                  rating: 4,
                  comment: "Great with children and very professional. Arrived on time and was well prepared.",
                },
              ].map((review, i) => (
                <div key={i} className="p-3 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-purple-900">{review.clinic}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                  <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-900">Notifications</CardTitle>
            <CardDescription>Recent updates and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "New Job Matches",
                  description: "5 new jobs match your profile in Kuala Lumpur area",
                  time: "2 hours ago",
                  icon: <Briefcase className="h-5 w-5 text-purple-600" />,
                },
                {
                  title: "Profile Verification",
                  description: "Your profile has been verified. You can now apply to all jobs.",
                  time: "1 day ago",
                  icon: <Bell className="h-5 w-5 text-purple-600" />,
                },
                {
                  title: "Upcoming Shift Reminder",
                  description: "You have a shift at City Medical Clinic tomorrow at 9:00 AM",
                  time: "1 day ago",
                  icon: <Calendar className="h-5 w-5 text-purple-600" />,
                },
              ].map((notification, i) => (
                <div
                  key={i}
                  className="flex items-start p-3 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <div className="p-2 bg-purple-100 rounded-full mr-3">{notification.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-purple-900">{notification.title}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{notification.description}</p>
                  </div>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full border-purple-200 text-purple-700">
                <Link href="/doctor/notifications">View All Notifications</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode
  title: string
  value: string
  description: string
}) {
  return (
    <Card className="border-purple-100 overflow-hidden">
      <div className="h-1 bg-purple-gradient-light"></div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-purple-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <div className="p-2 rounded-full bg-purple-50">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
