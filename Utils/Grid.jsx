'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { Paging } from './Paging';
import { useLang } from '@/lib/lang';
import { icons } from '@/lib/icons';
import Link from 'next/link';
import Cookies from 'js-cookie';
import axios from '@/lib/axios';
import { Toast } from './Toast';

export function Grid({url, pageInfo, perPage, columns, activeSort = false, activeSearch = true, insertLabel, insertLink, insertLinkAccess, multiView, filters, theme, type}){
    const {Lang} = useLang();
    const SearchParams = useSearchParams();    
    const pathString = SearchParams.toString();    
    insertLabel = insertLabel?insertLabel:Lang('public.New Item');

    const getCookieValues = ()=>{
        let name = url;
        let result = Cookies.get(name+'values');
        let page = SearchParams.get('page');
        if(page == undefined || page == null || page == ''){
            page = 1;
        }
        if(result == null || result == undefined || result == 'undefined'){            
            result = {page:page, perPage:perPage, sort:'', sortLabel:'', sortType:'', sortTypeLabel:'', search:''};
        }
        else{
            result = JSON.parse(result);
            result.page = page;
        }
        return result;
    }

    const setCookieValues = (state)=>{
        let name = url;
        let {page, perPage, sort, sortLabel, sortType, sortTypeLabel, search} = state;
        const newStates = {page, perPage, sort, sortLabel, sortType, sortTypeLabel, search};
        let result = JSON.stringify(newStates);
        Cookies.set(name+'values', result);
    }

    let dir = 'rtl';
    const defaultValues = getCookieValues();

    let [state, setState] = useState({
        url: url,
        items: pageInfo?.data,
        status: '',
        columns: columns,
        page: defaultValues.page,
        pageInfo: pageInfo,
        perPage: defaultValues.perPage,
        sort: defaultValues.sort,
        sortLabel: defaultValues.sortLabel,
        sortType: defaultValues.sortType,
        sortTypeLabel: defaultValues.sortTypeLabel,
        search: defaultValues.search,        
        pathString: pathString,
    });

    const options = {
        insertLabel: insertLabel?insertLabel:Lang('public.New Item'),
        insertLink: insertLink,
        activeSort: activeSort,
        activeSearch: activeSearch,
        multiView: multiView,
        filters: filters,
        insertLinkAccess: insertLinkAccess,        
        dir: dir,
    }

    useEffect(()=>{
        if(url != undefined){
            getInfo(state.page);
        }

        if(state.hash == ''){
            state.hash = window.location.hash;
        }

        if(state.hash != window.location.hash){
            state.hash = window.location.hash;
        }
    }, []);

    // run when the 'url query string' is changed!!
    useEffect(()=>{
        const page = SearchParams.get('page');
        if(page != undefined) state.page = page;        
        if(pathString != state.pathString){
            getInfo(state.page);
            setCookieValues(state);
        }
    }, [pathString]);

    
    // useEffect(()=>{
    //     if(url == undefined && pageInfo != undefined)
    //         setState({...state, items: pageInfo?.data})
    // }, [pageInfo]);

    setCookieValues(state);
    
    const getInfo = (page=1)=>{
        setState({...state, status: 'loading'});
        let {url} = state;
        state.page = page;
        const options = {
            url: url,
            method: 'GET',
            header: {
                'content-type': 'application/json'
            },
            params: {
                page: page,
                number: state.perPage,
                sort: state.sort,
                sortType: state.sortType,
                search: state.search
            }
        }

        axios(options)
            .then((response)=>{
                let items = response.data.data;
                if(items == undefined || items.length == 0) state.status = 'no-data';
                let pageInfo = response.data;
  
                delete pageInfo.data;
                setState({
                    ...state,
                    items,
                    pageInfo
                });
            })
            .catch((error)=>{
                if(error.response){
                    // console.log(error.response.status);
                    if(error.response.status == 401){
                        Toast.error(Lang('public.error-401'),Lang('public.error message'), 5000);
                        let {host, pathname} = window.location;
                        setTimeout(()=>window.location.href='//'+host+pathname, 2000);
                    }else if(error.response.status == '500'){
                        Toast.error('<b2>'+Lang('public.error-500')+'</b2>', Lang('public.error message'), 3000);
                        setState({...state, status: 'error'});
                    }
                }
            })
            .then(()=>{
              setTimeout(()=>{
                  runScroll();
                }, 400);
          });
    }

    const search = (e)=>{
        let search = refs.search.value;
        let keyCode = e.which;
        if(keyCode==13){
            state.search = search;
            getInfo(1);
        }
    }
  
    const proccessFilters = ()=>{
        props.filters.forEach((filter, index)=>{
            if(filter.url != '' && filter.url != undefined)
            {
                axios.get(filter.url)
                    .then((response)=>{
                        // console.log(response.data);
                        let data = [];
                        response.data.forEach((d)=>{
                            if(filter.valueIdex == '' && filter.valueIdex == undefined) filter.valueIdex = 'id';
                            if(filter.labelIndex == '' && filter.labelIndex == undefined) filter.labelIndex = 'title';
                            data.push({value: d[filter.valueIdex], label: d[filter.labelIndex]})
                        });
                        props.filter[index].data = response.data;
                    })
                    .catch((error)=>{
                        // console.log('Filter Error:'+props.filter[index].name+'-'+error);
                    });
            }
        });
    }      
  
    const runScroll = ()=>{
      if(window?.$('.tableFixHead').length == 0) return;
    //   const ps = new PerfectScrollbar('.tableFixHead', {
    //       wheelSpeed: 2,
    //       wheelPropagation: true,
    //       minScrollbarLength: 20,
    //       scrollTop: 0
    //   });
    //   ps.update();
    }    

    let {items} = state;

    return(
        <div>
            <GridHeader {...options} key={'header'} state={state} getInfo={getInfo} />
            {
                theme? <RenderThemplete items={items} theme={theme} state={state} Lang={Lang} />
                : <RenderTable items={items} columns={columns} state={state} type={type} />
            }
            {
                (pageInfo?.last_page > 2) ? <div className='separator mb-2'></div> : ''
            }
            <Paging pageInfo={state.pageInfo} />
        </div>
    );
}

const GridHeader = ({insertLabel, insertLink, activeSort, activeSearch, multiView, filters, insertLinkAccess, getInfo, state})=>{
    const {Lang,dir} = useLang();
    const search = (e)=>{
        let text = e.target.value;
        let keyCode = e.which;
        if(keyCode==13){
            state.search = text;
            getInfo(1);
        }
    }

    return <div className='flex flex-col sm:flex-row items-center p-1 pr-0 border-b border-gray-200' key={'header'}>
           {activeSearch?<>
                    <input className='form-control w-48' type='text' placeholder={Lang('public.search')} id='search_key' onKeyUp={search} />
                    </>:""
            }
            {activeSort?<>
                <div className='dropdown'>
                        <button className='dropdown-toggle btn mr-2 px-2 box text-gray-700 dark:text-gray-300' aria-expanded='false'>
                            <span className='w-5 h-5 flex items-center justify-center text-gray-700'>
                                {icons.plus}
                            </span>
                        </button>
                        <div className='dropdown-menu w-40' id='_tw2h95cg3' data-popper-placement='bottom-start'>
                            <div className='dropdown-menu__content box dark:bg-dark-1 p-2'>
                                <a href='' className='items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md'> 
                                    {icons.users}
                                    {Lang('public.new_group')}
                                </a>
                                <a href='' className='items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md'> 
                                    {icons.setting}
                                    {Lang('public.setting')} 
                                </a>
                                <a href='' className='items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md'> 
                                    {icons.setting}
                                    {Lang('public.order_by')}
                                </a>
                            </div>
                        </div>
                    </div>
                </> : ""
            } 
            <div className='hidden md:block mx-auto text-gray-600'></div>
            {
                insertLink?
                    <Link href={insertLink} className={'btn btn-primary shadow-md '+(dir=="ltr" ? " mr-2" : " ml-2")}>
                        {Lang('public.'+insertLabel)}
                        {/* {icons.plus} */}
                    </Link>
                : ''
            }
        </div>
}

const RenderTable = ({columns, items, state, type}) =>{
    const {Lang} = useLang();    

    const resolve = (path, obj)=>{
        return path?.split('.').reduce(function(prev, curr) {
            return prev ? prev[curr] : null
        }, obj || self)
    } 

    return <>
        <div className='table-responsive overflow-x-auto'>
            <table className={'table'} role='grid' id='grid'>
                <thead>
                    <tr className='bg-gray-600-  dark:bg-dark-2 text-neutral-800- font-extrabold border-b-4'>
                        <th className='border-b-2 dark:border-dark-5 whitespace-nowrap font-bold w-10'> # </th>
                        {columns?.map((col, index)=>
                            <th key={index} className='border-b-2 dark:border-dark-5 whitespace-nowrap' style={{width:col.width}}> 
                            {(col.label)?Lang('public.'+col.label):''}
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className={state?.status == 'loading' && items?.length > 0 ? 'blur-md': ''}>
                    {(()=>{
                        if(state?.status == 'loading' && !items){
                            return <tr className='bg-white dark:bg-dark-3'>
                                    <td colSpan={columns.length+1} className='border-b-2 dark:border-dark-5 whitespace-nowrap text-center'> {Lang('public.grid_loading')} </td>
                                </tr>
                        }
                        else if(state?.status == 'error')
                            return <tr className='bg-white dark:bg-dark-3'>
                                    <td colSpan={columns.length+1} className='border-b-2 dark:border-dark-5 whitespace-nowrap text-center bg-red-500 text-gray-50 font-medium'> {Lang('public.getinfo_error')} </td>
                                </tr>
                        else if(items?.length == 0)
                            return <tr className='bg-amber-200 dark:bg-dark-3'>
                                    <td colSpan={columns.length+1} className='border-b-2 dark:border-dark-5 whitespace-nowrap text-center'> <b>{Lang('public.no_data')}!</b> </td>
                                </tr>
                        else
                            return items?.map((item, index)=>
                                <tr key={index} className={(index%2!=0)?'bg-gray-200 dark:bg-dark-3 intro-x':'bg-white dark:bg-dark-1 intro-x'}>
                                    <td key='1000' className='border-b dark:border-dark-5'>
                                        {state.pageInfo?.from+index}
                                    </td>
                                    {columns.map((col, index)=>{
                                            if(col.jsx == undefined || col.jsx == '' ){
                                                let resolveObj = resolve(col.field, item);
                                                let result = [];
                                                if(typeof resolveObj != 'object' || resolveObj == null){
                                                    result.push(<span key={'span'+index} dangerouslySetInnerHTML={{__html: resolveObj}} />);
                                                }
                                                else{
                                                    resolveObj.map((item, index)=>{
                                                        result.push(<div key={index}>
                                                            {   col.fieldKey?item[col.fieldKey]
                                                                :item.title?item.title
                                                                :item.name?item.name
                                                                :item.label?item.label:''}
                                                            </div>);
                                                    })
                                                }
                                                return (<td key={index} className='border-b dark:border-dark-5'>
                                                    {result}
                                                </td>)
                                            }
                                            else
                                            {
                                                return (<td key={index} className='border-b dark:border-dark-5'>
                                                    {col.jsx(item)}
                                                </td>)
                                            }
                                        }
                                    )}
                                </tr>
                        )
                    })()
                }
                </tbody>
            </table>
        </div>
    </>
}

const RenderThemplete = ({items, state, theme, Lang}) => {
    return <div className="grid grid-cols-12 gap-4 py-2">
            {
                (state?.status == 'loading' && !items)?
                    <div className="col-span-12 p-5 bg-theme-4 text-center text-base font-bold rounded-lg m-6">
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