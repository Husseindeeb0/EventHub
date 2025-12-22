"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Download, Loader2 } from 'lucide-react';

const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    {
        ssr: false,
        loading: () => <button className="opacity-50 cursor-wait">Loading PDF...</button>,
    }
);

import TicketPDF from './TicketPDF';

interface DownloadTicketButtonProps {
    event: any;
    booking: any;
    label?: string;
    className?: string;
}

const DownloadTicketButton: React.FC<DownloadTicketButtonProps> = ({ event, booking, label = "Download Ticket", className }) => {
    if (!event || !booking) return null;

    // Add timestamp to force new download
    const timestamp = new Date().getTime();
    const fileName = `ticket-${event.title?.replace(/\s+/g, '-').toLowerCase() || 'event'}-${timestamp}.pdf`;

    return (
        <PDFDownloadLink
            document={<TicketPDF event={event} booking={booking} />}
            fileName={fileName}
            className={className}
        >
            {/* @ts-ignore */}
            {({ blob, url, loading, error }) => (
                loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        {label}
                    </span>
                )
            )}
        </PDFDownloadLink>
    );
};

export default DownloadTicketButton;
