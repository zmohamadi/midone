'use client'
import { useLang } from "@/lib";

export const ButtonContainer = (props) => {
    let {className, children} = props;
    let {dir} = useLang();

    return(        
        <div className={ (dir=="ltr"? " text-right": " text-left") + ' mt-5 ' + (className?className:"")}>
            {children}
        </div>        
    );
}