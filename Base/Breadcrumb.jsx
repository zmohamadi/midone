import { useRouter, usePathname } from 'next/navigation';
import * as Icon from 'react-feather';
import Link from "next/link";
import { Fragment } from "react";

export const Breadcrumb = () => {
    const router = useRouter();
    const pathname = usePathname();
    let pathArray = pathname.split("/"), lastpath = "";
    let breadcrumbArray = [];

    pathArray.forEach(element => {
        if(element != "") {
            lastpath += "/"+element;
            breadcrumbArray.push({label: element, path: lastpath})
        }
    });

    return <div className="text-sm">
        {
            breadcrumbArray.map((item, index)=> {
                return (index < breadcrumbArray.length -1 )?<Fragment key={index}>
                    <Link href={item.path}> {item.label} </Link> <Icon.ChevronRight className="inline-block" size='16' />
                </Fragment>:<Fragment key={index}>
                    {item.label}
                </Fragment>
            })
        }
    </div>
}