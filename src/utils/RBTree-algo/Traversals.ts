import {INode} from "./RBTreeConstants";
import {Node} from "./NodeClass";
import {colorNode} from "./RBTreeVisual";

export const preTraversal = async (node: INode, nodes: Node[], highlight: boolean, writeToArea: boolean): Promise<void> => {
    if(node){
        console.log(node)
        nodes.push(node)
        //There are some cases where I want to do this incognito! XD
        if(highlight)
            await colorNode(node, 'green')
        if(writeToArea) {
            //Write the key of the node on the screen!
            const writeArea = document.querySelector(".write-area")!;
            const newP = document.createElement('p') as HTMLParagraphElement
            newP.textContent = node.Key.toString()
            writeArea.appendChild(newP);
        }

        await preTraversal(node.Left, nodes, highlight, writeToArea)
        await preTraversal(node.Right, nodes, highlight, writeToArea)
    }
}
export const inTraversal = async (node: INode, nodes: Node[], highlight: boolean, writeToArea: boolean): Promise<void> => {
    if(node){
        //There are some cases where I want to do this incognito! XD
        if(highlight)
            await colorNode(node, 'green')
        await inTraversal(node.Left, nodes, highlight, writeToArea)
        if(writeToArea) {
            //Write the key of the node on the screen!
            const writeArea = document.querySelector(".write-area")!;
            const newP = document.createElement('p') as HTMLParagraphElement
            newP.textContent = node.Key.toString()
            writeArea.appendChild(newP);
        }
        console.log(node)
        nodes.push(node)

        await inTraversal(node.Right, nodes, highlight, writeToArea)
    }
}
export const postTraversal = async (node: INode, nodes: Node[], highlight: boolean, writeToArea: boolean): Promise<void> => {
    if(node){
        //There are some cases where I want to do this incognito! XD
        if(highlight)
            await colorNode(node, 'green')

        await postTraversal(node.Left, nodes, highlight, writeToArea)
        await postTraversal(node.Right, nodes, highlight, writeToArea)
        if(writeToArea) {
            //Write the key of the node on the screen!
            const writeArea = document.querySelector(".write-area")!;
            const newP = document.createElement('p') as HTMLParagraphElement
            newP.textContent = node.Key.toString()
            writeArea.appendChild(newP);
        }
        console.log(node)
        nodes.push(node)

    }
}