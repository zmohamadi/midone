'use client'
import { useLang } from "@/lib";

export const ButtonContainer = (props) => {
    let {className, children} = props;
    let {dir} = useLang();

    return(        
        <div className={ (dir=="ltr"? " text-right ": " text-left ") + (className?className:" mt-5 ")}>
            {children}
        </div>        
    );
}