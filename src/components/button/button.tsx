import './button.css'
import React, {FC, MouseEventHandler} from "react";

interface buttonProps {
    clickHandler?: MouseEventHandler<HTMLButtonElement>
    text: string
    type: 'submit' | 'reset' | undefined
}

const Button: React.FC<buttonProps> = ({type, clickHandler, text}) => {
    return (
        <div className='button-container'>
            <button type={type} onClick={clickHandler}>{text}</button>
        </div>
    )
}
export default Button