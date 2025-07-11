"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/utils/axiosinstance";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function doctorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (error && errorMessage) {
      toast.error(errorMessage);
      // Optionally clear the error after showing toast
      setError(false);
      setErrorMessage("");
    }
  }, [error, errorMessage]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Login API call
    try {
      const response = await axiosInstance.post("/doctor-login", {
        email: email,
        password: password,
      });

      console.log("Login successful", response.data);

      if (!response.data.error) {
        localStorage.setItem("doctorId", response.data.id);
        localStorage.setItem("doctorAccessToken", response.data.accessToken);

        toast.success("Login successful!");
        router.push("/doctor");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Login failed:", error.response.data.message);
          setError(true);
          setErrorMessage(error.response.data.message);
        } else {
          console.error("No response received:", error.message);
          setError(true);
          setErrorMessage(error.message);
        }
      } else {
        console.error("An unexpected error occurred:", error);
        setError(true);
        setErrorMessage("An unexpected error occurred, please try again");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white-100 p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-4xl font-bold text-black mb-10">
          Doctor Login
        </h1>
        <div className="grid md:grid-cols-1 gap-8 w-full max-w-4xl">
          <Card className="border-purple-100 hover:shadow-md transition-shadow">
            <CardContent className="p-8">
              <p className="text-gray-600 mb-6">
                Please enter your credentials to access your doctor dashboard.
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
                <Button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-900 w-full mt-8"
                >
                  Login
                </Button>
              </form>
              <Button
                asChild
                className="bg-blue-700 hover:bg-blue-900 w-full mt-4"
              >
                <Link href="/doctor-signup">Create a new account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
