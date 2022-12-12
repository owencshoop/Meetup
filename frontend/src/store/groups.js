import { csrfFetch } from "./csrf";

const LOAD_GROUPS = "groups/LOAD_GROUPS";
const ADD_GROUP = "groups/ADD_GROUP";
const EDIT_GROUP = "group/EDIT_GROUP";
const GET_GROUP = "/groups/GET_GROUP";
const DELETE_GROUP = "groups/DELETE_GROUP";

export const setGroups = (groups) => {
  return {
    type: LOAD_GROUPS,
    payload: groups,
  };
};

export const addGroup = (group) => {
  return {
    type: ADD_GROUP,
    payload: group,
  };
};

export const editGroup = (group) => {
  return {
    type: EDIT_GROUP,
    payload: group,
  };
};

export const getGroup = (group) => {
  return {
    type: GET_GROUP,
    payload: group,
  };
};

export const deleteGroup = (groupId) => {
  return {
    type: DELETE_GROUP,
    payload: groupId,
  };
};

// TODO - copy shitty feature where you can never access the 'add group' button because it keeps loading more events/groups
export const loadGroups = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups");
  if (response.ok) {
    const data = await response.json();
    dispatch(setGroups(data.Groups));
    return data.Groups;
  }
};

export const addGroupThunk = (group) => async (dispatch) => {
  const response = await csrfFetch("/api/groups", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(group),
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(addGroup(data));
    return data;
  }
};

export const editGroupThunk = (group, groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(group),
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(editGroup(data));
    return data;
  }
};

export const getGroupThunk = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getGroup(data));
    return data;
  }
};

export const deleteGroupThunk = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(deleteGroup(groupId));
    return data;
  }
};

const initialState = { allGroups: {}, singleGroup: {} };

const groupReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case LOAD_GROUPS:
      newState = { ...state, allGroups: {...state.allGroups}, singleGroup: {...state.singleGroup} };
      action.payload.forEach((group) => (newState.allGroups[group.id] = group));
      return newState;
    case ADD_GROUP:
      newState = {
        ...state,
        allGroups: { ...state.allGroups, [action.payload.id]: action.payload },
        singleGroup: { ...state.singleGroup }, // dont change single group
      };
      return newState;
    case EDIT_GROUP:
      newState = {
        ...state,
        allGroups: {
          ...state.allGroups,
          [action.payload.id]: {
            ...state.allGroups[action.payload.id],
            ...action.payload,
          },
        },
        singleGroup: { ...state.singleGroup},
      };
      return newState;
    case GET_GROUP:
      newState = { ...state, allGroups: {...state.allGroups, [action.payload.id]: action.payload}, singleGroup: {...state.singleGroup, ...action.payload } };
      return newState;
    case DELETE_GROUP:
      newState = { ...state, allGroups: {...state.allGroups} };
      delete newState.allGroups[action.payload];
      return newState;
    default:
      return state;
  }
};

export default groupReducer;
