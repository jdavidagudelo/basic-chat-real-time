import {ADD, CHANGE_INPUT, CHANGE_SHIFT_PRESSED} from '../actions/chats';


const initialState = {messages: [], input: '', shiftPressed: false};


const addMessageFunction = (state, action) => {
  let messages = state.messages || [];
  messages = [action.message].concat(messages);
  let result = Object.assign({}, state, {
    messages: messages,
    input: ''
  });
  return result;
};

const changeInputFunction = (state, action) => {
    let value = action.input || '';
    let lastInput = null;

    if (value.length > 0){
        lastInput = value.charAt(value.length - 1)
    }
    if (!state.shiftPressed) {
        if (lastInput === '\n') {
            value = value.substring(0, value.length - 1);
        }
    }

    let result = Object.assign({}, state, {
        messages: state.messages || [],
        input: value
    });
    return result;
};

const changeShiftFunction = (state, action) => {
    let value = action.shiftPressed;
    let result = Object.assign({}, state, {
        messages: state.messages || [],
        input: state.input || '',
        shiftPressed: action.shiftPressed
    });
    return result;
};

const defaultFunction = (state, action) => {
    return state;
};

const messageReducer = (state = initialState, action) => {
  let functions = {};
  functions[ADD] = addMessageFunction;
  functions[CHANGE_INPUT] = changeInputFunction;
  functions[CHANGE_SHIFT_PRESSED] = changeShiftFunction;
  let resultFunction = functions[action.type] || defaultFunction;
  return resultFunction(state, action)
};

export default messageReducer;