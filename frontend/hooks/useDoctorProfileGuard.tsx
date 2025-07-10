"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosinstance";

export function useDoctorProfileGuard() {
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const doctorId =
    typeof window !== "undefined" ? localStorage.getItem("doctorId") : null;

  useEffect(() => {
    if (!doctorId) {
      setIsLoading(false);
      return;
    }

    // Check if profile is complete
    const checkProfileCompletion = async () => {
      try {
        const response = await axiosInstance.get(
          `/doctor-first-time-login/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "doctorAccessToken"
              )}`,
            },
          }
        );

        if (!response.data.error) {
          const isFirstTime = response.data.isFirstTimeLogin;
          setIsProfileComplete(!isFirstTime);

          // If it's first time and not on profile page, redirect and show toast
          if (isFirstTime && pathname !== "/doctor/profile") {
            toast.error(
              "Please complete your profile setup before accessing other pages"
            );
            router.push("/doctor/profile");
          }
        }
      } catch (error) {
        console.error("Error checking profile completion:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfileCompletion();
  }, [doctorId, pathname, router]);

  return { isProfileComplete, isLoading };
}
