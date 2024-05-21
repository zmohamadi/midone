"use client";

import {Tools} from '../Utils/Tools';
import {useFormElement} from './Element';
import {useState, useEffect} from 'react';

export function Input(props){
    let {refItem, className, inputClassName, type, options, disabled, name, value, checked, max, min, maxlength} = props;

    let Element = useFormElement(props);
    let {id, rand, label, helpDiv, divError, requiredDiv, placeholder, defaultValue} = Element.init();

    let [state, setState] = useState({
        iconStyle: {position: "absolute", top: "1rem", left: "1rem", cursor: "pointer"},
        currentType: "",
        value: defaultValue,
    });
    
    useEffect(()=>{
        setState({...state, value: defaultValue});
    }, [refItem[0].state.info])
    
    const showHidePassword = (e) => {
        $(e.target).toggleClass("fa-eye fa-eye-slash");
        if(state.currentType === "password"){
            setState({currentType : "text"});
        }else{
            setState({currentType : "password"});
        }
    };

    let keyUp = ()=>{}, dataType = '', {currentType, iconStyle} = state;

    if(type == 'currency' || type == "price"){
        const currencyKeyUpHandler = (e) => e.target.value = Tools.getAsCurrency(e.target.value);
        type = "text";
        dataType = 'currency';
        keyUp = currencyKeyUpHandler;
        if(state.value)
            state.value = Tools.getAsCurrency(state.value);
    }
    else{
        if(options && options.onKeyUp){
            keyUp = options.OnKeyUp;
            delete options.OnKeyUp;
        }
    }

    if(type=="hidden"){
        return (
            <input
                id={id}
                ref={Element.createRef(refItem)}
                type={type}
                defaultValue={state.value}
                value={props.value}
                onChange={function(e){
                    state.value = e.target.value;
                }}
            />
        )
    }

    return (
        <div className={className?className:" mb-3 col-span-6"} >
            <label htmlFor={id} className="form-label font-bold">{label} {requiredDiv}</label>
            <input 
                className = {inputClassName ? inputClassName+" form-control " : " form-control "}
                id = {id}
                name = {name}
                ref={Element.createRef(refItem)}
                key = {'input-'+rand}
                type = {type == "password"? currentType:(type?type:"text")}
                data-type = {dataType}
                value = {value}
                defaultValue = {state.value}
                placeholder = {placeholder}
                disabled = {disabled==true?true:false}
                max = {max || maxlength}
                min = {min}
                onKeyUp = {keyUp}
                onFocus = {()=>Element.removeError()}
                onChange={function(e){
                    state.value = e.target.value;
                }}
                checked = {checked}
                {...options}
               />
            <i className={ type =='password' ? 'glyph-icon far fa-eye': 'none'} style={iconStyle} onClick={showHidePassword}></i>
            {helpDiv}
            {divError}
        </div>
    );
}
