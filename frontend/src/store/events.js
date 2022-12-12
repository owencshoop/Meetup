import { csrfFetch } from "./csrf";

const LOAD_EVENTS = "events/LOAD_EVENTS";
const ADD_EVENT = "events/ADD_EVENT";
const GET_EVENT = "events/GET_EVENT";
const DELETE_EVENT = "event/DELETE_EVENT";

export const setEvents = (events) => {
  return {
    type: LOAD_EVENTS,
    payload: events,
  };
};

export const addEvent = (event) => {
  return {
    type: ADD_EVENT,
    payload: event,
  };
};

export const getEvent = (event) => {
  return {
    type: GET_EVENT,
    payload: event,
  };
};

export const deleteEvent = (eventId) => {
  return {
    type: DELETE_EVENT,
    payload: eventId,
  };
};

// TODO - copy shitty feature where you can never access the 'add group' button because it keeps loading more events/groups
export const loadEvents = () => async (dispatch) => {
  const response = await csrfFetch("/api/events");
  if (response.ok) {
    const data = await response.json();
    dispatch(setEvents(data.Events));
    return data.Groups;
  }
};

export const addEventThunk = (event, groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  });
  if (response.ok) {
    const data = await response.json()
    dispatch(addEvent(data))
    return data
  }
};

export const getEventThunk = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getEvent(data));
    return data;
  }
};

export const deleteEventThunk = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(deleteEvent(eventId));
    return data;
  }
};

const initialState = { allEvents: {}, singleEvent: {} };

const eventReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case LOAD_EVENTS:
      newState = { ...state, allEvents: {...state.allEvents}, singleEvent: {...state.singleEvent} };
      action.payload.forEach((event) => (newState.allEvents[event.id] = event));
      return newState;
    case ADD_EVENT:
      newState = {...state,
      allEvents: {...state.allEvents, [action.payload.id]: action.payload},
      singleEvent: {...state.singleEvent} // remove from single event
      }
      return newState
    case GET_EVENT:
      newState = { ...state, allEvents: {...state.allEvents, [action.payload.id]: action.payload}, singleEvent: {...state.singleEvent, ...action.payload } };
      return newState;
    case DELETE_EVENT:
      newState = { ...state, allEvents: {...state.allEvents} };
      delete newState.allEvents[action.payload];
      return newState;
    default:
      return state;
  }
};

export default eventReducer;
