'use client';

import {useLang} from '@/lib/lang';

const createRand = function(){
    return (new Date()).getTime() + Math.ceil(Math.random()*10000);
}

export const useFormElement = (props)=>{
    const {Lang} = useLang();
    let rand = (new Date()).getTime() + Math.ceil(Math.random()*10000);
    let Element = {
        props: props,

        state: {
            rand: rand,
            errorRand: rand,
            id: 'element-'+rand,
            previousRef: null,
            ignoreError: false,
        },

        getRand: function(){
            return this.state.rand;
        },
    
        checkError: function(){
            let {refItem} = this.props,
                {errorRand} = this.state,
                divError = [];
            
            let errors = refItem?refItem[0].state?.errors:undefined;
            if(errors!=undefined){
                let error = errors[refItem[1]];
                if(error == undefined) 
                    return divError;
                this.getPreviousRef();
                let err = error.join('<br/>');
                this.state.ignoreError = false;
                let elementNew = <div className='text-theme-24 mt-2' key={errorRand} id={'error-'+errorRand}>
                                    <span dangerouslySetInnerHTML={{__html: err}} /> 
                                </div>
                divError.push(elementNew);
            }
            return divError;
        },

        createRef: function(refItem){
            const ref = (el) => {
                if(refItem){
                    let {state, setState} = refItem[0];
                    let newRef = state.refs;
                    newRef.current[refItem[1]] = el;
                    state.refs = newRef;
                    return newRef.current[refItem[1]];
                }else{
                    return el;
                }
            }
            return ref;
        },
    
        getParent: function(){
            var parent = this._reactInternalFiber._debugOwner.stateNode;
            return parent;
        },
    
        getRefName: function(){
            var name = this._reactInternalFiber.ref._stringRef;
            return name;
        },
    
        removeError: function(rand = ''){
    
            let {errorRand} = this.state;
            let id = this.getId();
            if(window?.$('#error-'+errorRand).length > 0){
                window?.$('#error-'+errorRand).slideUp(400, ()=>{
                    Element.state.errorRand = createRand();
                });
            }
            window?.$('#'+id).parent().children('span').children('div').slideUp(400, function(){
                Element.state.errorRand = createRand();
            });
        },
    
        getCurrentRef: function(){
            let {refItem} = this.props,
                {state} = refItem[0],
                {refs} = state;
            return this.state.previousRef = refs[refItem[1]];
        },
    
        getPreviousRef: function(){
            return (this.state.previousRef != null) ? this.state.previousRef.value : '';
        },
    
        getDefaultValue: function(type){
            let {refItem} = this.props;
            let dvalue;

            if(refItem){
                let [component, name] = this.props.refItem;
                if(component.state?.info?.[name] != undefined)
                    dvalue = component.state?.info?.[name];
            }
            
            let {defaultValue} = this.props;
            if(defaultValue != undefined)
                dvalue = defaultValue;
            
            if(this.getPreviousRef()){
                dvalue = this.getPreviousRef();
            }
            
            else if(typeof dvalue == 'object' && dvalue != null && type == "element"){
                let newVal = [];
                dvalue.map((item)=>{newVal.push(item?.id)});
                dvalue = newVal;
            }
            
            return dvalue;
        },
    
        getHelp: function(){
          let {help} = this.props;
          if(help)
            // return <a href='#' alt={help}><i className='fa fa-question-circle' aria-hidden='true'></i></a>;
            return <div className='form-help'> {help} </div>;
    
          return '';
        },
    
        getRequired: function(){
          let {required} = this.props;
          if(required == 'true' || required === true)
            return <sup className='required text-danger'> * </sup>;
    
          return '';
        },
    
        getId: function(){
            let {refItem} = this.props;
            if(refItem)
                return this.props.id || this.state.id || refItem[1];
            else
                return this.props.id || this.state.id;
        },
    
        getLabel: function(){
            let {label, refItem} = this.props;
            return Lang('public.'+(label?label:refItem?refItem[1]:""));
        },
    
        getPlaceHolder: function(props){
            let {placeholder} = this.props;
            return (placeholder)?Lang('public.'+placeholder, {title: this.getLabel()}) : '';
        },

        init: function(type="element"){
            return {
                id: Element.getId(),
                rand: Element.getRand(),
                label: Element.getLabel(),
                helpDiv: Element.getHelp(),
                divError: Element.checkError(),
                requiredDiv: Element.getRequired(),
                placeholder: Element.getPlaceHolder(),
                defaultValue: Element.getDefaultValue(type),
            };
        }
    };

    return Element;
};