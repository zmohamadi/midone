'use client';

import dynamic from "next/dynamic";
const CKEditorBase = dynamic(() => import('./CkeditorBase').then((mod) => mod.CKEditor), {ssr: false});

export const CKEditor = (props)=>{    

    return <>
        <CKEditorBase {...props} />
    </>
}
