"use client";

import { useConfig } from "@/lib/config";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import Link from "next/link";

export function Login({Lang}) {
    const { nextDomain, nextAdmin } = useConfig();
    const redirectIfAuthenticated = `${nextDomain}${nextAdmin}/dashboard`;
    const { login, user } = useAuth({ // اضافه کردن user
        middleware: "guest",
        guard: "admin",
        redirectIfAuthenticated,
    });

    let [formData, setFormData] = useState({ mobile: "", password: "" });
    let [errors, setErrors] = useState({});
    let [status, setStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login({ ...formData, setErrors, setStatus });
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

    // console.log(user); // نمایش user در کنسول

    return (
        <>
            <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-center">
                {Lang("public.login")}
            </h2>
            <form
                onSubmit={handleSubmit}
                className="intro-x mt-8"
                style={{ filter: status == "loading" && "blur(1px)" }}
            >
                <div className="intro-x mt-2 text-xl font-bold text-green-500 text-center ">
                    {status == "success" && Lang("public.welcome") + "!"}
                </div>
                {renderInput("mobile")}
                {renderInput("password", "password")}
                <div className="intro-x flex text-gray-700 dark:text-gray-600 text-xs sm:text-sm mt-4 justify-between items-center">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            type="checkbox"
                            className="form-check-input border ml-2"
                        />
                        <label
                            className="cursor-pointer select-none"
                            htmlFor="remember-me"
                        >
                            {Lang("public.remember_me")}
                        </label>
                    </div>
                    <div className="flex items-center">
                        <Link
                            href={`${nextAdmin}/register`}
                            className="text-blue-900 border-b hover:text-blue-700"
                        >
                            {Lang("public.register")}
                        </Link>
                    </div>
                </div>

                <div className="intro-x mt-5 xl:mt-8 text-left xl:text-left flex justify-between items-center">
                    <button
                        type="submit"
                        className="btn btn-primary py-3 px-4 w-full xl:w-32 align-top"
                    >
                        {Lang("public.login")}
                        {status == "loading" && (
                            <span
                                dangerouslySetInnerHTML={{ __html: loading }}
                            ></span>
                        )}
                    </button>
                    <Link
                        href={`${nextAdmin}/login-with-code`}
                        className="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top"
                    >
                        {Lang("public.login_with_code")}
                    </Link>
                </div>
            </form>
        </>
    );
}

const loading =
    '<svg id="a-loading" style="display: inline-block; margin: 0 6px" width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(255, 250, 250)"><circle cx="15" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="60" cy="15" r="9" fill-opacity="0.3"><animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate></circle></svg>';
