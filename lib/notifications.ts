import connectDb from "@/lib/connectDb";
import Notification from "@/models/Notification";

export const createNotification = async (data: {
    recipient: string;
    sender?: string;
    type: 'LOGIN' | 'RESERVATION' | 'CANCELLATION' | 'NEW_FOLLOWER' | 'NEW_EVENT_FROM_FOLLOWING';
    message: string;
    relatedEntityId?: string;
    relatedEntityType?: 'Event' | 'User';
}) => {
    try {
        await connectDb();
        await Notification.create(data);
    } catch (error) {
        console.error("Failed to create notification:", error);
        console.error("Notification Data:", data);
    }
}
