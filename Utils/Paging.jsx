'use client'

import { icons } from '@/lib/icons'
import Link from 'next/link'
import {useLang} from "@/lib/lang"

const Paging = ({pageInfo = {}}) => {
    let {current_page, last_page} = pageInfo;
    const {dir} = useLang();

    if(last_page < 2) return '';
    let pages = [];
    for(let i=1; i <= last_page; i++){
        pages.push(i);
    }
    let li =[];
    let toPage = 1, fromPage = 1;
    if(Math.ceil(current_page/10)*10 < last_page){
        toPage = Math.ceil(current_page/10)*10;
        fromPage = toPage - 9;
    }else{
        toPage = last_page;
        fromPage = Math.ceil(current_page/10)*10 - 9;
    }

    let previous = current_page-1;
    let next = current_page+1;
    if(current_page == 1){
        previous = false;
    }
    if(current_page == last_page){
        next = false;
    }

    var href = getLink();
    for(let j=fromPage; j<=toPage; j++)
        li.push(<li key={j}>
                    <Link href={href.replace('pageNumber', j)} className={current_page==j?'pagination__link pagination__link--active':'pagination__link'} preserveState> {j} </Link>
                </li>) ;

    return (
        <div className='intro-y flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-3'>
            <ul className='pagination'>
                {(current_page > 1)?
                    <>
                        <li>
                            <Link className='pagination__link' href={href.replace('pageNumber', 1)} preserveState> {dir == "rtl"? icons.firstRight: icons.firstLeft} </Link>
                        </li>
                        <li>
                            <Link className='pagination__link' href={href.replace('pageNumber', current_page - 1)} preserveState> {dir == "rtl"? icons.arrowRight: icons.arrowLeft} </Link>
                        </li>
                    </> :''
                }
                {li}
                {(current_page != last_page)?
                    <>
                        <li>
                            <Link className='pagination__link'  href={href.replace('pageNumber', current_page + 1)} preserveState> {dir == "rtl"? icons.arrowLeft: icons.arrowRight}</Link>
                        </li>
                        <li>
                            <Link className='pagination__link'  href={href.replace('pageNumber', last_page)} preserveState> {dir == "rtl"? icons.firstLeft: icons.firstRight}</Link>
                        </li>
                    </> :''
                }
            </ul>
        </div>
    );
}

const getLink = ()=>{
    let search = window.location.search;
    if(search.length == 0){
        search = '?page=pageNumber';
    }
    else{
        search = search.replace(/page=(\d)*/, 'page=pageNumber');
        if(search.search('page=') == -1){
            search += '&page=pageNumber';
        }
    }
    return search;
}

export {Paging};
