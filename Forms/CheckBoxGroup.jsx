'use client';

import { useFormElement } from './Element';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/lang';

export function CheckBoxGroup(props) {
    let { refItem, className, data, onChange, valueKey, titleKey } = props;
    let Element = useFormElement(props);
    let { id, label, helpDiv, divError, requiredDiv, defaultValue } = Element.init();
    const { Lang } = useLang();

    if (!titleKey) titleKey = 'title';
    if (!valueKey) valueKey = 'id';

    let [selectedValues, setSelectedValues] = useState(new Set(defaultValue || []));

    useEffect(() => {
        const { defaultValue } = Element.init();
        setSelectedValues(new Set(defaultValue || []));
    }, [refItem[0].state.info]);

    const handleChange = (e, itemValue) => {
        const newSelectedValues = new Set(selectedValues);
        if (e.target.checked) {
            newSelectedValues.add(itemValue);
        } else {
            newSelectedValues.delete(itemValue);
        }
        setSelectedValues(newSelectedValues);
        // state.value = newSelectedValues;
        onChange && onChange(Array.from(newSelectedValues));
    };

    return (
        <div className={className ? className : 'col-span-12 md:col-span-6 mb-3'}>
            <label htmlFor={id} className='form-label font-bold'>
                {label}
                {requiredDiv}
            </label>
            <div className='mb-4 pr-5 flex flex-col mt-2'>
                {data?.map((item, index) => (
                    <div className='form-check ml-2 mb-2' key={index}>
                        <input
                            type='checkbox'
                            data-type='checkbox'
                            id={`${id}-${index}`}
                            // ref={Element.createRef(refItem)}
                            name={refItem[1]}
                            value={item[valueKey]}
                            checked={selectedValues.has(item[valueKey])}
                            onFocus={() => Element.removeError()}
                            onChange={(e) => handleChange(e, item[valueKey])}
                            className='form-check-input'
                            
                        />
                        <input id={id} 
                            type='hidden'
                            ref={Element.createRef(refItem)}
                            defaultValue={"["+[...selectedValues].join(',')+"]"}
                        />
                        <label className='form-check-label' htmlFor={`${id}-${index}`}>
                            {Lang('public.' + item[titleKey])}
                        </label>
                    </div>
                ))}
            </div>
            <div className='mb-2'>
                {helpDiv}
                {divError}
            </div>
        </div>
    );
}
