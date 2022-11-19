import './button.css'
import React, {FC, MouseEventHandler} from "react";
import {useSelector} from "react-redux";
import {getTypeOfAlgo} from "../../utils/store/typeOfAlgo/typeSelectors";

interface buttonProps {
    clickHandler?: MouseEventHandler<HTMLButtonElement>
    text: string
    type: 'submit' | 'reset' | undefined
}

const Button: React.FC<buttonProps> = ({type, clickHandler, text}) => {

    const typeOfAlgo = useSelector(getTypeOfAlgo)
    return (
        <div className='button-container'>
            <button type={type} onClick={clickHandler} style={typeOfAlgo ? {backgroundColor: "orange"}: {backgroundColor: "lightblue"}}>{text}</button>
        </div>
    )
}
export default Button