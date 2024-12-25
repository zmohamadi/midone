'use client'

import {useLang} from '@/lib/lang';
import { useMemo } from 'react';

export const Button = (props) => {
  let {label, onClick, className, disabled, component} = props;
  const {Lang} = useLang();

  const status = component? useMemo(()=>component.state.status, [component.state.status]):"";

  className = className?className:'btn btn-primary mr-1 ml-1 '+(status == "loading"?"w-32 ":"w-20 ");
  if(disabled) className += ' disabled';

  return(
      <button
        type='button' 
        className={className} 
        onClick={(event)=> onClick(event)}
        disabled = {disabled}
      >
        {typeof label == "string"? Lang('public.'+label): label}
        {status == "loading" && <span dangerouslySetInnerHTML={{ __html: loading }}></span>}
      </button>
  );
}

const loading = '<svg id="a-loading" style="display: inline-block; margin: 0 6px" width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(255, 250, 250)"><circle cx="15" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="60" cy="15" r="9" fill-opacity="0.3"><animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate></circle></svg>';
