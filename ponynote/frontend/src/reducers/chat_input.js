import {CHANGE_INPUT} from '../actions/chats';


const initialState = {input: ''};

const changeInputFunction = (state, action) => {
    let value = action.input || '';
    let lastInput = null;

    if (value.length > 0) {
        lastInput = value.charAt(value.length - 1)
    }
    if (!state.shiftPressed) {
        if (lastInput === '\n') {
            value = value.substring(0, value.length - 1);
        }
    }
    let result = {...state, input: value};
    return result;
};

const defaultFunction = (state, action) => {
    return state;
};

const messageReducer = (state = initialState, action) => {
  let functions = {};
  functions[CHANGE_INPUT] = changeInputFunction;
  let resultFunction = functions[action.type]  || defaultFunction;
  return resultFunction(state, action)
};

export default messageReducer;