import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Building, User } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">MediLocum</h1>
        <p className="text-xl text-gray-600 max-w-2xl">Connecting clinics with freelance doctors for locum positions</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="border-purple-100 hover:shadow-md transition-shadow">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                <Building className="h-10 w-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-purple-900 mb-4">For Clinics</h2>
              <p className="text-gray-600 mb-6">
                Post locum jobs, find qualified doctors, and manage your clinic's staffing needs efficiently.
              </p>
              <Button asChild className="bg-purple-gradient hover:bg-purple-700 w-full">
                <Link href="/clinic-login">Access Clinic Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100 hover:shadow-md transition-shadow">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                <User className="h-10 w-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-purple-900 mb-4">For Doctors</h2>
              <p className="text-gray-600 mb-6">
                Find locum opportunities, manage your schedule, and connect with clinics looking for your expertise.
              </p>
              <Button asChild className="bg-purple-gradient hover:bg-purple-700 w-full">
                <Link href="/doctor-login">Access Doctor Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center text-gray-500">
        <p>© 2025 MediLocum. All rights reserved.</p>
      </div>
    </div>
  )
}
