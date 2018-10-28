import {ADD, CHANGE_INPUT, CHANGE_SHIFT_PRESSED, EDIT_MESSAGE, DELETE_MESSAGE} from '../actions/chats';


const initialState = {messages: [], input: '', shiftPressed: false};


const deleteMessageFunction = (state, action) => {
    let messages = state.messages || [];
    messages = messages.slice(0);
    messages.splice(action.index, 1);
    let result = Object.assign({}, state, {
        messages: messages,
        input: state.input,
        shiftPressed: state.shiftPressed
    });
    return result;
};

const editMessageFunction = (state, action) => {
    let messages = state.messages || [];
    messages = messages.slice(0);
    messages[action.index] = action.message;
    console.log(messages);
    let result = Object.assign({}, state, {
        messages: messages,
        input: state.input,
        shiftPressed: state.shiftPressed
    });
    return result;
};

const addMessageFunction = (state, action) => {
  let messages = state.messages || [];
  messages = [action.message].concat(messages);
  let result = Object.assign({}, state, {
    messages: messages,
    input: '',
    shiftPressed: state.shiftPressed
  });
  return result;
};

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

    let result = Object.assign({}, state, {
        messages: state.messages || [],
        input: value,
        shiftPressed: state.shiftPressed
    });
    return result;
};

const changeShiftFunction = (state, action) => {
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
  functions[EDIT_MESSAGE] = editMessageFunction;
  functions[DELETE_MESSAGE] = deleteMessageFunction;
  let resultFunction = functions[action.type] || defaultFunction;
  return resultFunction(state, action)
};

export default messageReducer;