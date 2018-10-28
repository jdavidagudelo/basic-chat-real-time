import React from 'react';
import ReactDOM from 'react-dom';
import messageReducer from './chats';
import {addMessage, changeInput, ADD, CHANGE_INPUT} from '../actions/chats';
import { shallow } from 'enzyme';


it('adding a message to empty chats list', () => {
    let state = {};
    let message = 'New Message';
    let action = addMessage(message);
    let expectedAction = {type: ADD, message: message};
    expect(action).toEqual(expectedAction);
    let newState = messageReducer(state, action);
    let expectedNewState = {messages: [message], input: ''};
    expect(newState).not.toBe(expectedNewState);
    expect(newState).toEqual(expectedNewState);
});

it('adding change input function', () => {
    let state = {};
    let input = 'New Message';
    let action = changeInput(input);
    let expectedAction = {type: CHANGE_INPUT, input: input};
    expect(action).toEqual(expectedAction);
    let newState = messageReducer(state, action);
    let expectedNewState = {messages: [], input: input};
    expect(newState).not.toBe(expectedNewState);
    expect(newState).toEqual(expectedNewState);
});


it('executing unknown action', () => {
    let state = {};
    let action = {};
    let newState = messageReducer(state, action);
    expect(newState).toBe(state);
});

