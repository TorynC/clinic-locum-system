import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-purple-900">Clinic Profile</h1>
        <p className="text-gray-500">Manage your clinic information and settings</p>
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
              <CardTitle className="text-purple-900">General Information</CardTitle>
              <CardDescription>Update your clinic's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinic-name">Clinic Name</Label>
                <Input id="clinic-name" defaultValue="City Medical Clinic" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinic-type">Clinic Type</Label>
                <select
                  id="clinic-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="medical"
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
                  defaultValue="City Medical Clinic provides comprehensive healthcare services to the community with a focus on family medicine and preventive care."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="established">Year Established</Label>
                <Input id="established" type="number" defaultValue="2010" />
              </div>

              <Button className="bg-purple-gradient hover:bg-purple-700">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-900">Contact Details</CardTitle>
              <CardDescription>Update your clinic's contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Medical Center Drive" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" defaultValue="Metropolis" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal-code">Postal Code</Label>
                  <Input id="postal-code" defaultValue="10001" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="(555) 123-4567" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="contact@citymedical.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" defaultValue="https://citymedical.com" />
              </div>

              <Button className="bg-purple-gradient hover:bg-purple-700">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-900">Preferences</CardTitle>
              <CardDescription>Set your default preferences for job postings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-rate">Default Hourly Rate ($)</Label>
                <Input id="default-rate" type="number" defaultValue="85" />
              </div>

              <div className="space-y-2">
                <Label>Preferred Doctor Qualifications</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["General Practice", "Pediatrics", "Dental", "Emergency", "Surgery"].map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <input type="checkbox" id={`skill-${skill}`} className="h-4 w-4 rounded border-gray-300" />
                      <Label htmlFor={`skill-${skill}`}>{skill}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Languages</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["English", "Spanish", "Mandarin", "French", "Arabic"].map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <input type="checkbox" id={`lang-${language}`} className="h-4 w-4 rounded border-gray-300" />
                      <Label htmlFor={`lang-${language}`}>{language}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="preferred-only" className="h-4 w-4 rounded border-gray-300" />
                <Label htmlFor="preferred-only">Default to "Preferred Doctors Only" for new job postings</Label>
              </div>

              <Button className="bg-purple-gradient hover:bg-purple-700">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
