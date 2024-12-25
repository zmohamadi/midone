'use client';
// docs: https://www.cssscript.com/single-multiple-select-tail/
import { useLang } from '@/lib';
import { Tools } from '../Utils/Tools';
import { useFormElement } from './Element';
import { useEffect, useState } from 'react';

const SelectTail = (props)=>{      

    let {refItem, multiple, className, disabled, data, valueKey, titleKey, children, onChange, search} = props;

    let Element = useFormElement(props);
    let {id, rand, label, helpDiv, divError, requiredDiv, placeholder, defaultValue} = Element.init();
    
    if(!titleKey) titleKey = 'title';
    if(!valueKey) valueKey = 'id';

    const {Lang} = useLang();
    
    let [state, setState] = useState({
        value: defaultValue,
        instance: null,
    });

    const createSelect = () => {
        return window?.tail?.select('#'+id, {
        // tail('#'+id, {
            animate: true,              // [0.3.0]      Boolean
            classNames: className,           // [0.2.0]      Boolean, String, Array, null
            csvOutput: false,           // [0.3.4]      Boolean
            csvSeparator: ',',          // [0.3.4]      String
            descriptions: true,        // [0.3.0]      Boolean
            deselect: false,            // [0.3.0]      Boolean
            disabled: disabled,            // [0.5.0]      Boolean
            height: 350,                // [0.2.0]      Integer, null
            hideDisabled: false,        // [0.3.0]      Boolean
            hideSelected: false,        // [0.3.0]      Boolean
            items: {},                  // [0.3.0]      Object
            locale: 'fa',               // [0.5.0]      String
            linguisticRules: {          // [0.5.9]      Object
                'е': 'ё',
                'a': 'ä',
                'o': 'ö',
                'u': 'ü',
                'ss': 'ß'
            },
            multiple: multiple,         // [0.2.0]      Boolean
            multiLimit: 10,             // [0.3.0]      Integer, Infinity
            multiPinSelected: true,     // [0.5.0]      Boolean
            multiContainer: true,       // [0.3.0]      Boolean, String
            multiShowCount: true,       // [0.3.0]      Boolean
            multiShowLimit: false,      // [0.5.0]      Boolean
            multiSelectAll: true,       // [0.4.0]      Boolean
            multiSelectGroup: true,     // [0.4.0]      Boolean
            openAbove: false,            // [0.3.0]      Boolean, null
            // placeholder: placeholder?placeholder:'انتخاب گزینه',   // [0.2.0]      String, null
            search: search?search:true,               // [0.3.0]      Boolean
            searchConfig: [             // [0.5.13]     Array
                'text', 'value'
            ],
            searchFocus: true,          // [0.3.0]      Boolean
            searchMarked: true,         // [0.3.0]      Boolean
            searchMinLength: 1,         // [0.5.13]     Integer
            searchDisabled: true,       // [0.5.5]      Boolean
            sortItems: false,           // [0.3.0]      String, Function, false
            sortGroups: false,          // [0.3.0]      String, Function, false
            sourceBind: false,          // [0.5.0]      Boolean
            sourceHide: true,           // [0.5.0]      Boolean
            startOpen: false,           // [0.3.0]      Boolean
            stayOpen: false,            // [0.3.0]      Boolean
            width: null,                // [0.2.0]      Integer, String, null
            // cbComplete: ()=>console.log('cbLoopComplete'),      // [0.5.0]      Function
            // cbEmpty: undefined,         // [0.5.0]      Function
            // cbLoopItem: ()=>console.log('cbLoopItem'),      // [0.4.0]      Function
            // cbLoopGroup: ()=>console.log('cbLoopGroup'),      // [0.4.0]      Function
        }).on('change', (e) => {
            // const mySelectField = document.querySelector('#'+id);
        });;

    }

    useEffect(()=>{        
        window?.$('#'+id).on('change', function(item, state){
            Element.removeError(rand);
            if(typeof onChange == 'function')
                onChange(item.currentTarget);
        });
        setState({...state, instance: createSelect()});
    }, []);

    useEffect(()=>{        
        state.instance?.config('disabled', disabled);
    }, [disabled])

    useEffect(()=>{
        state.value = defaultValue;
        window?.$('#'+id+'').val(defaultValue);        
        state.instance?.reload();
        if(defaultValue != "")
            Element.removeError();
    }, [defaultValue])

    useEffect(function(){
        state.value && window?.$('#'+id+'').val(state.value);
        state.instance?.reload();
        if(state.value && state.value != "")
            Element.removeError();
    }, [data, children])
    
    return(
        <div className={className?className+' mb-3':' mb-3 col-span-12 md:col-span-6'} >
            <label htmlFor={id} className='form-label font-bold'>{label} {requiredDiv}</label>
            {/* <select
                id = {id}
                ref={Element.createRef(refItem)}
                className='tail-select w-full'
                tabIndex='-1'
                multiple={Boolean(multiple)}
            >
                { !Boolean(multiple) && (placeholder !== false) && <option key={-1} value="" >{Lang('public.select_option')}</option>}
                { children }
                {
                    Tools.getArray(data).map((item, key)=><option key={key} value={item[valueKey]}>{item[titleKey]}</option>)
                }
            </select> */}
             <select
                id={id}
                ref={Element.createRef(refItem)}
                className='tail-select w-full'
                tabIndex='-1'
                multiple={multiple} // یا !!multiple
            >
                {!multiple && (placeholder !== false) && <option key={-1} value="">{Lang('public.select_option')}</option>}
                {children}
                {Tools.getArray(data).map((item, key) => (
                    <option key={key} value={item[valueKey]}>
                        {item[titleKey]}
                    </option>
                ))}
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

export {SelectTail};
