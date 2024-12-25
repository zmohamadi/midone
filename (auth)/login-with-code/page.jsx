"use client";

import { useLang } from "@/lib/lang";
import { useConfig } from "@/lib/config";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function Main() {
    const { Lang } = useLang();
    const { nextDomain, nextAdmin, laraDomain, laraAdmin } = useConfig();
    const redirectIfAuthenticated = `${nextDomain}${nextAdmin}/dashboard`;
    
    const { loginWithCode } = useAuth({
        middleware: "guest",
        guard: "admin",
        redirectIfAuthenticated,
    });
    const { loginCheck } = useAuth({
        middleware: "guest",
        guard: "admin",
        redirectIfAuthenticated,
    });

    const [formData, setFormData] = useState({ mobile: "", code: "" });
    const [errors, setErrors] = useState({});
    const [timer, setTimer] = useState(120); // تنظیم تایمر به 5 ثانیه
    const [isTimerActive, setIsTimerActive] = useState(false); // تایمر باید ابتدا غیرفعال باشد
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSecondForm, setShowSecondForm] = useState(false); // وضعیت فرم دوم

    useEffect(() => {
        if (timer == 0) {
            setIsTimerActive(false); // غیرفعال کردن تایمر پس از پایان
            return;
        }

        if (isTimerActive) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [timer, isTimerActive]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        loginCheck({ ...formData, setErrors });
    };

    const handleResendCode = async () => {
        setIsSubmitting(true);
        try {
            const resendCodeUrl = `${laraDomain}${laraAdmin}/resend-code/${formData.mobile}`;
            await fetch(resendCodeUrl, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            // تنظیم مجدد تایمر
            setTimer(120);
            setIsTimerActive(true);
        } catch (err) {
            //console.error("Failed to resend code:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderInput = (name, type = "text") => (
        <>
            <input
                dir="rtl"
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="intro-x login__input form-control py-3 px-4 border-gray-300 block mt-4"
                placeholder={Lang(`public.${name}`)}
            />
            {errors?.[name] && (
                <div className="pristine-error text-theme-24 mt-2">
                    {errors?.[name]}
                </div>
            )}
        </>
    );

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    };

    const handleFirstFormSubmit = async (e) => {
        e.preventDefault();
    
        // Check if the mobile field is empty
        if (!formData.mobile) {
            setErrors({ mobile: Lang("public.mobile_required") });
            return;
        }
    
        // Clear any previous errors related to the mobile field
        setErrors({});
    
        try {
            // Attempt to send the request to Laravel
            const response = await axios.post(`${laraDomain}${laraAdmin}/login-with-code`, { mobile: formData.mobile });
            if(response?.status != 422){
                // If successful, show the second form and start the timer
                setShowSecondForm(true);
                setIsTimerActive(true);
                setTimer(120);  // Reset the timer to 120 seconds if needed
            }
    
        } catch (error) {
            // If a 422 error is returned, set the errors
            if (error.response?.status == 422) {
                setErrors(error.response?.data.errors);
            } else {
                // Re-throw unexpected errors to handle elsewhere if needed
                throw error;
            }
        }
    };
    
    

    return (
        <>
            <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-center">
                {Lang("public.login_with_code")}
            </h2>
            {/* فرم اول: وارد کردن شماره موبایل */}
            {!showSecondForm && (
                <form id="get-mobile" onSubmit={handleFirstFormSubmit} className="intro-x mt-8">
                    {renderInput("mobile")}
                    <div className="intro-x mt-5 xl:mt-8 text-left xl:text-left flex justify-between items-center">
                        <button
                            type="submit"
                            className="btn btn-primary py-3 px-4 w-full xl:w-32 align-top"
                            disabled={isSubmitting} // غیرفعال شدن دکمه هنگام ارسال درخواست
                        >
                            {Lang("public.send_confirm_code")}
                        </button>
                        <Link
                            href={`${nextAdmin}/login`}
                            className="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top"
                        >
                            {Lang("public.login_with_pass")}
                        </Link>
                    </div>
                    
                </form>
            )}

            {/* فرم دوم: وارد کردن کد تایید */}
            {showSecondForm && (
                <form id="get-code" onSubmit={handleSubmit}>
                    {renderInput("code")}
                    <div className="intro-x flex text-gray-700 dark:text-gray-600 text-xs sm:text-sm mt-4 justify-between items-center">
                        <div className="flex items-center">
                            {isTimerActive ? (
                                <span>{Lang("public.time_left")}: {formatTime(timer)}</span>
                            ) : (
                                <span>{Lang("public.code_expired")}</span>
                            )}
                        </div>
                        <div className="flex items-center">
                            <Link href={`${nextAdmin}/login`} className="text-blue-900 border-b hover:text-blue-700">
                                {Lang("public.login_with_pass")}
                            </Link>
                        </div>
                    </div>
                    <div className="intro-x mt-5 xl:mt-8 text-left xl:text-left flex justify-between items-center">
                        <button
                            type="submit"
                            className="btn btn-primary py-3 px-4 w-full xl:w-32 align-top"
                            disabled={isSubmitting} // غیرفعال شدن دکمه هنگام ارسال درخواست
                        >
                            {Lang("public.login")}
                        </button>
                        <button
                            onClick={handleResendCode}
                            className="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top"
                            disabled={isTimerActive || isSubmitting} // دکمه ارسال مجدد فقط وقتی فعال می‌شود که تایمر به پایان رسیده باشد
                        >
                            {Lang("public.resend_code")}
                        </button>
                    </div>
                    
                </form>
            )}

           
        </>
    );
}
