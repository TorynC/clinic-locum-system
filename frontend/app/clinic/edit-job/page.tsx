"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Route, Save, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useState } from "react"
import axiosInstance from "@/utils/axiosinstance"
import { useEffect } from "react"
import { formatISO } from "date-fns"
import { useRouter } from "next/navigation";
import axios from "axios"

export default function EditJobPage() {
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [date, setDate] = useState<Date>()
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [preferredDoctors, setPreferredDoctors] = useState(false);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paidBreak, setPaidBreak] = useState(false)
  const [totalPay, setTotalPay] = useState(0);
  const [dayRate, setDayRate] = useState<number>(45); 
  const [nightRate, setNightRate] = useState<number>(35); 
  const [dayStart, setDayStart] = useState<string>("09:00");
  const [dayEnd, setDayEnd] = useState<string>("17:00");
  const [nightStart, setNightStart] = useState<string>("20:00");
  const [nightEnd, setNightEnd] = useState<string>("08:00");
  const [jobTitle, setJobTitle] = useState("");
  const [chosenLanguages, setChosenLanguages] = useState<string[]>([]);
  const [chosenProcedure, setChosenProcedure] = useState<string[]>([]);
  const [jobDescription, setJobDescription] = useState("");
  const [jobIncentives, setJobIncentives] = useState("");
  const [preferredGender, setPreferredGender] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [shiftStart, setShiftStart] = useState<string>("09:00");
  const [shiftEnd, setShiftEnd] = useState<string>("20:00");
  const [status, setStatus] = useState("");
  const [jobId, setJobId] = useState("");
  const [twoRates, setTwoRates] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(0);
  const [duration, setDuration] = useState(0);
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);

  const qualificationOptions: Record<string, string> = {
  'General Practice': 'General Consultation',
  'Pediatrics': 'Pediatric Care',
  'Dental': 'Dental Procedure',
  'Emergency': 'Emergency Care',
  'Surgery': 'Minor Surgery',
};  
  
    // function to calculate total pay 
  function calculateTotalPay(): number {
    const parseTime = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours + minutes / 60;
    };
    if (twoRates) {
      const dayStartHours = parseTime(dayStart);
      const dayEndHours = parseTime(dayEnd);
      const nightStartHours = parseTime(nightStart);
      const nightEndHours = parseTime(nightEnd);
      const dayHours = dayEndHours - dayStartHours;
      let nightHours = 0;
      if (nightEndHours > nightStartHours) {
        nightHours = nightEndHours - nightStartHours;
      } else {
        nightHours = (24 - nightStartHours) + nightEndHours;
      }

      let result = (dayRate * dayHours) + (nightRate * nightHours);
      setDuration(dayHours + nightHours);
      if (!paidBreak) {
        
        const breakHours = 1;
        const dayBreakFraction = dayHours / (dayHours + nightHours);
        const nightBreakFraction = nightHours / (dayHours + nightHours);
        
        result -= dayRate * (breakHours * dayBreakFraction);
        result -= nightRate * (breakHours * nightBreakFraction);
      }

      return result;

    } else {
      const startHours = parseTime(shiftStart);
      const endHours = parseTime(shiftEnd);
      let Hours;
      if (endHours > startHours) {
        Hours = endHours - startHours;
      } else {
        Hours = (24 - startHours) + endHours;
        
      }
      if (!paidBreak) {
          Hours = Hours - 1 
      }
      const result = (Hours * rate);
      setDuration(Hours);
      return result;
    }
  }

  
  const updateTotalPay = () => {
    const calculatedPay = calculateTotalPay();
    setTotalPay(calculatedPay);
  };

  
  useEffect(() => {
    updateTotalPay();
  }, [dayRate, nightRate, dayStart, dayEnd, nightStart, nightEnd, paidBreak, shiftStart, shiftEnd, rate]);

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

  // function to edit job
  const editJob = async () => {
    const formattedDate = date ? formatISO(date, {representation: "date"}) : null;
    const payLoad = {
      jobTitle,
      date: formattedDate,
      chosenLanguages,
      chosenProcedure,
      preferredDoctors,
      address,
      email,
      phone,
      paidBreak,
      totalPay: Number(totalPay.toFixed(2)),
      dayRate: Number(dayRate),
      nightRate: Number(nightRate),
      dayStart,
      dayEnd,
      nightStart,
      nightEnd,
      jobDescription,
      jobIncentives,
      preferredGender,
      contactPerson,
      specialInstructions,
      shiftStart,
      shiftEnd,
      status: "posted",
      rate,
      twoRates,
      duration
    }
    console.log("Payload being sent:", payLoad);
    
    try {
      const response = await axiosInstance.patch(`/edit-job/${jobId}`, payLoad);
      if (!response.data.error) {
        console.log("Job edit succcessful", response.data)  
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error:", error.message)
      }
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

  // get jobs
  const getJobs = async () => {
    try {
      const response = await axiosInstance.get(`/get-jobs/${clinicId}/jobs`);
      if (!response.data.error) {
        setJobs(response.data.jobs);
        console.log("retrieved jobs!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log(jobs);
  


  useEffect(() => {
    const storedId = localStorage.getItem("clinicId");
    if (storedId) {
      setClinicId(storedId);
      }
    }, []);
  
    useEffect(() => {
    if (clinicId) {
      
      getClinicContact();
      getEmail();
      getJobs();
      }
    }, [clinicId]);
    console.log(jobId)

  useEffect(() => {
    if (!jobId) return;
    const selectedJob = jobs.find(job => String(job.id) === String(jobId));
    if (selectedJob) {
        setJobTitle(selectedJob.title);
        setChosenProcedure(Array.isArray(selectedJob.procedure) ? selectedJob.procedure : (selectedJob.procedure ? selectedJob.procedure.split(",") : []));
        setJobDescription(selectedJob.description)
        setJobIncentives(selectedJob.incentives)
        setDayRate(selectedJob.day_rate)
        setNightRate(selectedJob.night_rate)
        setShiftStart(selectedJob.start_time)
        setShiftEnd(selectedJob.end_time)
        setPreferredGender(selectedJob.gender)
        setChosenLanguages(selectedJob.languages)
        setPreferredDoctors(selectedJob.preferred_doctors_only)
        setPaidBreak(selectedJob.paid_break)
        setDate(selectedJob.date)
        setDayStart(selectedJob.start_day_time)
        setDayEnd(selectedJob.end_day_time)
        setNightStart(selectedJob.start_night_time)
        setNightEnd(selectedJob.end_night_time)
        setAddress(selectedJob.address)
        setPhone(selectedJob.phone)
        setContactPerson(selectedJob.contact)
        setEmail(selectedJob.email)
        setSpecialInstructions(selectedJob.special_instructions)
        setRate(selectedJob.rate)
        setTwoRates(selectedJob.two_rates);
      
    }
  }, [jobId, jobs])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Edit an Existing Job</h1>
        </div>
        <div className="flex space-x-2">
          <Button className="bg-purple-gradient hover:bg-purple-700" onClick={editJob}>Save Changes</Button>
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
              <Label htmlFor="job-id">Existing Job ID</Label>
              <select
                id="job-id"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={jobId} onChange={(e) => {setJobId(e.target.value)}}
              >
                <option value="">Select Existing Job ID</option>
                {jobs.map((job) => ((job.id && <option key={job.id} value={job.id}>{job.id}</option>)))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title</Label>
              <Input id="job-title" placeholder="e.g., General Practitioner Locum" 
              value={jobTitle} onChange={(e) => {setJobTitle(e.target.value)}}/>
            </div>

            <div className="space-y-2">
              <Label>Required Skills and Procedures</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Antenatal Care",'ECG','Wound Care', 'IM Injection','Suturing', 'Venipuncture','Basic Surgery', "Paeds Care"].map((procedure) => (
                  <div key={procedure} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`prod-${procedure}`}
                      className="h-4 w-4 rounded border-gray-300"
                      checked={chosenProcedure.includes(procedure)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setChosenProcedure([...chosenProcedure, procedure]);
                        } else {
                          setChosenProcedure(chosenProcedure.filter((q) => q !== procedure));
                        }
                      }}
                    />
                    <Label htmlFor={`prod-${procedure}`}>{procedure}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Describe the responsibilities, requirements, and any specific details about the job"
                value={jobDescription}
                onChange={(e) => {setJobDescription(e.target.value)}}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Incentives</Label>
              <Textarea
                id="incentives"
                rows={4}
                placeholder="Eg. RM1/patient, Bank Transfer"
                value={jobIncentives}
                onChange={(e) => {setJobIncentives(e.target.value)}}
              />
            </div>

            {!twoRates && <div className="space-y-2">
              <Label htmlFor="day-hourly-rate">Hourly Rate (MYR)</Label>
              <Input id="hourly-rate" type="number" value={Number(rate)} onChange={(e) => {setRate(Number(e.target.value))}} />
            </div>}

            {twoRates && <div className="space-y-2">
              <Label htmlFor="day-hourly-rate">Day Time Hourly Rate (MYR)</Label>
              <Input id="hourly-rate" type="number" value={Number(dayRate)} onChange={(e) => {setDayRate(Number(e.target.value))}} />
            </div>}

            {twoRates && <div className="space-y-2">
              <Label htmlFor="night-hourly-rate">Night Time Hourly Rate (MYR)</Label>
              <Input id="hourly-rate" type="number" value={Number(nightRate)} onChange={(e) => {setNightRate(Number(e.target.value))}} />
            </div>}

            <div className="space-y-2">
            <Label htmlFor="total-pay">Total Pay Before Incentives (MYR)</Label>
            <Input 
              id="total-pay" 
              type="number" 
              value={totalPay.toFixed(2)} 
              readOnly
              className="bg-gray-100" // Optional: visual indication it's not editable
            />
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

            <div className="space-y-2">
              <Label>Preferred Gender</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="any-gender" name="gender" className="h-4 w-4" value="any" checked={preferredGender === "any"} 
                  onChange={() => {setPreferredGender("any")}}/>
                  <Label htmlFor="any-gender">Any</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="male" name="gender" className="h-4 w-4" value={"male"} checked={preferredGender === "male"} 
                  onChange={() => {setPreferredGender("male")}}/>
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="female" name="gender" className="h-4 w-4" value={"female"} checked={preferredGender === "female"} 
                  onChange={() => {setPreferredGender("female")}}/>
                  <Label htmlFor="female">Female</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Required Languages</Label>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <input type="checkbox" id={`lang-${language}`} className="h-4 w-4 rounded border-gray-300" 
                    checked={chosenLanguages.includes(language)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setChosenLanguages([...chosenLanguages, language]);
                      } else {
                        setChosenLanguages(chosenLanguages.filter((q) => q !== language));
                      }
                    }}/>
                    <Label htmlFor={`lang-${language}`}>{language}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch id="preferred-only" checked={preferredDoctors} onCheckedChange={setPreferredDoctors}/>
              <Label htmlFor="preferred-only">Restrict to Preferred Doctors Only</Label>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch id="paid-break" checked={paidBreak} onCheckedChange={setPaidBreak}/>
              <Label htmlFor="preferred-only">Set Paid Break</Label>
            </div>
              
            {!twoRates && <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <div className="relative">
                  <Input id="start-time" type="time" value={shiftStart} onChange={(e) => {setShiftStart(e.target.value)}} />
                  <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <div className="relative">
                  <Input id="end-time" type="time" value={shiftEnd} onChange={(e) => {setShiftEnd(e.target.value)}}/>
                  <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>}

            {twoRates && <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Day Time</Label>
                <div className="relative">
                  <Input id="start-time" type="time" value={dayStart} onChange={(e) => {setDayStart(e.target.value)}} />
                  <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Day Time</Label>
                <div className="relative">
                  <Input id="end-time" type="time" value={dayEnd} onChange={(e) => {setDayEnd(e.target.value)}}/>
                  <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>}

            {twoRates && <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Night Time</Label>
                <div className="relative">
                  <Input id="start-time" type="time" value={nightStart} onChange={(e) => {setNightStart(e.target.value)}}/>
                  <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Night Time</Label>
                <div className="relative">
                  <Input id="end-time" type="time" value={nightEnd} onChange={(e) => {setNightEnd(e.target.value)}} />
                  <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>}
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
              <Input id="contact-person" value={contactPerson} onChange={(e) => {setContactPerson(e.target.value)}} />
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
              value={specialInstructions} 
              onChange={(e) => {setSpecialInstructions(e.target.value)}}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" className="gap-2 border-purple-200 text-purple-700" onClick={() => router.push("/clinic")}>
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button className="gap-2 bg-purple-gradient hover:bg-purple-700" 
        onClick={editJob}>
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
