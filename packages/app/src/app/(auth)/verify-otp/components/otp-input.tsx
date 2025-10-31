"use client";

import { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";

interface OTPInputProps {
    length?: number;
    onComplete: (otp: string) => void;
    error?: string;
}

export default function OTPInput({ length = 4, onComplete, error }: OTPInputProps) {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        // Take only the last character if multiple are entered
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Call onComplete if all fields are filled
        const otpString = newOtp.join("");
        if (otpString.length === length) {
            onComplete(otpString);
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace if current is empty
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").slice(0, length);
        
        // Only process if pasted data contains only numbers
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split("").forEach((char, index) => {
            if (index < length) {
                newOtp[index] = char;
            }
        });
        setOtp(newOtp);

        // Focus on the next empty input or the last one
        const nextIndex = Math.min(pastedData.length, length - 1);
        inputRefs.current[nextIndex]?.focus();

        // Call onComplete if all fields are filled
        if (pastedData.length === length) {
            onComplete(pastedData);
        }
    };

    return (
        <div className="w-full">
            <div className="flex gap-2 justify-center" dir="ltr">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => {
                            inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className={`w-20 h-12 text-center text-lg font-semibold border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            error
                                ? "border-red-500 focus:ring-red-500"
                                : "border-[#EDEDED] focus:ring-[#FF6A29] focus:border-transparent"
                        }`}
                    />
                ))}
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
            )}
        </div>
    );
}

