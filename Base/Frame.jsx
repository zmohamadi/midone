'use client'

import { useLang } from "@/lib/lang"
import { Breadcrumb } from "./Breadcrumb";

export function Frame({ title, children, breadcrumb=true}) {
    const {dir} = useLang();
    
    return <>
            <div className='intro-y flex items-center mt-8'>
                <h2 className={'text-lg font-medium ' + (dir == "ltr"?"mr-auto":"ml-auto")}>
                    {title}
                   {(breadcrumb)? <Breadcrumb /> : ""}
                </h2>
            </div>
            <div className='grid grid-cols-12 gap-6 mt-5'>
                {children}
            </div>
        </>           
}