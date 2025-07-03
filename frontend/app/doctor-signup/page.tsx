"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import axiosInstance from '@/utils/axiosinstance'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function doctorSignUpPage() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      //Signup API call 
      try {
        const response = await axiosInstance.post("/doctor-register", {
          name: name,
          email: email,
          password: password
        });

        console.log("Signup successful", response.data);
        router.push("/doctor-login");
        
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error("Signup failed:", error.response.data);
          } else {
            console.error("No response received:", error.message);
          }
          } else {
            console.error("An unexpected error occurred:", error);
        }
      }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <div className="text-center mb-12">
        <h1 className="text-4xl md:text-4xl font-bold text-black-900 mb-10">Doctor Signup</h1>
        <div className="grid md:grid-cols-1 gap-8 w-full max-w-4xl">
            <Card className="border-purple-100 hover:shadow-md transition-shadow">
                <CardContent className="p-8">
                      <p className="text-gray-600 mb-6">
                          Please enter your credentials to create a new doctor account.
                      </p>
                      <form onSubmit={handleSignup}>
                      <Input
                      id="doctor-name"
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-4"
                        required
                      />
                      <Input
                        id="password"
                        type="text"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-4"
                        required
                      />
                      <Button type="submit" className="bg-blue-700 hover:bg-blue-900 w-full mt-8">
                        Signup
                      </Button>
                      </form>
                      <Button asChild className="bg-blue-700 hover:bg-blue-900 w-full mt-4">
                        <Link href="/doctor-login">Cancel</Link>
                      </Button>
                </CardContent>                
            </Card>
        </div>
      </div>
    </div>
  )
}

