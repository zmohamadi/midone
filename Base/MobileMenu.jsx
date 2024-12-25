'use client'

import { useLang } from '@/lib';
import {useConfig} from '@/lib/config';
import Link from 'next/link';
import { useEffect } from 'react';
import * as Icon from 'react-feather';

export function MobileMenu({prefix, menus}){
    const {nextDomain, laraDomain} = useConfig();
    const {dir, Lang} = useLang();

    useEffect(()=>{
        runMenu();
    }, [])

    const runMenu = async () => {
        const cash = (await import('cash-dom')).default;
        const Velocity = (await import('velocity-animate')).default;

        // Mobile Menu
        if(cash("#mobile-menu-toggler").data('click') == "fn") 
            return;
        cash("#mobile-menu-toggler").data('click', 'fn');

        const toggleMobile = ()=>{
            if (cash(".mobile-menu").find("ul").first()[0].offsetParent !== null) {
                Velocity(cash(".mobile-menu").find("ul").first(), "slideUp");
            } else {
                Velocity(cash(".mobile-menu").find("ul").first(), "slideDown");
            }
        }

        cash("#mobile-menu-toggler").on("click", toggleMobile);

        cash(".mobile-menu")
            .find(".menu")
            .on("click", function () {
                if (cash(this).parent().find("ul").length) {
                    if (
                        cash(this).parent().find("ul").first()[0].offsetParent !==
                        null
                    ) {
                        cash(this)
                            .find(".menu__sub-icon")
                            .removeClass("transform rotate-180");
                        Velocity(
                            cash(this).parent().find("ul").first(),
                            "slideUp",
                            {
                                duration: 300,
                                complete: function (el) {
                                    cash(this).removeClass("menu__sub-open");
                                },
                            }
                        );
                    } else {
                        cash(this)
                            .find(".menu__sub-icon")
                            .addClass("transform rotate-180");
                        Velocity(
                            cash(this).parent().find("ul").first(),
                            "slideDown",
                            {
                                duration: 300,
                                complete: function (el) {
                                    cash(this).addClass("menu__sub-open");
                                },
                            }
                        );
                    }
                }
                if(this.href.indexOf("#") == -1){
                    toggleMobile();
                }
            });
    }

    return (
        <div className='mobile-menu md:hidden'>
            <div className='mobile-menu-bar'>
                <a href='#' onClick={(e)=>e.preventDefault() } className={'flex '+(dir == "ltr"?"mr-auto":"ml-auto")}>
                    <img alt='Icewall Tailwind HTML Admin Template' style={{maxHeight:"40px"}} className='w-full' src={laraDomain+'/media/logo/light-logo.png'} />
                    <span className='text-white text-lg mr-3 adjust '><b>  </b></span>
                </a>
                <a href='#' onClick={(e)=>e.preventDefault() } id='mobile-menu-toggler'> 
                    {/* <i dataFeather='bar-chart-2' className='w-8 h-8 text-white transform-rotate-90'></i> */}
                    <Icon.BarChart2 color='#FFF' />
                </a>
            </div>
            <ul className='border-t border-theme-2 py-5 hidden'>
                {
                    menus.map((item, index)=>{
                        let ICN = Icon[item.icon];
                        if(item.childs?.length > 0)
                            return (<li key={index}>
                                        <a href='#' onClick={(e)=>e.preventDefault() } className={item.open?'menu menu--open': 'menu'}>
                                            <div className='menu__icon'>
                                                <ICN className="px-auto inline" size='18' />
                                            </div>
                                            <div className='menu__title'>
                                                {Lang('public.'+item.title)}
                                                <div className='side-menu__sub-icon transform rotate-180'>
                                                    <Icon.ChevronUp size='16' style={{margin: '10px'}} />
                                                </div>
                                            </div>
                                        </a>
                                        <ul className={item.open?'menu__sub-open': ''}>
                                            {item.childs.map((child, index)=>{
                                                let CICN = Icon[child.icon];
                                                return <li key={index}>
                                                    <Link href={nextDomain+prefix+child.href} className='menu'>
                                                        <div className='menu__icon'>
                                                            <CICN className="px-auto inline" size='16' />
                                                        </div>
                                                        <div className='menu__title'> 
                                                            {Lang('public.'+child.title)}
                                                        </div>
                                                    </Link>
                                                </li>
                                            })}
                                        </ul>
                                    </li>);
                        else{
                            return <li key={index}>
                                        <Link href={nextDomain+prefix+item.href} className='menu menu--active'>
                                            <div className='menu__icon'>  <ICN className="px-auto inline" size='18' /> </div>
                                            <div className='menu__title'> {Lang('public.'+item.title)} </div>
                                        </Link>
                                    </li>
                        }
                    })
                }
            </ul>
        </div>
    );
}