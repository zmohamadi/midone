'use client'

import {Config, singular} from '../index';

class Access{
  static check(path){
    if(path == undefined) return false;

    let routes = Config.getStore().getState().routes;
    path = Access.truePath(path.replace('#', ''));
    // console.log(path);
    let access = false;
    if(routes != undefined)
      routes.forEach((route) => {
          if(route.path == path){
              access = true;
              return;
          }
      });
    else
      access = true;
    return access;
  }

  static truePath(path){
    if(!path) return path;
    let items = path.split('/');
    items.forEach((item, index)=>{
        if(item != '')
            if(Access.isNumber(item)){
                items[index] = ':'+singular(items[index-1])+'Id';
            }
    });
    path = items.join('/');
    return path;
  }

  static isNumber(n){
    return Number(n)==n;
  }
}

export {Access};
