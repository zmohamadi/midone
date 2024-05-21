'use client'

import { usePathname, useRouter } from "next/navigation";

export const utility = {
    addScriptFile: (name, path, callback=null)=>{
        var script = document.createElement( "script" )
        script.type = "text/javascript"; script.id = name; script.src = path;
        if(callback)
            if(script.readyState) {  // only required for IE <9
                script.onreadystatechange = function() {
                if ( script.readyState === "loaded" || script.readyState === "complete" ) {
                    script.onreadystatechange = null;
                    callback();
                }
                };
            } else {  //Others
                script.onload = function() {
                callback();
                };
            }
        
        typeof window != "undefined" && window?.document.getElementById(name) == undefined && window?.document.head.appendChild(script);
                
    },

    addCSSFile: (name, path)=>{
        var cssFile = typeof window != "undefined" ? window?.document.createElement('link'): "";
        cssFile.id = name;
        cssFile.setAttribute("rel", "stylesheet");
        cssFile.setAttribute("href", path);
        typeof window != "undefined" && window?.document.getElementById(name) == undefined && window?.document.head.appendChild(cssFile);
    },
    
    reloadPage: (router, pathname)=>{
        let search = typeof window != "undefined" && window?.document.location.search.replace("?", "");
        let serachParams = search.split("&");
        let items = [], itemArr = [];

        serachParams.forEach((item)=>{
            itemArr = item.split("=");
            if(itemArr.length > 1)
                items[itemArr[0]] = itemArr[1];
        });
        items['pload'] = Math.random() * 1000;
        serachParams = [];
        Object.keys(items).forEach((key)=> serachParams.push(key+"="+items[key]));
        let newSearch = serachParams.join("&");
        let newUrl = pathname + "?" + newSearch;
        router.push(newUrl);
    }
}

export const useUtility = (router = null, pathname = null)=>{
    if(router == null) router = useRouter();
    if(pathname == null) pathname = usePathname();
    
    return {
        addCSSFile: utility.addCSSFile,
        addScriptFile: utility.addScriptFile,
        reload: ()=>utility.reloadPage(router, pathname),
    }
}
