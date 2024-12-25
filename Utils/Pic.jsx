'use client'

import React, { useState } from 'react';
import Image from 'next/image';

const Pic = ({ src, defaultImg, style = {}, classImg, width = 100, height = 100 }) => {
    const [imgSrc, setImgSrc] = useState(src);

    const handleError = () => {
        setImgSrc(defaultImg);
    };

    style.objectFit = "contain";  // استایل object-fit برای تصویر

    return (
        <Image
            src={imgSrc}
            style={style}
            className={classImg || ""}
            width={width} 
            height={height} 
            sizes="(max-width: 100px) 100vw, (max-width: 120px) 50vw, 33vw"
            loading='lazy'
            onError={handleError}
            alt="image"
        />
    );
};

// class PicOld extends Component{
//     constructor(props){
//         super(props);
//     }
//     render(){
//         let {src, defaultImg, style,classImg} = this.props;

//         var image = new Image();
//         image.src = src;

//         if (image.width == 0){
//             return <img src={defaultImg} className={classImg} style={style} />;
//         } else {
//             return <img src={src} className={classImg} style={style} />;
//         }
//     }
// }
export {Pic};
