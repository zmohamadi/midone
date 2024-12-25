'use client'

import React, {Component} from 'react';
// import axios from 'axios';
// import {Data} from 'sanegar-react-theme/dist/Saba';
import {Lang} from './../index';
// import {Tools} from './../index';



class Modal extends Component {
    constructor(props){
        super(props);
        this.state ={
            id: (props.id != undefined)?props.id:'exampleModal',
            maxHeight: 200
        };
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount(){
        // let {id} = this.state;
        // window.$('#'+id+'Content').on('show.bs.modal', function(e) {
        //     var t = window.$(e.relatedTarget).data('whatever'),
        //         a = window.$(this);
        //     a.find('.modal-title').text('پیام جدید به ' + t), a.find('.modal-body input').val(t)
        // });

        let winHeight = window.$(window).height();
        let topMargin = window.$('.modal-dialog').css('marginTop');
        // let topMargin = 30;
        let maxHeight = winHeight - (2 * parseInt(topMargin));
        this.setState({maxHeight});
        // window.$('.modal-body').scrollbar();
    }

    componentDidUpdate(){
        // console.log(window.$('.modal-body'));
        if((window.$('.modal-body')).length > 0)
            window.$('.modal-body')
            .css('max-height', (this.state.maxHeight-50)+'px')
            .css('overflow-y', 'hidden !important')
            .scrollbar();
    }

    render(){
        let {id, maxHeight} = this.state;
        let {style, title, className, display, hideModal} = this.props;

        return(<React.Fragment>
                    <div className={'modal'} key={Math.random()*1000} style={{display:display?'block':'none'}} id={id} tabIndex='-1' role='dialog' aria-hidden='true' >
                        <div className={'modal-dialog '+className} role='document' style={style}>
                            <div className='modal-content scrollbar-outer' style={{zIndex:1060}}>
                                <div className='modal-header' >
                                    <h5 className='modal-title' id={id+'Label'}> {Lang('public.'+title)} </h5>
                                    <button type='button' className='close' data-dismiss='modal' aria-label='Close' onClick={hideModal}>
                                        <span aria-hidden='true'>&times;</span>
                                    </button>
                                </div>
                                <div className='modal-body scrollbar-light overflowHidden' style={{maxHeight: (maxHeight-50)}}>
                                    {this.props.children}
                                    <div style={{clear: 'both'}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='modal shadow' onClick={hideModal} style={{display:display?'block':'none', backgroundColor:'#111', opacity:'0.65', zIndex:1040}}></div>
                </React.Fragment>
            );
    }
}

export {Modal};
