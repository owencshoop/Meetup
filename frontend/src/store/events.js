import { csrfFetch } from "./csrf";

const LOAD_EVENTS = 'events/LOAD_EVENTS'

export const setEvents = (events) => {
    return {
        type: LOAD_EVENTS,
        payload: events
    }
}

// TODO - copy shitty feature where you can never access the 'add group' button because it keeps loading more events/groups
export const loadEvents = () => async (dispatch) => {
    const response = await csrfFetch('/api/events')
    if (response.ok){
        const data = await response.json()
        dispatch(setEvents(data.Events))
        return data.Groups
    }
}

const initialState = {allEvents: {}}

const eventReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_EVENTS:
            newState = {...state}
            action.payload.forEach(event => newState.allEvents[event.id] = event)
            return newState
        default:
            return state
    }
}

export default eventReducer
