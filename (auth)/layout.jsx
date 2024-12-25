"use client";

import { useConfig, useLang } from "@/lib";
import { loginPic } from "./loginSvg";

export default function Main({ children }) {
    const { Lang } = useLang();
    const { laraDomain } = useConfig();

    return (
        <><div className="login">

            <div className="container sm:px-10">
                <div className="block xl:grid grid-cols-2 gap-4">
                    <div className="hidden xl:flex flex-col min-h-screen">
                        <a href="" className="-intro-x flex items-center pt-5">
                            <img
                                alt="Icewall Tailwind HTML Admin Template"
                                className="w-6 ml-2"
                                src={laraDomain + "/admin/Midone-v3/Icewall_v1.0.9/dist/images/logo.svg"}
                            />
                            <span className="text-white text-lg ml-3 adjust">
                                {Lang("public.title_main")}
                                <span className="font-medium">{Lang("public.title_sub")}</span>
                            </span>
                        </a>
                        <div className="my-auto">
                            {loginPic}
                            <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10">
                                {Lang("public.text_main1")}
                                <br /> {Lang("public.text_main2")}
                            </div>
                        </div>
                    </div>
                    <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0 justify-center items-center">
                        <div className="my-auto mx-auto xl:mr-20 bg-white dark:bg-dark-1 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}
