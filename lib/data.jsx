'use client';

import axios from '@/lib/axios';
import { Toast } from '@/Theme/Midone/Utils/Toast';
import { useLang } from '@/lib/lang';
import { useConfig } from '@/lib/config';
import { useRouter, usePathname } from 'next/navigation';
import { useUtility } from '@/lib/utility';
// import tinymce from 'tinymce/tinymce';

const Data = {
    getRefValue(ref, parent) {
        const refs = parent.current;
        
        if(!refs) return "";
        const element = refs[ref];
        let value = '';

        if (!element) return 0;

        const $element = window?.$(element);
        const type = $element.attr('data-type');

        switch (type) {
            case 'radio':
                const name = $element.attr('name');
                value = window?.$('input[name=' + name + ']:checked').val();
                break;
            case 'checkbox':
                const id = $element.attr('id');
                value = window?.$('#' + id + ':checked').val() ?? 0;
                break;
            default:
                value = window?.$(element).val();
                break;
        }

        if (type === 'editor') {
            value = element.editor.getData();
            if (value === '<p>&nbsp;</p>') value = '';
        } else if (type === 'tinyMCE') {
            value = tinymce.get(element.id).getContent();
            if (value === '<p>&nbsp;</p>') value = '';
        } else if (type === 'currency') {
            value = element.value.replace(/,/g, '');
        }

        return value;
    },

    save(url, parent, type = 'new', nextUrl = '', callback = () => {}, router = '', Lang) {
        const data = {};
        const { state, setState } = parent;
        const refs = state.refs.current;

        if (type === 'edit' || type === 'update') {
            data['_method'] = 'PUT';
        }

        Object.keys(refs).forEach(refTitle => {
            if (refs[refTitle] && refs[refTitle].value !== undefined) {
                data[refTitle] = Data.getRefValue(refTitle, state.refs);
            }
        });

        setState((oldState)=>{
            return {...oldState, errors:[], status: "loading"}
        });

        state.errors = [];
        axios.post(url, data)
            .then(response => {
                const result = parseInt(response.data);
                const message = Lang('public.save_message');

                if (result) {
                    setState((oldState)=>{
                        return {...oldState, errors:[], status: "success", lastId: response.data}
                    });
                }

                Toast.success(message, Lang('public.dear_user'), 3000);

                if (nextUrl) {
                    router.push(Data.getSystemPrefix() + nextUrl);
                }

                callback(data, response.data);
            })
            .catch(error => {
                if (error.response) {
                    let title = Lang('public.error_message');
                    let message = '';
                    let method = 'warning';

                    switch (error.response.status) {
                        case 422:
                            message = Lang('public.error-422');
                            break;
                        case 401:
                            message = Lang('public.error-401');
                            break;
                        case 403:
                            message = Lang('public.error-403');
                            break;
                        case 501:
                            message = Lang('public.error-501');
                            method = 'error';
                            break;
                        case 500:
                            message = Lang('public.error-500');
                            method = 'error';
                            break;
                    }

                    setState((oldState)=>{
                        return {...oldState, errors: error.response?.data?.errors, status: "error"}
                    });

                    Toast[method](message, title, 3000);
                } else {
                    Toast.error(Lang('public.connection_error'), Lang('public.dear_user'), 3000);
                }
            })
            .finally(() => {
                setTimeout(() => {
                    window?.$('#contentFrame').css('filter', 'blur(0)');
                }, 500);
            });
    },

    destroy(url, reload, Lang) {
        const result = window.confirm(Lang('public.confirm_delete'));

        if (result) {
            axios.post(url, { _method: 'delete' }, { headers: { 'content-type': 'multipart/form-data' } })
                .then(() => {
                    Toast.success(Lang('public.message-200'), Lang('public.dear_user'), 5000);
                    reload();
                })
                .catch(error => {
                    if (error?.response?.status === 404) {
                        Toast.error(Lang('public.delete_error'), Lang('public.dear_user'), 5000);
                    }
                });
        } else {
            reload();
        }
    },

    resetForm(parent) {
        // Logic to reset the form
    },

    postData(url, data = {}, type = 'new', nextUrl = '', callback = () => {}, router = '', Lang) {
        if (type === 'edit' || type === 'update') {
            data['_method'] = 'PUT';
        }

        axios.post(url, data)
            .then(response => {
                const result = parseInt(response.data);
                const message = Lang('public.save_message');

                if (result) {
                    setState({ ...state, lastId: response.data });
                }

                Toast.success(message,  Lang('public.dear_user'), 3000);

                if (nextUrl) {
                    router.push(Data.getSystemPrefix() + nextUrl);
                }

                callback(data, response.data);
            })
            .catch(error => {
                if (error.response) {
                    let title = Lang('public.error_message');
                    let message = '';
                    let method = 'warning';

                    switch (error.response.status) {
                        case 422:
                            setState({ ...state, errors: error.response.data.errors });
                            message = Lang('public.error-422');
                            break;
                        case 401:
                            setState({ ...state, errors: error.response.data.errors });
                            message = Lang('public.error-401');
                            break;
                        case 501:
                            message = Lang('public.error-501');
                            method = 'error';
                            break;
                        case 500:
                            message = Lang('public.error-500');
                            method = 'error';
                            break;
                    }

                    Toast[method](message, title, 3000);
                } else {
                    Toast.error(Lang('public.connection_error'), Lang('public.dear_user'), 3000);
                }
            })
            .finally(() => {
                setTimeout(() => {
                    window?.$('#contentFrame').css('filter', 'blur(0)');
                }, 500);
            });
    },

    getSystemPrefix() {
        const { nextAdmin, nextsadmin } = useConfig();
        const pathname = window.location.href;

        if (pathname.includes(nextAdmin)) {
            return nextAdmin;
        } else if (pathname.includes(nextsadmin)) {
            return nextsadmin;
        } else {
            return '';
        }
    },

    getInfo(url, component, itemName = 'info', callback = null, Lang) {
        document.getElementById('#loader')?.classList.remove('d-none');

        axios.get(url, { headers: { 'content-type': 'application/json' } })
            .then(response => {
                if (typeof component?.setState === 'function') {
                    component.setState({ ...component.state, [itemName]: response.data });
                }
                if (callback) {
                    callback(response.data);
                }
            })
            .catch(error => {
                if (error.response) {
                    let message = '';
                    switch (error.response.status) {
                        case 422:
                            message = Lang('public.error-422');
                            break;
                        case 401:
                            message = Lang('public.error-401');
                            break;
                        default:
                            message = Lang('public.error-info');
                    }
                    Toast.error(message, Lang('public.dear_user'), 3000);
                }
            })
            .finally(() => {
                setTimeout(() => {
                    window?.$('#loader').addClass('d-none');
                }, 400);
            });
    },

    needles(url, setNeedleFunc, Lang) {
        Data.getInfo(url, '', '', data => setNeedleFunc(data), Lang);
    },

    prepareUrl(url) {
        // Logic to prepare URL
    }
};

const useData = () => {
    const { Lang } = useLang();
    const router = useRouter();
    const pathname = usePathname();
    const { reload } = useUtility(router, pathname);

    return {
        get: (url, component, itemName, callback) => Data.getInfo(url, component, itemName, callback, Lang),
        getInfo: (url, component, itemName , callback) => Data.getInfo(url, component, itemName, callback, Lang),
        save: (url, parent, type, nextUrl, callback) => Data.save(url, parent, type, nextUrl, callback, router, Lang),
        post: (url, parent, nextUrl, callback) => Data.save(url, parent, 'new', nextUrl, callback, router, Lang),
        postData: (url, data, type, nextUrl, callback) => Data.postData(url, data, type, nextUrl, callback, router, Lang),
        put: (url, parent, nextUrl, callback) => Data.save(url, parent, 'edit', nextUrl, callback, router, Lang),
        destroy: url => Data.destroy(url, reload, Lang),
        getValue: Data.getRefValue,
        getRefValue: Data.getRefValue,
        getNeedles: (url, setNeedleFunc) => Data.needles(url, setNeedleFunc, Lang),
        resetForm: parent => Data.resetForm(parent),
    };
};

export { Data, useData };
