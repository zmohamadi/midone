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
        let name, id;
        if(refs[ref].value != undefined){
            let type = window?.$(refs[ref]).attr('data-type');
            switch(type){
                case 'radio':
                    name = window?.$(refs[ref]).attr('name');
                    value = window?.$('input[name='+name+']:checked').val();
                    break;
                case "checkbox":
                    id = window?.$(refs[ref]).attr('id');
                    value = window?.$('#'+id+':checked').val() ?? 0;
                    break;
                default:
                    value = window?.$(refs[ref]).val();
            }
        }
        else{
            // Radio Button
            return 0;
            if(refs[ref].refs.item == undefined && Object.keys(refs[ref].refs).length >= 1){
                Object.keys(refs[ref].refs).forEach((item)=>{
                    if(refs[ref].refs[item].checked == true){
                        value = refs[ref].refs[item].value;
                    }
                })
            }
            else if(refs[ref].refs.item.type == 'checkbox' || refs[ref].refs.item.type == 'radio'){
                if(value = refs[ref].refs.item.checked)
                {
                    value = refs[ref].refs.item.value;
                }
                else{
                    value = 0;
                }
            }
            else if(refs[ref].refs.item.multiple == true)
            {
                value = window?.$('#'+refs[ref].refs.item.id).val();
            }
            else if(refs[ref].refs.item.dataset.type=='editor'){
                value = refs[ref].refs.item.editor.getData();
                if(value == '<p>&nbsp;</p>') value = '';
            }
            else if(refs[ref].refs.item.dataset.type=='tinyMCE'){
                let id = refs[ref].refs.item.id;
                value = tinymce.get(id).getContent();
                if(value == '<p>&nbsp;</p>') value = '';
            }
            else if(refs[ref].refs.item.dataset.type=='currency'){
                value = refs[ref].refs.item.value.replace(/,/g, '');
            }
            else{
                value = refs[ref].refs.item.value;
            }
        }

        return value;
    },
    // parent: is the ref Object,
    save: function(url, parent, type='new', nextUrl='', callback='', router = '', Lang){
        
        // let data = {}, targetBTN = window.event.target;
        let data = {};
        let {state, setState} = parent;
        let refs = state.refs.current;
        // console.log(refs);

        if(type=='edit' || type=='update'){
            data['_method'] = 'PUT';
        }

        Object.keys(refs).forEach((refTitle)=>{
                if(refs[refTitle] && refs[refTitle].value != undefined){
                    data[refTitle] = Data.getRefValue(refTitle, state.refs);
                }else{
                    // console.log(refTitle+' not have value!!', refs[refTitle], refs[refTitle].value);
                }
            }
        );
        
        state.errors = [];
        axios.post(`${url}`, data)
            .then((response)=>{
                let result = parseInt(response.data);
                let message = Lang('public.save_message');;
                
                if(result){
                    setState({...state, lastId: response.data});
                    message = Lang('public.save_message');
                }
                Toast.success(message, Lang('message'), 3000);
                                
                if(nextUrl != '')
                {
                    let pathNextUrl = Data.getSystemPrefix()+nextUrl;
                    router.push(pathNextUrl);
                }
                if(typeof callback == 'function'){
                    callback(data, response.data);
                }
            })
            .catch((error)=>{
                if (error.response) {
                    let title = '', message = '', method = 'warning';
                    title = Lang('public.error message');
                    switch(error.response.status){
                        case 422:
                            setState({...state, errors: error.response.data.errors});
                            message = Lang('public.error-422');
                            break;
                        case 401:
                            setState({...state, errors: error.response.data.errors});
                            message = Lang('public.error-401');
                            break;
                        case 501:
                            message = Lang('public.error-501');
                            method = 'error';
                            break;
                    }
                    Toast[method](message, title, 3000);

                } else if (error.request) {
                    // console.log(error.request);
                } else {
                    Toast.error(Lang('public.Connection error'), Lang('public.error message'), 3000);
                }
            })
            .then(()=>{
                setTimeout(()=>{
                    // window?.$(targetBTN)?.removeClass('btn-loading');
                    // window?.$(targetBTN)?.attr('disabled', false);
                    window?.$('#contentFrame').css('filter', 'blur(0)');
                }, 500);
            });
    },

    destroy: function(url, reload, Lang){
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

    postData: function(url, data = {}, type='new', nextUrl='', callback='', router = '', Lang){
    
        if(type=='edit' || type=='update'){
            data['_method'] = 'PUT';
        }        
        
        axios.post(`${url}`, data)
            .then((response)=>{
                let result = parseInt(response.data);
                let message = Lang('public.save_message');;
                
                if(result){
                    setState({...state, lastId: response.data});
                    message = Lang('public.save_message');
                }
                Toast.success(message, Lang('message'), 3000);
                                
                if(nextUrl != '')
                {
                    let pathNextUrl = Data.getSystemPrefix()+nextUrl;
                    router.push(pathNextUrl);
                }
                if(typeof callback == 'function'){
                    callback(data, response.data);
                }
            })
            .catch((error)=>{
                if (error.response) {
                    let title = '', message = '', method = 'warning';
                    title = Lang('public.error message');
                    switch(error.response.status){
                        case 422:
                            setState({...state, errors: error.response.data.errors});
                            message = Lang('public.error-422');
                            break;
                        case 401:
                            setState({...state, errors: error.response.data.errors});
                            message = Lang('public.error-401');
                            break;
                        case 501:
                            message = Lang('public.error-501');
                            method = 'error';
                            break;
                    }
                    Toast[method](message, title, 3000);

                } else if (error.request) {
                    // console.log(error.request);
                } else {
                    Toast.error(Lang('public.Connection error'), Lang('public.error message'), 3000);
                }
            })
            .then(()=>{
                setTimeout(()=>{
                    window?.$('#contentFrame').css('filter', 'blur(0)');
                }, 500);
            });
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
        // window?.$('#loader')?.removeClass('d-none');
        document.getElementById('#loader')?.classList.remove('d-none');
        const options = {
            url:url,
            method: 'GET',
            header: {
                'content-type': 'application/json'
            }
        }

        axios(options)
            .then((response)=>{
                if(typeof component?.setState == "function")
                    component?.setState({ ...component.state, [itemName]: response.data});
                if(callback != null){
                  callback(response.data);
                }
            })
            .catch((error)=>{
                // console.log("error:", error);
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
            })
            .then(()=>{
                setTimeout(()=>{
                    window?.$('#loader').addClass('d-none')
                }, 400);
            });
    },

    needles: function(url, setNeedleFunc){
        Data.getInfo(url, "", "", (data)=>setNeedleFunc(data));
    },

    prepareUrl: function (url){
        
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
        postData: (url, data, nextUrl, callback)=>Data.postData(url, data, 'new', nextUrl, callback, router, Lang),
        put: (url, parent, nextUrl, callback)=>Data.save(url, parent, 'edit', nextUrl, callback, router, Lang),
        destroy: (url)=>Data.destroy(url, reload, Lang),
        getValue: Data.getRefValue,
        getRefValue: Data.getRefValue,
        getNeedles: Data.needles,
        resetForm: (parent)=>Data.resetForm,
    };
}

let DataObj = Data;
export {Data, DataObj, useData};
