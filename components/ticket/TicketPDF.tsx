import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Link,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#0f172a",
    padding: 20,
    fontFamily: "Helvetica",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  // The Ticket Shape
  ticketContainer: {
    width: "100%",
    maxWidth: 750,
    height: 300,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
  },

  // Left Section (Main) - 70% width
  leftSection: {
    width: "70%",
    backgroundColor: "#fdfbf7", // Premium Ivory/Paper
    padding: 0,
    position: "relative",
    borderRightWidth: 3,
    borderRightColor: "#94a3b8",
    borderRightStyle: "dashed",
    flexDirection: "row",
  },

  // Poster Section (New)
  posterSection: {
    width: "35%",
    backgroundColor: "#f1f5f9",
    position: "relative",
  },
  posterImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  posterPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },

  // Main Content Area (inside Left Section)
  mainContent: {
    width: "65%",
    padding: 20,
    justifyContent: "space-between",
    position: "relative",
  },

  // Right Section (Stub) - 30% width
  rightSection: {
    width: "30%",
    backgroundColor: "#1e293b",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    borderLeftWidth: 2,
    borderLeftColor: "rgba(255,255,255,0.1)",
  },

  // Branding (Site Logo)
  siteLogo: {
    marginBottom: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 5,
  },
  logoIcon: {
    width: 20,
    height: 20,
    backgroundColor: "#6366f1",
    borderRadius: 4,
  },
  logoText: {
    color: "#4f46e5",
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    letterSpacing: -0.5,
  },

  // Event Title
  eventTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 4,
    textTransform: "uppercase",
    lineHeight: 1.1,
  },
  eventLocation: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 10,
    fontFamily: "Helvetica",
  },

  // Organizer Link styling
  organizerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#f8fafc",
    padding: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  orgLabel: {
    fontSize: 8,
    color: "#94a3b8",
    marginRight: 4,
  },
  orgName: {
    fontSize: 9,
    color: "#4f46e5", // Indigo link color
    fontFamily: "Helvetica-Bold",
    textDecoration: "none",
  },

  // Data Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: "auto",
  },
  col: {
    width: "45%",
  },
  label: {
    fontSize: 7,
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 2,
    letterSpacing: 1,
    fontFamily: "Helvetica-Bold",
  },
  value: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#334155",
  },

  // Right Section Styles
  stubTitle: {
    color: "#f8fafc",
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 10,
  },

  qrContainer: {
    backgroundColor: "white",
    padding: 4,
    borderRadius: 6,
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  qrImage: {
    width: 82,
    height: 82,
  },

  securityHash: {
    color: "#64748b",
    fontSize: 5,
    fontFamily: "Courier",
    textAlign: "center",
    marginTop: 2,
    letterSpacing: 1,
  },

  cutoutTop: {
    position: "absolute",
    top: -12,
    left: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0f172a",
    zIndex: 10,
  },
  cutoutBottom: {
    position: "absolute",
    bottom: -12,
    left: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0f172a",
    zIndex: 10,
  },
});

interface TicketPDFProps {
  event: any;
  booking: any;
}

const TicketPDF: React.FC<TicketPDFProps> = ({ event, booking }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "TBA";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    } catch (e) {
      return "";
    }
  };

  // Construct QR Data
  const qrData = JSON.stringify({
    id: booking?._id,
    event: event?.title,
    user: booking?.name,
    valid: true,
  });
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    qrData
  )}`;

  // Organizer Link
  const organizerUrl = event?.organizer?._id
    ? `http://localhost:3000/organizers/${event.organizer._id}`
    : "#";

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.ticketContainer}>
          {/* --- Main Section (Left) --- */}
          <View style={styles.leftSection}>
            {/* Poster Area */}
            <View style={styles.posterSection}>
              {event?.coverImageUrl ? (
                <Image src={event.coverImageUrl} style={styles.posterImage} />
              ) : (
                <View style={styles.posterPlaceholder}>
                  <Text style={{ fontSize: 8, color: "#94a3b8" }}>
                    NO IMAGE
                  </Text>
                </View>
              )}
            </View>

            {/* Watermark Background - Advanced Security Pattern */}
            <View
              style={{
                position: "absolute",
                top: 0,
                left: "35%",
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                opacity: 0.08, // Increased visibility
                transform: "rotate(-10deg)",
                zIndex: -1,
              }}
            >
              <Image
                src="/logo.png"
                style={{ width: 250, height: 250, objectFit: "contain" }}
              />
            </View>

            {/* Content Area */}
            <View style={styles.mainContent}>
              <View>
                {/* Site Logo */}
                <View style={styles.siteLogo}>
                  <Image
                    src="/logo.png"
                    style={{ height: 50, width: 140, objectFit: "contain" }}
                  />
                </View>

                <Text style={styles.eventTitle}>
                  {event?.title || "Unknown Event"}
                </Text>
                {event?.isOnline ? (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ ...styles.eventLocation, marginBottom: 2 }}>
                      ONLINE EVENT
                    </Text>
                    <Link
                      src={event.meetingLink}
                      style={{
                        fontSize: 9,
                        color: "#4f46e5",
                        textDecoration: "underline",
                      }}
                    >
                      Join Meeting
                    </Link>
                  </View>
                ) : (
                  <Text style={styles.eventLocation}>
                    {event?.location || "Location TBA"}
                  </Text>
                )}

                {/* Organizer Link */}
                {event?.organizer && (
                  <View style={styles.organizerRow}>
                    <Text style={styles.orgLabel}>Organized by</Text>
                    <Link src={organizerUrl} style={styles.orgName}>
                      {event.organizer.name}
                    </Link>
                  </View>
                )}
              </View>

              {/* Grid of Details */}
              <View style={styles.grid}>
                <View style={styles.col}>
                  <Text style={styles.label}>ATTENDEE</Text>
                  {booking?.userId ? (
                    <Link
                      src={`http://localhost:3000/profile/${booking.userId}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Text
                        style={{
                          ...styles.value,
                          color: "#0f172a",
                          textDecoration: "underline",
                        }}
                      >
                        {booking?.name || "Guest"}
                      </Text>
                    </Link>
                  ) : (
                    <Text style={styles.value}>{booking?.name || "Guest"}</Text>
                  )}
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>CONTACT</Text>
                  <Text style={{ ...styles.value, fontSize: 8 }}>
                    {booking?.phone || "N/A"}
                  </Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>SEATS</Text>
                  <Text style={styles.value}>
                    {booking?.seats || 1} Reserved
                  </Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>DATE & TIME</Text>
                  <Text style={{ ...styles.value, color: "#f59e0b" }}>
                    {formatDate(event?.startsAt)} •{" "}
                    {formatTime(event?.startsAt)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* --- Stub Section (Right) --- */}
          <View style={styles.rightSection}>
            <View style={styles.cutoutTop} />
            <View style={styles.cutoutBottom} />

            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: "#94a3b8",
                  fontSize: 8,
                  letterSpacing: 2,
                  marginBottom: 5,
                }}
              >
                SCAN TO VERIFY
              </Text>
            </View>

            {/* Real QR Code */}
            <View style={styles.qrContainer}>
              <Image src={qrUrl} style={styles.qrImage} />
            </View>

            <View style={{ width: "100%", alignItems: "center" }}>
              <Text style={{ color: "#64748b", fontSize: 8, marginBottom: 2 }}>
                SECURITY HASH
              </Text>
              <Text style={styles.securityHash}>
                {booking?._id || "INVALID-ID"}
              </Text>
            </View>

            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontFamily: "Helvetica-Bold",
                marginTop: 10,
              }}
            >
              ADMIT {booking?.seats || 1}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TicketPDF;
