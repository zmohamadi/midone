"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/lang";
import Link from "next/link";
import { useConfig } from "@/lib";
import { useRouter, useSearchParams } from 'next/navigation';

export default function Main() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mobile = searchParams.get("mobile");
    const { Lang } = useLang();
    const { verify } = useAuth({ middleware: "guest", guard: "admin" });
    const { nextDomain,laraDomain,laraAdmin, nextAdmin } = useConfig();
    const [verifyCode, setCode] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await verify({ verifyCode,mobile, setErrors });
        } catch (err) {
            //console.error("Verification failed:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendCode = async () => {
        setIsSubmitting(true);
        try {
            // ارسال درخواست به روت لاراول برای ارسال مجدد کد
            const resendCodeUrl = `${laraDomain}${laraAdmin}/resend-code/${mobile}`;
            await fetch(resendCodeUrl, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            // تنظیم دوباره تایمر و فعال کردن دکمه ارسال کد تایید
            setTimeLeft(120);
            setIsSubmitting(false);
        } catch (err) {
            //console.error("Failed to resend code:", err);
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (timeLeft == 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime > 0) return prevTime - 1;
                clearInterval(timer);
                return 0;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    return (
        <>
            <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-center">
                {Lang("public.verify_account")}
            </h2>
            <div className="intro-x mt-8">
                <input
                    type="text"
                    onChange={(e) => setCode(e.target.value)}
                    value={verifyCode}
                    className="intro-x login__input form-control py-3 px-4 border-gray-300 block"
                    placeholder={Lang("public.confirm_code")}
                />
                {errors?.verifyCode && (
                    <div className="pristine-error text-theme-24 mt-2">
                        {errors?.verifyCode}
                    </div>
                )}
                <input
                    type="hidden"
                    name="mobile"
                    value={mobile || ""}
                    className="intro-x login__input form-control py-3 px-4 border-gray-300 block"
                    readOnly
                />
                
                <div className="intro-x mt-5 xl:mt-8 text-left xl:text-left flex justify-between gap-4 items-center">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || timeLeft == 0}
                        className={`btn btn-primary py-3 px-4 w-full xl:w-32 align-top ${isSubmitting || timeLeft == 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isSubmitting ? Lang("public.processing") : Lang("public.send_confirm_code")}
                    </button>
                    <button
                        onClick={handleResendCode}
                        disabled={isSubmitting || timeLeft > 0} // غیرفعال کردن دکمه در طول زمان تایمر
                        className={`btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top ${isSubmitting || timeLeft > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {Lang("public.resend_code")}
                    </button>
                </div>
                {timeLeft ? ( <div className="text-center mt-2 text-gray-600">
                            {Lang("public.time_left")} {timeLeft} {Lang("public.seconds")}
                        </div>
                        ) : (<div className="text-center mt-2 text-gray-600">
                                {Lang("public.code_expired")}
                            </div>
                        )}
            </div>
        </>
    );
}
