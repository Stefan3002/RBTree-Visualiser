import {Node} from "./NodeClass";

export const SPEED = 500
//Because GSAP wants a duration of 1, we have to accommodate this with our speed of 1000
export const GSAPSPEED: number = SPEED / 1000
export const SPACE_BETWEEN_NODES_X = 50
export const SPACE_BETWEEN_NODES_Y = 50
export const BALANCE_FACTOR = 1
export const ANIMATION_MODE = 'none'
export const ANIMATION_MODE_ALT = 'none'
//Offsets a bit the animations in certain points to make it more visually appealing.
export const ANIMATION_OFFSET = 250
//The time the animation will wait so people can see certain colouring, before changing them.
export const WAITING_TIME = 2000

export enum COLOR {
    RED, BLACK
}
export enum DIRECTION {
    LEFT, RIGHT
}

export interface UIInterface {
    x: number
    y: number
}
export type INode = Node | undefined


