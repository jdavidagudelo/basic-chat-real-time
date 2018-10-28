
export const ADD = 'ADD';
export const CHANGE_INPUT = 'CHANGE_INPUT';
export const CHANGE_SHIFT_PRESSED = 'CHANGE_SHIFT_PRESSED';


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