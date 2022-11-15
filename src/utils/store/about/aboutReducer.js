const INITIAL_VALUE = {
    opened: false
}

export const aboutReducer = (state = INITIAL_VALUE, action) => {
    const {type, payload} = action
    switch (type) {
        case 'SET_ABOUT_OPENED':
            return {
                ...state,
                opened: payload
            }
        default:
            return {
                ...state
            }
    }
}