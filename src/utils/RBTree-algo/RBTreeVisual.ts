import {
    ANIMATION_MODE, ANIMATION_MODE_ALT,
    ANIMATION_OFFSET,
    COLOR,
    DIRECTION,
    GSAPSPEED,
    INode, SPACE_BETWEEN_NODES_X,
    SPEED,
    UIInterface, WAITING_TIME
} from "./RBTreeConstants";
import {Node} from "./NodeClass";

//Function that horizontally translates a given node by a given amount of pixels.
export const translateX = async (node: HTMLDivElement, amount: string, timeToComplete: string, nodeInfo: string | undefined, color: COLOR): Promise<void> => {
    // @ts-ignore
    gsap.to(node, {duration: timeToComplete, x: amount, scaleX: '1', scaleY: '1', ease: ANIMATION_MODE_ALT})
    await waitForVisualAnimations(+timeToComplete * 1000 + ANIMATION_OFFSET)

    //Render its paragraph with the key to use some animations.
    const paragraphInfo = document.createElement('p')

    if(nodeInfo) {
        paragraphInfo.textContent = nodeInfo
        node.appendChild(paragraphInfo)
        //Change the node's background.
        color === COLOR.RED ? node.style.backgroundColor = 'red' : node.style.backgroundColor = 'black'
        //Wait for the paragraph to animate.
        await waitForVisualAnimations(270)
    }

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, +timeToComplete * 1000 + ANIMATION_OFFSET)
    })
}
//Function that just forces the program to wait for various animations to complete.
export const waitForVisualAnimations = (timeToWait: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, timeToWait)
    })
}


//Function that creates the visual representation of a given node.
export const createNodeVisual = async (UIid: number, key: number, ui: UIInterface, parent: INode, direction: DIRECTION, color: COLOR): Promise<void> => {
    return new Promise (async (resolve, reject) => {
        const child = document.createElement('div')
        child.classList.add('node-container')
        child.id = 'c' + UIid.toString()
        // child.textContent = String(key)
        if (parent)
            document.querySelector(`#c${parent.UIId}`)!.appendChild(child)
        else
            document.querySelector('.visual-area')!.appendChild(child)
        //The node was visually created now.
        //Start some slick animations XD!

        //We force an await here so the node can get created visually
        //This implies a .2s animation on the css file of the node.
        await waitForVisualAnimations(200 + ANIMATION_OFFSET)
        const goInCreationZone = window.innerWidth - 200 - (window.innerWidth - window.innerWidth / 2) - ui.x - SPACE_BETWEEN_NODES_X
        await translateX(child, goInCreationZone.toString(), (GSAPSPEED / 3).toString(), key.toString(), color)

        await translateX(child, '0', (GSAPSPEED / 3).toString(), key.toString(), color)

        if(parent !== undefined)
            if(direction === DIRECTION.RIGHT)
                //Because a new node spawns over the parent, you just need to lower it by 100% and go right/left by 100%
                // @ts-ignore
                gsap.to(child, {duration: GSAPSPEED / 3, x: '100%', y: '100%', scaleX: '1', scaleY: '1' , ease: ANIMATION_MODE})
        else
                // @ts-ignore
                gsap.to(child, {duration: GSAPSPEED / 3, x: '-100%', y: '100%',  scaleX: '1', scaleY: '1' , ease: ANIMATION_MODE})


        // // await waitForVisualAnimations(1000)
        // if(parent) {
        //     //Create the line to connect the 2 nodes.
        //     const newLine = document.createElement('div')
        //
        //     newLine.classList.add('line')
        //     newLine.style.transform = 'rotate(-45deg) translate(50%, 10%)'
        //     // @ts-ignore
        //     gsap.to(newLine, {duration: 1, height: '70', ease: ANIMATION_MODE})
        //     const visualParent = document.querySelector(`#c${parent.UIId}`)! as HTMLDivElement
        //     visualParent.appendChild(newLine)
        // }

        setTimeout(() => {
            resolve()
        }, SPEED)
    })
}

export const visualMoveTo = (node: Node, xAmount: string, yAmount: string): void => {
    const visualNode = document.querySelector(`#c${node.UIId}`)
    console.log(visualNode, xAmount, yAmount)
    // @ts-ignore
    gsap.to(visualNode, {duration: .1, x: xAmount, y: yAmount, scaleX: '1', scaleY: '1', ease: ANIMATION_MODE})
}



//Function that colors one node to a highlight color.
//It is used to highlight the current node in the search itself.
export const colorNode = async (node: Node, color: string): Promise<void> => {
    //Get the DOM element.
    const visualNode = document.getElementById('c' + node.UIId.toString())! as HTMLDivElement
    //Change it's color to a highlighter color.
    // @ts-ignore
    visualNode.style.backgroundColor = color
    visualNode.style.scale = '1.3'
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            //Change it's color back.
            //And every other highlight.
            node.Color === COLOR.RED ? visualNode.style.backgroundColor = 'red' : visualNode.style.backgroundColor = 'black'
            visualNode.style.scale = '1'
            resolve()
        }, SPEED)
    })
}
//This function warns about the tree being unbalanced.
export const alertUnbalanced = (node: Node) => {
//    Visually highlight the unbalanced / not good node.
    const nodeVisual: HTMLDivElement = document.querySelector(`#c${node.UIId}`)!
    nodeVisual.style.backgroundColor = 'orange'
}