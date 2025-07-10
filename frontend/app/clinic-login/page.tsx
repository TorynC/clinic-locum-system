"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/utils/axiosinstance";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

export default function clinicLoginPage() {
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
      const response = await axiosInstance.post("/clinic-login", {
        email: email,
        password: password,
      });

      console.log("Login successful", response.data);

      if (!response.data.error) {
        localStorage.setItem("clinicId", response.data.id);
        localStorage.setItem("clinicAccessToken", response.data.accessToken);

        if (response.data.isFirstTimeLogin) {
          router.push("/clinic/profile");
        } else {
          router.push("/clinic");
        }
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-4xl font-bold text-black mb-10">
          Clinic Login
        </h1>
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
                <Link href="/clinic-signup">Create a new account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
