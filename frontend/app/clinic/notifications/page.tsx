"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosinstance";
import { Bell, UserPlus, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ClinicNotificationsPage = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Replace with your actual clinic ID fetching logic
  const clinicId =
    typeof window !== "undefined" ? localStorage.getItem("clinicId") : null;

  useEffect(() => {
    if (!clinicId) return;
    setLoading(true);
    axiosInstance
    // get notifications
      .get(`/notifications/clinic/${clinicId}`)
      .then((res) => setNotifications(res.data.notifications || []))
      .finally(() => setLoading(false));
  }, [clinicId]);

  // Mark notification as read in the backend 
  const markAsRead = async (id: number) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`, {});
      setNotifications((prev) => prev.map((notif) => notif.id === id ? { ...notif, is_read:true }: notif))
    } catch (error) {
      console.error(error) 
    }
  }

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
              className={`p-4 rounded border flex items-start gap-3 cursor-pointer hover:bg-blue-200 ${
                n.is_read ? "bg-white" : "bg-purple-50 border-purple-200"
              }`} 
              onClick={() => {markAsRead(n.id)}}
            >
              <div>
                {n.type === "application" ? (
                  <UserPlus className="text-blue-500 w-5 h-5 mt-1" />
                ) : n.type === "cancellation" ? (
                  <AlertCircle className="text-red-500 w-5 h-5 mt-1" />
                ) : (
                  <Bell className="text-purple-500 w-5 h-5 mt-1" />
                )}
              </div>
              <div className="flex-1 ">
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
                  {!n.is_read && (
                  <Badge
                    variant="default"
                    className="bg-slate-700 text-white"
                  >
                    Mark as Read?
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

export default ClinicNotificationsPage;
