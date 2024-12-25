'use client'

import {useLang} from '@/lib/lang';
import Link from 'next/link';
import { FeatherIcon } from '../Utils';

export const BackBtn = (props) => {
  let {onClick} = props;
  const {Lang} = useLang();


  return(
    <Link className="btn bg-blue-700 text-white font-medium hover:bg-blue-800 hover:text-yellow-400 leading-6 w-20 mr-1 ml-1" href={"#"} onClick={onClick}>
      <FeatherIcon name="CornerUpRight" size = "17" spanWrapperClass="ml-1" />
      {Lang(["back"])}
  </Link>
  );
}
