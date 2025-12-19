"use client";

import React, { useState } from "react";
import { IKUpload, ImageKitProvider } from "imagekitio-next";
import { Loader2, Image as ImageIcon } from "lucide-react";

interface ImageKitUploadProps {
    onSuccess: (res: { url: string; fileId: string }) => void;
    defaultImage?: string;
    aspectRatio?: "aspect-video" | "aspect-square";
}

export default function ImageKitUpload({
    onSuccess,
    defaultImage,
    aspectRatio = "aspect-video",
}: ImageKitUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(defaultImage || null);
    const [error, setError] = useState<string | null>(null);

    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    const authenticator = async () => {
        try {
            const response = await fetch("/api/auth/imagekit");

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `Request failed with status ${response.status}: ${errorText}`
                );
            }

            const data = await response.json();
            const { signature, expire, token } = data;
            return { signature, expire, token };
        } catch (error: any) {
            console.error("Authentication request failed:", error);
            throw new Error(`Authentication request failed: ${error.message}`);
        }
    };

    const onError = (err: any) => {
        console.error("Upload Error:", err);
        setError("Upload failed. Please try again.");
        setUploading(false);
    };

    const onSuccessHandler = (res: any) => {
        console.log("Upload Success:", res);
        setUploading(false);
        setPreview(res.url);
        onSuccess({ url: res.url, fileId: res.fileId });
        setError(null);
    };

    const onUploadStart = () => {
        setUploading(true);
        setError(null);
    };

    const validateFile = (file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            // 5MB limit
            setError("File size should be less than 5MB");
            return false;
        }
        return true;
    };

    return (
        <ImageKitProvider
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            authenticator={authenticator}
        >
            <div className="space-y-4">
                <div className="relative border-2 border-dashed border-purple-200 rounded-xl bg-purple-50/50 p-6 transition-all hover:bg-purple-50 hover:border-purple-300 group">
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        {!preview && !uploading && (
                            <>
                                <div className="bg-white p-3 rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                    <ImageIcon className="w-6 h-6 text-purple-600" />
                                </div>
                                <p className="text-sm font-medium text-slate-700">
                                    Click or Drag to Upload
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    JPG, PNG, WEBP up to 5MB
                                </p>
                            </>
                        )}
                    </div>

                    <IKUpload
                        fileName="event-cover"
                        onError={onError}
                        onSuccess={onSuccessHandler}
                        onUploadStart={onUploadStart}
                        validateFile={validateFile}
                        className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${uploading ? "pointer-events-none" : ""
                            }`}
                    />

                    {uploading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl">
                            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-2" />
                            <p className="text-sm font-medium text-purple-700">
                                Uploading...
                            </p>
                        </div>
                    )}

                    {preview && !uploading && (
                        <div className={`relative ${aspectRatio} w-full overflow-hidden rounded-lg shadow-md`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                                    Click to Change
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                        <svg
                            className="w-4 h-4 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        {error}
                    </div>
                )}
            </div>
        </ImageKitProvider>
    );
}
