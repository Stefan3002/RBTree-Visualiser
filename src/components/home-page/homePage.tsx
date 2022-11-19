import './home-page.css'
import '../node/node.css'
import React from "react";
import {useSelector} from "react-redux";
import {getAboutOpened} from "../../utils/store/about/aboutSelectors";
import About from "../about/about";
import Button from "../button/button";

const HomePage: React.FC = () => {
    const aboutOpened = useSelector(getAboutOpened)

    //Function that will clear the writable area where the traversals will print the keys.
    const clearWriteArea = () => {
        const writeArea = document.querySelector(".write-area")! as HTMLDivElement
        //Set its html to nothing to quickly remove everything!
        writeArea.innerHTML = ''
    }

    return (
        <>
            {aboutOpened ? <About /> : null}
            <div className='home-page-container'>
                <div className='visual-area'>
                    <div className="node-creator">
                        <h2>Node Pit Stop</h2>
                        <p>Stop here to get your designated color & key!</p>
                        <div className="write-area" />
                        <Button type={undefined} clickHandler={clearWriteArea} text="Clear." />
                    </div>
                </div>
            </div>
        </>
    )
}
export default HomePage