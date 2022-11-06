import './node.css'
import React from "react";

interface nodeProps {
    nodeKey: string
    nodeID: string
}

const Node: React.FC<nodeProps> = ({nodeID, nodeKey}) => {
    return (
        <div id={nodeID} className='node-container'>
            <p>{nodeKey}</p>
        </div>
    )
}
export default Node