import './navigation.css'
import React, {FormEvent, MouseEventHandler, useEffect, useState} from "react";
import Button from "../button/button";
import logoSVG from '../../utils/imgs/Logo.svg'
import InputField from "../input-field/inputField";
import {createTree, insert, preTraversal} from "../../utils/RBTree-algo/RBTreeAlgo";
import {Outlet} from "react-router-dom";


const Navigation: React.FC = () => {
    const [root, setRoot] = useState(undefined)
    useEffect(() => {
         // @ts-ignore
        setRoot(createTree())
    }, [])

    const addNode = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
        // @ts-ignore
        const key = e.target[0].value
        if(root)
            insert(root, +key)
    }

    const preTraverse = () => {
        // @ts-ignore
        preTraversal(root.Root)
    }

    return (
        <>
            <div className='navigation-container'>
                <div className="top-section">
                    <img className='logo-img' src={logoSVG} alt=""/>
                    <h1>RBTree <br/> Visualiser</h1>
                </div>
                <div className="bottom-section">
                    <form onSubmit={addNode} action="">
                        <InputField text='Value of the node key.' />
                        <Button type='submit' text='Add node.' />
                    </form>
                    <Button type={undefined} clickHandler={preTraverse} text='Pre traverse tree.' />
                </div>
            </div>
            <Outlet />
        </>

    )
}
export default Navigation