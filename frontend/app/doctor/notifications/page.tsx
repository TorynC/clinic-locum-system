"use client";

import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "@/utils/axiosinstance";
import { Bell, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const DoctorNotificationsPage = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const shownIds = useRef<Set<number>>(new Set());

  const doctorId =
    typeof window !== "undefined" ? localStorage.getItem("doctorId") : null;
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("doctorAccessToken")
      : null;

  // Fetch notifications
  const getNotifications = async () => {
    setLoading(true);
    try {
      const result = await axiosInstance.get(
        `/notifications/doctor/${doctorId}`,
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
    } finally {
      setLoading(false);
    }
  };

  // Poll every 15 seconds
  useEffect(() => {
    if (!doctorId) return;
    getNotifications();
    const interval = setInterval(getNotifications, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [doctorId, token]);

  // Show toast for new, unread notifications
  useEffect(() => {
    notifications.forEach((n) => {
      if (!n.is_read && !shownIds.current.has(n.id)) {
        toast(n.title, {
          description: n.message,
          duration: 10000,
          action: {
            label: "Mark as read",
            onClick: () => markAsRead(n.id),
          },
        });
        shownIds.current.add(n.id);
        // Optionally auto-mark as read after showing
        markAsRead(n.id);
      }
    });
    // eslint-disable-next-line
  }, [notifications]);

  // Mark notification as read in backend
  const markAsRead = async (id: number) => {
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
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Bell className="w-6 h-6" /> Notifications
      </h1>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="text-gray-500">No notifications yet.</div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded border flex items-start gap-3 cursor-pointer ${
                n.is_read ? "bg-white" : "bg-purple-50 border-purple-200"
              }`}
              onClick={() => markAsRead(n.id)}
            >
              <div>
                {n.type === "accepted" ? (
                  <CheckCircle className="text-green-500 w-5 h-5 mt-1" />
                ) : n.type === "job_unavailable" ? (
                  <AlertCircle className="text-red-500 w-5 h-5 mt-1" />
                ) : (
                  <Bell className="text-purple-500 w-5 h-5 mt-1" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{n.title}</span>
                  {!n.is_read && (
                    <Badge
                      variant="default"
                      className="bg-purple-500 text-white"
                    >
                      New
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-700">{n.message}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorNotificationsPage;
