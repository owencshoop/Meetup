import { csrfFetch } from "./csrf";

const LOAD_GROUPS = 'groups/LOAD_GROUPS'

export const setGroups = (groups) => {
    return {
        type: LOAD_GROUPS,
        payload: groups
    }
}

// TODO - copy shitty feature where you can never access the 'add group' button because it keeps loading more events/groups
export const loadGroups = () => async (dispatch) => {
    const response = await csrfFetch('/api/groups')
    if (response.ok){
        const data = await response.json()
        dispatch(setGroups(data.Groups))
        return data.Groups
    }
}

const initialState = {allGroups: {}, singleGroup: {}}

const groupReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_GROUPS:
            newState = {...state}
            action.payload.forEach(group => newState.allGroups[group.id] = group)
            return newState
        default:
            return state;
    }
}

export default groupReducer
