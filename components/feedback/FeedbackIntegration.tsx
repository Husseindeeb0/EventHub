"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import FeedbackModal from "./FeedbackModal";

interface FeedbackIntegrationProps {
  bookingId: string;
}

export default function FeedbackIntegration({
  bookingId,
}: FeedbackIntegrationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("showFeedback") === "true") {
      setIsOpen(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);

    // Clean up the URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("showFeedback");

    // Keep 'booked=true' if we want, or remove it too if it's annoying.
    // Usually good to clean up 'booked' after it's seen, but 'AnimatedSuccessMessage' likely relies on it.
    // So we only remove 'showFeedback'.

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <FeedbackModal
      isOpen={isOpen}
      onClose={handleClose}
      bookingId={bookingId}
    />
  );
}
