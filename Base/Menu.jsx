'use client'

import {config, useConfig} from '@/lib/config';
import tippy, { roundArrow } from "tippy.js";
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { useLang } from "@/lib/lang";
import Link from 'next/link';

export function Menu({prefix, menus})
{
    let { Lang } = useLang();
    let { adminMenuType } = useConfig();
    if ( adminMenuType == "" || !adminMenuType ) 
        adminMenuType = "side";
    let pathname = usePathname();
    let [ active, setActive ] = useState(-1);

    useEffect(()=>{
        initMenu();
    }, []);

    useEffect(()=>{
        getActiveMenu(pathname);
    }, [pathname]);

    const initMenu = async () => {
        const cash = (await import('cash-dom')).default;
        const Velocity = (await import('velocity-animate')).default;
        // Side Menu
        if(cash(".side-menu").data('click') == "fn") 
            return;
        cash(".side-menu").data('click', 'fn');
        cash(".side-menu").on("click", function () {
            if (cash(this).parent().find("ul").length) {
                if (
                    cash(this).parent().find("ul").first()[0].offsetParent !== null
                ) {
                    cash(this)
                        .find(".side-menu__sub-icon")
                        .removeClass("transform rotate-180");
                    cash(this).removeClass("side-menu--open");
                    Velocity(cash(this).parent().find("ul").first(), "slideUp", {
                        duration: 300,
                        complete: function (el) {
                            cash(el).removeClass("side-menu__sub-open");
                        },
                    });
                } else {
                    cash(this)
                        .find(".side-menu__sub-icon")
                        .addClass("transform rotate-180");
                    cash(this).addClass("side-menu--open");
                    Velocity(cash(this).parent().find("ul").first(), "slideDown", {
                        duration: 300,
                        complete: function (el) {
                            cash(el).addClass("side-menu__sub-open");
                        },
                    });
                }
            }
        });

        // Side menu tooltips
        let initTooltips = (function tooltips() {
            cash(".side-menu").each(function () {
                if (this._tippy == undefined) {
                    let content = cash(this)
                        .find(".side-menu__title")
                        .html()
                        .replace(/<[^>]*>?/gm, "")
                        .trim();
                    tippy(this, {
                        content: content,
                        arrow: roundArrow,
                        animation: "shift-away",
                        placement: "right",
                    });
                }

                if (
                    cash(window).width() <= 1260 ||
                    cash(this).closest(".side-nav").hasClass("side-nav--simple")
                ) {
                    this._tippy.enable();
                } else {
                    this._tippy.disable();
                }
            });

            return tooltips;
        })();

        window.addEventListener("resize", () => {
            initTooltips();
        });
    }

    const getActiveMenu = (pathname) => {
        let path;
        menus.map((menu, index) => {
            path = prefix + menu.href;
            // console.log("childs: ", menu.childs?.length);
            if(!menu.childs?.length) {
                if(pathname.lastIndexOf(path) == 0) 
                    setActive(index);
            }else{
                menu.childs?.map((child, cindex)=>{
                    path = prefix + child.href;
                    if(pathname.lastIndexOf(path) == 0){
                        setActive(`${index}-${cindex}`);
                    }
                });
            }
        })
    }

    return(
        <nav className={adminMenuType +'-nav'} key={adminMenuType +'-nav'}>
            <ul>
                {
                    menus.map((item, index)=>{
                        let ICN = Icon[item.icon];
                        if(item.childs?.length > 0)
                            return (<li key={index}>
                                        <a href='#' onClick={(e)=>e.preventDefault() } 
                                            className={adminMenuType+"-menu "+(item.open && adminMenuType+'-menu--open ')+" "+(active.toString().indexOf(index+"-") > -1  && adminMenuType+"-menu--active")}>
                                            <div className={adminMenuType+'-menu__icon'}> 
                                                <ICN className="px-auto inline" />
                                            </div>
                                            <div className={adminMenuType+'-menu__title'}>
                                                {Lang('public.'+item.title)} 
                                                <div className={adminMenuType+'-menu__sub-icon transform rotate-180'}>
                                                    {item.open?<Icon.ChevronDown width={16} height={16} />: <Icon.ChevronUp width={16} height={16} />}
                                                </div>
                                            </div> 
                                        </a>
                                        <ul className={item.open?adminMenuType+'-menu__sub-open ': ''}>
                                            {item.childs.map((child, cindex)=>{
                                                let CICN = Icon[child.icon];
                                                return <li key={cindex}>
                                                    <Link href={config.front()+prefix+child.href} 
                                                        onClick={()=>setActive(index+"-"+cindex)}
                                                        className={adminMenuType+'-menu '+(active == index+"-"+cindex && adminMenuType+"-menu--active")}>
                                                        <div className={adminMenuType+'-menu__icon'}>
                                                            <CICN className="px-auto inline" />
                                                        </div>
                                                        <div className={adminMenuType+'-menu__title'}> {Lang('public.'+child.title)} </div>
                                                    </Link>
                                                </li>
                                            })}
                                        </ul>
                                    </li>);
                        else{
                            return <li key={index}>
                                        <Link href={config.front()+prefix+item.href} 
                                            onClick={()=>setActive(index)}
                                            className={adminMenuType+'-menu '+(active == index && adminMenuType+"-menu--active")}>
                                            <div className={adminMenuType+'-menu__icon'}>
                                                <ICN className="px-auto inline" />
                                            </div>
                                            <div className={adminMenuType+'-menu__title'}> {Lang('public.'+item.title)} </div>
                                        </Link>
                                    </li>
                        }
                    })
                }
            </ul>
        </nav>
    );
}