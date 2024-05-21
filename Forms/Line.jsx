'use client';

export const Line = ({border = false}) => {
  return(
      <div className={'col-span-12 '+(border?'border-t-2':'')}></div>
  );
}
