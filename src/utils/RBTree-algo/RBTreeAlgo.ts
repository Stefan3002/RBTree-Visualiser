import {alertUnbalanced, colorNode, createNodeVisual, waitForVisualAnimations} from "./RBTreeVisual";
import {
    ANIMATION_MODE,
    ANIMATION_OFFSET,
    COLOR,
    DIRECTION, GSAPSPEED,
    INode,
    SPACE_BETWEEN_NODES_X,
    SPACE_BETWEEN_NODES_Y,
    UIInterface,
    WAITING_TIME
} from "./RBTreeConstants";


export class Node {
    public static LAST_ID: number = 0
    private UIid: number
    private key: number
    private color: COLOR = COLOR.RED
    private left: INode
    private right: INode
    private parent: INode
    private ui: UIInterface
    constructor (UIid: number, key: number, color: COLOR, left: INode, right: INode, parent: INode, UI: UIInterface) {
        this.key = key
        this.color = color
        this.left = left
        this.right = right
        this.parent = parent
        this.ui = UI
        this.UIid = UIid
    }
    get Parent () {
        return this.parent
    }
    get Color () {
        return this.color
    }
    get UIId () {
        return this.UIid
    }
    get UI () {
        return this.ui
    }
    get Left () {
        return this.left
    }
    get Right () {
        return this.right
    }
    get Key () {
        return this.key
    }
    set Parent (parent: INode) {
        this.parent = parent;
    }
    set Left (left) {
        this.left = left
    }
    set Right (right) {
        this.right = right
    }
    set Color (color: COLOR) {
        this.color = color
    }
}
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

export const preTraversal = async (node: INode): Promise<void> => {
    if(node){
        console.log(node.Key)
        await colorNode(node, 'green')
        preTraversal(node.Left)
        preTraversal(node.Right)
    }
}
export const inTraversal = (node: INode): void => {
    if(node){
        inTraversal(node.Left)
        console.log(node.Key)
        inTraversal(node.Right)
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

//Function that rotates the visual nodes on the screen.
const visuallyRotateNode = async (x: Node, y: Node, direction: DIRECTION, root: Node): Promise<void> => {
    const visualNodeY = document.querySelector(`#c${y.UIId}`)!
    const visualNodeX = document.querySelector(`#c${x.UIId}`)!

    //Visually animate the rotation itself.

    //INTERESTING FACT: GSAP does NOT stack your commands, so if the node already has translateX: 100%
    //Saying it again would mean the same thing, NOT translateX: 200%
    //Use this: "yPercent: +100" to APPEND the new translate.

    if(direction === DIRECTION.LEFT) {
        // @ts-ignore
        gsap.to(visualNodeX, {duration: GSAPSPEED / 3, xPercent: -100, ease: ANIMATION_MODE})
        x.UI.x -= SPACE_BETWEEN_NODES_X
    }
    else {
        // @ts-ignore
        gsap.to(visualNodeX, {duration: GSAPSPEED / 3, xPercent: +100, ease: ANIMATION_MODE})
        x.UI.x += SPACE_BETWEEN_NODES_X
    }

    await waitForVisualAnimations(GSAPSPEED * 1000 + ANIMATION_OFFSET)
    // @ts-ignore
    gsap.to(visualNodeX, {duration: GSAPSPEED / 3, yPercent: +100, ease: ANIMATION_MODE})
    x.UI.x += SPACE_BETWEEN_NODES_X
    await waitForVisualAnimations(GSAPSPEED * 1000 + ANIMATION_OFFSET)
    // @ts-ignore
    gsap.to(visualNodeY, {duration: GSAPSPEED / 3, y: '-100%', ease: ANIMATION_MODE})
    y.UI.y -= SPACE_BETWEEN_NODES_Y
    await waitForVisualAnimations(GSAPSPEED * 1000 + ANIMATION_OFFSET)

}


// This function rotates some nodes.
const rotateLeft = async (x: Node, root: Node): Promise<INode> => {
// Here the Tree is RIGHT HEAVY
    const y = x.Right
    const subtree = y?.Left
    const p = x.Parent

    if(y) {
        y.Left = x
        await visuallyRotateNode(x, y, DIRECTION.LEFT, root)
    }
    x.Right = subtree
    //Fix the parents.
    if(p)
        p.Right = y
    if(y)
        y.Parent = p

    x.Parent = y
    return y
}

// This function rotates some nodes.
const rotateRight = async (x: Node, root: Node): Promise<INode> => {
// Here the Tree is LEFT HEAVY
    const y = x.Left
    const subtree = y?.Right
    const p = x.Parent
    if(y) {
        y.Right = x
        await visuallyRotateNode(x, y, DIRECTION.RIGHT, root)
    }
    x.Left = subtree
    //Fix the parents.
    if(p)
        p.Left = y
    if(y)
        y.Parent = p

    x.Parent = y
    return y
}

const insertAux = async (node: INode, key: number, prevNode: INode, direction: DIRECTION): Promise<Node> => {
    console.log(node)
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
        //Also render it visually.
        await createNodeVisual(Node.LAST_ID += 1, key, newUI, node.Parent, direction, COLOR.RED)
        return node
    }
    if(key > node.Key) {
        //First you have to wait for the visual representation of the search.
        await colorNode(node, 'green');
        //Just go to the right child.
        node.Right = await insertAux(node.Right, key, node, DIRECTION.RIGHT)
        //After that, update the parent ref.
        node.Right.Parent = node;
    }
    if(key <= node.Key) {
        //First you have to wait for the visual representation of the search.
        await colorNode(node, 'green');
        //Just go to the left child.
        node.Left = await insertAux(node.Left, key, node, DIRECTION.LEFT);
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

let once = true
//Function that inserts the given key in the RBTree.
export const insert = async (root: Tree, key: number): Promise<void> => {
    //Render visually the dummy root to help the flow begin.
    if(once) {
        await createNodeVisual(Node.LAST_ID += 1, root.Root.Key, root.Root.UI, undefined, DIRECTION.RIGHT, COLOR.BLACK)
        once = false
    }
    root.Root = await insertAux(root.Root, key, undefined, DIRECTION.RIGHT)
    //We search the inserted node to check for unbalances.
    const insertedNode = await findNode(root.Root, key);
    await RBFixup(insertedNode!, root.Root)
}

//Function that fixes the properties of a RBTree starting from a given node.
const RBFixup = async (node: Node, root: Node): Promise<void> => {
    console.log('--', node, root)
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
    if(node === root)
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
                await RBFixup(p, root);
            }
            else
                //If the uncle is black.
                if(uColor === COLOR.BLACK){
                //    LR case.
                    if(node === p.Right && p === g?.Left) {
                        await rotateLeft(p, root)
                        await colorNode(p, 'red')
                        // Just color the node back.
                        await colorNode(node, 'red')
                        await RBFixup(p, root);
                    }
                    //    RL case.
                    else
                        if(node === p.Left && p === g?.Right) {
                            await rotateRight(p, root)
                            await colorNode(p, 'red')
                            // Just color the node back.
                            await colorNode(node, 'red')
                            await RBFixup(p, root);
                        }
                        //RR case
                        else
                            if(node === p.Right && p === g?.Right) {
                                await rotateLeft(g, root)
                                await changeColor(p)
                                await changeColor(g)
                                // Just color the node back.
                                await colorNode(node, 'red')
                                await RBFixup(p, root)
                            }
                            //LL case
                            else
                                if(node === p.Left && p === g?.Left) {
                                    await rotateRight(g, root)
                                    await changeColor(p)
                                    await changeColor(g)
                                    // Just color the node back.
                                    await colorNode(node, 'red')
                                    await RBFixup(p, root)
                                }
                }
        }
    //No problems, just continue.
    else
        await RBFixup(p, root);

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

export const createTree = () => {
    return new Tree(createNode(-1, COLOR.BLACK, {x: 0, y: 10}, undefined))
}

export const testMe = () => {
    let tree = createTree()
    insert(tree, 10)
    insert(tree, 20)
    insert(tree, 30)
    insert(tree, 1)
    insert(tree, 2)
    insert(tree, 3)
    insert(tree, 0)
    // insert(tree, 6)
    // insert(tree, 9)
    // insert(tree, 8)
    // insert(tree, 5)
    preTraversal(tree.Root)
    console.log('\n')
    inTraversal(tree.Root)
}
