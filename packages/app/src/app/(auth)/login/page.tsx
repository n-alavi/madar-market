"use client";

import { useLogin } from "@/app/lib/auth";
import { extractErrorMessages } from "@/app/lib/function";
import { SigninFormData, signinSchema } from "@/app/lib/validation/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type FormData = {
    phoneNumber: string;
    password: string;
};

export default function LoginPage() {

    const router = useRouter();
    // const login = useLogin();

    const {
        register,
        setError,
        clearErrors,
        handleSubmit,
        formState: { errors }
    } = useForm<SigninFormData>({
        resolver: yupResolver(signinSchema),
        mode: 'onChange'
    });

    const onSubmit = (data: SigninFormData) => {
        // login.mutate({
        //     phoneNumber: data.phoneNumber,
        // }, {
        //     onSuccess: (response) => {
        //         // Redirect to OTP verification or next step
        //         router.push('/verify-otp');
        //     },
        //     onError: (err) => {
        //         const { fieldErrors, generalMessage } = extractErrorMessages<FormData>(err);
        //         if (fieldErrors.length > 0) {
        //             fieldErrors.forEach(({ field, message }) => {
        //                 setError(field, { type: "server", message });
        //             });
        //         }
        //         if (generalMessage) {
        //             setError('root', {
        //                 type: 'server',
        //                 message: generalMessage
        //             });
        //         }
        //     }
        // });
        console.log('Form data:', data);
    };

    return (
        <div className="w-full space-y-6">
            {/* Logo */}
            <div className="flex justify-center mt-8">
                <Image
                    src="/ssets/logo.svg"
                    alt="مادر مارکت"
                    width={100}
                    height={100}
                    priority
                />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-medium text-right text-[#514F4D]">ورود</h2>
            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Phone Number Input */}
                <div>
                    <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-[#787471] mb-4"
                    >
                        شماره موبایل خود را وارد کنید
                    </label>
                    <input
                        id="phoneNumber"
                        type="tel"
                        autoComplete="tel"
                        maxLength={11}
                        className="relative block w-full px-2 py-3 border border-[#EDEDED] placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF6A29] focus:border-transparent transition-all"
                        placeholder="09123456789"
                        dir="ltr"
                        {...register('phoneNumber')}
                    />
                    {errors.phoneNumber && (
                        <p className="mt-2 text-sm text-red-600 text-right">
                            {errors.phoneNumber.message}
                        </p>
                    )}
                </div>

                {/* General Error Message */}
                {errors.root && (
                    <div className="text-sm text-red-600 text-right bg-red-50 p-3 rounded-lg">
                        {errors.root.message}
                    </div>
                )}

                {/* Login Button */}
                <div>
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-[#FF6A29] transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                    >
                        ادامه
                    </button>
                </div>

            </form>

            {/* Bottom Image */}
            <div className="flex justify-center mt-20">
                <Image
                    src="/ssets/login-image.svg"
                    alt="Login Illustration"
                    width={286}
                    height={204}
                    className="w-full max-w-xs h-auto"
                    priority
                />
            </div>
        </div>
    );
}

