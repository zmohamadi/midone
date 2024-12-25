'use client'

import {Storage} from './Storage';
import {Tools} from './Tools';

export const Lang = (str, items = null) => {
  if(Tools.isArray(str)){
    let results = [];
    str.forEach((word)=>{
      results.push(WordLang(word, items));
    });
    return results.join(' ')  
  }else{
    return WordLang(str, items);
  }
}

function WordLang(word, items = null){
  let lang = {};
  if(window)
    lang = window.lang;
    
    let param = word.split('.');
    let result = lang;
    if(param.length == 1){
      param[1] = param[0];
      param[0] = "public";
    }

    param.forEach((item)=>{
      if(result != null && result != undefined && result != '')
        result = result[item];
      else
        result = '';
    });

    if(items != null && result != null){
      Object.keys(items).forEach((key)=>{
          result = result.replace(':'+key, items[key]);
        });
    }

    if(result != '' && result != undefined && result != null)
      return result;
    else
      return word.replace('public.', '').replace('undefined', '')
  // }, []);
}

function MergeRecursive(obj1, obj2) {
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