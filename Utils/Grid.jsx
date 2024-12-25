'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { Paging } from './Paging';
import { useLang } from '@/lib/lang';
import { icons } from '@/lib/icons';
import { Toast } from './Toast';
import Link from 'next/link';
import Cookies from 'js-cookie';
import axios from '@/lib/axios';

export function Grid({
    url,
    pageInfo,
    perPage,
    columns,
    activeSort = false,
    activeSearch = true,
    insertLabel,
    insertLink,
    insertLinkAccess,
    multiView,
    filters,
    theme,
    type,
    className,
    callback
}) {
    const { Lang } = useLang();
    const SearchParams = useSearchParams();
    const pathString = SearchParams.toString();
    insertLabel = insertLabel || Lang('public.New Item');

    const getCookieValues = () => {
        const name = url;
        const result = Cookies.get(name + 'values');
        const page = SearchParams.get('page') || 1;
        if (!result) {
            return { page, perPage, sort: '', sortLabel: '', sortType: '', sortTypeLabel: '', search: '' };
        }
        const values = JSON.parse(result);
        return { ...values, page };
    };

    const setCookieValues = (state) => {
        const name = url;
        Cookies.set(name + 'values', JSON.stringify(state));
    };

    const defaultValues = getCookieValues();

    const [state, setState] = useState({
        url,
        items: pageInfo?.data || [], // Ensure items is always an array
        status: '',
        columns: columns || [], // Default to an empty array if columns is not provided
        page: defaultValues.page,
        pageInfo: pageInfo || {}, // Default to an empty object if pageInfo is not provided
        perPage: defaultValues.perPage,
        sort: defaultValues.sort,
        sortLabel: defaultValues.sortLabel,
        sortType: defaultValues.sortType,
        sortTypeLabel: defaultValues.sortTypeLabel,
        search: defaultValues.search,
        pathString,
    });

    const options = {
        insertLabel: insertLabel || Lang('public.New Item'),
        insertLink,
        activeSort,
        activeSearch,
        multiView,
        filters,
        insertLinkAccess,
        dir: 'rtl',
    };

    useEffect(() => {
        if (url) {
            getInfo(state.page);
        }
        // This will set the hash value in the state only if it's different from the current hash
        if (state.hash !== window.location.hash) {
            setState(prev => ({ ...prev, hash: window.location.hash }));
        }
    }, [url, state.page, state.hash]);

    useEffect(() => {
        const page = SearchParams.get('page') || state.page;
        if (pathString !== state.pathString) {
            getInfo(page);
            setCookieValues({ ...state, page });
        }
    }, [pathString, SearchParams, state.pathString]);

    const getInfo = async (page = 1) => {
        setState(prev => ({ ...prev, status: 'loading' }));

        try {
            const {data} = await axios.get(url, {
                headers: { 'Content-Type': 'application/json' },
                params: {
                    page,
                    number: state.perPage,
                    sort: state.sort,
                    sortType: state.sortType,
                    search: state.search
                }
            });
            // const {data} = result;
            if(typeof callback == "function"){
                callback(data);
            }
            const items = data.data || [];
            const pageInfo = { ...data };
            delete pageInfo.data;

            setState(prev => ({
                ...prev,
                items,
                pageInfo,
                status: items.length ? 'loaded' : 'no-data'
            }));
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            setTimeout(runScroll, 400);
        }
    };

    const handleErrorResponse = (error) => {
        if (error.response) {
            const { status } = error.response;
            if (status === 401) {
                Toast.error(Lang('public.error-401'), Lang('public.error message'), 5000);
                setTimeout(() => window.location.href = `//${window.location.host}${window.location.pathname}`, 2000);
            } else if (status === 500) {
                Toast.error('<b2>' + Lang('public.error-500') + '</b2>', Lang('public.error message'), 3000);
                setState(prev => ({ ...prev, status: 'error' }));
            }
        }
    };

    const runScroll = () => {
        // Ensure scroll-related logic is implemented
        if (window?.$('.tableFixHead').length === 0) return;
    };

    const { items } = state;

    return(
        <div>
            <GridHeader {...options} key={'header'} state={state} getInfo={getInfo} />
            {
                theme? <RenderThemplete items={items} theme={theme} state={state} Lang={Lang} className={className} />
                : <RenderTable items={items} columns={columns} state={state} type={type} className={className} />
            }
            {
                (pageInfo?.last_page > 2) ? <div className='separator mb-2'></div> : ''
            }
            <Paging pageInfo={state.pageInfo} />
        </div>
    );
}

const GridHeader = ({
    insertLabel,
    insertLink,
    activeSort,
    activeSearch,
    multiView,
    filters,
    insertLinkAccess,
    getInfo,
    className,
    state
}) => {
    const { Lang, dir } = useLang();

    const search = (e) => {
        if (e.which === 13) {
            const text = e.target.value;
            state.search = text;
            getInfo(1);
        }
    };

    return (
        <div className={'flex flex-row items-center p-1 pr-0 border-b border-gray-200'} key='header'>
            {activeSearch && (
                <input
                    className='form-control w-48'
                    type='text'
                    placeholder={Lang('public.search')}
                    id='search_key'
                    onKeyUp={search}
                />
            )}

            {activeSort && (
                <div className='dropdown'>
                    <button
                        className='dropdown-toggle btn mr-2 px-2 box text-gray-700 dark:text-gray-300'
                        aria-expanded='false'
                    >
                        <span className='w-5 h-5 flex items-center justify-center text-gray-700'>
                            {icons.plus}
                        </span>
                    </button>
                    <div className='dropdown-menu w-40' id='_tw2h95cg3' data-popper-placement='bottom-start'>
                        <div className='dropdown-menu__content box dark:bg-dark-1 p-2'>
                            <a
                                href=''
                                className='items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md'
                            >
                                {icons.users}
                                {Lang('public.new_group')}
                            </a>
                            <a
                                href=''
                                className='items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md'
                            >
                                {icons.setting}
                                {Lang('public.setting')}
                            </a>
                            <a
                                href=''
                                className='items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md'
                            >
                                {icons.setting}
                                {Lang('public.order_by')}
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {insertLink && (
                <Link
                    href={insertLink}
                    className={`btn btn-primary shadow-md ${dir === 'ltr' ? 'mr-2 ml-auto' : 'ml-2 mr-auto'}`}
                >
                    {Lang('public.' + insertLabel)}
                </Link>
            )}
        </div>
    );
};


const RenderTable = ({ columns = [], items = [], state = {}, type, className }) => {
    const { Lang } = useLang();

    // Safe path resolution
    const resolve = (path, obj) => {
        return path?.split('.').reduce((prev, curr) => prev ? prev[curr] : null, obj || {});
    };

    return (
        <div className={'table-responsive overflow-x-auto '+(className??"")}>
            <table className='table' role='grid' id='grid'>
                <thead>
                    <tr className='bg-gray-200 dark:bg-dark-2 text-neutral-800 font-extrabold border-b-4'>
                        <th className='border-b-2 dark:border-dark-5 whitespace-nowrap font-bold w-10'>#</th>
                        {columns.map((col, index) => (
                            <th key={index} className='border-b-2 dark:border-dark-5 whitespace-nowrap' style={{ width: col.width, minWidth: col.minWidth }}>
                                {col.label ? Lang('public.' + col.label) : ''}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={state.status === 'loading' && items.length > 0 ? 'blur-md' : ''}>
                    {(() => {
                        if (state.status === 'loading' && items.length === 0) {
                            return (
                                <tr className='bg-white dark:bg-dark-3'>
                                    <td colSpan={columns.length + 1} className='border-b-2 dark:border-dark-5 whitespace-nowrap text-center'>
                                        <MessageRow>{Lang('public.grid_loading')}</MessageRow>
                                    </td>
                                </tr>
                            );
                        }
                        if (state.status === 'error') {
                            return (
                                <tr className='bg-white dark:bg-dark-3'>
                                    <td colSpan={columns.length + 1} className='border-b-2 dark:border-dark-5 whitespace-nowrap text-center bg-red-500 text-gray-50 font-medium'>
                                        <MessageRow>{Lang('public.getinfo_error')}</MessageRow>
                                    </td>
                                </tr>
                            );
                        }
                        
                        if (items.length === 0) {
                            return (
                                <tr className='bg-amber-200 dark:bg-dark-3'>
                                    <td colSpan={columns.length + 1} className='border-b-2 dark:border-dark-5 whitespace-nowrap text-center'>
                                        <MessageRow><b>{Lang('public.no_data')}!</b></MessageRow>
                                    </td>
                                </tr>
                            );
                        }

                        return items.map((item, index) => (
                            <tr key={index} className={index % 2 !== 0 ? 'bg-gray-200 dark:bg-dark-3 intro-x' : 'bg-white dark:bg-dark-1 intro-x'}>
                                <td className='border-b dark:border-dark-5'>
                                    {state.pageInfo?.from + index}
                                </td>
                                {columns.map((col, colIndex) => {
                                    if (!col.jsx) {
                                        const resolveObj = resolve(col.field, item);
                                        let result = [];
                                        if (typeof resolveObj !== 'object' || resolveObj === null) {
                                            result.push(<span key={'span' + colIndex} dangerouslySetInnerHTML={{ __html: resolveObj }} />);
                                        } else {
                                            result = resolveObj.map((resItem, resIndex) => (
                                                <div key={resIndex}>
                                                    {col.fieldKey ? resItem[col.fieldKey] :
                                                        resItem.title ? resItem.title :
                                                            resItem.name ? resItem.name :
                                                                resItem.label || ''}
                                                </div>
                                            ));
                                        }
                                        return (
                                            <td key={colIndex} className='border-b dark:border-dark-5'>
                                                {result}
                                            </td>
                                        );
                                    } else {
                                        return (
                                            <td key={colIndex} className='border-b dark:border-dark-5'>
                                                {col.jsx(item)}
                                            </td>
                                        );
                                    }
                                })}
                            </tr>
                        ));
                    })()}
                </tbody>
            </table>
        </div>
    );
};

const RenderThemplete = ({items, state, theme, Lang}) => {
    return <div className="grid grid-cols-12 gap-4 py-2">
            {
                (state?.status == 'loading' && items?.length == 0)?
                    <div className="col-span-12 p-5 bg-white text-center text-base font-bold rounded-lg m-6">
                        {Lang('public.grid_loading')}
                    </div>
                :(state?.status == 'error')?
                    <div className="col-span-12 p-5 bg-theme-23 text-center text-base font-bold rounded-lg m-6">
                        {Lang('public.getinfo_error')}
                    </div>
                :(items?.length == 0)?
                    <div className="col-span-12 p-5 bg-theme-23 text-center text-base font-bold rounded-lg m-6">
                        {Lang('public.no_data')}
                    </div>
                :items?.map((item, index)=>
                    <React.Fragment key={index}>
                        {
                            theme(item, index)
                        }
                    </React.Fragment>)
            }
        </div>
}

const MessageRow = ({children}) => {
    return <>
        <div className="sm:hidden" style={{width: "70vw"}}> {children} </div>
        <div className="hidden sm:block"> {children} </div>
    </>
}