/**
 * Professional email templates for EventHub notifications
 */

interface NewEventEmailData {
  followerName: string;
  organizerName: string;
  organizerImageUrl?: string;
  eventTitle: string;
  eventDescription?: string;
  eventLocation: string;
  eventDate: string;
  eventTime: string;
  eventCategory?: string;
  eventImageUrl?: string;
  eventUrl: string;
}

export function generateNewEventEmailTemplate(data: NewEventEmailData): string {
  const {
    followerName,
    organizerName,
    organizerImageUrl,
    eventTitle,
    eventDescription,
    eventLocation,
    eventDate,
    eventTime,
    eventCategory,
    eventImageUrl,
    eventUrl,
  } = data;

  const organizerAvatar = organizerImageUrl
    ? `<img src="${organizerImageUrl}" alt="${organizerName}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;" />`
    : `<div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">${organizerName
        .charAt(0)
        .toUpperCase()}</div>`;

  const eventImage = eventImageUrl
    ? `<img src="${eventImageUrl}" alt="${eventTitle}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 20px;" />`
    : "";

  const categoryBadge = eventCategory
    ? `<span style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${eventCategory}</span>`
    : "";

  const truncatedDescription = eventDescription
    ? eventDescription.length > 150
      ? eventDescription.substring(0, 150) + "..."
      : eventDescription
    : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Event from ${organizerName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                🎉 New Event Alert!
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                An organizer you follow just posted something exciting
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              
              <!-- Greeting -->
              <p style="margin: 0 0 24px; color: #1e293b; font-size: 16px;">
                Hi <strong>${followerName}</strong>,
              </p>
              
              <p style="margin: 0 0 24px; color: #475569; font-size: 15px; line-height: 1.6;">
                Great news! <strong style="color: #4f46e5;">${organizerName}</strong>, an organizer you follow, has just published a new event that you might love.
              </p>

              <!-- Organizer Info -->
              <table role="presentation" style="width: 100%; margin-bottom: 24px;">
                <tr>
                  <td style="width: 56px; vertical-align: top;">
                    ${organizerAvatar}
                  </td>
                  <td style="padding-left: 12px; vertical-align: middle;">
                    <p style="margin: 0; font-weight: 700; color: #1e293b; font-size: 15px;">${organizerName}</p>
                    <p style="margin: 4px 0 0; color: #64748b; font-size: 13px;">Event Organizer</p>
                  </td>
                </tr>
              </table>

              <!-- Event Card -->
              <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0;">
                
                ${eventImage}
                
                ${
                  categoryBadge
                    ? `<div style="margin-bottom: 12px;">${categoryBadge}</div>`
                    : ""
                }
                
                <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 22px; font-weight: 800; line-height: 1.3;">
                  ${eventTitle}
                </h2>
                
                ${
                  truncatedDescription
                    ? `<p style="margin: 0 0 20px; color: #475569; font-size: 14px; line-height: 1.6;">${truncatedDescription}</p>`
                    : ""
                }
                
                <!-- Event Details -->
                <table role="presentation" style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0;">
                      <table role="presentation">
                        <tr>
                          <td style="width: 28px; vertical-align: top;">
                            <div style="width: 24px; height: 24px; background-color: #eef2ff; border-radius: 6px; text-align: center; line-height: 24px;">📅</div>
                          </td>
                          <td style="padding-left: 10px;">
                            <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Date</p>
                            <p style="margin: 2px 0 0; color: #1e293b; font-size: 14px; font-weight: 600;">${eventDate}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <table role="presentation">
                        <tr>
                          <td style="width: 28px; vertical-align: top;">
                            <div style="width: 24px; height: 24px; background-color: #eef2ff; border-radius: 6px; text-align: center; line-height: 24px;">⏰</div>
                          </td>
                          <td style="padding-left: 10px;">
                            <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Time</p>
                            <p style="margin: 2px 0 0; color: #1e293b; font-size: 14px; font-weight: 600;">${eventTime}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <table role="presentation">
                        <tr>
                          <td style="width: 28px; vertical-align: top;">
                            <div style="width: 24px; height: 24px; background-color: #eef2ff; border-radius: 6px; text-align: center; line-height: 24px;">📍</div>
                          </td>
                          <td style="padding-left: 10px;">
                            <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Location</p>
                            <p style="margin: 2px 0 0; color: #1e293b; font-size: 14px; font-weight: 600;">${eventLocation}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-top: 32px;">
                <a href="${eventUrl}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 15px; letter-spacing: 0.3px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);">
                  View Event Details →
                </a>
              </div>

              <p style="margin: 32px 0 0; color: #64748b; font-size: 13px; text-align: center; line-height: 1.6;">
                Don't miss out – spots may be limited!
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #e2e8f0;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 8px; color: #94a3b8; font-size: 12px;">
                      You're receiving this email because you follow <strong>${organizerName}</strong> on EventHub.
                    </p>
                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                      © ${new Date().getFullYear()} EventHub. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Format a date for email display
 */
export function formatEventDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a time for email display
 */
export function formatEventTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
