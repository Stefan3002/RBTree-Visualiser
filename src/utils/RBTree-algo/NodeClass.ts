import {COLOR, INode, UIInterface} from "./RBTreeConstants";

export class Node {
    public static LAST_ID: number = 0

    private NOFixups: number
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
        this.NOFixups = 0
    }
    get NOFixUps () {
        return this.NOFixups
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

    set NOFixUps (fixups) {
        this.NOFixups = fixups
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