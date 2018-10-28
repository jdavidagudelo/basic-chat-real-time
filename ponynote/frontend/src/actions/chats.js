
export const ADD = 'ADD';
export const CHANGE_INPUT = 'CHANGE_INPUT';
export const CHANGE_SHIFT_PRESSED = 'CHANGE_SHIFT_PRESSED';
export const EDIT_MESSAGE = 'EDIT_MESSAGE';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';


export const deleteMessage = (index) => {
    return {
        type: DELETE_MESSAGE,
        index: index,
    };
};

export const editMessage = (index, message) => {
    return {
        type: EDIT_MESSAGE,
        index: index,
        message: message
    };
};

export const changeShiftPressed = (shiftPressed) => {
  return {
    type: CHANGE_SHIFT_PRESSED,
    shiftPressed: shiftPressed
  }
};

export const addMessage = (message) => {
  return {
    type: ADD,
    message: message
  }
};

export const changeInput = (input) => {
    return {
        type: CHANGE_INPUT,
        input: input
    }
};