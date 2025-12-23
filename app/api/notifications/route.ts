import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import connectDb from "@/lib/connectDb";
import Notification from "@/models/Notification";

export async function GET(req: NextRequest) {
    try {
        const authResult = await authMiddleware(req);
        if (authResult.error) return authResult.response;
        const { userId } = authResult.user!;

        await connectDb();
        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50 notifications

        const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

        return NextResponse.json({ success: true, notifications, unreadCount });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const authResult = await authMiddleware(req);
        if (authResult.error) return authResult.response;
        const { userId } = authResult.user!;

        const { notificationId, markAllRead } = await req.json();

        await connectDb();

        if (markAllRead) {
            await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
            return NextResponse.json({ success: true, message: "All marked as read" });
        }

        if (notificationId) {
            const notification = await Notification.findOne({ _id: notificationId, recipient: userId });
            if (!notification) return NextResponse.json({ success: false, message: "Notification not found" }, { status: 404 });

            notification.isRead = true;
            await notification.save();
            return NextResponse.json({ success: true, message: "Marked as read" });
        }

        return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    } catch (error) {
        console.error("Error updating notifications:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const authResult = await authMiddleware(req);
        if (authResult.error) return authResult.response;
        const { userId } = authResult.user!;

        const { notificationId, clearAll } = await req.json();

        await connectDb();

        if (clearAll) {
            await Notification.deleteMany({ recipient: userId });
            return NextResponse.json({ success: true, message: "All notifications cleared" });
        }

        if (notificationId) {
            await Notification.findOneAndDelete({ _id: notificationId, recipient: userId });
            return NextResponse.json({ success: true, message: "Notification deleted" });
        }

        return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    } catch (error) {
        console.error("Error deleting notifications:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}
