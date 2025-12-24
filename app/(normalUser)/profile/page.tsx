"use client";
import {
  AnimatedPageHeader,
  AnimatedCard,
} from "@/components/animations/PageAnimations";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import ProfileInfo from "../../../components/profile/ProfileInfo";
import ProfileAttendedEvents from "../../../components/profile/ProfileAttendedEvents";
import ProfileFollowing from "../../../components/profile/ProfileFollowing";
import EditCoverForm from "../../../components/profile/EditCoverForm";
import EditProfileForm from "../../../components/profile/EditProfileForm";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/features/auth/authSlice";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingCover, setIsEditingCover] = useState(false);
  const user = useAppSelector(selectUser);

  return (
    <main className="min-h-[calc(100vh-56px)] bg-linear-to-br from-slate-100 via-indigo-100/60 to-blue-100/80 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.2),transparent_60%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.2),transparent_60%)] pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 z-10">
        <AnimatedPageHeader>
          <ProfileHeader onEditClick={() => setIsEditingCover(true)} />
        </AnimatedPageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-1">
            <AnimatedCard delay={0.2}>
              <ProfileInfo onEditClick={() => setIsEditing(true)} />
            </AnimatedCard>
          </div>

          {/* Right Column - Events */}
          <div className="lg:col-span-2">
            <AnimatedCard delay={0.3}>
              <ProfileAttendedEvents />
            </AnimatedCard>
            <div className="mt-8">
              <AnimatedCard delay={0.4}>
                <ProfileFollowing />
              </AnimatedCard>
            </div>
            {/* Followers section removed as regular users don't have followers */}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEditing && user && (
          <EditProfileForm user={user} onClose={() => setIsEditing(false)} />
        )}
        {isEditingCover && user && (
          <EditCoverForm user={user} onClose={() => setIsEditingCover(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}
