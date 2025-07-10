"use client";
import React, { useRef, useCallback } from "react";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosinstance";
import { toast } from "sonner";

interface NotificationListenerProps {
  userType: "doctor" | "clinic";
}

export default function NotificationListener({
  userType,
}: NotificationListenerProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const shownIds = useRef<Set<Number>>(new Set());

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem(userType === "doctor" ? "doctorId" : "clinicId")
      : null;
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(
          userType === "doctor" ? "doctorAccessToken" : "clinicAccessToken"
        )
      : null;

  const getNotifications = async () => {
    if (!userId) return;
    try {
      const result = await axiosInstance.get(
        `/notifications/${userType}/${userId}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (!result.data.error) {
        setNotifications(result.data.notifications);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // mark notifications as read
  const markAsRead = useCallback(
    async (id: number) => {
      try {
        await axiosInstance.patch(
          `/notifications/${id}/read`,
          {},
          {
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, is_read: true } : notif
          )
        );
      } catch (error) {
        console.error(error);
      }
    },
    [token]
  );

  // Show toast notifications for unread notifications
  const showToastNotifications = useCallback(() => {
    notifications.forEach((n) => {
      if (!n.is_read && !shownIds.current.has(n.id)) {
        // Use setTimeout to avoid setState during render
        setTimeout(() => {
          toast(n.title, {
            description: n.message,
            duration: 15000,
            action: {
              label: "Mark as read",
              onClick: () => markAsRead(n.id),
            },
          });
        }, 0);
        shownIds.current.add(n.id);
      }
    });
  }, [notifications, markAsRead]);

  useEffect(() => {
    if (!userId) return;
    getNotifications();
    const interval = setInterval(getNotifications, 15000);
    return () => clearInterval(interval);
  }, [userId, token]);

  useEffect(() => {
    showToastNotifications();
  }, [showToastNotifications]);

  return null;
}
