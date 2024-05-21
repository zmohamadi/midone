'use client'

import { useState, useEffect } from 'react';
import { FeatherIcon} from "@/Theme/Midone/Utils/FeatherIcon";
import { useLang } from '@/lib';

export const Repeat = ({child, parent, needles,className , count_data=1,classNameComp})=>{
    let[state, setState] = useState({
        count: 1,
        deleted: [],
    });
    const {Lang} = useLang();

    useEffect(()=>{        
        setState({...state, count: count_data});
    }, [count_data]);

    const add = ()=>{
        let {count} = state;
        count++;
        setState({...state, count: count});
    }

    const remove = (key)=>{
        let {deleted} = state;
        deleted.push(key);
        setState({...state, deleted});
    }

    let Comp = child;

    return <div className={'items-center col-span-12'+ (className?className:"")}>
        {
            Array(state.count).fill(0).map((i, key)=>{
                if(state.deleted.indexOf(key) == -1)
                    return <div className='grid grid-cols-12 gap-2' key={key}>
                                <div className='col-span-11 '>
                                    <div className='grid grid-cols-12 gap-2'>
                                        <Comp index={key} key={key} parent={parent} needles={needles} className={"col-span-11 "+classNameComp} />
                                    </div>
                                </div>
                                <div className='col-span-1 text-center pt-6 mt-3'>
                                    <FeatherIcon spanWrapperclassName="icon-plus" iconClassName="inline-block" name="XOctagon" color="darkred"  onClick={()=>remove(key)} />
                                </div>
                            </div>
                }
            )
        }
        <FeatherIcon iconClassName="mt-1" name="PlusSquare"  onClick={add} />
    </div>
}
