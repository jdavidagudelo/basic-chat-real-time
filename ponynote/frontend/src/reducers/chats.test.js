import React from 'react';
import ReactDOM from 'react-dom';
import messageReducer from './chats';
import {addMessage, changeInput, fetchChats, ADD, CHANGE_INPUT, 
        EDIT_MESSAGE, FETCH_CHATS, DELETE_MESSAGE, CHANGE_SHIFT_PRESSED} from '../actions/chats';
import { shallow } from 'enzyme';
import * as enzyme from 'enzyme';
import { mount } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk';
import expect from 'expect';
import Chat from '../components/Chat';
import MockProvider, { getMockStore } from 'redux-mock-provider';
import renderer from 'react-test-renderer';

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)



configure({ adapter: new Adapter() });


describe('renders correctly', () => {
    it('Renders chat component', () => {
        const store = mockStore({ 
            chats:{ messages: [{text: 'text', created_at: 'created_at',
            receiver: {username: 'username'}, id: 1
        }], randomId: 'randomId'}, auth: {token: 'token'} });
        const component = mount(
            <MockProvider store={store}>
              <Chat />
            </MockProvider>
          );
        const tree = renderer.create(component).toJSON();
        //expect(component).toMatchSnapshot();
    })
});

describe('reducer functions', () => {
    it('add message ', () => {
        let expectedMessage = {text: 'Text', created_at: '12-03-1990', id: 1}
        let currentState = messageReducer({input: expectedMessage}, {type: ADD, message: expectedMessage});
        expect(currentState.messages).toEqual([expectedMessage]);
        expect(currentState.input).toEqual('');
        let expectedInput = 'Hello';
        currentState = messageReducer(currentState, {type: CHANGE_INPUT, input: expectedInput});
        expect(currentState.messages).toEqual([expectedMessage]);
        expect(currentState.input).toEqual(expectedInput);
        currentState = messageReducer(currentState, {type: CHANGE_SHIFT_PRESSED, 
            shiftPressed: true});
        expect(currentState.messages).toEqual([expectedMessage]);
        expect(currentState.input).toEqual(expectedInput);
        expect(currentState.shiftPressed).toEqual(true);
        let newMessage = 'Hello updated';
        expectedMessage = {text: newMessage, created_at: '12-03-1991', id: 1}
        currentState = messageReducer(currentState, {type: EDIT_MESSAGE, message: expectedMessage, id: 1})
        expect(currentState.messages).toEqual([expectedMessage]);
        expect(currentState.input).toEqual(expectedInput);
        currentState = messageReducer(currentState, {type: DELETE_MESSAGE, id: 1});
        expect(currentState.messages).toEqual([]);
        expect(currentState.input).toEqual(expectedInput);
        let fetchMessages = [{text: 'Text', created_at: '12-03-1990', id: 1},
                            {text: 'Text', created_at: '12-03-1990', id: 2}];
        currentState = messageReducer(currentState, {type: FETCH_CHATS, messages: fetchMessages});
        expect(currentState.messages).toEqual(fetchMessages);
        expect(currentState.input).toEqual(expectedInput);
    });
});

describe('async actions', () => {
    afterEach(() => {
      fetchMock.restore()
    });

    it('creates FETCH_CHATS when fetching chats has been done', () => {
      fetchMock.getOnce('/api/chat_messages/', {
        body: { 'results': ['Hello'] },
        headers: { 'content-type': 'application/json' }
      })
      const expectedActions = [
        { type: FETCH_CHATS, messages: ['Hello'] }
      ]
      const store = mockStore({ messages: [], auth: {token: 'token'} })
      return store.dispatch(fetchChats()).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it('adding a message to empty chats list', () => {
        let message = 'New Message';
        fetchMock.post('/api/chat_messages/', {
            body: {text: message},
            status: 201,
            headers: { 'content-type': 'application/json' }
        })
        let action = addMessage(message);
        let expectedActions = [{type: ADD, message: {text: message}, realTime: false}];
        const store = mockStore({ messages: [], auth: {token: 'token'} });
        return store.dispatch(action).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions)
        })
    });
    
    it('adding change input function', () => {
        let state = {};
        let input = 'New Message';
        let action = changeInput(input);
        let expectedAction = {type: CHANGE_INPUT, input: input};
        expect(action).toEqual(expectedAction);
        let newState = messageReducer(state, action);
        let expectedNewState = {input: input};
        expect(newState).not.toBe(expectedNewState);
        expect(newState).toEqual(expectedNewState);
    });
    it('executing unknown action', () => {
        let state = {};
        let action = {};
        let newState = messageReducer(state, action);
        expect(newState).toBe(state);
    });
  })

