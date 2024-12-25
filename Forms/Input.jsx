"use client";

import { FeatherIcon } from '../Utils';
import { Tools } from '../Utils/Tools';
import { useFormElement } from './Element';
import { useState, useEffect } from 'react';

export function Input(props) {
    let { refItem, className, inputClassName, type, options, disabled, name, value, checked, max, min, maxlength, dir, onEnter,note } = props;
    // value used for checkbox or radio value
    let Element = useFormElement(props);
    let { id, rand, label, helpDiv, divError, requiredDiv, placeholder, defaultValue } = Element.init();

    let [state, setState] = useState({
        currentType: type || "text",
        key: 'input-' + rand,
        value: defaultValue,
    });

    useEffect(() => {
        setState(prevState => ({ ...prevState, key: 'input-' + rand, value: defaultValue }));
    }, [defaultValue]);
    
    const showHidePassword = () => {
        setState(prevState => ({
            ...prevState,
            currentType: prevState.currentType == "password" ? "text" : "password"
        }));
    };

    let keyUp = () => {}, dataType = '';

    if (type == 'currency' || type == "price") {
        const currencyKeyUpHandler = (e) => e.target.value = Tools.getAsCurrency(e.target.value);
        type = "text";
        dataType = 'currency';
        keyUp = currencyKeyUpHandler;
        if (state.value) {
            state.value = Tools.getAsCurrency(state.value);
        }
    } else if (options && options.onKeyUp) {
        keyUp = options.onKeyUp;
        delete options.onKeyUp;
    }
    if (type == "number" || type == "mobile") {
        const numberKeyDownHandler = (e) => {
            // لیست کلیدهای مجاز
            const allowedKeys = [
                "Backspace",
                "Tab",
                "ArrowLeft",
                "ArrowRight",
                "Delete",
                "Home",
                "End",
                "Enter",
            ];
    
            // بررسی اعداد انگلیسی و فارسی
            const englishNumbers = e.key >= "0" && e.key <= "9";
            const persianNumbers = e.key >= "۰" && e.key <= "۹";
    
            // اجازه ورود فقط اعداد و کلیدهای ضروری
            if (!allowedKeys.includes(e.key) && !englishNumbers && !persianNumbers) {
                e.preventDefault();
            }
        };
    
        keyUp = keyUp || (() => {}); // اگر keyUp مقدار پیش‌فرض دارد حفظ شود
        options = {
            ...(options || {}),
            onKeyDown: numberKeyDownHandler,
        };
    }
    
    

    const handleChange = (e) => {
        const newValue = e.target.value;
        setState(prevState => ({ ...prevState, value: newValue }));
    };

    if(type == "hidden"){
        return <input
                    id={id}
                    name={name}
                    ref={Element.createRef(refItem)}
                    key={state.key}
                    type="hidden"
                    defaultValue={state.value}
                    onChange={function(e){
                        state.value = e.target.value;
                    }}
                />
    }

    return (
        <div className={className || "mb-3 col-span-12 md:col-span-6"}>
            <label htmlFor={id} className="form-label font-bold">{label} {requiredDiv}</label>
            <input
                dir = {dir || 'rtl'}
                className={inputClassName ? inputClassName + " form-control" : "form-control"}
                id={id}
                name={name}
                ref={Element.createRef(refItem)}
                key={state.key}
                type={state.currentType}
                data-type={dataType}
                value = {value}
                defaultValue = {state.value}
                placeholder={placeholder}
                disabled={!!disabled}
                max={max || maxlength}
                min={min}
                onKeyUp={keyUp}
                onFocus={() => Element.removeError()}
                onChange={handleChange} 
                onKeyDown={(e) => {
                    if(onEnter && (e.code == "Enter" || e.code == "NumpadEnter")){
                        onEnter(e);
                    }
                }}
                checked={checked}
                {...options}
            />
            {type == "password" && (
                <FeatherIcon 
                    name={state.currentType == "password" ? "Eye" : "EyeOff"} 
                    spanWrapperClass="show-password relative top-1/2 left-1 float-left transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-gray-800" 
                    onClick={showHidePassword} 
                /> 
            )}
            {helpDiv}
            {divError}
            {note ? <small id={id + "-note"} className="form-text text-muted">{note}</small> : ""}
        </div>
            
    );
}
