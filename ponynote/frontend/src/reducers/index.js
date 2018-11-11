import { combineReducers } from 'redux';
import notes from "./notes";
import auth from "./auth";
import chats from "./chats";
import chat_input from "./chat_input";


const ponyApp = combineReducers({
    notes, auth, chats, chat_input
});

export default ponyApp;
