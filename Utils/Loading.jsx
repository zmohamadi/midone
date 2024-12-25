'use client'

import { useLang } from "@/lib/lang";
import { loadingIcons } from "@/lib/icons";

export const Loading = ({ className = "", displayText = undefined, displayIcon = loadingIcons.circles }) => {
    const { Lang } = useLang();
    if (displayText == undefined) displayText = Lang("public.grid_loading");

    return (
        <div className="col-span-12 xxl:col-span-9">
            <div
                className={
                    "col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-center items-center mt-5 p-4 bg-white/60 backdrop-blur-md rounded-lg shadow-md " +
                    className
                }
            >
                <div className="text-blue-500">{displayIcon}</div>
                <div className="text-center text-xs mt-2 text-blue-500" style={{color:"rgb(0, 0, 139)"}}>{displayText}</div>
            </div>
        </div>
    );
};

// صوت : audio
// توپ مثلثی : ballTriangle
// خطی : bars
// دایره : circles
// گرید : grid
// قلب : hearts
// دایره : oval
// پاف : puff
// رینگ : rings
// دایره چرخان : spinningCircles
// چرخش مار : tailSpin
// سه نقطه : threeDots
