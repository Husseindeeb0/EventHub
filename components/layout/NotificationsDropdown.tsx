"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, Trash2, CheckCircle } from "lucide-react";

import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
} from "@/redux/features/notifications/notificationsApi";

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data } = useGetNotificationsQuery(undefined, {
    pollingInterval: 5000,
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const [markNotifRead] = useMarkAsReadMutation();
  const [markAllRead] = useMarkAllAsReadMutation();
  const [delNotif] = useDeleteNotificationMutation();
  const [clearAllNotifs] = useClearAllNotificationsMutation();

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const notif = notifications.find((n) => n._id === id);
    if (!notif || notif.isRead) return;
    await markNotifRead(id);
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    await markAllRead();
  };

  const handleClearAll = async () => {
    if (notifications.length === 0) return;
    await clearAllNotifs();
  };

  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await delNotif(id);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/90 hover:text-white transition-colors focus:outline-none cursor-pointer"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full border border-white/20">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute -right-12 sm:right-0 mt-3 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-[60] border border-gray-100 ring-1 ring-black/5 origin-top transform transition-all">
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            <div className="flex gap-3 text-xs font-medium">
              <button
                onClick={handleMarkAllAsRead}
                className="text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
              >
                <CheckCircle size={12} /> Mark all read
              </button>
              <button
                onClick={handleClearAll}
                className="text-gray-500 hover:text-red-600 transition flex items-center gap-1"
              >
                <Trash2 size={12} /> Clear all
              </button>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-10 text-center text-gray-500 flex flex-col items-center">
                <Bell className="w-10 h-10 text-gray-200 mb-2" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`relative p-4 hover:bg-gray-50 transition-colors cursor-pointer group flex gap-3 ${
                      !notification.isRead ? "bg-blue-50/40" : ""
                    }`}
                    onClick={() => markAsRead(notification._id)}
                  >
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-snug break-words ${
                          !notification.isRead
                            ? "text-gray-900 font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(notification.createdAt).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </p>
                    </div>

                    <button
                      onClick={(e) =>
                        handleDeleteNotification(notification._id, e)
                      }
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 self-start"
                      title="Delete"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
