const INITIAL_VALUE = {
    typeOfAlgo: true
}

export const typeReducer = (state = INITIAL_VALUE, action) => {
    const {type, payload} = action
    switch(type) {
        case 'SET_TYPE_OF_ALGO':
            return {
                ...state,
                typeOfAlgo: payload
            }
        default:
            return {
                ...state
            }
    }
}