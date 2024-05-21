'use client'

import {config, useConfig} from '@/lib/config';
// import {icons} from '@/lib/icons';
import Link from 'next/link';
import * as Icon from 'react-feather';
import { useLang } from "@/lib/lang";


export function Menu({prefix, menus})
{
    const {Lang} = useLang();
    let {adminMenuType} = useConfig();
    if(adminMenuType == "" || !adminMenuType) adminMenuType = "side";

    return(
        <nav className={adminMenuType +'-nav'} key={adminMenuType +'-nav'}>
            <ul>
                {
                    menus.map((item, index)=>{
                        let ICN = Icon[item.icon];
                        if(item.childs?.length > 0)
                            return (<li key={index}>
                                        <a href='#' className={adminMenuType+"-menu"+(item.open?adminMenuType+'-menu--open': '')}>
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
                                        <ul className={item.open?adminMenuType+'-menu__sub-open': ''}>
                                            {item.childs.map((child, index)=>{
                                                let CICN = Icon[child.icon];
                                                // console.log(child.icon);
                                                return <li key={index}>
                                                    <Link href={config.front()+prefix+child.href} className={adminMenuType+'-menu'}>
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
                                        <Link href={config.front()+prefix+item.href} className={adminMenuType+'-menu'}>
                                            <div className={adminMenuType+'-menu__icon'}>
                                                {/* {icons[item.icon]} */}
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