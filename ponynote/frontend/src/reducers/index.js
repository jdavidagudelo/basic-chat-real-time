import { combineReducers } from 'redux';
import notes from "./notes";
import auth from "./auth";
import chats from "./chats";


const ponyApp = combineReducers({
    notes, auth, chats
});

export default ponyApp;
