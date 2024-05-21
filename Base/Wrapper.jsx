'use client'

import { useConfig } from "@/lib/config";

export function Wrapper({ Menu, children}) {
    let {adminMenuType} = useConfig();
    
    return <>
            {adminMenuType == "top"? Menu : "" }
            <div className={"wrapper " + (adminMenuType == "top"? "wrapper--top-nav" : "")} id="wrapper">
                <div className="wrapper-box">
                    {adminMenuType != "top"? Menu : "" }
                    <div className="content">
                        {children}
                    </div>
                </div>
            </div>
        </>           
}