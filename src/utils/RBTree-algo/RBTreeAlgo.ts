import {alertUnbalanced, colorNode, createNodeVisual, waitForVisualAnimations} from "./RBTreeVisual";
import {
    ANIMATION_MODE,
    ANIMATION_OFFSET,
    COLOR,
    DIRECTION,
    GSAPSPEED,
    INode,
    SPACE_BETWEEN_NODES_X,
    SPACE_BETWEEN_NODES_Y,
    UIInterface,
    WAITING_TIME
} from "./RBTreeConstants";
import {Node} from "./NodeClass";
import {preTraversal} from "./Traversals";


export class Tree {
    private root: Node
    constructor (root: Node) {
        this.root = root
    }
    get Root () {
        return this.root
    }
    set Root (root) {
        this.root = root
    }
}

const createNode = (key: number, color: COLOR, ui: UIInterface, parent: INode): Node => {
    let newNode = new Node(Node.LAST_ID + 1, key, color, undefined, undefined, parent, ui)
    return newNode
}

//This function computes the height of the subtree rooted in the given node.
const computeHeight = (node: Node): number => {
    if(!node)
        return 0
    let leftHeight = node.Left ? computeHeight(node.Left) : 0;
    let rightHeight = node.Right ? computeHeight(node.Right) : 0;
    return 1 + Math.max(leftHeight, rightHeight)
}

//This function computes the balance of a given node.
const computeBalance = (node: Node): number => {
    let leftHeight = node.Left ? computeHeight(node.Left) : 0;
    let rightHeight = node.Right ? computeHeight(node.Right) : 0;
    //So it returns the subtraction of the height of its left subtree and it's right subtree.
    return leftHeight - rightHeight
}

//Function that fixes a given collision.
const fixCollision = async (node1: Node, node2: Node, tree: Tree): Promise<void> => {
    //Parent of node1.
    let p1 = node1.Parent
    //Parent of node2.
    let p2 = node2.Parent
//    Guarantee that node1 is always the left node in the collision.
//    If not, switch the nodes.
    if(p1 && p1.Right !== node1){
        let aux: Node = p1
        p1 = p2
        p2 = aux
        aux = node1
        node1 = node2
        node2 = aux
    }

    if(p1) {
        //Cascade fix the UI
        cascadeUIFixup(tree.Root.Left, -SPACE_BETWEEN_NODES_X, 0)
        //Get DOM node of the uppermost node under the root.
        const rootVisualLeft = document.querySelector(`#c${tree.Root.Left?.UIId}`)
        if(tree.Root.Left)
            tree.Root.Left.NOFixUps++
        // @ts-ignore
        gsap.to(rootVisualLeft, {duration: GSAPSPEED, xPercent: -100, ease: ANIMATION_MODE})
    }
    if(p2) {
        //Cascade fix the UI
        cascadeUIFixup(tree.Root.Right, SPACE_BETWEEN_NODES_X, 0)
        //Get DOM node of the uppermost node under the root.
        const rootVisualRight = document.querySelector(`#c${tree.Root.Right?.UIId}`)
        if(tree.Root.Right)
            tree.Root.Right.NOFixUps++
        // @ts-ignore
        gsap.to(rootVisualRight, {duration: GSAPSPEED, xPercent: +100, ease: ANIMATION_MODE})
    }
    await waitForVisualAnimations(ANIMATION_OFFSET)
}


const checkIfCollided =  async (node: Node, tree: Tree): Promise<boolean> => {
    console.log("Checking for collisions!")
    const nodeUI = node.UI
    const nodes: Node[] = []
    await preTraversal(tree.Root, nodes, false, false)

    //Do not forget to remove the current node from the list of nodes.
    for (const otherNode of nodes.filter(listNode => listNode.UIId != node.UIId)) {
        if(otherNode.UI.x === nodeUI.x && otherNode.UI.y === nodeUI.y) {
            await fixCollision(node, otherNode, tree)
            return true
        }
    }
    return false
}

//Function that fixes the UI of the subtree of the given node.
const cascadeUIFixup = (node: INode, amountX: number, amountY: number): void => {
    console.log(node)
    //If node is not undefined.
    if(node !== undefined){
        //Fix its UI.
        node.UI.x += amountX
        node.UI.y += amountY
        //Cascade to the left and right subtrees.
        cascadeUIFixup(node.Right, amountX, amountY)
        cascadeUIFixup(node.Left, amountX, amountY)
    }
}

//Function that rotates the visual nodes on the screen.
const visuallyRotateNode = async (x: Node, y: Node, subtree: INode, direction: DIRECTION, tree: Tree): Promise<void> => {
    const visualNodeY = document.querySelector(`#c${y.UIId}`)!
    const visualNodeX = document.querySelector(`#c${x.UIId}`)!
    const visualNodeSubTree = document.querySelector(`#c${subtree?.UIId}`)!

    //Visually animate the rotation itself.

    //INTERESTING FACT: GSAP does NOT stack your commands, so if the node already has translateX: 100%
    //Saying it again would mean the same thing, NOT translateX: 200%
    //Use this: "yPercent: +100" to APPEND the new translate.

    if(direction === DIRECTION.LEFT) {
        // console.log("UI OF NODE:", x.UI)
        // @ts-ignore
        gsap.to(visualNodeX, {duration: GSAPSPEED / 3, xPercent: -(x.NOFixUps + 1) * 100, ease: ANIMATION_MODE})
        x.UI.x -= SPACE_BETWEEN_NODES_X
        y.UI.x -= SPACE_BETWEEN_NODES_X
        //Fix the ui of the subtree of y.
        cascadeUIFixup(y.Right, -SPACE_BETWEEN_NODES_X, -SPACE_BETWEEN_NODES_Y);
        // console.log("UI OF NODE:", x.UI)
    }
    else {
        // @ts-ignore
        gsap.to(visualNodeX, {duration: GSAPSPEED / 3, xPercent: +(x.NOFixUps + 1) * 100, ease: ANIMATION_MODE})
        x.UI.x += SPACE_BETWEEN_NODES_X
        y.UI.x += SPACE_BETWEEN_NODES_X
        //Fix the ui of the subtree of y.
        cascadeUIFixup(y.Left, SPACE_BETWEEN_NODES_X, -SPACE_BETWEEN_NODES_Y);
    }



    await waitForVisualAnimations(GSAPSPEED * 1000 + ANIMATION_OFFSET)
    // @ts-ignore
    gsap.to(visualNodeX, {duration: GSAPSPEED / 3, yPercent: +100, ease: ANIMATION_MODE})
    x.UI.y += SPACE_BETWEEN_NODES_Y
    await waitForVisualAnimations(GSAPSPEED * 1000 + ANIMATION_OFFSET)
    // @ts-ignore
    gsap.to(visualNodeY, {duration: GSAPSPEED / 3, y: '-100%', ease: ANIMATION_MODE})
    y.UI.y -= SPACE_BETWEEN_NODES_Y

    await waitForVisualAnimations(GSAPSPEED * 1000 + ANIMATION_OFFSET)

    //Even if the animation did the job visually in the DOM
    //there is still the old order:
    //x is still the parent of y
    //this can break the algo on later rotations.
    //Fix this!

    //Reference to the visual area of the visualiser.
    const visualArea = document.querySelector('.visual-area')! as HTMLDivElement
    //To insert before, we need the parent.
    let parentReference = visualArea
    if(x.Parent)
        parentReference = document.querySelector(`#c${x.Parent.UIId}`) as HTMLDivElement
    console.log('+++', x, y, parentReference)
    //Deeply clone y.
    const cloneNodeY = visualNodeY.cloneNode(true) as HTMLDivElement
    //Remove y so you do not deep clone it in x's clone.
    visualNodeY.remove()
    const cloneNodeX = visualNodeX.cloneNode(true) as HTMLDivElement
    //Clear the previous translates as they make no sense now.
    cloneNodeY.style.transform = ''
    //Clear x's previous translates.
    cloneNodeX.style.transform = ''
    //Add x as the child of y.
    //But add it as the first child.
    cloneNodeY.insertBefore(cloneNodeX, cloneNodeY.firstChild)
    let cloneNodeSubTree = undefined
    //Insert the subtree as X's child.
    if(subtree) {
        cloneNodeSubTree = visualNodeSubTree.cloneNode(true) as HTMLDivElement
        //Remove old subtree.
        visualNodeSubTree.remove();
        cloneNodeSubTree.style.transform = ''
        cloneNodeX.appendChild(cloneNodeSubTree)
    }
    // await waitForVisualAnimations(1000)

    if(direction === DIRECTION.LEFT) {
        //If y is the new root, it is already in place.
        if(x.Parent !== undefined)
            if(x === x.Parent.Right)
                cloneNodeY.style.transform = `translate(${(x.NOFixUps + 1) * 100}%, 100%)`
            else
                cloneNodeY.style.transform = `translate(-${(x.NOFixUps + 1) * 100}%, 100%)`
        cloneNodeX.style.transform = 'translate(-100%, 100%)'
    //    Subtree is on the right side.
        if(subtree)
            // @ts-ignore
            gsap.to(cloneNodeSubTree, {duration: GSAPSPEED / 3, y: '100%', x: '100%', scale: 1, ease: ANIMATION_MODE})
    }

    if(direction === DIRECTION.RIGHT) {
        if(x.Parent !== undefined)
            if(x === x.Parent.Left)
                cloneNodeY.style.transform = `translate(-${(x.NOFixUps + 1) * 100}%, 100%)`
            else
                cloneNodeY.style.transform = `translate(${(x.NOFixUps + 1) * 100}%, 100%)`
        cloneNodeX.style.transform = 'translate(100%, 100%)'
        //    Subtree is on the left side.
        if(subtree)
            // @ts-ignore
            gsap.to(cloneNodeSubTree, {duration: GSAPSPEED / 3, y: '100%', x: '-100%', scale: 1, ease: ANIMATION_MODE})
    }

    parentReference.insertBefore(cloneNodeY, visualNodeX);
    //Remove the old nodes.

    await waitForVisualAnimations(WAITING_TIME)
    visualNodeX.remove()


    //If it is root.
    if(x.Parent === undefined)
        tree.Root = y

    checkIfCollided(x, tree)

}


// This function rotates some nodes.
const rotateLeft = async (x: Node, tree: Tree): Promise<INode> => {
// Here the Tree is RIGHT HEAVY
    const y = x.Right
    const subtree = y?.Left
    const p = x.Parent

    if(y) {
        y.Left = x
        await visuallyRotateNode(x, y, subtree, DIRECTION.LEFT, tree)
    }
    x.Right = subtree
    //Fix the parents.
    //Check to see where is the parent?
    if(p)
        //If x is his right child.
        if(p.Right === x)
            p.Right = y;
        else
            p.Left = y
    if(y)
        y.Parent = p

    x.Parent = y
    return y
}

// This function rotates some nodes.
const rotateRight = async (x: Node, tree: Tree): Promise<INode> => {
// Here the Tree is LEFT HEAVY
    const y = x.Left
    const subtree = y?.Right
    const p = x.Parent
    if(y) {
        y.Right = x
        await visuallyRotateNode(x, y, subtree, DIRECTION.RIGHT, tree)
    }
    x.Left = subtree
    //Fix the parents.
    //Check to see where is the parent?
    if(p)
        //If x is his right child.
        if(p.Right === x)
            p.Right = y;
        else
            p.Left = y
    if(y)
        y.Parent = p

    x.Parent = y
    return y
}

const insertAux = async (node: INode, key: number, prevNode: INode, direction: DIRECTION, tree: Tree): Promise<Node> => {

//    Insert as you would in a regular BST
    if(!node) {
        //I need to handle the UI here.
        let newUI
        if(direction === DIRECTION.RIGHT)
            newUI = {x: prevNode!.UI.x + SPACE_BETWEEN_NODES_X, y: prevNode!.UI.y + SPACE_BETWEEN_NODES_Y}

        else
                newUI = {x: prevNode!.UI.x - SPACE_BETWEEN_NODES_X, y: prevNode!.UI.y + SPACE_BETWEEN_NODES_Y}
        //Just create a regular new node.
        const node = createNode(key, COLOR.RED, newUI, prevNode);
        console.log(node)
        //Also render it visually.
        await createNodeVisual(Node.LAST_ID += 1, key, newUI, node.Parent, direction, COLOR.RED)
        return node
    }
    if(key > node.Key) {
        //First you have to wait for the visual representation of the search.
        await colorNode(node, 'green');
        //Just go to the right child.
        node.Right = await insertAux(node.Right, key, node, DIRECTION.RIGHT, tree)
        //Check for collisions.
        //node.Right is the new node here.
        await checkIfCollided(node.Right, tree)
        //After that, update the parent ref.
        node.Right.Parent = node;
    }
    if(key <= node.Key) {
        //First you have to wait for the visual representation of the search.
        await colorNode(node, 'green');
        //Just go to the left child.
        node.Left = await insertAux(node.Left, key, node, DIRECTION.LEFT, tree);
        //Check for collisions.
        //node.Left is the new node here.
        await checkIfCollided(node.Left, tree)
        //After that, update the parent ref.
        node.Left.Parent = node;
    }
    //Return node to not change anything on your
    //way back to the top of the recursive chain
    return node
}

//Function that returns the node with a given key in the RBTree.
const findNode = async (root: INode, key: number): Promise<void | INode> => {
    //If I got to an undefined node, the key is missing!
    if(!root)
        return undefined;
    //Await some colouring.
    await colorNode(root, 'green')
    //Go right.
    if(key > root.Key)
        return findNode(root.Right, key)
    //Go left.
    if(key < root.Key)
        return findNode(root.Left, key)
    //Found it!
    if(key === root.Key)
        return root
}


//Function that inserts the given key in the RBTree.
export const insert = async (root: Tree, key: number, rb: boolean): Promise<void> => {
    root.Root = await insertAux(root.Root, key, undefined, DIRECTION.RIGHT, root)
    //If the user chose Red Black
    if(rb) {
        //We search the inserted node to check for unbalances.
        const insertedNode = await findNode(root.Root, key);
        await RBFixup(insertedNode!, root)
    }
}

//Function that fixes the properties of a RBTree starting from a given node.
const RBFixup = async (node: Node, tree: Tree): Promise<void> => {
    //Parent of node.
    const p: INode = node.Parent
    //Grandparent of node.
    const g: INode = p ? p.Parent : undefined
    //Uncle of node.
    let u: INode = undefined
    //The color of the uncle.

    //If there is no grandparent, uncle color is BLACK.
    let uColor: COLOR = COLOR.BLACK
    if(g) {
        //Check if the uncle is in the left or in the right spot.
        u = p === g.Right ? g.Left : g.Right
        //If uncle is not undefined, color is its color.
        //If it is undefined, color is BLACK.
        uColor = u ? u.Color : COLOR.BLACK
    }
    //If the root is not black.
    if(node === tree.Root)
        if(node.Color === COLOR.RED){
            node.Color = COLOR.BLACK
            await colorNode(node, 'black')
        }
    if(p)
        //This is the main problem of the RBTree.
        if(node.Color === COLOR.RED && p.Color === COLOR.RED) {
            alertUnbalanced(node)
            alertUnbalanced(p)
        //    Just wait a sec so people can see that those 2 nodes are problematic.
            await waitForVisualAnimations(WAITING_TIME)
        //    If the uncle is RED.
            if(uColor === COLOR.RED){
            //    Recolor.
            //    Parent.
                await changeColor(p)
                //Grandparent.
                await changeColor(g)
                //Uncle.
                await changeColor(u)
                // Just color the node back.
                await colorNode(node, 'red')
            //    Go up and continue the fix-up.
                await RBFixup(p, tree);
            }
            else
                //If the uncle is black.
                if(uColor === COLOR.BLACK){
                //    LR case.
                    if(node === p.Right && p === g?.Left) {
                        await rotateLeft(p, tree)
                        await colorNode(p, 'red')
                        // Just color the node back.
                        await colorNode(node, 'red')
                        await RBFixup(p, tree);
                    }
                    //    RL case.
                    else
                        if(node === p.Left && p === g?.Right) {
                            await rotateRight(p, tree)
                            await colorNode(p, 'red')
                            // Just color the node back.
                            await colorNode(node, 'red')
                            await RBFixup(p, tree);
                        }
                        //RR case
                        else
                            if(node === p.Right && p === g?.Right) {
                                await rotateLeft(g, tree)
                                await changeColor(p)
                                await changeColor(g)
                                // Just color the node back.
                                await colorNode(node, 'red')
                                await RBFixup(p, tree)
                            }
                            //LL case
                            else
                                if(node === p.Left && p === g?.Left) {
                                    await rotateRight(g, tree)
                                    await changeColor(p)
                                    await changeColor(g)
                                    // Just color the node back.
                                    await colorNode(node, 'red')
                                    await RBFixup(p, tree)
                                }
                }
        }
    //No problems, just continue.
    else
        await RBFixup(p, tree);

}

//Function that changes the color of a given node.
const changeColor = async (node: INode): Promise<void> => {
    if(node) {
        if(node.Color === COLOR.BLACK){
            node.Color = COLOR.RED
            await colorNode(node, 'red')
        }
        else{
            node.Color = COLOR.BLACK
            await colorNode(node, 'black')
        }
        // // @ts-ignore
        // gsap.to(visualNode, {duration: GSAPSPEED, x: -goInCreationZone, scaleX: '1', scaleY: '1', ease: ANIMATION_MODE_ALT})
        // await waitForVisualAnimations(GSAPSPEED)
    }
}

export const createTree = async (key: number): Promise<Tree> => {
    const root = new Tree(createNode(key, COLOR.BLACK, {x: 0, y: 0}, undefined))
    //Render visually the root to help the flow begin.
    await createNodeVisual(Node.LAST_ID += 1, root.Root.Key, root.Root.UI, undefined, DIRECTION.RIGHT, COLOR.BLACK)
    return root
}

// export const testMe = () => {
//     let tree = createTree()
//     insert(tree, 10)
//     insert(tree, 20)
//     insert(tree, 30)
//     insert(tree, 1)
//     insert(tree, 2)
//     insert(tree, 3)
//     insert(tree, 0)
//     // insert(tree, 6)
//     // insert(tree, 9)
//     // insert(tree, 8)
//     // insert(tree, 5)
//     preTraversal(tree.Root, [], true)
//     console.log('\n')
//     inTraversal(tree.Root)
// }
