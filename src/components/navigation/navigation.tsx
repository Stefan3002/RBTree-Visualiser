import './navigation.css'
import React, {FormEvent, useState} from "react";
import Button from "../button/button";
import logoSVG from '../../utils/imgs/Logo.svg'
import InputField from "../input-field/inputField";
import {createTree, insert, preTraversal} from "../../utils/RBTree-algo/RBTreeAlgo";
import {Outlet} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setAboutOpened} from "../../utils/store/about/aboutActions";
import {getAboutOpened} from "../../utils/store/about/aboutSelectors";


const Navigation: React.FC = () => {
    const dispatch = useDispatch()
    const aboutOpened = useSelector(getAboutOpened)

    const [root, setRoot] = useState(undefined)
    // useEffect(() => {
    //      // @ts-ignore
    //     setRoot(createTree())
    // }, [])

    const addNode = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        // @ts-ignore
        const key = e.target[0].value
        if(root)
            await insert(root, +key)
        else
            { // @ts-ignore
                setRoot(await createTree(+key))
            }
    }

    const preTraverse = () => {
        // @ts-ignore
        preTraversal(root.Root, [], true)
    }

    const openAbout = (): void => {
        aboutOpened ? dispatch(setAboutOpened(false)) : dispatch(setAboutOpened(true))
    }

    return (
        <>
            <div className='navigation-container'>
                <div className="top-section">
                    <img className='logo-img' src={logoSVG} alt=""/>
                    <h1>RBTree <br/> Visualiser</h1>
                    <div onClick={openAbout} className="how-work">
                        <p>How does it work?</p>
                        <i className="fa-3x fa-solid fa-circle-question"></i>
                    </div>
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