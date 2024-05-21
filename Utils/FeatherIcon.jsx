'use client'

import * as Icon from 'react-feather';
import Link from 'next/link';


export const FeatherIcon = ({name, onClick, url, iconClassName,spanWrapperClass, tooltip, color, size, access = true}) => {
    const ICONname = Icon[name];
    const options = {
        color: color, 
        size: size,
        className: (iconClassName?iconClassName:''),
        // className: 'mx-1 '+(iconClassName?iconClassName:''),
    }

    if(!access) return <></>;

    const ICON = <ICONname {...options} />
    let IconWrapper = '';

    if(url){
        IconWrapper = <Link href={url} > {ICON} </Link>;
    }else{
        IconWrapper = <span className={spanWrapperClass} onClick={onClick} style={{'cursor': 'pointer' }}> {ICON} </span>;
    }
    
    if(tooltip){
        return <>
            <span className='simple-tooltip mr-1'> {IconWrapper} 
                <span className='tooltiptext'>{tooltip}</span>
            </span>
        </>
    }else{
        return <> {IconWrapper} </>
    }
};
