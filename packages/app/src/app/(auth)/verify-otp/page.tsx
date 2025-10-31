"use client";

import { useEffect, useState } from "react";
import { generateOTPCode } from "@/app/lib/function";
import { useRouter, useSearchParams } from "next/navigation";
import OTPInput from "@/app/(auth)/verify-otp/components/otp-input";

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const phoneNumber = searchParams.get("phone");

    const [generatedOTP, setGeneratedOTP] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [timeLeft, setTimeLeft] = useState<number>(120); // 2 minutes
    const [canResend, setCanResend] = useState<boolean>(false);

    // Generate OTP on component mount
    useEffect(() => {
        if (!phoneNumber) {
            router.push("/login");
            return;
        }
        const otp = generateOTPCode();
        setGeneratedOTP(otp);
        console.log("Generated OTP:", otp); // For development - shows the code
    }, [phoneNumber, router]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleOTPComplete = (otp: string) => {
        setError("");

        // Verify the OTP
        if (otp === generatedOTP) {
            // Success! Redirect to dashboard or home
            console.log("OTP verified successfully!");
            // Here you would typically call an API to verify and login
            // router.push("/");
            alert("کد با موفقیت تایید شد!");
        } else {
            setError("کد وارد شده صحیح نمی‌باشد");
        }
    };

    const handleResendOTP = () => {
        if (!canResend) return;

        // Generate new OTP
        const newOTP = generateOTPCode();
        setGeneratedOTP(newOTP);
        console.log("New Generated OTP:", newOTP);

        // Reset timer
        setTimeLeft(120);
        setCanResend(false);
        setError("");
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const formatPhoneNumber = (phone: string): string => {
        if (phone.length === 11) {
            return phone;
        }
        return phone;
    };

    return (
        <>
            <button
                onClick={() => router.push("/login")}
                className="text-sm cursor-pointer"
            >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3333 9.33337L18.6666 16L13.3333 22.6667" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            <hr className="text-[#EAE8E8]" />
            {/* Title */}
            <div className="space-y-2">
                <h2 className="text-2xl font-medium text-right text-[#514F4D]">
                    ورود
                </h2>
                <p className="text-sm text-[#787471] text-right">
                    کد 6 رقمی به شماره {phoneNumber && formatPhoneNumber(phoneNumber)} ارسال شد
                </p>
            </div>

            {/* Development: Show generated OTP */}
            {generatedOTP && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-[#787471] mb-2">کد تولید شده (فقط برای تست):</p>
                    <p className="text-2xl font-bold text-[#FF6A29] tracking-widest" dir="ltr">
                        {generatedOTP}
                    </p>
                </div>
            )}

            {/* OTP Input */}
            <div className="py-4">
                <OTPInput onComplete={handleOTPComplete} error={error} />
            </div>

            {/* Timer and Resend */}
            <div className="text-center space-y-4">
                <div className="flex justify-between items-center gap-2">

                    <div className="text-sm text-[#787471]">
                        {canResend ? (
                            <button
                                onClick={handleResendOTP}
                                className=" flex items-center gap-1 text-[#C4C2C0] font-medium hover:underline cursor-pointer"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.3333 10.0001C18.3333 14.6001 14.6 18.3334 9.99996 18.3334C5.39996 18.3334 1.66663 14.6001 1.66663 10.0001C1.66663 5.40008 5.39996 1.66675 9.99996 1.66675C14.6 1.66675 18.3333 5.40008 18.3333 10.0001Z" stroke="#C4C2C0" strokeLinecap="round" stroke-linejoin="round" />
                                    <path d="M13.0917 12.6501L10.5083 11.1084C10.0583 10.8418 9.69165 10.2001 9.69165 9.67509V6.25842" stroke="#C4C2C0" strokeLinecap="round" stroke-linejoin="round" />
                                </svg>
                                ارسال مجدد کد
                            </button>
                        ) : (
                            <span>
                                دریافت مجدد کد{" "}
                                <span className="w-[59px] h-[32px] border border-[#EDEDED] bg-[#FAFAFA] rounded-md px-2 py-1 font-medium text-[#FF6A29]" dir="ltr">
                                    {formatTime(timeLeft)}
                                </span>
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => router.push('/login')}
                            className="flex items-center gap-1 text-lg text-[#787471] cursor-pointer"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.16663 1.66675H7.49996C3.33329 1.66675 1.66663 3.33341 1.66663 7.50008V12.5001C1.66663 16.6667 3.33329 18.3334 7.49996 18.3334H12.5C16.6666 18.3334 18.3333 16.6667 18.3333 12.5001V10.8334" stroke="#787471" strokeLinecap="round" stroke-linejoin="round" />
                                <path d="M13.3666 2.51676L6.79996 9.08342C6.54996 9.33342 6.29996 9.82509 6.24996 10.1834L5.89163 12.6918C5.75829 13.6001 6.39996 14.2334 7.30829 14.1084L9.81663 13.7501C10.1666 13.7001 10.6583 13.4501 10.9166 13.2001L17.4833 6.63342C18.6166 5.50009 19.15 4.18342 17.4833 2.51676C15.8166 0.850089 14.5 1.38342 13.3666 2.51676Z" stroke="#787471" stroke-miterlimit="10" strokeLinecap="round" stroke-linejoin="round" />
                                <path d="M12.425 3.45837C12.9833 5.45004 14.5417 7.00837 16.5417 7.57504" stroke="#787471" stroke-miterlimit="10" strokeLinecap="round" stroke-linejoin="round" />
                            </svg>

                            ویرایش شماره
                        </button>
                    </div>
                </div>


            </div>
        </>
    );
}

