import './navigation.css'
import React, {FormEvent, useState} from "react";
import Button from "../button/button";
import logoSVG from '../../utils/imgs/Logo.svg'
import InputField from "../input-field/inputField";
import {createTree, insert} from "../../utils/RBTree-algo/RBTreeAlgo";
import {Outlet} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setAboutOpened} from "../../utils/store/about/aboutActions";
import {getAboutOpened} from "../../utils/store/about/aboutSelectors";
import {inTraversal, postTraversal, preTraversal} from "../../utils/RBTree-algo/Traversals";
import {getTypeOfAlgo} from "../../utils/store/typeOfAlgo/typeSelectors";
import {setTypeOfAlgo} from "../../utils/store/typeOfAlgo/typeActions";
import {changeSpeed} from "../../utils/RBTree-algo/RBTreeConstants";

const Navigation: React.FC = () => {

    const [traversalsMenuOpened, setTraversalsMenuOpened] = useState(false)

   const typeOfAlgo = useSelector(getTypeOfAlgo)

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
        if(Number.isInteger(parseInt(key))) {
            if (root)
                await insert(root, +key, typeOfAlgo)
            else { // @ts-ignore
                setRoot(await createTree(+key))
            }
        }
    }

    const preTraverse = () => {
        // @ts-ignore
        preTraversal(root.Root, [], true, true)
    }
    const inTraverse = () => {
        // @ts-ignore
        inTraversal(root.Root, [], true, true)
    }
    const postTraverse = () => {
        // @ts-ignore
        postTraversal(root.Root, [], true, true)
    }

    const openAbout = (): void => {
        aboutOpened ? dispatch(setAboutOpened(false)) : dispatch(setAboutOpened(true))
    }

    const openTraversalsMenu = () => {
       traversalsMenuOpened ? setTraversalsMenuOpened(false) : setTraversalsMenuOpened(true)
    }

    const [speed, setSpeed] = useState(600)

    // @ts-ignore
    const printChosenSpeed = (event) => {
        const speed = event.target.value
        changeSpeed(speed)
        setSpeed(speed)
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
                    <div className="algo-chose">
                        <Button type={undefined} clickHandler={() => dispatch(setTypeOfAlgo(true))} text="Red-Black Tree" />
                        <Button type={undefined} clickHandler={() => dispatch(setTypeOfAlgo(false))} text="Binary Search Tree" />
                    </div>
                </div>
                <div className="bottom-section">
                    <p>Delay(ms): {speed}</p>
                    <input type="range" onChange={printChosenSpeed} min='100' max='2000' />
                    <form onSubmit={addNode} action="">
                        <InputField text='Value of the node key.' />
                        <Button type='submit' text='Add node.' />
                    </form>
                    <div className="traversals-menu-container">
                        <Button type={undefined} clickHandler={openTraversalsMenu} text="Traversals." />
                        {traversalsMenuOpened ? <div className='traversals-menu'>
                            <Button type={undefined} clickHandler={preTraverse} text='Pre traverse tree.' />
                            <Button type={undefined} clickHandler={inTraverse} text='In traverse tree.' />
                            <Button type={undefined} clickHandler={postTraverse} text='Post traverse tree.' />
                        </div>: null}
                    </div>
                </div>
            </div>
            <Outlet />
        </>

    )
}
export default Navigation