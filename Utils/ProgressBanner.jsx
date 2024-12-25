'use client'

import React, {Component} from 'react';


export class ProgressBanner extends Component {
    constructor(props){
        super(props);
        this.state ={
            items: props.items!=undefined? props.items:[],
        }


    }

    componentWillReceiveProps(props){
        this.setState({
            items: props.items!=undefined? props.items:[],
        });
    }

    render(){

        let {items} = this.state;

        // console.log(items);
        return(<div className='card mb-4 progress-banner'>
                         <div className='card-body justify-content-between d-flex flex-row align-items-center'>
                             <div>
                                <i className='flaticon-print mr-2 text-white align-text-bottom d-inline-block'></i>
                                 <div>
                                     <p className='lead text-white'> <span className='numberltr'>10 </span> test</p>
                                 <p className='text-small text-white'>test
                                     </p>
                                 </div>
                             </div>

                             <div>
                                <div role='progressbar' className='progress-bar-circle progress-bar-banner position-relative' data-color='white' data-trail-color='rgba(255,255,255,0.2)' aria-valuenow='10' aria-valuemax='20' data-show-percent='false'>
                                </div>
                             </div>
                         </div>
                    </div>)

        // {items.map((item, index)=>{
        //     return(<div className='card mb-4 progress-banner'>
        //                 <div className='card-body justify-content-between d-flex flex-row align-items-center'>
        //                     <div>
        //                         <i className='flaticon-print mr-2 text-white align-text-bottom d-inline-block'></i>
        //                         <div>
        //                             <p className='lead text-white'> <span className='numberltr'>{item.count} </span> {item.label}</p>
        //                             <p className='text-small text-white'>{item.sublabel}
        //                             </p>
        //                         </div>
        //                     </div>

        //                     <div>
        //                         <div role='progressbar' className='progress-bar-circle progress-bar-banner position-relative' data-color='white' data-trail-color='rgba(255,255,255,0.2)' aria-valuenow={item.count} aria-valuemax={item.Maxcount} data-show-percent='false'>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>)
        // }
        // )}
}
}
