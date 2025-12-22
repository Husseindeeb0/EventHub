import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import connectDb from "@/lib/connectDb";
import Feedback from "@/models/Feedback";
import Booking from "@/models/Booking";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authMiddleware(req);
    if (authResult.error) {
      return authResult.response;
    }

    const { userId, email: userEmail } = authResult.user!;
    const body = await req.json();
    const {
      bookingId,
      rating,
      comment,
      description,
      type = "event",
      category,
    } = body;

    const finalComment = comment || description;

    if (!rating) {
      return NextResponse.json(
        { success: false, message: "Rating is required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    try {
      await connectDb();
    } catch (dbError) {
      console.error(
        "Database connection failed in feedback submission:",
        dbError
      );
      return NextResponse.json(
        {
          success: false,
          message: "Server is currently unable to connect to the database",
        },
        { status: 500 }
      );
    }

    let feedbackData: any = {
      user: userId,
      rating,
      comment: finalComment,
      type,
    };

    if (type === "event") {
      if (!bookingId) {
        return NextResponse.json(
          {
            success: false,
            message: "Booking ID is required for event feedback",
          },
          { status: 400 }
        );
      }

      // Verify booking belongs to user
      const booking = await Booking.findOne({
        _id: bookingId,
        user: userId,
        status: { $ne: "cancelled" },
      }).populate("event", "title");

      if (!booking) {
        return NextResponse.json(
          { success: false, message: "Invalid booking" },
          { status: 400 }
        );
      }

      feedbackData.booking = bookingId;
    } else if (type === "general") {
      feedbackData.category = category;
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid feedback type" },
        { status: 400 }
      );
    }

    // Create feedback in database
    const feedback = await Feedback.create(feedbackData);

    // Send Email Notification
    try {
      // Hardcoded credentials as requested by the USER
      const emailUser = "eventhub172@gmail.com";
      const emailPass = "gdrl coht boja kjrv";

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      // Get Event Title for event-type feedback
      let eventTitle = "";
      if (type === "event" && bookingId) {
        const booking = await Booking.findById(bookingId).populate(
          "event",
          "title"
        );
        if (booking && booking.event) {
          eventTitle = (booking.event as any).title;
        }
      }

      const mailOptions = {
        from: `"EventHub Feedback" <${emailUser}>`,
        to: emailUser, // Now sends to the website email (admin)
        replyTo: userEmail, // Makes it easy for the admin to reply to the user
        subject: `✨ New Feedback: ${
          type === "event"
            ? `Event "${eventTitle || "Unknown"}"`
            : `General (${category || "Other"})`
        }`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
            <div style="background: linear-gradient(to right, #4f46e5, #9333ea); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">New Feedback Received</h1>
            </div>
            <div style="padding: 40px; background-color: #ffffff;">
              <div style="margin-bottom: 30px;">
                <div style="background: #f1f5f9; padding: 15px 20px; border-radius: 12px; margin-bottom: 15px;">
                   <p style="margin: 0; color: #64748b; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Submitted By</p>
                   <p style="margin: 5px 0 0 0; color: #1e293b; font-weight: 600; font-size: 15px;">${userEmail}</p>
                </div>
                <div style="background: #f1f5f9; padding: 15px 20px; border-radius: 12px;">
                   <p style="margin: 0; color: #64748b; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Experience Rating</p>
                   <p style="margin: 5px 0 0 0; color: #fbbf24; font-size: 20px; line-height: 1;">
                     ${"★".repeat(rating)}${"☆".repeat(5 - rating)}
                     <span style="font-size: 14px; color: #94a3b8; margin-left: 8px; font-weight: normal;">(${rating} / 5)</span>
                   </p>
                </div>
              </div>

              ${
                type === "event" && eventTitle
                  ? `
              <div style="margin-bottom: 25px; padding: 15px 20px; background: #f8fafc; border-left: 4px solid #4f46e5; border-radius: 8px;">
                <p style="margin: 0; color: #64748b; font-size: 11px; font-weight: bold; text-transform: uppercase;">Event Name</p>
                <p style="margin: 5px 0 0 0; color: #1e293b; font-weight: 600; font-size: 15px;">${eventTitle}</p>
              </div>
              `
                  : ""
              }

              ${
                category
                  ? `
              <div style="margin-bottom: 25px; padding: 15px 20px; background: #f8fafc; border-left: 4px solid #9333ea; border-radius: 8px;">
                <p style="margin: 0; color: #64748b; font-size: 11px; font-weight: bold; text-transform: uppercase;">Category</p>
                <p style="margin: 5px 0 0 0; color: #1e293b; font-weight: 600; font-size: 15px;">${
                  category.charAt(0).toUpperCase() + category.slice(1)
                }</p>
              </div>
              `
                  : ""
              }

              <div style="margin-bottom: 8px;">
                <p style="margin: 0; color: #64748b; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Detailed Feedback</p>
              </div>
              <div style="background: #f8fafc; padding: 25px; border-radius: 15px; border: 1px solid #f1f5f9; text-align: left;">
                <p style="margin: 0; color: #334155; line-height: 1.6; font-style: ${
                  finalComment ? "normal" : "italic"
                }; white-space: pre-wrap; font-size: 15px; text-align: left;">
                  ${
                    finalComment || "No detailed comments provided by the user."
                  }
                </p>
              </div>

              <div style="margin-top: 40px; text-align: center; color: #94a3b8; font-size: 10px;">
                <p style="margin-bottom: 5px;">Internal Tracking ID: ${
                  (feedback as any)._id || "N/A"
                }</p>
                <p>© 2024 EventHub System • Quality Assurance Team</p>
              </div>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError: any) {
      console.error("Nodemailer Error:", emailError);
      // We still return success: true because the feedback was saved in the DB
    }

    return NextResponse.json(
      { success: true, message: "Feedback submitted successfully", feedback },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
