"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import TicketPDF from "./TicketPDF";
import { usePDF } from "@react-pdf/renderer";

const AutoDownloadLogic = ({
  event,
  booking,
}: {
  event: any;
  booking: any;
}) => {
  const [instance, updateInstance] = usePDF({
    document: <TicketPDF event={event} booking={booking} />,
  });

  useEffect(() => {
    if (!instance.loading && instance.url) {
      const downloadKey = `downloaded_ticket_${booking._id}`;
      const hasDownloaded = localStorage.getItem(downloadKey);

      if (!hasDownloaded) {
        const timestamp = new Date().getTime();
        const fileName = `ticket-${
          event.title?.replace(/\s+/g, "-").toLowerCase() || "event"
        }-${timestamp}.pdf`;

        const link = document.createElement("a");
        link.href = instance.url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Mark as downloaded for this session/local storage
        localStorage.setItem(downloadKey, "true");
      }
    }
  }, [instance.loading, instance.url, event.title, booking._id]);

  return null;
};

// Wrapper to ensure Client Side Rendering
const AutoDownloadTicket = dynamic(() => Promise.resolve(AutoDownloadLogic), {
  ssr: false,
});

export default AutoDownloadTicket;
