'use client'

export function TabPanel({children, active, id,className}) {
    let classDiv = className?className:"";
    let activeClass = active?" active ":"";

    return(
            <>
                <div id={id} 
                    className={activeClass+classDiv+" tab-pane p-5 grid gap-4 grid-cols-12"} 
                    role="tabpanel" aria-labelledby="content-tab">
                    {children}
                </div>
            </>
        );
    }
