'use client'

import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import {Data, Lang, Access} from './../index';

/**
 * Icon Component
 * click:           onClick function
 * to:              The 'to' attribute of Link Component
 * materialIcon:    The Material Icon name
 * iconClass:       The 'i' class name used for icon
 * id:              The item id
 * displayIf:       The element display condition
 * style:           The 'a' tag css styles
 * iconStyle:       The icon css styles
 */
class Icon extends Component{
    constructor(props){
        super(props);

        this.state={
            prefix: '',
        }
        this.data = new Data();
        this.state.prefix = this.data.getSystemPrefix();

    }
    render(){

        let {click, url, message, to, materialIcon, iconClass, id, displayIf, style, iconStyle, title, prefix} = this.props;
        // console.log('this.state.prefix');
        let path = prefix!=undefined?prefix:this.state.prefix+to;
        // console.log(path);


        let icon = '';

        if(materialIcon != undefined)
            icon = <i className='material-icons' style={iconStyle}>{materialIcon}</i>;
        else if(iconClass != undefined)
            icon = <i className={iconClass} style={iconStyle}></i>;

        if(displayIf == undefined) displayIf = 'true';

        if(eval(displayIf) && (Access.check(to) || to == undefined))
            if(to != undefined)
                return (title!=undefined)?
                    <Link to={path} style={style} className={title!=undefined?'tooltip':''} alt={Lang('public.'+title)}> {icon} </Link>
                    :
                    <Link to={path} style={style} className={title!=undefined?'tooltip':''}> {icon} </Link>;
            else
                return <a style={{cursor:'pointer', ...style}} className={title!=undefined?'tooltip':''} alt={Lang('public.'+title)} onClick={click} data-url={url} data-id={id}  data-message={message==undefined?'':message} > {icon} </a>;
        else
            return <React.Fragment></React.Fragment>
    }
}

export {Icon};
