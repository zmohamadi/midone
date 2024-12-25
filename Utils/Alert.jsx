'use client'

import React, {Component} from 'react';

class Alert extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let {text,className} = this.props;
        if(className == undefined) className = '';
        let id = 'layer-'+Math.round(Math.random()*10000);

        return(
            <div className={'alert alert-warning alert-dismissible fade show rounded mb-0 '+className} role='alert'>
                {text}
                <button type='button' className='close' data-dismiss='alert' aria-label='Close'>
                    <span aria-hidden='true'>×</span>
                </button>
            </div>
            // <div className={'card mb-4 '+className} id='contentFrame'>
            //     <div className='card-body'>
            //         <h5 className='card-title mb-4 lalezar'>
            //             {labelIcon?<i className={labelIcon+' label-icon'}></i>:''} {label}
            //             {min?<a className = {minIcon+' collapsed float-left'}
            //              data-toggle='collapse' href={'#'+id} role='button'
            //              aria-expanded='false' aria-controls={id}></a>:''}
            //         </h5>
            //         <div id={id} className='collapse show'>
            //             {
            //                 children
            //             }
            //         </div>
            //     </div>
            // </div>
        );
    }
}

export {Alert};
