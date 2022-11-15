import './about.css'
import React from "react";
import Blur from "../blur/blur";
const About: React.FC = () => {


    return (
        <>
            <Blur />
            <div className='about-container'>
                <div className="about-text">
                    <h2>Welcome to RBTree visualizer!</h2>
                    <p>Here is how it works:</p>
                    <ul>
                        <li>2 orange nodes are violating the RBTree definition.</li>
                        <li>Green nodes will be highlighted to show how the algo traverses the tree.</li>
                    </ul>
                </div>
            </div>
        </>

    )
}
export default About