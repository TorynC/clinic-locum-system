"use client";

import React from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import axiosInstance from "@/utils/axiosinstance"
import { useRouter } from "next/navigation";
import axios from 'axios';

export default function clinicLoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Login API call 
    try {
      const response = await axiosInstance.post("/clinic-login", {
        email: email, 
        password: password
      });

      console.log("Login successful", response.data);
      console.log("id", response.data.id)
      localStorage.setItem("clinicId", response.data.id);
      router.push("/clinic");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Login failed:", error.response.data);
        } else {
          console.error("No response received:", error.message);
        }
        } else {
          console.error("An unexpected error occurred:", error);
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
        <div className="text-center mb-12">
        <h1 className="text-4xl md:text-4xl font-bold text-purple-900 mb-10">Clinic Login</h1>
        <div className="grid md:grid-cols-1 gap-8 w-full max-w-4xl">
            <Card className="border-purple-100 hover:shadow-md transition-shadow">
                <CardContent className="p-8">
                    <p className="text-gray-600 mb-6">
                        Please enter your credentials to access your clinic dashboard.
                    </p>
                   <form onSubmit={handleLogin}>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-4"
                        required
                      />
                      <Button type="submit" className="bg-purple-gradient hover:bg-purple-700 w-full mt-8">
                        Login
                      </Button>
                    </form>
                    <Button asChild className="bg-purple-gradient hover:bg-purple-700 w-full mt-4">
                      <Link href="/clinic-signup">Create a new account</Link>
                    </Button>
                </CardContent>                
            </Card>
        </div>
      </div>
    </div>
  )
}

