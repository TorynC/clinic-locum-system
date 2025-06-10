import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Star, StarOff, FileText, MessageSquare } from "lucide-react"

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Preferred Doctors</h1>
          <p className="text-gray-500">Manage your preferred locum doctors</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Doctor
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder="Search doctors by name, specialty, or skills..." className="pl-8" />
        </div>
        <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          <option value="">All Specialties</option>
          <option value="general">General Practice</option>
          <option value="pediatric">Pediatrics</option>
          <option value="dental">Dental</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>

      <Tabs defaultValue="preferred">
        <TabsList>
          <TabsTrigger value="preferred">Preferred Doctors</TabsTrigger>
          <TabsTrigger value="previous">Previously Hired</TabsTrigger>
          <TabsTrigger value="all">All Doctors</TabsTrigger>
        </TabsList>

        <TabsContent value="preferred" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Dr. Sarah Johnson",
                specialty: "General Practice",
                experience: "8 years",
                languages: ["English", "Spanish"],
                skills: ["Family Medicine", "Preventive Care"],
              },
              {
                name: "Dr. Michael Chen",
                specialty: "Pediatrics",
                experience: "5 years",
                languages: ["English", "Mandarin"],
                skills: ["Child Development", "Vaccinations"],
              },
              {
                name: "Dr. Emily Patel",
                specialty: "Dental",
                experience: "10 years",
                languages: ["English", "Hindi"],
                skills: ["General Dentistry", "Cosmetic Dentistry"],
              },
            ].map((doctor, i) => (
              <DoctorCard key={i} doctor={doctor} preferred={true} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="previous" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Dr. James Wilson",
                specialty: "Emergency Medicine",
                experience: "12 years",
                languages: ["English"],
                skills: ["Trauma Care", "Critical Care"],
              },
              {
                name: "Dr. Robert Kim",
                specialty: "General Practice",
                experience: "7 years",
                languages: ["English", "Korean"],
                skills: ["Family Medicine", "Geriatrics"],
              },
            ].map((doctor, i) => (
              <DoctorCard key={i} doctor={doctor} preferred={false} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Available Doctors</CardTitle>
              <CardDescription>Browse all doctors available on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">This feature will be available in the next update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DoctorCard({
  doctor,
  preferred,
}: {
  doctor: {
    name: string
    specialty: string
    experience: string
    languages: string[]
    skills: string[]
  }
  preferred: boolean
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-lg font-medium">
              {doctor.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium">{doctor.name}</h3>
              <p className="text-sm text-gray-500">
                {doctor.specialty} • {doctor.experience}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-yellow-500">
            {preferred ? <Star className="h-5 w-5 fill-yellow-500" /> : <StarOff className="h-5 w-5" />}
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">LANGUAGES</p>
            <div className="flex flex-wrap gap-1">
              {doctor.languages.map((language) => (
                <Badge key={language} variant="outline" className="text-xs">
                  {language}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">SKILLS</p>
            <div className="flex flex-wrap gap-1">
              {doctor.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="gap-1">
            <FileText className="h-4 w-4" />
            View Profile
          </Button>
          <Button size="sm" className="gap-1">
            <MessageSquare className="h-4 w-4" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
