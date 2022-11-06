import './home-page.css'
import '../node/node.css'
import React from "react";

const HomePage: React.FC = () => {
    return (
        <div className='home-page-container'>
            <div className='visual-area'>
                <div className="node-creator">
                    <h2>Node Pit Stop</h2>
                    <p>Stop here to get your dessignated color & key!</p>
                </div>
            </div>
        </div>
    )
}
export default HomePage