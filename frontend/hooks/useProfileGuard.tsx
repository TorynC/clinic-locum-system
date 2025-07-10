"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosinstance";

export function useProfileGuard() {
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const clinicId =
    typeof window !== "undefined" ? localStorage.getItem("clinicId") : null;

  useEffect(() => {
    if (!clinicId) {
      setIsLoading(false);
      return;
    }

    // Check if profile is complete
    const checkProfileCompletion = async () => {
      try {
        const response = await axiosInstance.get(
          `/clinic-first-time-login/${clinicId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "clinicAccessToken"
              )}`,
            },
          }
        );

        if (!response.data.error) {
          const isFirstTime = response.data.isFirstTimeLogin;
          setIsProfileComplete(!isFirstTime);

          // If it's first time and not on profile page, redirect and show toast
          if (isFirstTime && pathname !== "/clinic/profile") {
            toast.error(
              "Please complete your profile setup before accessing other pages"
            );
            router.push("/clinic/profile");
          }
        }
      } catch (error) {
        console.error("Error checking profile completion:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfileCompletion();
  }, [clinicId, pathname, router]);

  return { isProfileComplete, isLoading };
}
