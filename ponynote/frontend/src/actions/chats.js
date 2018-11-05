
export const ADD = 'ADD';
export const CHANGE_INPUT = 'CHANGE_INPUT';
export const CHANGE_SHIFT_PRESSED = 'CHANGE_SHIFT_PRESSED';
export const EDIT_MESSAGE = 'EDIT_MESSAGE';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const FETCH_CHATS = 'FETCH_CHATS';


export const fetchChats = () => {
    return (dispatch, getState) => {
        let headers = {"Content-Type": "application/json"};
        let token = getState().auth.token;

        if (token) {
            headers["X-AUTH-TOKEN"] = token;
        }

        return fetch("/api/chat_messages/", {headers, })
            .then(res => {
                if (res.status < 500) {
                    return res.json().then(data => {
                        return {status: res.status, data: data};
                    })
                } else {
                    console.log("Server Error!");
                    throw res;
                }
            })
            .then(res => {
                if (res.status === 200) {
                    return dispatch({type: FETCH_CHATS, messages: res.data.results});
                } else if (res.status === 401 || res.status === 403) {
                    dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
                    throw res.data;
                }
            })
    }
}


export const deleteMessage = (index, id) => {
    return (dispatch, getState) => {
        let headers = {"Content-Type": "application/json"};
        let token = getState().auth.token;

        if (token) {
            headers["X-AUTH-TOKEN"] = token;
        }

        return fetch("/api/chat_messages/" + id + '/', {headers: headers, method: "DELETE"})
            .then(res => {
                if (res.status < 500) {
                    return {status: res.status}
                } else {
                    console.log("Server Error!");
                    throw res;
                }
            })
            .then(res => {
                if (res.status === 204 || res.status === 404 || res.status === 200) {
                    return dispatch({type: DELETE_MESSAGE, index: index, id: id});
                } else if (res.status === 401 || res.status === 403) {
                    dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
                    throw res.data;
                }
            })
    }
};

export const editMessage = (index, message, id, user, created_at) => {
    return (dispatch, getState) => {
        let token = getState().auth.token;
        return dispatch({type: EDIT_MESSAGE, message: {text: message, id: id, receiver: user, created_at: created_at}, index: index, token: token});
    }
};

export const changeShiftPressed = (shiftPressed) => {
  return {
    type: CHANGE_SHIFT_PRESSED,
    shiftPressed: shiftPressed
  }
};

export const addMessageRealTime = (message) => {
    return {type: ADD, message: message, realTime: true};
};

export const addMessage = (message) => {
    return (dispatch, getState) => {
        let headers = {"Content-Type": "application/json"};
        let token = getState().auth.token;

        if (token) {
            headers["X-AUTH-TOKEN"] = token;
        }

        let body = JSON.stringify({text: message});
        return fetch("/api/chat_messages/", {headers, method: "POST", body})
            .then(res => {
                if (res.status < 500) {
                    return res.json().then(data => {
                        return {status: res.status, data: data};
                    })
                } else {
                    console.log("Server Error!");
                    throw res;
                }
            })
            .then(res => {
                if (res.status === 201) {
                    return dispatch({type: ADD, message: res.data, realTime: false});
                } else if (res.status === 401 || res.status === 403) {
                    dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
                    throw res.data;
                }
            })
    }
};

export const changeInput = (input) => {
    return {
        type: CHANGE_INPUT,
        input: input
    }
};