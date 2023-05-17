import { ActionTypes } from "../constants/action-types";
export const setCollector = (collectorName, characterList) => {
  
  return {
    type: ActionTypes.SET_COLLECTOR,
    payload: { collectorName: collectorName, characterList: characterList },
  };
};

export const selectedCollector = (id, collectorName, characterList) => {
  return {
    type: ActionTypes.SELECTED_COLLECTOR,
    payload: { id: id, collectorName: collectorName, characterList: characterList },
  };
};

export const unSelectedCollector = (id) => {
  return {
    type: ActionTypes.UNSELECTED_COLLECTOR,
    payload: { id: id },
  };
};

export const deleteCollector = (id) => {
  return {
    type: ActionTypes.DELETE_COLLECTOR,
    payload: { id: id },
  };
};

export const addCharacter = (id, characterList) => {
  return {
    type: ActionTypes.ADD_CHARACTER,
    payload: { id: id, characterList: characterList },
  };
};

export const deleteCharacter = (id, characterList) => {
  return {
    type: ActionTypes.DELETE_CHARACTER,
    payload: { id: id, characterList: characterList },
  };
};
