'use client'

export function Tab({ children,className}) {
    
    return(
            <>
                <div className={className?className+" post intro-y box mt-5":" post intro-y box mt-5"}>
                    {children}
                 </div>
            </>
        );
    }
