'use client'

import { useState, useEffect } from 'react';
import { FeatherIcon} from "@/Theme/Midone/Utils/FeatherIcon";
import { useLang } from '@/lib';

export const Repeat = ({child, parent, needles, className , count_data=1, classNameComp, other, displayClose = true, displayPlus=true})=>{
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

    return <div className={'items-center col-span-12 '+ (className?className:"")}>
        {
            Array(state.count).fill(0).map((i, key)=>{
                if(state.deleted.indexOf(key) == -1)
                    return <div className='grid grid-cols-12 gap-2' key={key}>
                                <div className='col-span-11 '>
                                    <div className='grid grid-cols-12 gap-2'>
                                        <Comp index={key} key={key+other?.toString()} parent={parent} needles={needles} className={"col-span-11 "+classNameComp} {...other} />
                                    </div>
                                </div>
                                {(displayClose)?
                                    <div className="col-span-1 text-center pt-6 mt-3">
                                        <FeatherIcon spanWrapperClass="icon-plus" iconClassName="mt-5" name="XOctagon" color="darkred"  onClick={()=>remove(key)} />
                                    </div>
                                :
                                    ""
                                }
                            </div>
                }
            )
        }
        {(displayPlus)?
            <FeatherIcon iconClassName="mt-2" name="PlusSquare"  onClick={add} />
        :
            ""
        }
    </div>
}
