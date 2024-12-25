'use client';

import {useFormElement} from './Element';
import {useState, useEffect} from 'react';
import { useLang } from '@/lib/lang';

export function Radio(props){
    let {refItem, className, data, onChange, type, valueKey, titleKey, onClick} = props;
    let Element = useFormElement(props);
    let {id, label, helpDiv, divError, requiredDiv, defaultValue} = Element.init();
    const {Lang} = useLang();

    if(!titleKey) titleKey = 'title';
    if(!valueKey) valueKey = 'id';

    let [state, setState] = useState({
        iconStyle: {position: 'absolute', top: '1rem', left: '1rem', cursor: 'pointer'},
        currentType: '',
        value: defaultValue,
    });    

    useEffect(()=>{
        let { defaultValue } = Element.init();
        state.value = defaultValue;
    }, [refItem[0].state.info]);

    const changeValue = (e) => {
        let val = window.document.querySelector('input[name="'+id+'"]:checked').value;
        setState({...state, value: val});
        onClick && onClick(e);
    }
    
    return(<div className={className?className:' col-span-12 md:col-span-6 mb-3'}>
                <label htmlFor={id} className='form-label font-bold'>
                    {label}
                    {requiredDiv}
                </label>
                <div className={'mb-4 pr-5 '+(type == "col" ?"flex flex-col sm:flex-row mt-2" : "")}>
                    {
                        data?.map((item, index)=>
                            <div className={'form-check ml-2 mb-2'} key={index}>
                                {
                                    <input
                                        key={index}
                                        name={id}
                                        type='radio'
                                        data-type='radio'
                                        id={id+index}
                                        ref={Element.createRef(refItem)}
                                        value={item[valueKey]}
                                        defaultChecked={state?.value == item[valueKey]}
                                        onFocus = {()=>Element.removeError()}
                                        onChange={onChange}
                                        onClick={changeValue}
                                        className={'form-check-input'}
                                    />
                                }
                                <label className={'form-check-label'} htmlFor={id+index}>
                                    {Lang('public.'+item[titleKey])} 
                                    {/* + {item[valueKey]} */}
                                </label>
                            </div>
                        )
                    }
                </div>
                <div className='mb-2'>
                    {helpDiv}
                    {divError}
                </div>
            </div>
        );
}