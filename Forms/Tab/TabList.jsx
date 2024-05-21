
'use client'

export function TabList({children, active, href,title}){

      return(
          <>
              
              <a  title={title} 
                  data-toggle="tab" 
                  data-target={"#"+href} 
                  href="#" 
                  className={active?'tooltip w-full sm:w-40 py-4 text-center flex justify-center items-center active':
                  'tooltip w-full sm:w-40 py-4 text-center flex justify-center items-center'}              
                  id="content-tab" role="tab" aria-controls="content" 
                  aria-selected="true">
                {children}
            </a>

          </>
      );
}
