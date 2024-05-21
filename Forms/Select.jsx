'use client';

import {useEffect, useState} from 'react';
import {Tools} from '../Utils/Tools';
import {useFormElement} from './Element';
// import tail from 'tail.select.js';

const Select = (props)=>{      

    let {refItem, multiple, className, disabled, data, valueKey, titleKey, children, onChange} = props;

    let Element = useFormElement(props);
    let {id, label, helpDiv, divError, requiredDiv, defaultValue} = Element.init();
    
    if(!titleKey) titleKey = 'title';
    if(!valueKey) valueKey = 'id';
    
    let [state, setState] = useState({
        value: defaultValue,
    });    

    return(
        <div className={className?className:' mb-3 col-span-6'} >
            <label htmlFor={id} className='form-label font-bold'>{label} {requiredDiv}</label>
            <select
                id = {id}
                ref={Element.createRef(refItem)}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 dark:bg-gray-700 dark:border-gray-600 w-full'
                disabled={(disabled == undefined)?false:true}
                onChange={(e)=>{state.value = e.target.value; onChange&&onChange(e)}}
                defaultValue={state?.value}
            >
                <option></option>
                { children }
                {
                    Tools.getArray(data).map((item, key)=><option key={key} value={item[valueKey]}>{item[titleKey]}</option>)
                }
            </select>
            <span>
                {helpDiv}
            </span>
            <span id={'error'}>
                {divError}
            </span>
        </div>
    );
}

export {Select};
