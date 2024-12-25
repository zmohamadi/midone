
'use client'

import { useMemo } from "react";

export function TabList({children, active, href, title, items = []}){
    const errorCount = useMemo(()=>{
        let count = 0;
        let [component, elements] = items;
        elements?.map(elem => {
            if(elem.slice(-1) == "*"){
                elem = elem.replace("*", "");
                for (let key in component?.state?.errors) {
                    if (key.lastIndexOf(elem,0) === 0) {
                        count++;
                        continue;
                    }
                }
            }else{
                component?.state?.errors && component?.state?.errors[elem] && count++;
            }
        });
        return count;
    }, [items])
    return(
        <>
            
            <a  title={title} 
                data-toggle="tab" 
                data-target={"#"+href} 
                href="#" 
                className={active?'tooltip w-full sm:w-40 py-4 text-center flex justify-center items-center active':
                'tooltip w-full sm:w-40 py-4 text-center flex justify-center items-center'}              
                id="content-tab" role="tab" aria-controls="content" 
                aria-selected="true">
            {children || title}
            {errorCount > 0 && <span className="py-0 px-2 mx-2 rounded-full text-xs bg-theme-22 text-white cursor-pointer font-medium"> {errorCount} </span>}
        </a>

        </>
    );
}
