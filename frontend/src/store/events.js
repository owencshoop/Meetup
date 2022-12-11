import { csrfFetch } from "./csrf";

const LOAD_EVENTS = "events/LOAD_EVENTS";
const GET_EVENT = "events/GET_EVENT";
const DELETE_EVENT = "event/DELETE_EVENT";

export const setEvents = (events) => {
  return {
    type: LOAD_EVENTS,
    payload: events,
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
      newState = { ...state };
      action.payload.forEach((event) => (newState.allEvents[event.id] = event));
      return newState;
    case GET_EVENT:
      newState = { ...state, singleEvent: { ...action.payload } };
      return newState;
    case DELETE_EVENT:
      newState = { ...state };
      delete newState.allEvents[action.payload];
      return newState;
    default:
      return state;
  }
};

export default eventReducer;
