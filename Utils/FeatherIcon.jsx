'use client'

import * as Icon from 'react-feather';
import Link from 'next/link';
import { useEffect } from 'react';

export const FeatherIcon = ({name, onClick, url, iconClassName, spanWrapperClass, tooltip, color, size, access = true, displayIf = true}) => {
    // Exit early if displayIf is false
    if (!access || !displayIf) return null;

    const ICONname = Icon[name];
    const options = {
        color: color, 
        size: size,
        className: (iconClassName ? iconClassName : ''),
    };

    // Change icon size in mobile if icon has mobile-resize-icon className
    useEffect(() => {
        setTimeout(() => {
            $('.mobile-resize-icon').attr('width', '18');
            $('.mobile-resize-icon').attr('height', '18');
        }, 100);
    }, []);

    const ICON = <ICONname {...options} />;
    let IconWrapper = '';

    if (url) {
        IconWrapper = <Link className={spanWrapperClass} href={url}>{ICON}</Link>;
    } else {
        IconWrapper = <span className={spanWrapperClass} onClick={onClick} style={{ cursor: 'pointer' }}>{ICON}</span>;
    }
    
    if (tooltip) {
        return (
            <span className='simple-tooltip mr-1'>
                {IconWrapper}
                <span className='tooltiptext'>{tooltip}</span>
            </span>
        );
    } else {
        return IconWrapper;
    }
};
