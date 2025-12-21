"use client";

import { useState } from "react";
import { useUpdateProfileMutation } from "@/redux/features/auth/authApi";
import { X, Loader2, Save, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import ImageKitUpload from "@/components/ImageKitUpload";

interface EditCoverFormProps {
    user: {
        coverImageUrl?: string;
        coverImageFileId?: string;
    };
    onClose: () => void;
}

export default function EditCoverForm({
    user,
    onClose,
}: EditCoverFormProps) {
    const [coverImageUrl, setCoverImageUrl] = useState(user.coverImageUrl || "");
    const [coverImageFileId, setCoverImageFileId] = useState(user.coverImageFileId || "");
    const [updateProfile, { isLoading, error }] = useUpdateProfileMutation();
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile({ coverImageUrl, coverImageFileId }).unwrap();
            setSuccessMessage("Cover photo updated!");
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err: any) {
            console.error("Failed to update cover photo:", {
                message: err?.message,
                data: err?.data,
                status: err?.status,
                fullError: err
            });
            // Try to set a readable error message for the user
            setSuccessMessage(err?.data?.message || err?.message || "Failed to update. Check console.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Edit Cover Photo</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <p className="block text-sm font-medium text-gray-700 mb-2">
                            Upload New Cover <span className="text-gray-400 font-normal">(Recommended size: 1200x400)</span>
                        </p>
                        <div className="aspect-[3/1] w-full relative group">
                            <ImageKitUpload
                                onSuccess={(res) => {
                                    setCoverImageUrl(res.url);
                                    setCoverImageFileId(res.fileId);
                                }}
                                defaultImage={coverImageUrl}
                                aspectRatio="aspect-video"
                            />
                            {coverImageUrl && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCoverImageUrl("");
                                        setCoverImageFileId("");
                                    }}
                                    className="absolute -bottom-8 right-0 text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Remove Cover
                                </button>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                            Failed to update cover photo. Please try again.
                        </div>
                    )}

                    {successMessage && (
                        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg">
                            {successMessage}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !!successMessage}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
