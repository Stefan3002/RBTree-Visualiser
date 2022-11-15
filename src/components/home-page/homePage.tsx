import './home-page.css'
import '../node/node.css'
import React from "react";
import {useSelector} from "react-redux";
import {getAboutOpened} from "../../utils/store/about/aboutSelectors";
import About from "../about/about";

const HomePage: React.FC = () => {
    const aboutOpened = useSelector(getAboutOpened)

    return (
        <>
            {aboutOpened ? <About /> : null}
            <div className='home-page-container'>
                <div className='visual-area'>
                    <div className="node-creator">
                        <h2>Node Pit Stop</h2>
                        <p>Stop here to get your designated color & key!</p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default HomePage