import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Building2, Stethoscope, ArrowRight, Users, Calendar, Shield, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-800/10"></div>
        <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              <Zap className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
              Modern Healthcare Staffing Platform
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              <span className="gradient-text">LocumLah</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 sm:mb-12 leading-relaxed px-4">
              Seamlessly connecting healthcare facilities with qualified locum doctors. Find the right talent or
              discover your next opportunity.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 px-4">
              <div className="flex items-center justify-center space-x-3 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <Shield className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-600 flex-shrink-0" />
                <span className="font-medium text-slate-700 text-sm sm:text-base">Verified Professionals</span>
              </div>
              <div className="flex items-center justify-center space-x-3 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600 flex-shrink-0" />
                <span className="font-medium text-slate-700 text-sm sm:text-base">Smart Scheduling</span>
              </div>
              <div className="flex items-center justify-center space-x-3 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <Users className="w-5 sm:w-6 h-5 sm:h-6 text-orange-600 flex-shrink-0" />
                <span className="font-medium text-slate-700 text-sm sm:text-base">Instant Matching</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main selection cards */}
      <div className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Clinic Card */}
          <Card className="group relative overflow-hidden border-0 shadow-strong hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-blue-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <CardContent className="p-6 sm:p-8 relative">
              <div className="text-center">
                <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 sm:mb-6 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-8 sm:w-10 h-8 sm:h-10 text-blue-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">Healthcare Facilities</h2>
                <p className="text-slate-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  Post locum positions, manage applications, and find qualified doctors to cover your shifts
                  efficiently.
                </p>

                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  <div className="flex items-center text-xs sm:text-sm text-slate-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                    Post jobs in minutes
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-slate-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0"></div>
                    Access verified doctors
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-slate-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 flex-shrink-0"></div>
                    Manage schedules easily
                  </div>
                </div>

                <Button asChild className="w-full btn-primary group">
                  <Link href="/clinic-login" className="flex items-center justify-center">
                    Access Clinic Dashboard
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Doctor Card */}
          <Card className="group relative overflow-hidden border-0 shadow-strong hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-emerald-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <CardContent className="p-6 sm:p-8 relative">
              <div className="text-center">
                <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 sm:mb-6 bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="w-8 sm:w-10 h-8 sm:h-10 text-emerald-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">Medical Professionals</h2>
                <p className="text-slate-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  Discover locum opportunities, manage your availability, and connect with healthcare facilities.
                </p>

                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  <div className="flex items-center text-xs sm:text-sm text-slate-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0"></div>
                    Browse matching opportunities
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-slate-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                    Flexible scheduling
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-slate-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 flex-shrink-0"></div>
                    Competitive rates
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-emerald-gradient text-white font-medium px-6 py-3 rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 transform hover:-translate-y-0.5 group"
                >
                  <Link href="/doctor-login" className="flex items-center justify-center">
                    Access Doctor Dashboard
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center text-slate-500">
            <p className="text-sm sm:text-base">© 2025 LocumLah. Transforming healthcare staffing with technology.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
