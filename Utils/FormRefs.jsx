'use client'

import {useRef, useState} from 'react';

export const useFormRefs = (otherItems={})=>{
    let component = {};
    [component.state, component.setState] = useState({
            refs: useRef([]),
            errors: {},
            info: {},
            ...otherItems
        });
    return component;
}

