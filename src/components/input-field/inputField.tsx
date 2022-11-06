import './input-field.css'
import React from "react";

interface inputFieldProps {
    text: string
}

const InputField: React.FC<inputFieldProps> = ({text}) => {
    return (
        <div className='input-field-container'>
            <input type="text" placeholder={text}/>
        </div>
    )
}
export default InputField