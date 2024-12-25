'use client'

import {useLang} from '@/lib/lang';
import Link from 'next/link';
import { FeatherIcon } from '../Utils';

export const CourseToolsBtn = (props) => {
  let {href} = props;
  const {Lang} = useLang();

  return(
    <Link className="btn bg-teal-500 text-white font-semibold hover:bg-teal-600 hover:text-yellow-400 leading-6 w-20 mr-1 ml-1" 
        href={href}>
      <FeatherIcon name="Settings" size = "17" spanWrapperClass="ml-2" />
      {Lang(["tools_link"])}
  </Link>
  );
}
