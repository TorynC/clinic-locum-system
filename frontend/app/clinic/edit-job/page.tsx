"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock, Route, Save, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import axiosInstance from "@/utils/axiosinstance";
import { useEffect } from "react";
import { formatISO } from "date-fns";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function EditJobPage() {
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [date, setDate] = useState<Date>();
  const [paidBreak, setPaidBreak] = useState(false);
  const [totalPay, setTotalPay] = useState(0);
  const [breakStart, setBreakStart] = useState("");
  const [breakEnd, setBreakEnd] = useState("");
  const [shiftStart, setShiftStart] = useState<string>("09:00");
  const [shiftEnd, setShiftEnd] = useState<string>("20:00");
  const [jobId, setJobId] = useState("");
  const [rate, setRate] = useState<number>(0);
  const [duration, setDuration] = useState(0);
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);

  function parseTime(timeStr: string): number {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours + minutes / 60;
  }

  function calculateDuration(): number {
    const start = parseTime(shiftStart);
    const end = parseTime(shiftEnd);
    return end >= start ? end - start : 24 - start + end;
  }

  function calculateBreakHours(): number {
    if (!breakStart || !breakEnd) return 0;
    const start = parseTime(breakStart);
    const end = parseTime(breakEnd);
    return end >= start ? end - start : 24 - start + end;
  }

  // function to calculate total pay
  function calculateTotalPay(): number {
    const duration = calculateDuration();
    const breakHours = paidBreak ? 0 : calculateBreakHours();
    const payableHours = Math.max(0, duration - breakHours);
    return payableHours * rate;
  }

  const updateTotalPay = () => {
    const calculatedPay = calculateTotalPay();
    setTotalPay(calculatedPay);
  };

  useEffect(() => {
    updateTotalPay();
  }, [breakStart, breakEnd, paidBreak, shiftStart, shiftEnd, rate]);

  // function to edit job
  const editJob = async () => {
    const formattedDate = date
      ? formatISO(date, { representation: "date" })
      : null;
    const payLoad = {
      date: formattedDate,
      start_time: shiftStart,
      end_time: shiftEnd,
      rate,
      total_pay: totalPay,
      duration, // <-- add this
    };
    try {
      const response = await axiosInstance.patch(`/edit-job/${jobId}`, payLoad);
      if (!response.data.error) {
        console.log("Job edit successful", response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error:", error.message);
      }
    }
  };

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
      getJobs();
    }
  }, [clinicId]);
  console.log(jobId);

  useEffect(() => {
    if (!jobId) return;
    const selectedJob = jobs.find((job) => String(job.id) === String(jobId));
    if (selectedJob) {
      setShiftStart(selectedJob.start_time);
      setShiftEnd(selectedJob.end_time);
      setDate(selectedJob.date);
      setRate(selectedJob.rate);
      setPaidBreak(selectedJob.paid_break);
      setBreakEnd(selectedJob.break_end);
      setBreakStart(selectedJob.break_start);
    }
  }, [jobId, jobs]);

  useEffect(() => {
    const dur = calculateDuration();
    setDuration(dur);
    setTotalPay(calculateTotalPay());
  }, [breakStart, breakEnd, paidBreak, shiftStart, shiftEnd, rate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">
            Edit an Existing Job
          </h1>
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
                value={jobId}
                onChange={(e) => {
                  setJobId(e.target.value);
                }}
              >
                <option value="">Select Existing Job ID</option>
                {jobs.map(
                  (job) =>
                    job.id && (
                      <option key={job.id} value={job.id}>
                        {job.id}
                      </option>
                    )
                )}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="day-hourly-rate">Hourly Rate (MYR)</Label>
              <Input
                id="hourly-rate"
                type="number"
                value={Number(rate)}
                onChange={(e) => {
                  setRate(Number(e.target.value));
                }}
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
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <div className="relative">
                  <Input
                    id="start-time"
                    type="time"
                    value={shiftStart}
                    onChange={(e) => {
                      setShiftStart(e.target.value);
                    }}
                  />
                  <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <div className="relative">
                  <Input
                    id="end-time"
                    type="time"
                    value={shiftEnd}
                    onChange={(e) => {
                      setShiftEnd(e.target.value);
                    }}
                  />
                  <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          className="gap-2 border-blue-200 text-blue-700"
          onClick={() => router.push("/clinic")}
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button
          className="gap-2 bg-blue-700 hover:bg-blue-900"
          onClick={() => {
            editJob();
            router.push("/clinic");
          }}
        >
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
