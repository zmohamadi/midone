'use client'

import { useLang } from "@/lib/lang"
import { Breadcrumb } from "./Breadcrumb";

export function Frame({ title, children, breadcrumb=true, cols = 12}) {
    const {dir} = useLang();
    
    return <>
            <div className='intro-y flex flex-col items-center mt-8'>
                <h2 className={'text-xl font-header ' + (dir == "ltr"?"mr-auto":"ml-auto")}>
                    {title}
                </h2>
                <div className={(dir == "ltr"?"mr-auto":"ml-auto")}>
                    {(breadcrumb)? <Breadcrumb /> : ""}
                </div>
            </div>
            <div className={'grid gap-6 mt-5 '+(cols=="12"?"grid-cols-12":"grid-cols-10")}>
                {children}
            </div>
        </>           
}