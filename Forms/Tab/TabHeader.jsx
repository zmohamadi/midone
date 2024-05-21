'use client'

export function TabHeader({ children}) {
    
    return(
            <>
                <div className="post__tabs nav nav-tabs flex-col sm:flex-row bg-gray-300 dark:bg-dark-2 text-gray-600" role="tablist">
                    {children}
                 </div>
            </>
        );
    }
