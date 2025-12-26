"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, Trash2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="relative p-2 text-white/90 hover:text-white transition-colors focus:outline-none cursor-pointer">
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full border border-white/20">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute -right-12 sm:right-0 mt-1 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-none overflow-hidden z-[60] border border-gray-100 dark:border-slate-800 ring-1 ring-black/5 dark:ring-white/5 origin-top"
          >
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Notifications
              </h3>
              <div className="flex gap-3 text-xs font-medium">
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle size={12} /> Mark all read
                </button>
                <button
                  onClick={handleClearAll}
                  className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={12} /> Clear all
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-10 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                  <Bell className="w-10 h-10 text-gray-200 dark:text-slate-800 mb-2" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 dark:divide-slate-800">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`relative p-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group flex gap-3 ${
                        !notification.isRead
                          ? "bg-blue-50/40 dark:bg-blue-900/10"
                          : ""
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
                              ? "text-gray-900 dark:text-gray-100 font-medium"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(
                            notification.createdAt
                          ).toLocaleDateString()}{" "}
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
                        className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1 self-start cursor-pointer"
                        title="Delete"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
