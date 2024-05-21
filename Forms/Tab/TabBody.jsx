'use client'

export function TabBody({ children}) {
    
    return(
            <>
                <div className="post__content tab-content">
                    {children}
                </div>
            </>
        );
    }
