"use client"

export const config = {
    host: ()=>{
        return process.env.NEXT_PUBLIC_BACKEND_URL;
    },
    front: ()=>{
        return process.env.NEXT_PUBLIC_FRONT_URL;
    },
    mastership: ()=>{
        return process.env.NEXT_PUBLIC_MASTERSHIP_NEXT_URL;
    },
    // admin: ()=>{
    //     return process.env.NEXT_PUBLIC_MASTERSHIP_NEXT_URL;
    // },
    lUrl: ()=>{
        return process.env.NEXT_PUBLIC_MASTERSHIP_LARA_URL;
    },
    nextsadmin: ()=>{
        return process.env.NEXT_PUBLIC_sadmin_NEXT_URL;
    },
    larasadmin: ()=>{
        return process.env.NEXT_PUBLIC_sadmin_LARA_URL;
    },
    laraProfile: () => {
        return process.env.NEXT_PUBLIC_PROFILE_LARA_URL;
    },
    nextProfile: () => {
        return process.env.NEXT_PUBLIC_PROFILE_NEXT_URL;
    },
    assets: () => {
        return process.env.NEXT_PUBLIC_SITE_ASSETS_URL;
    },
    assetsProfile: () => {
        return process.env.NEXT_PUBLIC_PROFILE_ASSETS_URL;
    },
    media: () => {
        return process.env.NEXT_PUBLIC_MEDIA_URL;
    },
    defaultLogo: () => {
        return process.env.NEXT_PUBLIC_DIR_LOGO;
    },
    adminMenuType: () => {
        return typeof window !== 'undefined' && window?.localStorage.getItem("adminMenuType");        
    },
}

export const useConfig = ()=>{
    let local = typeof window !== 'undefined' && window?.location?.href.split("/")[4];
    return {
        laraDomain: config.host(),
        laraAdmin: config.lUrl(),
        larasadmin: config.larasadmin(),
        laraProfile: config.laraProfile(),

        nextDomain: config.front(),
        nextAdmin: config.mastership(),
        nextsadmin: config.nextsadmin(),
        nextProfile: config.nextProfile()+"/"+local,

        mediaPath: config.media(),
        assetsPath: config.assets(),
        assetsProfile: config.assetsProfile(),
        defaultLogo: config.defaultLogo(),

        adminMenuType: config.adminMenuType(),
    }
}