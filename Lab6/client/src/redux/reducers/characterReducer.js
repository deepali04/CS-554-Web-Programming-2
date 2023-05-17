import { ActionTypes } from "../constants/action-types";
import { v4 as uuid } from "uuid";
const initialState = [];
let copyState = null;
let index = 0;

export const characterReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_COLLECTOR:
      return [
        ...state,
        {
          id: uuid(),
          collectorName: payload.collectorName,
          characterList: payload.characterList,
          selected: false,
        },
      ];
    case ActionTypes.DELETE_COLLECTOR:
      copyState = [...state];
      index = copyState.findIndex((i) => i.id === payload.id);
      copyState.splice(index, 1);
      return [...copyState];

    case ActionTypes.ADD_CHARACTER:
      let charObj = state.map((char) => {
        if (char.id === payload.id) {
          char.characterList.push(payload.characterList);
        }
        return char;
      });
      return [...charObj];

    case ActionTypes.DELETE_CHARACTER:
      copyState = [...state];
      let delChar = copyState.map((delData) => {
        if (delData.selected === true) {
          index = delData.characterList.findIndex(
            (x) => x.id === payload.characterList.id
          );
          delData.characterList.splice(index, 1);
          return [...delData.characterList];
        }
      });
      copyState.characterList = delChar;
      return [...copyState];

    case ActionTypes.SELECTED_COLLECTOR:
      let stateObj = state.map((stateName) => {
        if (stateName.id !== payload.id) {
          stateName.selected = false;
        } else {
          stateName.selected = true;
        }
        return stateName;
      });

      return [...stateObj];

    case ActionTypes.UNSELECTED_COLLECTOR:
      let unselectObj = state.map((stateName) => {
        if (stateName.id === payload.id) {
          stateName.selected = false;
        }
        return stateName;
      });

      return [...unselectObj];
    default:
      return state;
  }
};