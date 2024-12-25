import Link from "next/link";
import { Fragment, useEffect, useState, useMemo } from "react";
import { useLang } from "@/lib/lang"
import { useConfig } from "@/lib/config"
import { usePathname } from 'next/navigation';
import * as Icon from 'react-feather';

export const Breadcrumb = () => {
    const pathname = usePathname();
    let pathArray = pathname.split("/"), lastpath = "";
    let {dir, Lang} = useLang();
    let {laraDomain, laraAdmin} = useConfig();
    let [fetchInfo, useFetchInfo] = useState({});
    let [breadcrumbItems, setBreadcrumbItems] = useState({});

    const processNumber = (element, index) => {
        let num = element?.match(/\d+/)?.[0];        
        if (num?.toString().length == element.length){
            fetchInfo[pathArray[index-1]] = element;
        }
    }

    const getBreadInfo = () => {
        if(Object.keys(fetchInfo).length > 0){
            fetch(`${laraDomain+laraAdmin}/breadcrumb`, {
                method: 'POST', 
                body: JSON.stringify(fetchInfo),
                headers: {
                    'Content-type': 'application/json',
                },
            }).then((response) => {
                if (response.ok) {
                  return response.json();
                }
                throw new Error('Something went wrong');
            })
            .then((data) => {
                Object.keys(data?.info).map((key)=>{
                    breadcrumbItems.map((item, index)=>{
                        if(item.label == key){
                            breadcrumbItems[index + 1]['label'] = data?.info[key];
                        }
                    })
                });
                setBreadcrumbItems(breadcrumbItems);
            })
            .catch((error) => {
                //console.log(error)
            });
            
        }
    }
    
    breadcrumbItems = useMemo(()=>{
        let Items = [];
        pathArray.forEach((element, i) => {
            if(element != "") {
                lastpath += "/" + element;
                processNumber(element, i);
                Items.push({label: element, path: lastpath})
            }
        });
        return Items;
    }, [pathname]);

    useEffect(() => getBreadInfo(), [fetchInfo]);

    // console.log("fetchInfo:", fetchInfo, "breadcrumbItems:", breadcrumbItems);

    return <div className="text-sm">
        {
            breadcrumbItems.map((item, index)=> {
                return (index < breadcrumbItems.length -1 )
                    ?<Fragment key={index}>
                        <Link href={item?.path}> {Lang("public."+item.label)} </Link> 
                        {dir == "ltr"?<Icon.ChevronRight className="inline-block" size='16' />: <Icon.ChevronLeft className="inline-block" size='16' />}
                    </Fragment>
                    :<Fragment key={index}>
                        {Lang("public."+item.label)}
                    </Fragment>
            })
        }
    </div>
}