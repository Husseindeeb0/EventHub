"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  MessageCircle,
  Crown,
  User as UserIcon,
  Heart,
  Trash2,
  Pin,
  Reply,
  X,
} from "lucide-react";

interface Comment {
  _id: string;
  content: string;
  user: {
    _id: string;
    name: string;
    imageUrl?: string;
  };
  likes: string[]; // Array of user IDs
  isPinned: boolean;
  replyTo?: {
    _id: string;
    user: { name: string };
    content: string;
  };
  createdAt: string;
}

interface EventChatProps {
  eventId: string;
  organizerId: string;
  currentUserId?: string;
}

export default function EventChat({
  eventId,
  organizerId,
  currentUserId,
}: EventChatProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToReply = (replyId?: string) => {
    if (!replyId) return;
    const element = document.getElementById(`msg-${replyId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedId(replyId);
      setTimeout(() => setHighlightedId(null), 2000);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // Poll every 5 seconds
    const interval = setInterval(fetchComments, 5000);
    return () => clearInterval(interval);
  }, [eventId]);

  useEffect(() => {
    // Only scroll to bottom on initial load or if user sends a message
    // to avoid annoying jumps when reading history
    if (isLoading) return;
    // Simple heuristic: if we're near bottom, scroll to bottom
    // For now, just scroll on fresh load is ok
  }, [comments.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/events/${eventId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          replyTo: replyingTo?._id,
        }),
      });

      if (res.ok) {
        setNewMessage("");
        setReplyingTo(null);
        fetchComments();
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!currentUserId) return;

    // Optimistic update
    setComments((prev) =>
      prev.map((c) => {
        if (c._id === commentId) {
          const currentLikes = c.likes || [];
          const isLiked = currentLikes.includes(currentUserId);
          return {
            ...c,
            likes: isLiked
              ? currentLikes.filter((id) => id !== currentUserId)
              : [...currentLikes, currentUserId],
          };
        }
        return c;
      })
    );

    try {
      await fetch(`/api/comments/${commentId}/like`, { method: "POST" });
      // Background refresh is better for consistent state
      fetchComments();
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    // Optimistic update
    setComments((prev) => prev.filter((c) => c._id !== commentId));

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        fetchComments();
        alert("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      fetchComments();
    }
  };

  const handlePin = async (commentId: string) => {
    // Optimistic update
    setComments((prev) =>
      prev.map((c) => {
        if (c._id === commentId) {
          return { ...c, isPinned: !c.isPinned };
        }
        return c;
      })
    );

    try {
      await fetch(`/api/comments/${commentId}/pin`, { method: "POST" });
      fetchComments();
    } catch (error) {
      console.error("Error pinning comment:", error);
    }
  };

  const pinnedComments = comments.filter((c) => c.isPinned);
  const regularComments = comments.filter((c) => !c.isPinned);

  return (
    <div className="flex flex-col h-[600px] w-full bg-white rounded-3xl border border-purple-100 shadow-xl overflow-hidden relative">
      {/* Header */}
      <div className="p-4 bg-linear-to-r from-purple-600 to-blue-600 text-white flex items-center gap-3 shadow-md z-10">
        <div className="p-2 bg-white/20 rounded-full">
          <MessageCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Event Chat</h3>
          <p className="text-xs text-purple-100">
            Discuss plans & updates live
          </p>
        </div>
      </div>

      {/* Pinned Messages Area (Sticky) */}
      {pinnedComments.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-100 max-h-32 overflow-y-auto z-10 shadow-sm">
          {pinnedComments.map((pin) => {
            const pinUser = pin.user || { name: "Deleted User" };
            return (
              <div
                key={pin._id}
                className="p-3 flex items-start gap-2 text-sm border-b border-amber-100 last:border-0 hover:bg-amber-100/50 transition-colors"
              >
                <Pin className="w-3 h-3 text-amber-600 mt-1 shrink-0 fill-current" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-amber-800 text-xs">
                      {pinUser.name}
                    </span>
                    <span className="text-[10px] text-amber-600/70">
                      Pinned Message
                    </span>
                  </div>
                  <p className="text-amber-900 truncate">{pin.content}</p>
                </div>
                {currentUserId === organizerId && (
                  <button
                    onClick={() => handlePin(pin._id)}
                    className="text-amber-400 hover:text-amber-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
        {isLoading ? (
          <div className="flex justify-center items-center h-full text-slate-400">
            Loading messages...
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
            <MessageCircle className="w-12 h-12 opacity-20" />
            <p>No messages yet. Be the first to say hi!</p>
          </div>
        ) : (
          comments.map((comment, index) => {
            const user = comment.user || {
              _id: "deleted",
              name: "Deleted User",
              imageUrl: undefined,
            };

            const isOrganizer = user._id === organizerId;
            const isMe = currentUserId === user._id;
            const isLiked = currentUserId
              ? (comment.likes || []).includes(currentUserId)
              : false;
            const canDelete =
              currentUserId && (isMe || currentUserId === organizerId);
            const canPin = currentUserId === organizerId;
            const isHighlighted = highlightedId === comment._id;

            // Date separator logic
            const commentDate = new Date(comment.createdAt);
            const prevComment = index > 0 ? comments[index - 1] : null;
            const prevCommentDate = prevComment
              ? new Date(prevComment.createdAt)
              : null;

            const isNewDay =
              !prevCommentDate ||
              commentDate.toDateString() !== prevCommentDate.toDateString();

            const formatDateSeparator = (date: Date) => {
              const today = new Date();
              const yesterday = new Date();
              yesterday.setDate(today.getDate() - 1);

              if (date.toDateString() === today.toDateString()) return "Today";
              if (date.toDateString() === yesterday.toDateString())
                return "Yesterday";

              return date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year:
                  date.getFullYear() !== today.getFullYear()
                    ? "numeric"
                    : undefined,
              });
            };

            return (
              <div key={comment._id} className="space-y-6">
                {isNewDay && (
                  <div className="flex justify-center my-8">
                    <span className="px-4 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-xs">
                      {formatDateSeparator(commentDate)}
                    </span>
                  </div>
                )}
                <div
                  id={`msg-${comment._id}`}
                  className={`flex gap-3 p-2 rounded-xl transition-colors duration-1000 ${
                    isHighlighted ? "bg-purple-100/50" : ""
                  } ${isMe ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div className="shrink-0">
                    {user.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.imageUrl}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center border-2 border-white shadow-sm text-purple-600">
                        <UserIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Message Bubble & Actions */}
                  <div
                    className={`flex flex-col max-w-[80%] ${
                      isMe ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-600">
                        {isMe ? "You" : user.name}
                      </span>
                      {isOrganizer && (
                        <span className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                          <Crown className="w-3 h-3" />
                          HOST
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">
                        {commentDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Reply Quote */}
                    {comment.replyTo && (
                      <div
                        onClick={() =>
                          handleScrollToReply(comment.replyTo?._id)
                        }
                        className={`mb-1 px-3 py-1.5 rounded-lg text-xs border-l-2 bg-white/50 border-purple-300 text-slate-500 w-full cursor-pointer hover:bg-white/80 transition-colors`}
                      >
                        <span className="font-bold mr-1">
                          {comment.replyTo.user
                            ? comment.replyTo.user.name
                            : "Deleted User"}
                          :
                        </span>
                        <span className="truncate block opacity-80">
                          {comment.replyTo.content}
                        </span>
                      </div>
                    )}

                    <div className="relative group">
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                          isMe
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : isOrganizer
                            ? "bg-amber-50 border border-amber-100 text-slate-800 rounded-tl-none"
                            : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                        }`}
                      >
                        {comment.content}
                      </div>

                      {/* Like Button */}
                      <button
                        onClick={() => handleLike(comment._id)}
                        className={`absolute -bottom-3 ${
                          isMe ? "-left-2" : "-right-2"
                        } bg-white rounded-full p-1 shadow-sm border border-slate-100 flex items-center gap-1 hover:scale-110 transition-transform ${
                          isLiked ? "text-red-500" : "text-slate-400"
                        }`}
                        disabled={!currentUserId}
                      >
                        <Heart
                          className={`w-3 h-3 ${isLiked ? "fill-current" : ""}`}
                        />
                        {(comment.likes?.length || 0) > 0 && (
                          <span className="text-[10px] font-bold px-1">
                            {comment.likes.length}
                          </span>
                        )}
                      </button>

                      {/* Hover Actions Container */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 ${
                          isMe ? "-left-20" : "-right-20"
                        } opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all bg-white/80 p-1 rounded-full shadow-sm backdrop-blur-sm`}
                      >
                        {/* Reply Action */}
                        <button
                          onClick={() => setReplyingTo(comment)}
                          className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors rounded-full hover:bg-blue-50"
                          title="Reply"
                        >
                          <Reply className="w-3.5 h-3.5" />
                        </button>

                        {/* Pin Action */}
                        {canPin && (
                          <button
                            onClick={() => handlePin(comment._id)}
                            className={`p-1.5 transition-colors rounded-full hover:bg-amber-50 ${
                              comment.isPinned
                                ? "text-amber-500 hover:text-amber-700"
                                : "text-slate-400 hover:text-amber-500"
                            }`}
                            title={
                              comment.isPinned ? "Unpin message" : "Pin message"
                            }
                          >
                            <Pin
                              className={`w-3.5 h-3.5 ${
                                comment.isPinned ? "fill-current" : ""
                              }`}
                            />
                          </button>
                        )}

                        {/* Delete Action */}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(comment._id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                            title="Delete message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Indicator */}
      {replyingTo && (
        <div className="px-4 py-2 bg-slate-50 border-t border-purple-50 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-600 overflow-hidden">
            <Reply className="w-4 h-4 text-purple-500 flip-x" />
            <span className="font-semibold">
              Replying to {replyingTo.user.name}
            </span>
            <span className="text-slate-400 truncate max-w-[200px] text-xs">
              "{replyingTo.content}"
            </span>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-purple-50">
        {currentUserId ? (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                replyingTo
                  ? `Reply to ${replyingTo.user.name}...`
                  : "Type your message..."
              }
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              disabled={isSending}
              autoFocus
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <div className="text-center py-2 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-sm">
            Please{" "}
            <a
              href="/login"
              className="text-purple-600 font-semibold hover:underline"
            >
              log in
            </a>{" "}
            to join the chat.
          </div>
        )}
      </div>
    </div>
  );
}
