'use client'

import { useLang } from "@/lib";

export function Box({ title, className, children, cols, shadow }) {
    let {dir} = useLang();
    const boxContent  = <>
        <div className={'intro-y box px-1 sm:px-5 mt-5 ' + (className?.indexOf("bg-theme") > 0? className : "")}>
            {
                title? <div className='flex items-center p-5 border-b border-gray-200 dark:border-dark-5'>
                            <h2 className={'font-medium text-base ' + (dir=="ltr"? "mr-auto": "ml-auto") }>
                                {title}
                            </h2>
                        </div>: ''
            }
            <div className={'py-5 px-4 sm:px-5 grid gap-4 '+(cols?cols:"grid-cols-12")}>
                {children}
            </div>
        </div>
    </>

    return <>
                <div className={"intro-y p-1 "
                    // + (className?.indexOf("bg-theme") > 0 || shadow === false ? "":" report-box-2 ") 
                    + (className?className:'col-span-12')}>
                    {boxContent}
                </div>
            </>              
}

/**
 * 
 */