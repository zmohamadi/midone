'use client';

import React from 'react';
import {useFormElement} from './Element';
import {useState, useEffect} from 'react';


const Textarea = (props)=>{
    let {refItem, className, options, disabled, row} = props;
    let Element = useFormElement(props);
    let {id, rand, label, helpDiv, divError, requiredDiv, placeholder, defaultValue} = Element.init();

    let [state, setState] = useState({
        value: defaultValue,
    });

    useEffect(()=>{
        let { defaultValue } = Element.init();
        setState({...state, value: defaultValue});
    }, [refItem[0].state.info])

    if (!row) row = 5;
    return(
        <div className={className?className:' mb-3 col-span-12 md:col-span-6'} >
            <label htmlFor={id} className='form-label font-bold'>{label} {requiredDiv}</label>
            <textarea
                id = {id}
                ref={Element.createRef(refItem)}
                key={'textarea-'+rand}
                placeholder = {placeholder}
                defaultValue = {state.value}                
                rows = {row}
                className = 'form-control'
                disabled = {disabled?true:false}
                onFocus = {()=>Element.removeError()}
                onChange={function(e){
                    state.value = e.target.value;
                }}
                {...options}>
            </textarea>
            {helpDiv}
            {divError}
        </div>
    );
}

export {Textarea};
