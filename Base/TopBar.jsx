'use client'

import { useLang } from '@/lib/lang';
import { config, useConfig } from '@/lib/config';
import * as Icon from 'react-feather';
import Link from 'next/link';

export function TopBar({setMenuType, logout, user, logo = "light-logo.png", side = "admin"}){
    const {nextAdmin, laraDomain, adminMenuType, nextDomain, nextProfile,mediaPath } = useConfig();
    const {dir, Lang, locale} = useLang();
    let prefix = nextAdmin;
    if(side == "profile") prefix = nextProfile;
    const changeMenu = ()=>{
        window?.localStorage.setItem("adminMenuType", adminMenuType == "top"?"side":"top");
        setMenuType(adminMenuType == "top"?"side":"top");
    }

    const changeMode = ()=>{
        let cname = document.documentElement.className;
        if(cname == 'dark') 
            document.documentElement.className = 'light';
        else 
            document.documentElement.className = 'dark';
    };
    
    return(
        <div className='top-bar-boxed border-b border-theme-2 -mt-7 md:-mt-5 -mx-3 sm:-mx-8 px-3 sm:px-8 md:pt-0 mb-12'>
            <div className='h-full flex items-center'>
                {/* BEGIN: Logo */}
                <a href='' className='-intro-x hidden md:flex' key={adminMenuType+"-logo"}>
                    <img alt='WIT' width="85px" className='w-13' src={mediaPath+'/logo/'+logo} />
                    <span className='text-white text-lg mr-3 adjust '><b> </b></span>
                </a>
                {/* END: Logo */}
                {/* BEGIN: Breadcrumb */}
                <div className={'-intro-x breadcrumb '+(dir == "ltr"? "mr-auto": "ml-auto")}> 
                    <a href=''> {Lang('public.management_system')} </a>
                    {dir == "ltr" ? <Icon.ChevronRight size='16' /> : <Icon.ChevronLeft size='16' />}
                    <a href='' className='breadcrumb--active'>{Lang('public.dashboard')}</a> 
                </div>
              
                <div className='intro-x dropdown w-8 h-8'>
                    <div className='dropdown-toggle w-12 h-12 rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110' role='button' aria-expanded='false'>
                        {
                            user?.pic ?
                            <img alt='AWA' src={mediaPath+'/users/'+user?.pic} />
                            :
                            <img alt='AWA' src={mediaPath+'/users/avatar.png'} />
                        }
                    </div>
                    <div className='dropdown-menu w-56'>
                        <div className='dropdown-menu__content box bg-theme-11 dark:bg-dark-6 text-white'>
                            <div className='p-4 border-b border-theme-12 dark:border-dark-3'>
                                <div className='font-medium'>{user?.name} {user?.lname}</div>
                                <div className='text-xs text-theme-13 mt-0.5 dark:text-gray-600'>{user?.email}</div>
                            </div>
                            <div className='p-2'>
                                <Link href={nextDomain+"/"+locale} 
                                    className='flex items-center p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md'>
                                        <Icon.User className={'w-4 h-4 ' +(dir == "ltr"? "mr-2": "mr-2")}/>
                                        {Lang('public.Home')} 
                                </Link>
                                <Link href={prefix+"/profile"} 
                                    className='flex items-center p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md'>
                                        <Icon.User className={'w-4 h-4 ' +(dir == "ltr"? "mr-2": "mr-2")}/>
                                        {Lang('public.profile')} 
                                </Link>
                                <Link href={prefix+"/change-password"} 
                                    className='flex items-center p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md'> 
                                    <Icon.Lock className={'w-4 h-4 ' +(dir == "ltr"? "mr-2": "mr-2")}/>
                                    {Lang('public.change_password')} 
                                </Link>
                                <span onClick={changeMenu}
                                    className='flex items-center p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md'> 
                                    <Icon.Menu className={'w-4 h-4 ' +(dir == "ltr"? "mr-2": "mr-2")}/>
                                    {adminMenuType == "top"? Lang('public.side-menu'): Lang('public.top-menu')} 
                                </span>
                                <span onClick={changeMode}
                                    className='flex items-center p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md'> 
                                    <Icon.Moon className={'w-4 h-4 ' +(dir == "ltr"? "mr-2": "mr-2")}/>
                                    {Lang('public.dark_mode')} 
                                </span>
                                
                            </div>
                            <div className='p-2 border-t border-theme-12 dark:border-dark-3'>
                                <a onClick={logout} className='flex items-center p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md'> 
                                    <Icon.ToggleRight className={'w-4 h-4 ' +(dir == "ltr"? "mr-2": "mr-2")}/>
                                     {Lang('public.logout')}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* END: Account Menu */}
            </div>
        </div>
    );
}