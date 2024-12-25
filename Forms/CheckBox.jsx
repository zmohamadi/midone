'use client';

import {useFormElement} from './Element';
import {useState, useEffect} from 'react';

export function CheckBox(props){
    let {name, value, className, onChange, refItem} = props;
    if(value == undefined) value = 1;
    let Element = useFormElement(props);
    let {id, rand, label, defaultValue, helpDiv, divError, requiredDiv} = Element.init();

    let [state, setState] = useState({
        value: defaultValue,
    });
    
    useEffect(()=>{
        setState({...state, value: defaultValue});
    }, [refItem[0].state.info])    

    return (<div className={className?className:' mt-3'}> <label>{label}</label>
        <div className='flex flex-col mt-2'>
            <div className='form-check mr-2 mt-2 sm:mt-0'> 
                <input id={id} 
                    className='form-check-input' 
                    type='checkbox'
                    data-type='checkbox'
                    defaultChecked={state.value==1?true:false}
                    key={'checkbox-'+rand}
                    ref={Element.createRef(refItem)}
                    value={value?value:1}
                    onFocus = {()=>Element.removeError()}
                    onChange={function(e){
                        state.value = e.target.checked?value:0;
                        onChange && onChange(state.value);
                    }}
                /> 
                <label className='form-check-label' htmlFor={id} >
                    {name}
                    {requiredDiv}
                </label>
            </div>
            <div className='d-block'>
                {helpDiv}
                {divError}
            </div>
        </div>
    </div>
    );
}