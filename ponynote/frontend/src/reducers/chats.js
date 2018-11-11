import {ADD, CHANGE_INPUT, CHANGE_SHIFT_PRESSED, EDIT_MESSAGE, DELETE_MESSAGE, FETCH_CHATS} from '../actions/chats';
import socketIOClient from "socket.io-client";
const uuidv4 = require('uuid/v4');


const initialState = {messages: [], input: '', shiftPressed: false, randomId: uuidv4()};


const deleteMessageFunction = (state, action) => {
    let messages = state.messages || [];
    messages = messages.slice(0);
    let ids = messages.map((v, index) => v.id);
    let currentIndex = ids.indexOf(action.id);
    if(currentIndex < 0){
        return state;
    }
    if(!action.realTime){
        const endpoint = "http://127.0.0.1:4001";
        const socket = socketIOClient(endpoint);
        socket.emit('delete:message', {index: currentIndex, id: action.id});
    }
    messages.splice(currentIndex, 1);
    let result = {...state, messages: messages};
    return result;
};

const fetchChatsFunction = (state, action) => {
    let messages = action.messages;
    let result = {...state, messages: messages};
    return result;

}

const editMessageFunction = (state, action) => {
    let headers = {"Content-Type": "application/json"};
    let token = action.token;
    if (token) {
        headers["X-AUTH-TOKEN"] = token;
    }
    let body = JSON.stringify({text: action.message.text});
    fetch('/api/chat_messages/' + action.message.id + '/', {headers, method: "PATCH", body})
        .then(async res => {
            if (res.status < 500) {
                const data = await res.json();
                return { status: res.status, data: data };
            } else {
                console.log("Server Error!");
                throw res;
            }
        })
        .then(res => {
    });
    let messages = state.messages || [];
    messages = messages.slice(0);
    let ids = messages.map((v, index) => v.id);
    let currentIndex = ids.indexOf(action.id);
    if (currentIndex < 0){
        return state;
    }
    messages[currentIndex] = action.message;
    let result = {...state, messages: messages};
    return result;
};

const addMessageFunction = (state, action) => {
  if (!action.realTime){
    const endpoint = "http://127.0.0.1:4001";
    const socket = socketIOClient(endpoint);
    socket.emit('send:message', {id: action.randomId, message: action.message});
  }
  let messages = state.messages || [];
  let ids = messages.map((v, index) => v.id);
  let currentIndex = ids.indexOf(action.message.id);
  if(currentIndex >= 0) {
    messages = messages.slice(0);
    messages[currentIndex] = action.message;
    let result = {...state, messages: messages};
    return result;
  }
  messages = [action.message, ...messages];
  let result = {...state, input: '', messages: messages};
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
    let result = {...state, input: value};
    return result;
};

const changeShiftFunction = (state, action) => {
    let result = {...state, shiftPressed: action.shiftPressed};
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
  functions[FETCH_CHATS] = fetchChatsFunction;
  let resultFunction = functions[action.type] || defaultFunction;
  return resultFunction(state, action)
};

export default messageReducer;