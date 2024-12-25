"use client";

import {useFormElement} from './Element';
import {useEffect, useState} from 'react';

export function DateTimePicker(props){
    let {refItem, inputClassName, className, options, name, disabled} = props;

    let Element = useFormElement(props);
    let {id, label, helpDiv, divError, requiredDiv, defaultValue, rand} = Element.init();

    let [state, setState] = useState({
        value: defaultValue,
    });

    useEffect(()=>{
        setState({...state, value: defaultValue});
    }, [refItem[0].state.info])


    return (
        <div className={className?className:" mb-3 col-span-12 md:col-span-6 "} >
            <label htmlFor={id} className="form-label font-bold">{label} {requiredDiv}</label>
            <input 
                className = {inputClassName ? inputClassName+" form-control " : " form-control "}
                id = {id}
                name = {name}
                ref={Element.createRef(refItem)}
                key = {'input-'+rand}
                type = {"datetime-local"}
                data-type = {"datetime-local"}
                placeholder="yyyy/mm/dd"
                defaultValue = {state.value}
                disabled = {disabled==true?true:false}
                onChange={function(e){
                    state.value = e.target.value;
                }}
                {...options}
            />
            {helpDiv}
            {divError}
        </div>
    );
}
