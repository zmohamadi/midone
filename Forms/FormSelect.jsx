'use client';

import React from 'react';
import {useFormElement} from './Element';

export class FormSelect extends Element {
    constructor(props) {
        super(props);
    }
    render() {
        let {className, selected, start, end, defaultValue} = this.props;
        let result = [];
        for(let i=start; i<=end; i++){
            result.push(<option value={i}>{i}</option>);
        }
        if (typeof defaultValue != 'number' && typeof defaultValue != 'string' && defaultValue != undefined && defaultValue.length > 0) {
            let temp = [];
            // console.log(defaultValue);
            defaultValue.map((item) => {
                temp.push(item.id);
            });
            defaultValue = temp;
        }
        let id = this.getId(),
            label = this.getLabel(),
            helpDiv = this.getHelp(),
            divError = this.checkError(),
            requiredDiv = this.getRequired(),
            placeholder = this.getPlaceHolder();

        window.$(document).ready(function () {
            window.$(`#${id}`).val(defaultValue).trigger('change');
        });

        return (
            <label className={'form-group has-float-label ' + className}>
                <select
                    id={id}
                    ref='item'
                    required
                    value={selected}
                    placeholder={placeholder}
                    style={{textAlign:'left'}}
                    defaultValue={defaultValue}
                    className='form-control select2-single'
                >
                    {result}
                </select>
                <span>{label}</span>
                {helpDiv}
                {divError}
                {requiredDiv}
            </label>

        );
    }
}
