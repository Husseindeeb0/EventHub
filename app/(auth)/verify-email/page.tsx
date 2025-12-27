"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useVerifyEmailMutation } from "@/redux/features/auth/authApi";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams?.get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const [verifyEmail] = useVerifyEmailMutation();

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const code = otp.join("");
    if (code.length !== 6 || !initialEmail) return;

    setStatus("loading");

    try {
      await verifyEmail({ email: initialEmail, code }).unwrap();
      setStatus("success");
    } catch (error: any) {
      setStatus("error");
      setMessage(error.data?.message || "Verification failed");
    }
  };

  // Auto-submit when all fields are filled
  useEffect(() => {
    if (
      otp.every((digit) => digit !== "") &&
      status === "idle" &&
      initialEmail
    ) {
      handleVerify();
    }
  }, [otp]);

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verified!</h2>
        <p className="text-gray-600 mb-6">
          Your email has been successfully verified.
        </p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Verify Email</h1>
        <p className="text-gray-500 mt-2">
          Enter the 6-digit code sent to{" "}
          {initialEmail ? <b>{initialEmail}</b> : "your email"}
        </p>
      </div>

      <form onSubmit={handleVerify}>
        <div className="flex justify-center gap-2 mb-6">
          {otp.map((data, index) => (
            <input
              className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              type="text"
              name="otp"
              maxLength={1}
              key={index}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center justify-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            {message}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={status === "loading" || otp.some((d) => d === "")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Code"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
