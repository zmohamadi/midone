'use client';

import axios from '@/lib/axios';
import { Toast } from '@/Theme/Midone/Utils/Toast';
import { useLang } from '@/lib/lang';
import { useConfig } from '@/lib/config'
import { useRouter, usePathname } from 'next/navigation';
import { useUtility } from '@/lib/utility';
// import tinymce from 'tinymce/tinymce';

let Data = {
    getRefValue: function(ref, parent){
        let refs = parent.current;
        let value = '';
        if(refs[ref].value != undefined){
            if(window?.$(refs[ref]).attr('type') != 'radio')
                value = window?.$(refs[ref]).val();
            else{
                let name = window?.$(refs[ref]).attr('name');
                value = window?.$('input[name='+name+']:checked').val();
            }
        }
        return value;
    },
    // parent: is the ref Object,
    save: function(url, parent, type='new', nextUrl='', callback='', router = '', Lang){
        
        let data = {}, targetBTN = window.event.target;
        let {state, setState} = parent;
        let refs = state.refs.current;
        state.errors = [];
        let {laraDomain} = useConfig(), method = "POST";
        url = laraDomain + url;

        if(type=='edit' || type=='update'){
            method = 'PUT';
        }

        Object.keys(refs).forEach((refTitle)=>{
                if(refs[refTitle] && refs[refTitle].value != undefined){
                    data[refTitle] = Data.getRefValue(refTitle, state.refs);
                }else{
                    // console.log(refTitle+' not have value!!', refs[refTitle], refs[refTitle].value);
                }
            }
        );

        const requestOptions = {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        fetch(url, requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const info = isJson && await response.json();
                // console.log(info);
                // check for error response
                // if (!response.ok) {
                //     // get error message from body or default to response status
                //     const error = (info && info.message) || response.status;
                //     return Promise.reject(error);
                // }

                let result = parseInt(info);
                let message = Lang('public.save_message');;
                
                if(result){
                    setState({...state, lastId: info});
                    message = Lang('public.save_message');
                }
                Toast.success(message, 'پیام', 3000);
                                
                if(nextUrl != '')
                {
                    let pathNextUrl = Data.getSystemPrefix()+nextUrl;
                    router.push(pathNextUrl);
                }
                if(typeof callback == 'function'){
                    callback(data, info);
                }
            })
            .catch(error => {
                // console.log('There was an error!', error);
                if (error.response) {
                    let title = '', message = '';
                    switch(error.response.status){
                        case 422:
                            message = Lang('public.error-422');
                            break;
                        case 401:
                            message = Lang('public.error-401');
                            break;
                    }
                    Toast.error(message, title, 3000);
                }
            });                        
    },

    destroy: function(url, reload){
        let result = window.confirm(Lang('public.Are you sure you want to delete?'));

        if(result == true){
            const options = {
                url,
                method: 'POST',
                header: {
                    'content-type': 'multipart/form-data'
                },
                data: {'_method':'delete'}
            }

            axios(options)
                .then((response)=>{
                    Toast.success(Lang('public.message-200'), Lang('public.message'), 5000);
                    reload();
                })
                .catch((error)=>{
                    // console.log('destroy error:', error);
                    if(error?.response?.status == 404){
                        Toast.error(Lang('public.The record was not found, probably deleted already'), Lang('public.message'), 5000);
                    }
                })
        }
        else{
            reload();
        }
    },

    resetForm: function(parent){
        // console.log(45);
        // let {refs} = parent;
        // console.log(refs);
        // parent.refs.reset();
    },

    getSystemPrefix: function(){
        let pathname = window.location.href;
        const {nextAdmin, nextsadmin} = useConfig();
        if(pathname.indexOf(nextAdmin) > -1){
            return nextAdmin;
        }else if(pathname.indexOf(nextsadmin) > -1){
            return nextsadmin;
        }else{
            return '';
        }        
    },

    getInfo: function(url, component, itemName = 'info', callback=null){
        const {laraDomain} = useConfig();
        url = laraDomain + url;
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
                    mod: "cors",                        
                },
            // body: JSON.stringify({ title: 'Fetch POST Request Example' })
        };
        fetch(url, requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                if(typeof component?.setState == "function")
                    component?.setState({ ...component.state, [itemName]: data});
                if(callback != null){
                  callback(data);
                }
            })
            .catch(error => {
                // element.parentElement.innerHTML = `Error: ${error}`;
                //console.error('There was an error!', error);
                if (error.response) {
                    let title = '', message = '';
                    switch(error.response.status){
                        case 422:
                            message = Lang('public.error-422');
                            break;
                        case 401:
                            message = Lang('public.error-401');
                            break;
                    }
                    Toast.error(message, title, 3000);
                }
            });
    },

    needles: function(url, setNeedleFunc){
        Data.getInfo(url, "", "", (data)=>setNeedleFunc(data));
    }
}

const useData = ()=>{
    const {Lang} = useLang();
    const router = useRouter();
    const pathname = usePathname();
    const {reload} = useUtility(router, pathname);

    return {
        get: Data.getInfo,
        getInfo: Data.getInfo,
        save: (url, parent, type, nextUrl, callback)=>Data.save(url, parent, type, nextUrl, callback, router, Lang),
        post: (url, parent, nextUrl, callback)=>Data.save(url, parent, 'new', nextUrl, callback, router, Lang),
        put: (url, parent, nextUrl, callback)=>Data.save(url, parent, 'edit', nextUrl, callback, router, Lang),
        destroy: (url)=>Data.destroy(url, reload),
        getValue: Data.getRefValue,
        getRefValue: Data.getRefValue,
        getNeedles: Data.needles,
        resetForm: (parent)=>Data.resetForm,
    };
}

let DataObj = Data;
export {Data, DataObj, useData};
