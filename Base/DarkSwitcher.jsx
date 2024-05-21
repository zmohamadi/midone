'use client'

import { useLang } from "@/lib";

export function DarkSwitcher(){
    const {dir, Lang} = useLang();
    const changeMode = ()=>{
        let cname = document.documentElement.className;
        if(cname == 'dark') 
            document.documentElement.className = 'light';
        else 
            document.documentElement.className = 'dark';
    };

    return (
        <div data-url='#mode-switcher' id='mode-switcher' onClick={changeMode} 
            className={'dark-mode-switcher cursor-pointer shadow-md fixed bottom-0 box dark:bg-dark-2 border rounded-full w-40 h-12 flex items-center justify-center z-50 mb-10 '+(dir == "ltr"? "right-0 mr-10":"left-0 ml-10")}>
            <div className={'text-gray-700 dark:text-gray-300 ' + (dir == "ltr"? "mr-4": "ml-4")}>{Lang("public.dark_mode")}</div>
            <div className='dark-mode-switcher__toggle border'></div>
        </div>
    );
}