"use client";

import {useSelector} from 'react-redux';
import {Tools} from '@/Theme/Midone/Utils/Tools';
import { usePathname } from 'next/navigation';

const translate = (str, items = [], langStore) => {
    if(Tools.isArray(str)){
        let results = [];
        str.forEach((word)=>{
          results.push(wordTranslate(word, items, langStore));
        });
        return results.join(" ")  
    }else{
      // console.log(langStore, str);
        return wordTranslate(str, items, langStore);
    }
}

function wordTranslate(word, items = null, langStore){
    const {langs} = langStore;
      
    let param = word.split('.');
    if(param.length == 1){
      param[1] = param[0];
      param[0] = "public";
    }
    
    let result = langs;
    param.forEach((item)=>{
        if(result != null && result != undefined && result != "")
            result = result[item];
        else
            result = "";
    });

    if(items != null && result != null){
        Object.keys(items).forEach((key)=>{
            result = result.replace(":"+key, items[key]);
        });
    }

    if(result != "" && result != undefined && result != null)
        return result;
    else
        return word.replace('public.', '').replace('undefined', '')
    
}

const MergeRecursive = (obj1, obj2) => {
    for (var p in obj2) {
      try {
        if ( obj2[p].constructor==Object ) {
          obj1[p] = MergeRecursive(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch(e) {
        obj1[p] = obj2[p];
      }
    }
    return obj1;
}

export function local(langStore)
{
  return langStore?.langs?.local; 
}

export function locale() {
  const pathname = usePathname();
  return pathname.split('/')[1] == 'profile' ? pathname.split('/')[2] : pathname.split('/')[1];
}

export function activeLang(langStore){
  return langStore?.langs?.langs;
}

export function dir(local){
  if(local == "en"){
    return "ltr";
  }else{
    return "rtl";
  }
}

export function useLang() {
  const langStore = useSelector(state=>state.lang);
  return {
    Lang: (str, items = [])=> translate(str, items = [], langStore),
    local: local(langStore),
    activeLang: activeLang(langStore),
    dir: dir(local(langStore)),
    locale: locale(),
  }
}

export const Lang = (str, items = [])=>{
  const langStore = useSelector(state=>state.lang);
  translate(str, items = [], langStore);
};